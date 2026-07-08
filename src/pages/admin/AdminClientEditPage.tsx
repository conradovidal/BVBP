import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ClientSetupWizard } from "@/components/admin/client-setup/ClientSetupWizard";
import { BVBP_COMPANY_ID } from "@/data/performanceSystem";
import {
  getClientConfiguration,
  type ClientSetupInput,
  updateClientWithConfiguration,
} from "@/lib/clientConfigurationStore";
import { getCompanyById, getBvbpWorkspaceCompany } from "@/lib/clientPortalStore";

const AdminClientEditPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const company = companyId === BVBP_COMPANY_ID ? getBvbpWorkspaceCompany() : getCompanyById(companyId);

  if (!company) return <Navigate to="/app/admin/clients" replace />;

  const handleSave = (input: ClientSetupInput) => {
    updateClientWithConfiguration(company.id, input);
    navigate(company.id === BVBP_COMPANY_ID ? "/app/admin" : "/app/admin/clients");
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
            onClick={() => navigate(company.id === BVBP_COMPANY_ID ? "/app/admin" : "/app/admin/clients")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-bvbp-muted-ink hover:text-bvbp-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {company.id === BVBP_COMPANY_ID ? "Portal BVBP" : "CRM"}
          </button>
          <h1 className="font-heading text-2xl font-bold text-bvbp-ink">Editar {company.name}</h1>
        </section>

        <ClientSetupWizard
          mode="edit"
          company={company}
          configuration={getClientConfiguration(company)}
          onCancel={() => navigate(company.id === BVBP_COMPANY_ID ? "/app/admin" : "/app/admin/clients")}
          onSave={handleSave}
        />
      </div>
    </>
  );
};

export default AdminClientEditPage;
