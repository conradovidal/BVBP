import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ClientSetupWizard } from "@/components/admin/client-setup/ClientSetupWizard";
import { type Company, createDefaultClientConfiguration } from "@/data/performanceSystem";
import { createClientWithConfiguration, type ClientSetupInput } from "@/lib/clientConfigurationStore";

const draftCompany: Company = {
  id: "draft-client",
  name: "",
  segment: "",
  employees: 0,
  monthlyRevenue: 0,
  recurringRevenue: 0,
  monthlyOperationalCost: 0,
  relationshipStatus: "Prospect",
  status: "Prospect",
};

const AdminClientNewPage = () => {
  const navigate = useNavigate();

  const handleSave = async (input: ClientSetupInput) => {
    await createClientWithConfiguration(input);
    navigate("/app/admin/clients");
  };

  const handleSaveDraft = async (input: ClientSetupInput) => {
    const result = await createClientWithConfiguration(input);
    navigate(`/app/admin/clients/${result.company.id}/edit`, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Novo cliente | Portal BVBP</title>
      </Helmet>

      <div className="mx-auto flex h-full max-w-6xl flex-col">
        <section className="shrink-0">
          <button
            type="button"
            onClick={() => navigate("/app/admin/clients")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-bvbp-muted-ink hover:text-bvbp-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            CRM
          </button>
        </section>

        <ClientSetupWizard
          mode="create"
          configuration={createDefaultClientConfiguration(draftCompany, { selectDefaults: false })}
          onCancel={() => navigate("/app/admin/clients")}
          onSave={handleSave}
          onSaveDraft={handleSaveDraft}
        />
      </div>
    </>
  );
};

export default AdminClientNewPage;
