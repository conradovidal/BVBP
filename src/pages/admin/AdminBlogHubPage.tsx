import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Edit, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/performance/EmptyState";
import { MetricCard } from "@/components/performance/MetricCard";
import { StatusBadge } from "@/components/performance/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { formatNumber } from "@/lib/performanceFormatters";

type BlogPostSummary = {
  id: string;
  title: string;
  status: string;
  updated_at: string;
};

const statusLabels: Record<string, string> = {
  published: "Publicado",
  review: "Revisão",
  draft: "Rascunho",
};

const formatUpdatedAt = (value: string) => new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
}).format(new Date(value));

const AdminBlogHubPage = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("blog_posts")
      .select("id, title, status, updated_at")
      .order("updated_at", { ascending: false });

    if (queryError) {
      setError("Não foi possível carregar os conteúdos agora.");
      setPosts([]);
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const publishedCount = posts.filter((post) => post.status === "published").length;
  const reviewCount = posts.filter((post) => post.status === "review").length;
  const draftCount = posts.filter((post) => post.status === "draft").length;

  return (
    <>
      <Helmet>
        <title>Conteúdo | Portal BVBP</title>
      </Helmet>

      <div className="space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm text-bvbp-muted-ink">Posts reais publicados e em preparação para o blog da BVBP.</p>
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

        <section className="grid gap-4 sm:grid-cols-3">
          <MetricCard title="Publicados" value={formatNumber(publishedCount)} accent="green" />
          <MetricCard title="Em revisão" value={formatNumber(reviewCount)} accent="orange" />
          <MetricCard title="Rascunhos" value={formatNumber(draftCount)} accent="gray" />
        </section>

        <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised shadow-none">
          {loading ? (
            <div className="space-y-3 p-5" aria-label="Carregando conteúdos">
              {[0, 1, 2].map((item) => <div key={item} className="h-14 animate-pulse rounded-[8px] bg-bvbp-inset" />)}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <p className="text-sm font-semibold text-bvbp-ink">{error}</p>
              <Button variant="outline" size="sm" onClick={() => void loadPosts()}>
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          ) : posts.length ? (
            <div className="divide-y divide-bvbp-ink/10">
              {posts.map((post) => (
                <div key={post.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-bvbp-ink">{post.title}</p>
                    <p className="text-sm text-bvbp-muted-ink">Atualizado em {formatUpdatedAt(post.updated_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge label={statusLabels[post.status] || post.status} />
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
          ) : (
            <EmptyState
              title="Nenhum conteúdo cadastrado."
              description="Crie o primeiro conteúdo real para acompanhar publicação, revisão e rascunhos."
              className="m-4"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminBlogHubPage;
