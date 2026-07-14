import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ContactAccessAction = "invite" | "resend" | "disable";

interface InviteRequestBody {
  workspaceId?: string;
  contactId?: string;
  action?: ContactAccessAction;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isContactAccessAction(value: unknown): value is ContactAccessAction {
  return value === "invite" || value === "resend" || value === "disable";
}

function logInviteStep(details: Record<string, boolean | string | number | null>) {
  console.info("invite-client-contact", JSON.stringify(details));
}

function getBearerToken(req: Request) {
  const authorization = req.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
}

function getRedirectTo(req: Request) {
  const origin = Deno.env.get("PUBLIC_SITE_URL") || Deno.env.get("SITE_URL") || req.headers.get("origin");
  return origin ? `${origin.replace(/\/+$/, "")}/auth/set-password` : undefined;
}

async function findUserByEmail(adminClient: ReturnType<typeof createClient>, email: string) {
  const normalizedEmail = email.toLowerCase();
  const perPage = 1000;

  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw error;
    }

    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === normalizedEmail);
    if (user) return user;
    if (data.users.length < perPage) return null;
  }

  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  logInviteStep({ received: true, method: req.method });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return jsonResponse({ error: "Supabase environment is not configured." }, 500);
  }

  const accessToken = getBearerToken(req);
  logInviteStep({ tokenPresent: Boolean(accessToken) });

  if (!accessToken) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const callerClient = createClient(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: userData, error: userError } = await callerClient.auth.getUser(accessToken);
  logInviteStep({ userValidated: Boolean(userData.user && !userError) });

  if (userError || !userData.user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const { data: roles, error: roleError } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .in("role", ["admin", "editor"]);
  const roleAuthorized = Boolean(!roleError && roles?.length);

  logInviteStep({ roleAuthorized });

  if (!roleAuthorized) {
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  const body = await req.json() as InviteRequestBody;
  if (!body.workspaceId || !body.contactId || !isContactAccessAction(body.action)) {
    return jsonResponse({ error: "workspaceId, contactId and action are required." }, 400);
  }

  const { data: contact, error: contactError } = await adminClient
    .from("client_contacts")
    .select("id, workspace_id, auth_user_id, name, email, is_primary, access_status")
    .eq("id", body.contactId)
    .eq("workspace_id", body.workspaceId)
    .single();
  const contactFound = Boolean(!contactError && contact);

  logInviteStep({ contactFound });

  if (!contactFound) {
    return jsonResponse({ error: "Contact not found." }, 404);
  }

  if (body.action === "disable") {
    const { error: contactDisableError } = await adminClient
      .from("client_contacts")
      .update({
        access_status: "disabled",
        disabled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", contact.id);

    if (contactDisableError) {
      return jsonResponse({ error: contactDisableError.message }, 500);
    }

    if (contact.auth_user_id) {
      const { error: membershipDisableError } = await adminClient
        .from("client_memberships")
        .update({
          status: "disabled",
          updated_at: new Date().toISOString(),
        })
        .eq("workspace_id", contact.workspace_id)
        .eq("user_id", contact.auth_user_id);

      if (membershipDisableError) {
        return jsonResponse({ error: membershipDisableError.message }, 500);
      }
    }

    logInviteStep({ inviteSent: false, accessDisabled: true });

    return jsonResponse({
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        isPrimary: contact.is_primary,
        accessStatus: "disabled",
      },
      deliveryType: "none",
    });
  }

  if (!contact.name?.trim() || !contact.email?.trim()) {
    return jsonResponse({ error: "Contact needs a name and email before invite." }, 400);
  }

  const redirectTo = getRedirectTo(req);
  let authUserId = contact.auth_user_id as string | null;
  let deliveryType: "invite" | "recovery" = "invite";

  if (!authUserId) {
    const existingUser = await findUserByEmail(adminClient, contact.email);
    authUserId = existingUser?.id || null;
  }

  if (!authUserId) {
    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
      contact.email,
      {
        data: {
          name: contact.name,
          workspace_id: contact.workspace_id,
          contact_id: contact.id,
          role: "client",
        },
        redirectTo,
      },
    );

    if (inviteError || !inviteData.user) {
      logInviteStep({ inviteSent: false });

      return jsonResponse({
        error: inviteError?.message || "Could not invite contact.",
      }, 400);
    }

    authUserId = inviteData.user.id;
  } else {
    deliveryType = "recovery";
    const { error: recoveryError } = await adminClient.auth.resetPasswordForEmail(contact.email, { redirectTo });

    if (recoveryError) {
      logInviteStep({ inviteSent: false });

      return jsonResponse({
        error: recoveryError.message || "Could not send access email.",
      }, 400);
    }
  }

  const now = new Date().toISOString();
  const { error: membershipError } = await adminClient
    .from("client_memberships")
    .upsert({
      workspace_id: contact.workspace_id,
      contact_id: contact.id,
      user_id: authUserId,
      role: "client",
      status: "active",
      updated_at: now,
    }, {
      onConflict: "workspace_id,user_id",
    });

  if (membershipError) {
    return jsonResponse({ error: membershipError.message }, 500);
  }

  const { error: contactUpdateError } = await adminClient
    .from("client_contacts")
    .update({
      auth_user_id: authUserId,
      access_status: "invited",
      invited_at: now,
      disabled_at: null,
      updated_at: now,
    })
    .eq("id", contact.id);

  if (contactUpdateError) {
    return jsonResponse({ error: contactUpdateError.message }, 500);
  }

  logInviteStep({ inviteSent: true, deliveryType });

  return jsonResponse({
    contact: {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      isPrimary: contact.is_primary,
      accessStatus: "invited",
    },
    deliveryType,
  });
});
