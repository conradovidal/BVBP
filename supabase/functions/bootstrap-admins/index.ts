import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-bootstrap-secret, x-client-info, apikey, content-type",
};

const bootstrapAdmins = [
  { email: "conrado@bvbp.com.br", name: "Conrado Vidal" },
  { email: "cristiano@bvbp.com.br", name: "Cristiano Basso" },
] as const;

type BootstrapAdminEmail = typeof bootstrapAdmins[number]["email"];
type AdminClient = SupabaseClient;

type BootstrapResult = {
  email: string;
  status: "invited" | "already_exists" | "recovery_sent" | "error";
  message?: string;
};

type BootstrapMode = "invite_only" | "recover_existing";

interface BootstrapRequestBody {
  mode?: unknown;
  emails?: unknown;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getRedirectTo(req: Request) {
  const origin = Deno.env.get("PUBLIC_SITE_URL") || Deno.env.get("SITE_URL") || req.headers.get("origin");
  return origin ? `${origin.replace(/\/+$/, "")}/auth/set-password` : undefined;
}

function isBootstrapMode(value: unknown): value is BootstrapMode {
  return value === "invite_only" || value === "recover_existing";
}

function parseRequestedAdmins(body: BootstrapRequestBody) {
  if (!Array.isArray(body.emails) || body.emails.length === 0) {
    throw new Error("emails must be a non-empty array.");
  }

  if (!body.emails.every((email) => typeof email === "string")) {
    throw new Error("emails must contain only strings.");
  }

  const normalizedEmails = body.emails.map((email) => email.trim().toLowerCase());
  const uniqueEmails = new Set(normalizedEmails);

  if (uniqueEmails.size !== normalizedEmails.length) {
    throw new Error("emails must not contain duplicates.");
  }

  const adminByEmail = new Map<BootstrapAdminEmail, typeof bootstrapAdmins[number]>(
    bootstrapAdmins.map((admin) => [admin.email, admin]),
  );
  const requestedAdmins = normalizedEmails.map((email) => adminByEmail.get(email as BootstrapAdminEmail));

  if (requestedAdmins.some((admin) => !admin)) {
    throw new Error("emails contains an address outside the bootstrap allowlist.");
  }

  return requestedAdmins as Array<typeof bootstrapAdmins[number]>;
}

async function findUserByEmail(adminClient: AdminClient, email: string) {
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

async function grantAdminRole(adminClient: AdminClient, userId: string, email: string) {
  await adminClient.rpc("assign_staff_role_from_email", {
    _user_id: userId,
    _email: email,
  });

  const { error } = await adminClient
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

  if (error) {
    throw error;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const expectedSecret = Deno.env.get("BOOTSTRAP_ADMIN_SECRET");
  const suppliedSecret = req.headers.get("x-bootstrap-secret") || req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!expectedSecret) {
    return jsonResponse({ error: "BOOTSTRAP_ADMIN_SECRET is not configured." }, 500);
  }

  if (!suppliedSecret || suppliedSecret !== expectedSecret) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Supabase environment is not configured." }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  let body: BootstrapRequestBody = {};

  try {
    const rawBody = await req.text();
    body = rawBody ? JSON.parse(rawBody) as BootstrapRequestBody : {};
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  const mode = body.mode;

  if (!isBootstrapMode(mode)) {
    return jsonResponse({ error: "mode must be invite_only or recover_existing." }, 400);
  }

  let requestedAdmins: Array<typeof bootstrapAdmins[number]>;

  try {
    requestedAdmins = parseRequestedAdmins(body);
  } catch (error) {
    return jsonResponse({
      error: error instanceof Error ? error.message : "Invalid emails.",
    }, 400);
  }

  const redirectTo = getRedirectTo(req);
  const results: BootstrapResult[] = [];

  for (const admin of requestedAdmins) {
    try {
      const existingUser = await findUserByEmail(adminClient, admin.email);

      if (existingUser) {
        if (mode === "invite_only") {
          results.push({ email: admin.email, status: "already_exists" });
          continue;
        }

        const { error } = await adminClient.auth.resetPasswordForEmail(admin.email, { redirectTo });

        if (error) {
          results.push({ email: admin.email, status: "error", message: error.message });
        } else {
          await grantAdminRole(adminClient, existingUser.id, admin.email);
          results.push({ email: admin.email, status: "recovery_sent" });
        }

        continue;
      }

      if (mode === "recover_existing") {
        results.push({
          email: admin.email,
          status: "error",
          message: "User does not exist; recover_existing never creates a new account.",
        });
        continue;
      }

      const { data, error } = await adminClient.auth.admin.inviteUserByEmail(admin.email, {
        data: {
          name: admin.name,
          role: "admin",
        },
        redirectTo,
      });

      if (error || !data.user) {
        results.push({ email: admin.email, status: "error", message: error?.message || "Invite did not return a user." });
        continue;
      }

      await grantAdminRole(adminClient, data.user.id, admin.email);
      results.push({ email: admin.email, status: "invited" });
    } catch (error) {
      results.push({
        email: admin.email,
        status: "error",
        message: error instanceof Error ? error.message : "Unexpected error.",
      });
    }
  }

  return jsonResponse({
    mode,
    requestedEmails: requestedAdmins.map((admin) => admin.email),
    results,
  });
});
