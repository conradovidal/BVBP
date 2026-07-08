import { Navigate, useLocation } from "react-router-dom";
import { getPerformanceSession } from "@/lib/performanceAuth";

interface ProtectedPerformanceRouteProps {
  children: React.ReactNode;
}

export function ProtectedPerformanceRoute({ children }: ProtectedPerformanceRouteProps) {
  const location = useLocation();
  const session = getPerformanceSession();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
