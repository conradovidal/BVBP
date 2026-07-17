import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  deleteClientWorkspace,
  getClientDeletionSummary,
} from "@/lib/clientDeletionStore";

interface AdminClientActionsProps {
  companyId: string;
  companyName: string;
  onOpenWorkspace: () => void;
  onDeleted: () => void;
}

export function AdminClientActions({ companyId, companyName, onOpenWorkspace, onDeleted }: AdminClientActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const summary = getClientDeletionSummary(companyId);
  const canDelete = confirmation.trim() === companyName;

  const setDeleteDialogOpen = (open: boolean) => {
    if (deleting) return;
    setDialogOpen(open);
    if (!open) setConfirmation("");
  };

  const handleDelete = async () => {
    if (!canDelete || deleting) return;

    setDeleting(true);
    try {
      await deleteClientWorkspace(companyId);
      setDialogOpen(false);
      setConfirmation("");
      onDeleted();
      toast({
        title: "Cliente excluído",
        description: `${companyName} e os dados do workspace foram removidos. As contas de acesso foram preservadas.`,
      });
    } catch (error) {
      toast({
        title: "Não foi possível excluir o cliente",
        description: error instanceof Error ? error.message : "Tente novamente sem recarregar a página.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-[88px] justify-center gap-1.5 whitespace-nowrap px-3 lg:justify-self-end"
            aria-label={`Ações de ${companyName}`}
          >
            <span>Ações</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={onOpenWorkspace}>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            Abrir workspace
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/app/admin/clients/${companyId}/edit`}>
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Editar cliente
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-bvbp-risk focus:text-bvbp-risk"
            onSelect={() => setDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Excluir cliente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={dialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent withinContentArea>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {companyName} definitivamente?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <span className="block">
                Esta ação remove o workspace e seus dados do portal. As contas de autenticação dos contatos não serão excluídas.
              </span>
              <span className="block rounded-[8px] bg-bvbp-inset p-3 font-medium text-bvbp-ink">
                {summary.contacts} contato(s) · {summary.initiatives} iniciativa(s) · {summary.activities} atividade(s)
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor={`delete-client-${companyId}`}>
              Digite <strong>{companyName}</strong> para confirmar
            </Label>
            <Input
              id={`delete-client-${companyId}`}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="off"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={!canDelete || deleting}
              onClick={() => void handleDelete()}
            >
              {deleting ? "Excluindo..." : "Excluir cliente"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
