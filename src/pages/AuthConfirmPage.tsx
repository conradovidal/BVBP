import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";
import { PasswordResetRequestForm } from "@/components/auth/PasswordResetRequestForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type ConfirmationType = "invite" | "recovery";

interface ConfirmationRequest {
  tokenHash: string;
  type: ConfirmationType;
}

function readConfirmationRequest(): ConfirmationRequest | null {
  const params = new URLSearchParams(window.location.search);
  const tokenHash = params.get("token_hash")?.trim();
  const type = params.get("type")?.trim();

  if (!tokenHash || (type !== "invite" && type !== "recovery")) {
    return null;
  }

  return { tokenHash, type };
}

export default function AuthConfirmPage() {
  const [request] = useState(readConfirmationRequest);
  const [verifying, setVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(window.history.state, "", "/auth/confirm");
    }
  }, []);

  const handleConfirm = async () => {
    if (!request || verifying) return;

    setVerifying(true);
    setErrorMessage(undefined);

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: request.tokenHash,
      type: request.type,
    });

    if (error || !data.session) {
      setErrorMessage("Este link é inválido, já foi usado ou expirou. Você pode solicitar outro agora.");
      setVerifying(false);
      return;
    }

    navigate("/auth/set-password", { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Confirmar acesso | Portal BVBP</title>
        <meta name="description" content="Confirme seu acesso antes de definir a senha do Portal BVBP." />
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
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1 className="mt-5 font-heading text-3xl font-medium text-bvbp-ink">Confirmar acesso</h1>
            <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">
              Este passo protege seu convite contra verificações automáticas do provedor de email.
              Nada será confirmado até você continuar.
            </p>

            {!request ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-[8px] border border-bvbp-gold/30 bg-bvbp-gold/5 p-4 text-sm leading-6 text-bvbp-muted-ink">
                  Este link está incompleto ou não é mais válido. Vamos gerar um novo acesso para o email cadastrado.
                </div>
                <PasswordResetRequestForm />
              </div>
            ) : errorMessage ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-[8px] border border-bvbp-gold/30 bg-bvbp-gold/5 p-4 text-sm leading-6 text-bvbp-muted-ink">
                  {errorMessage}
                </div>
                <PasswordResetRequestForm />
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset p-4 text-sm leading-6 text-bvbp-muted-ink">
                  O próximo passo será aberto em <strong className="text-bvbp-ink">www.bvbp.com.br</strong>.
                </div>
                <Button
                  id="confirm-access-button"
                  type="button"
                  className="w-full"
                  disabled={verifying}
                  onClick={() => void handleConfirm()}
                >
                  {verifying ? "Confirmando..." : "Continuar para definir senha"}
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
