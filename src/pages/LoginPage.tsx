import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrandLockup } from "@/components/BrandLockup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  getDefaultRouteForSession,
  getPerformanceSession,
  mockLoginCredentials,
  signInPerformanceUser,
} from "@/lib/performanceAuth";

const defaultRedirect = "/app/performance/overview";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = (location.state as { from?: string } | null)?.from || defaultRedirect;

  useEffect(() => {
    const session = getPerformanceSession();

    if (session) {
      navigate(from === defaultRedirect ? getDefaultRouteForSession(session) : from, { replace: true });
    }
  }, [from, navigate]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    window.setTimeout(() => {
      const session = signInPerformanceUser(email, password);

      if (!session) {
        toast({
          title: "Credenciais inválidas",
          description: "Use o login mockado definido para o MVP.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Acesso liberado",
        description: "Bem-vindo ao seu workspace.",
      });
      navigate(from === defaultRedirect ? getDefaultRouteForSession(session) : from, { replace: true });
    }, 250);
  };

  return (
    <>
      <Helmet>
        <title>Login | Portal BVBP</title>
        <meta
          name="description"
          content="Acesse o Portal BVBP para acompanhar workspace, ponteiros, ciclos PDCA e evidências de performance."
        />
      </Helmet>

      <main className="min-h-screen bg-bvbp-ivory px-4 py-8 text-bvbp-ink">
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="hidden h-full min-h-[560px] flex-col justify-between rounded-[8px] bg-bvbp-forest-dark p-8 text-bvbp-ivory lg:flex">
            <div>
              <BrandLockup tone="light" size="lg" />
              <p className="mt-10 max-w-sm font-heading text-4xl font-medium leading-tight">
                Ponteiros, ciclos e evidências para decidir melhor.
              </p>
            </div>
            <div className="grid gap-3 border-t border-bvbp-ivory/12 pt-6">
              {["Ponteiros", "PDCA", "Evidências"].map((item) => (
                <p key={item} className="font-label text-[11px] font-medium uppercase tracking-[0.12em] text-bvbp-ivory/65">
                  {item}
                </p>
              ))}
            </div>
          </aside>

          <div className="mx-auto w-full max-w-md rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-6 sm:p-8">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-bvbp-muted-ink transition-colors hover:text-bvbp-ink"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Site
            </Link>

            <div className="mb-7">
              <BrandLockup tone="dark" size="md" />
              <h1 className="mt-8 font-heading text-3xl font-medium text-bvbp-ink">Entrar no Portal BVBP</h1>
              <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">
                Acompanhe ponteiros, ciclos PDCA e evidências do seu workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="performance-email" className="text-bvbp-ink">
                  E-mail
                </Label>
                <Input
                  id="performance-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={mockLoginCredentials.email}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="performance-password" className="text-bvbp-ink">
                  Senha
                </Label>
                <Input
                  id="performance-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="bvbp90"
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset p-3 text-xs leading-5 text-bvbp-muted-ink">
              Equipe BVBP: conrado@bvbp.com.br · Usuário demo: cliente@bvbp.com.br · Senha: bvbp90
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LoginPage;
