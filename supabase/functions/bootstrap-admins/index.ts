import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-bootstrap-secret, x-client-info, apikey, content-type",
};

const bootstrapAdmins = [
  { email: "conrado@bvbp.com.br", name: "Conrado Vidal" },
  { email: "cristiano@bvbp.com.br", name: "Cristiano Basso" },
];

type BootstrapResult = {
  email: string;
  status: "invited" | "recovery_sent" | "role_granted" | "error";
  message?: string;
};

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

async function grantAdminRole(adminClient: ReturnType<typeof createClient>, userId: string, email: string) {
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
  const redirectTo = getRedirectTo(req);
  const results: BootstrapResult[] = [];

  for (const admin of bootstrapAdmins) {
    try {
      const existingUser = await findUserByEmail(adminClient, admin.email);

      if (existingUser) {
        await grantAdminRole(adminClient, existingUser.id, admin.email);

        const { error } = await adminClient.auth.resetPasswordForEmail(admin.email, { redirectTo });

        if (error) {
          results.push({ email: admin.email, status: "role_granted", message: error.message });
        } else {
          results.push({ email: admin.email, status: "recovery_sent" });
        }

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

  return jsonResponse({ results });
});
