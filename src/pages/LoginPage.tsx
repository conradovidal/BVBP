import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
        description: "Bem-vindo ao portal BVBP.",
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
          content="Acesse o portal BVBP para visualizar conteúdo, clientes e ponteiros de performance."
        />
      </Helmet>

      <main className="flex min-h-screen items-center justify-center bg-[#F7FAFC] px-4 py-8 text-[#1B365D]">
        <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-strong sm:p-8">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#1B365D]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Site
          </Link>

          <div className="mb-6">
            <p className="font-heading text-3xl font-bold text-[#1B365D]">BVBP</p>
            <h1 className="mt-5 font-heading text-2xl font-bold text-[#1B365D]">Entrar</h1>
            <p className="mt-2 text-sm text-slate-500">Portal BVBP e Performance Operacional.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="performance-email">E-mail</Label>
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
              <Label htmlFor="performance-password">Senha</Label>
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

            <Button type="submit" variant="corporate" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-500">
            Admin: conrado@bvbp.com.br · Cliente: cliente@bvbp.com.br · Senha: bvbp90
          </div>
        </section>
      </main>
    </>
  );
};

export default LoginPage;
