import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, LogOut, Trash2 } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

const AdminBlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, status, published_at, created_at")
      .order("created_at", { ascending: false });

    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}"?`)) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post excluído" });
      fetchPosts();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <a href="/" className="font-heading text-lg font-bold text-foreground">BVBP</a>
              <span className="text-sm text-muted-foreground">/ Admin / Blog</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1.5" /> Sair
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground">Posts do Blog</h1>
            <Button asChild>
              <Link to="/admin/blog/novo">
                <Plus className="h-4 w-4 mr-1.5" /> Novo Post
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>Nenhum post criado ainda.</p>
              <Button asChild className="mt-4">
                <Link to="/admin/blog/novo">Criar primeiro post</Link>
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg divide-y">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground truncate">{post.title}</span>
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status === "published" ? "Publicado" : "Rascunho"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {post.status === "published" && post.published_at
                        ? `Publicado em ${new Date(post.published_at).toLocaleDateString("pt-BR")}`
                        : `Criado em ${new Date(post.created_at).toLocaleDateString("pt-BR")}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/blog/editar/${post.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id, post.title)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
};

export default AdminBlogPage;
