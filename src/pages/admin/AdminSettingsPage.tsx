import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { RotateCcw, ShieldCheck } from "lucide-react";
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
import { resetPortalDemoData } from "@/lib/portalStorage";

const RESET_CONFIRMATION = "RESTAURAR";

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const canReset = confirmation.trim().toUpperCase() === RESET_CONFIRMATION;

  const handleReset = () => {
    if (!canReset) return;

    resetPortalDemoData();
    setConfirmation("");
    setIsDialogOpen(false);
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
          <h1 className="font-heading text-2xl font-bold text-[#1B365D]">Configurações</h1>
          <p className="text-sm text-slate-500">Estado local, dados de demonstração e preparação interna.</p>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#38A169]" aria-hidden="true" />
              <div>
                <h2 className="font-heading text-lg font-bold text-[#1B365D]">Modo atual</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Portal com autenticação mockada e dados locais. Use como ferramenta interna, não como fonte financeira auditada.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-[#1B365D]">Dados de demonstração</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Restaura clientes seedados, workspace BVBP, ciclos PDCA e evidências locais.
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
                      Esta ação recria clientes, workspace BVBP, ciclos PDCA e evidências locais. A sessão atual será preservada.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="space-y-2">
                    <Label htmlFor="reset-confirmation">
                      Digite <span className="font-bold text-[#1B365D]">{RESET_CONFIRMATION}</span> para confirmar
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
                      className="bg-red-600 text-white hover:bg-red-700 disabled:pointer-events-none disabled:opacity-50"
                    >
                      Restaurar dados
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </article>
        </section>
      </div>
    </>
  );
};

export default AdminSettingsPage;
