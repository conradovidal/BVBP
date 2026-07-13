import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { completePerformancePasswordSetup, getDefaultRouteForSession } from "@/lib/performanceAuth";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasSession, setHasSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setHasSession(Boolean(data.session));
      setCheckingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(Boolean(session));
      setCheckingSession(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 8) {
      toast({
        title: "Senha curta",
        description: "Use pelo menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas diferentes",
        description: "Confirme a mesma senha nos dois campos.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const session = await completePerformancePasswordSetup(password);

      if (!session) {
        toast({
          title: "Acesso ainda não vinculado",
          description: "A senha foi salva, mas este usuário ainda não tem workspace ativo.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      toast({
        title: "Senha definida",
        description: "Seu acesso ao Portal BVBP está pronto.",
      });
      navigate(getDefaultRouteForSession(session), { replace: true });
    } catch {
      toast({
        title: "Não foi possível salvar a senha",
        description: "O link pode ter expirado. Peça um novo convite para a equipe BVBP.",
        variant: "destructive",
      });
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Definir senha | Portal BVBP</title>
        <meta name="description" content="Defina sua senha para acessar o Portal BVBP." />
      </Helmet>

      <main className="min-h-screen bg-bvbp-ivory px-4 py-8 text-bvbp-ink">
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
          <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-6 sm:p-8">
            <div className="flex flex-col items-start gap-8">
              <BrandLockup tone="dark" size="md" />
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-bvbp-muted-ink transition-colors hover:text-bvbp-ink"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Voltar para o login
              </Link>
            </div>

            <div className="mt-8 flex h-11 w-11 items-center justify-center rounded-[8px] bg-bvbp-forest text-bvbp-ivory">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1 className="mt-5 font-heading text-3xl font-medium text-bvbp-ink">Definir senha</h1>
            <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">
              Crie ou atualize sua senha para acessar seu workspace no Portal BVBP.
            </p>

            {checkingSession ? (
              <div className="mt-6 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset p-4 text-sm text-bvbp-muted-ink">
                Validando link de acesso...
              </div>
            ) : hasSession ? (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={password}
                    minLength={8}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    minLength={8}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar senha e entrar"}
                </Button>
              </form>
            ) : (
              <div className="mt-6 rounded-[8px] border border-bvbp-risk/20 bg-bvbp-risk/5 p-4 text-sm leading-6 text-bvbp-muted-ink">
                Este link não tem uma sessão ativa ou pode ter expirado. Peça um novo convite para a equipe BVBP.
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
