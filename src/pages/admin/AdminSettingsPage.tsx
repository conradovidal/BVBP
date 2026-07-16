import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Building2, Pencil, Plus, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBvbpWorkspaceCompany } from "@/lib/clientPortalStore";

const AdminSettingsPage = () => {
  const bvbpWorkspace = getBvbpWorkspaceCompany();

  return (
    <>
      <Helmet>
        <title>Configurações | Portal BVBP</title>
      </Helmet>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-6">
          <Building2 className="h-5 w-5 text-bvbp-forest" aria-hidden="true" />
          <h2 className="mt-5 font-heading text-xl font-semibold text-bvbp-ink">Dados da BVBP</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-bvbp-muted-ink">
            {bvbpWorkspace
              ? "Mantenha os dados institucionais e o diagnóstico do workspace interno atualizados."
              : "Cadastre a BVBP para liberar visão geral, ponteiros e iniciativas do workspace interno."}
          </p>
          {bvbpWorkspace ? (
            <dl className="mt-5 grid gap-4 rounded-[8px] bg-bvbp-ivory p-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Empresa</dt>
                <dd className="mt-1 font-semibold text-bvbp-ink">{bvbpWorkspace.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Segmento</dt>
                <dd className="mt-1 font-semibold text-bvbp-ink">{bvbpWorkspace.segment}</dd>
              </div>
            </dl>
          ) : null}
          <Button asChild className="mt-5 rounded-[8px] bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark">
            <Link to="/app/admin/clients/company-bvbp/edit">
              {bvbpWorkspace ? <Pencil className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
              {bvbpWorkspace ? "Editar dados da BVBP" : "Cadastrar BVBP"}
            </Link>
          </Button>
        </article>

        <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-6">
          <UsersRound className="h-5 w-5 text-bvbp-forest" aria-hidden="true" />
          <h2 className="mt-5 font-heading text-xl font-semibold text-bvbp-ink">Clientes e acessos</h2>
          <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">
            Cadastros, contatos, cargos e permissões de acesso são administrados diretamente no CRM.
          </p>
          <Button asChild variant="outline" className="mt-5 rounded-[8px]">
            <Link to="/app/admin/clients">Abrir CRM</Link>
          </Button>
        </article>
      </div>
    </>
  );
};

export default AdminSettingsPage;
