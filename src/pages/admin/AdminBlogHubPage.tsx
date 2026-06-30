import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/performance/StatusBadge";
import { blogDrafts } from "@/data/blogDrafts";

const AdminBlogHubPage = () => {
  return (
    <>
      <Helmet>
        <title>Conteúdo | Portal BVBP</title>
      </Helmet>

      <div className="space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-bvbp-ink">Conteúdo</h1>
            <p className="mt-1 text-sm text-bvbp-muted-ink">Temas estratégicos do Método BVBP.</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-[8px] border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
          >
            <Link to="/app/admin/content/new">
              <Plus className="h-4 w-4" />
              Novo conteúdo
            </Link>
          </Button>
        </section>

        <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised shadow-none">
          <div className="divide-y divide-bvbp-ink/10">
            {blogDrafts.map((post) => (
              <div key={post.title} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-bvbp-ink">{post.title}</p>
                  <p className="text-sm text-bvbp-muted-ink">Atualizado: {post.updated}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge label={post.status} />
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/app/admin/content/edit/${post.id}`}>
                      <Edit className="h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminBlogHubPage;
