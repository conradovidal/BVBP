import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { refreshPerformanceSessionFromSupabase, signOutPerformanceUser } from "@/lib/performanceAuth";

interface ProtectedPerformanceRouteProps {
  children: React.ReactNode;
}

export function ProtectedPerformanceRoute({ children }: ProtectedPerformanceRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Awaited<ReturnType<typeof refreshPerformanceSessionFromSupabase>>>(null);
  const [loadError, setLoadError] = useState<string>();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(undefined);

    refreshPerformanceSessionFromSupabase()
      .then((refreshedSession) => {
        if (!cancelled) {
          setSession(refreshedSession);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setSession(null);
          setLoadError(error instanceof Error ? error.message : "Não foi possível carregar o portal.");
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
  }, [attempt]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bvbp-ivory text-sm font-semibold text-bvbp-muted-ink">
        Carregando portal...
      </div>
    );
  }

  if (loadError) {
    const handleSignOut = async () => {
      try {
        await signOutPerformanceUser();
      } finally {
        navigate("/login", { replace: true });
      }
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-bvbp-ivory px-4 text-bvbp-ink">
        <section className="w-full max-w-md rounded-[8px] border border-bvbp-risk/20 bg-bvbp-raised p-6">
          <h1 className="font-heading text-2xl font-bold">Não foi possível carregar o portal</h1>
          <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">{loadError}</p>
          <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">
            Nenhum dado armazenado neste navegador foi exibido sem validação do Supabase.
          </p>
          <div className="mt-5 flex gap-2">
            <Button onClick={() => setAttempt((current) => current + 1)}>Tentar novamente</Button>
            <Button variant="outline" onClick={() => void handleSignOut()}>Sair</Button>
          </div>
        </section>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
