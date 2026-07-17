import { Helmet } from "react-helmet-async";
import { Mail, ShieldCheck, UserRound } from "lucide-react";
import { getPerformanceSession } from "@/lib/performanceAuth";

interface AdminProfilePageProps {
  showPageTitle?: boolean;
}

const AdminProfilePage = ({ showPageTitle = false }: AdminProfilePageProps) => {
  const session = getPerformanceSession();

  return (
    <>
      <Helmet>
        <title>Meu perfil | Portal BVBP</title>
      </Helmet>

      {showPageTitle ? (
        <h1 className="mb-5 font-heading text-3xl font-semibold tracking-tight text-bvbp-ink">Meu perfil</h1>
      ) : null}

      <section className="max-w-2xl rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bvbp-forest text-bvbp-ivory">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-semibold text-bvbp-ink">{session?.user.name}</h2>
            <p className="mt-1 text-sm text-bvbp-muted-ink">Informações da sua conta no Portal BVBP.</p>
          </div>
        </div>

        <dl className="mt-7 divide-y divide-bvbp-ink/10 border-y border-bvbp-ink/10">
          <div className="flex items-center gap-3 py-4">
            <Mail className="h-4 w-4 text-bvbp-muted-ink" aria-hidden="true" />
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-bvbp-muted-ink">E-mail</dt>
              <dd className="mt-1 text-sm text-bvbp-ink">{session?.user.email}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3 py-4">
            <ShieldCheck className="h-4 w-4 text-bvbp-muted-ink" aria-hidden="true" />
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-bvbp-muted-ink">Acesso</dt>
              <dd className="mt-1 text-sm text-bvbp-ink">{session?.user.roleLabel}</dd>
            </div>
          </div>
        </dl>
      </section>
    </>
  );
};

export default AdminProfilePage;
