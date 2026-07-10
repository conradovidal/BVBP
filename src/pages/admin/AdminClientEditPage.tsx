import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ClientSetupWizard } from "@/components/admin/client-setup/ClientSetupWizard";
import { BVBP_COMPANY_ID, type Company, createDefaultClientConfiguration } from "@/data/performanceSystem";
import {
  getClientConfiguration,
  type ClientSetupInput,
  updateClientWithConfiguration,
  upsertClientWithConfiguration,
} from "@/lib/clientConfigurationStore";
import { getCompanyById, getBvbpWorkspaceCompany } from "@/lib/clientPortalStore";

const draftBvbpWorkspace: Company = {
  id: BVBP_COMPANY_ID,
  name: "BVBP",
  segment: "Consultoria de performance",
  employees: 0,
  monthlyRevenue: 0,
  recurringRevenue: 0,
  monthlyOperationalCost: 0,
  relationshipStatus: "Ativo",
  status: "Ativo",
};

const AdminClientEditPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const company = companyId === BVBP_COMPANY_ID
    ? getBvbpWorkspaceCompany() || draftBvbpWorkspace
    : getCompanyById(companyId);
  const isBvbpWorkspace = company?.id === BVBP_COMPANY_ID;
  const hasStoredBvbpWorkspace = Boolean(getBvbpWorkspaceCompany());

  if (!company) return <Navigate to="/app/admin/clients" replace />;

  const returnPath = isBvbpWorkspace ? "/app/admin/settings" : "/app/admin/clients";

  const handleSave = (input: ClientSetupInput) => {
    if (isBvbpWorkspace && !hasStoredBvbpWorkspace) {
      upsertClientWithConfiguration(BVBP_COMPANY_ID, input);
    } else {
      updateClientWithConfiguration(company.id, input);
    }

    navigate(returnPath);
  };

  return (
    <>
      <Helmet>
        <title>Editar cliente | Portal BVBP</title>
      </Helmet>

      <div className="mx-auto max-w-6xl space-y-6">
        <section>
          <button
            type="button"
            onClick={() => navigate(returnPath)}
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-bvbp-muted-ink hover:text-bvbp-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {isBvbpWorkspace ? "Configurações" : "CRM"}
          </button>
          <h1 className="font-heading text-2xl font-bold text-bvbp-ink">
            {isBvbpWorkspace && !hasStoredBvbpWorkspace ? "Cadastrar workspace BVBP" : `Editar ${company.name}`}
          </h1>
        </section>

        <ClientSetupWizard
          mode={isBvbpWorkspace && !hasStoredBvbpWorkspace ? "create" : "edit"}
          company={company}
          configuration={hasStoredBvbpWorkspace || !isBvbpWorkspace
            ? getClientConfiguration(company)
            : createDefaultClientConfiguration(company, { selectDefaults: false })}
          onCancel={() => navigate(returnPath)}
          onSave={handleSave}
        />
      </div>
    </>
  );
};

export default AdminClientEditPage;
