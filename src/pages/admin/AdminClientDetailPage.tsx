import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { BVBP_COMPANY_ID } from "@/data/performanceSystem";
import { getCompanyById, setActiveCompanyId } from "@/lib/clientPortalStore";

const AdminClientDetailPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const company = getCompanyById(companyId);

  useEffect(() => {
    if (!company || company.id === BVBP_COMPANY_ID) return;

    setActiveCompanyId(company.id);
    navigate("/app/performance/overview", { replace: true });
  }, [company, navigate]);

  if (!company) return <Navigate to="/app/admin/clients" replace />;
  if (company.id === BVBP_COMPANY_ID) return <Navigate to="/app/admin" replace />;

  return (
    <>
      <Helmet>
        <title>Abrindo workspace | Portal BVBP</title>
      </Helmet>
      <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5 text-sm text-bvbp-muted-ink">
        Abrindo workspace de {company.name}...
      </div>
    </>
  );
};

export default AdminClientDetailPage;
