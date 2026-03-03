import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostContent from "@/components/blog/BlogPostContent";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  meta_description: string | null;
  tags: string[] | null;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="aspect-video bg-muted rounded-lg" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background container mx-auto px-4 py-16 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Artigo não encontrado</h1>
          <Link to="/blog" className="text-primary hover:underline">Voltar ao blog</Link>
        </main>
        <Footer />
      </>
    );
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  return (
    <>
      <Helmet>
        <title>{post.title} — Blog BVBP</title>
        <meta name="description" content={post.meta_description || post.excerpt || ""} />
        <meta name="robots" content="max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={`https://bvbp.com.br/blog/${post.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.meta_description || post.excerpt,
            "image": post.cover_image_url,
            "datePublished": post.published_at,
            "publisher": {
              "@type": "Organization",
              "name": "BVBP — Basso & Vidal Business Partners",
              "url": "https://bvbp.com.br"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://bvbp.com.br/blog/${post.slug}`
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bvbp.com.br/" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://bvbp.com.br/blog" },
              { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://bvbp.com.br/blog/${post.slug}` }
            ]
          })}
        </script>
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background">
        <article className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao blog
            </Link>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {post.title}
            </h1>

            {formattedDate && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.published_at!}>{formattedDate}</time>
              </div>
            )}

            {post.cover_image_url && (
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full rounded-lg mb-10 aspect-video object-cover"
              />
            )}

            <BlogPostContent content={post.content} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default BlogPostPage;
