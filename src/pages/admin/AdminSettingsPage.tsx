import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, RotateCcw, ShieldCheck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { getBvbpWorkspaceCompany } from "@/lib/clientPortalStore";
import { portalRuntimeConfig } from "@/lib/portalRuntimeConfig";
import { resetPortalDemoData } from "@/lib/portalStorage";

const RESET_CONFIRMATION = "RESTAURAR";

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const canReset = confirmation.trim().toUpperCase() === RESET_CONFIRMATION;
  const bvbpWorkspace = getBvbpWorkspaceCompany();

  const handleReset = () => {
    if (!canReset) return;

    const restored = resetPortalDemoData();
    setConfirmation("");
    setIsDialogOpen(false);

    if (!restored) {
      toast({
        title: "Demo desativada",
        description: "Dados de demonstração não são restaurados quando VITE_ENABLE_DEMO_DATA está desligada.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Dados restaurados",
      description: "O portal voltou para os dados de demonstração.",
    });
    navigate("/app/performance/overview");
  };

  return (
    <>
      <Helmet>
        <title>Configurações | Portal BVBP</title>
      </Helmet>

      <div className="space-y-7">
        <section className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-bvbp-ink">Configurações</h1>
          <p className="text-sm text-bvbp-muted-ink">Auth, ambiente, workspace interno e preparação de produção.</p>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5 shadow-none">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-bvbp-positive" aria-hidden="true" />
              <div>
                <h2 className="font-heading text-lg font-bold text-bvbp-ink">Modo atual</h2>
                <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">
                  Portal integrado ao Supabase Auth e preparado para dados compartilhados. Demo local e login mockado dependem de flags explícitas.
                </p>
                <div className="mt-3 grid gap-2 text-xs font-semibold text-bvbp-muted-ink">
                  <span>Demo data: {portalRuntimeConfig.enableDemoData ? "ligada" : "desligada"}</span>
                  <span>Mock auth: {portalRuntimeConfig.enableMockAuth ? "ligado" : "desligado"}</span>
                </div>
                <Button asChild variant="outline" className="mt-4 rounded-[8px]">
                  <Link to="/app/admin/clients/company-bvbp/edit">
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    {bvbpWorkspace ? "Editar workspace BVBP" : "Cadastrar workspace BVBP"}
                  </Link>
                </Button>
              </div>
            </div>
          </article>

          {portalRuntimeConfig.enableDemoData ? (
            <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5 shadow-none">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-heading text-lg font-bold text-bvbp-ink">Dados de demonstração</h2>
                  <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">
                    Restaura clientes seedados, workspace BVBP, configurações, iniciativas e evidências locais.
                  </p>
                </div>

                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      Restaurar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Restaurar dados de demonstração?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação recria clientes, workspace BVBP, configurações, iniciativas e evidências locais. A sessão atual será preservada.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-2">
                      <Label htmlFor="reset-confirmation">
                        Digite <span className="font-bold text-bvbp-ink">{RESET_CONFIRMATION}</span> para confirmar
                      </Label>
                      <Input
                        id="reset-confirmation"
                        value={confirmation}
                        onChange={(event) => setConfirmation(event.target.value)}
                        autoComplete="off"
                      />
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setConfirmation("")}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={!canReset}
                        onClick={handleReset}
                        className="bg-bvbp-risk text-bvbp-ivory hover:bg-bvbp-risk/90 disabled:pointer-events-none disabled:opacity-50"
                      >
                        Restaurar dados
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </article>
          ) : (
            <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5 shadow-none">
              <div>
                <h2 className="font-heading text-lg font-bold text-bvbp-ink">Produção zerada</h2>
                <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">
                  Dados de demonstração estão desligados. Um Supabase vazio não cria BVBP nem clientes exemplo automaticamente.
                </p>
              </div>
            </article>
          )}
        </section>

        <section className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5">
          <h2 className="font-heading text-lg font-bold text-bvbp-ink">Checklist de produção</h2>
          <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">
            Use esta lista para conferência operacional antes de publicar.
          </p>
          <div className="mt-4 grid gap-3 text-sm text-bvbp-muted-ink md:grid-cols-2">
            {[
              "Migrações Supabase aplicadas",
              "Edge Functions de convite e bootstrap deployadas",
              "Site URL e Redirect URLs apontando para /auth/set-password",
              "SMTP transacional configurado para produção",
              "VITE_ENABLE_DEMO_DATA=false e VITE_ENABLE_MOCK_AUTH=false",
              "Conrado e Cristiano convidados pelo bootstrap inicial",
            ].map((item) => (
              <p key={item} className="flex items-start gap-2">
                <span className="mt-0.5 rounded-[6px] border border-bvbp-ink/10 bg-bvbp-inset px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
                  Verificar
                </span>
                <span className="leading-6">{item}</span>
              </p>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminSettingsPage;
