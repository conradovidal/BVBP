const DEFAULT_SUPABASE_URL = "https://zcpelfllyutpkystubxr.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjcGVsZmxseXV0cGt5c3R1YnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjA3ODcsImV4cCI6MjA3MTY5Njc4N30.AqPrD2Fa7P0225JQI5Um2hT0_bAoi9J30_QvUSBkcUA";

function readBooleanFlag(value: string | boolean | undefined, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return fallback;

  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;

  return fallback;
}

function withoutTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

const browserOrigin = typeof window === "undefined" ? "" : window.location.origin;
const defaultFeatureFlag = false;

export const portalRuntimeConfig = {
  enableDemoData: readBooleanFlag(import.meta.env.VITE_ENABLE_DEMO_DATA, defaultFeatureFlag),
  enableMockAuth: readBooleanFlag(import.meta.env.VITE_ENABLE_MOCK_AUTH, defaultFeatureFlag),
  siteUrl: withoutTrailingSlash(import.meta.env.VITE_PUBLIC_SITE_URL || browserOrigin),
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL,
  supabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY,
};

export const isDemoDataEnabled = portalRuntimeConfig.enableDemoData;

export function getAuthRedirectUrl(path = "/auth/set-password") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${portalRuntimeConfig.siteUrl}${normalizedPath}`;
}
