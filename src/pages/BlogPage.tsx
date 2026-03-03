import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  tags: string[] | null;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, published_at, tags")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog — BVBP | Insights sobre Gestão e Operações</title>
        <meta name="description" content="Artigos e insights sobre otimização de processos, gestão operacional e crescimento sustentável para PMEs brasileiras." />
        <meta name="robots" content="max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href="https://bvbp.com.br/blog" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Blog BVBP",
            "description": "Insights sobre gestão operacional e otimização de processos para PMEs",
            "url": "https://bvbp.com.br/blog",
            "publisher": {
              "@type": "Organization",
              "name": "BVBP — Basso & Vidal Business Partners"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bvbp.com.br/" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://bvbp.com.br/blog" }
            ]
          })}
        </script>
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl mb-12">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground">
              Insights sobre gestão operacional, otimização de processos e crescimento sustentável.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-border bg-card animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Nenhum artigo publicado ainda.</p>
              <p className="text-muted-foreground text-sm mt-2">Volte em breve para novos conteúdos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  coverImageUrl={post.cover_image_url}
                  publishedAt={post.published_at}
                  tags={post.tags}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BlogPage;
