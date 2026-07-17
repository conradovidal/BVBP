import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPerformancePasswordReset } from "@/lib/performanceAuth";

export function PasswordResetRequestForm() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || sending) return;

    setSending(true);
    setErrorMessage(undefined);

    try {
      await requestPerformancePasswordReset(email);
      setSent(true);
    } catch {
      setErrorMessage("Não foi possível solicitar outro link agora. Aguarde alguns minutos e tente novamente.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-[8px] border border-bvbp-positive/25 bg-bvbp-positive/5 p-4 text-sm leading-6 text-bvbp-muted-ink" role="status">
        Se este email possui acesso ao portal, um novo link chegará na caixa de entrada. Ele poderá ser usado por até 24 horas e apenas uma vez.
      </div>
    );
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="renew-access-email">Email de acesso</Label>
        <Input
          id="renew-access-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="seu@email.com"
          autoComplete="email"
          required
        />
      </div>
      {errorMessage ? <p className="text-sm text-bvbp-risk" role="alert">{errorMessage}</p> : null}
      <Button type="submit" className="w-full" disabled={sending || !email.trim()}>
        {sending ? "Solicitando..." : "Enviar novo link"}
      </Button>
      <p className="text-xs leading-5 text-bvbp-muted-ink">
        Por segurança, a confirmação não informa se o email está ou não cadastrado.
      </p>
    </form>
  );
}
