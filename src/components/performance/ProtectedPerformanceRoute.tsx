import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getPerformanceSession, refreshPerformanceSessionFromSupabase } from "@/lib/performanceAuth";

interface ProtectedPerformanceRouteProps {
  children: React.ReactNode;
}

export function ProtectedPerformanceRoute({ children }: ProtectedPerformanceRouteProps) {
  const location = useLocation();
  const [loading, setLoading] = useState(() => !getPerformanceSession());
  const [session, setSession] = useState(() => getPerformanceSession());

  useEffect(() => {
    if (session) return;

    let cancelled = false;

    refreshPerformanceSessionFromSupabase()
      .then((refreshedSession) => {
        if (!cancelled) {
          setSession(refreshedSession);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bvbp-ivory text-sm font-semibold text-bvbp-muted-ink">
        Carregando portal...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
