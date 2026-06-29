import { Navigate } from "react-router-dom";
import { getDefaultRouteForSession, getPerformanceSession } from "@/lib/performanceAuth";

export function PortalEntryRedirect() {
  const session = getPerformanceSession();

  if (!session) return <Navigate to="/login" replace />;

  return <Navigate to={getDefaultRouteForSession(session)} replace />;
}
