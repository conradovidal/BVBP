import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Send, Upload } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";
import { useToast } from "@/hooks/use-toast";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const AdminBlogEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    const fetchPost = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt || "");
        setContent(data.content);
        setMetaDescription(data.meta_description || "");
        setTags((data.tags || []).join(", "));
        setCoverImageUrl(data.cover_image_url || "");
        setStatus(data.status);
        setSlugManuallyEdited(true);
      }
    };
    fetchPost();
  }, [id, isEditing]);

  useEffect(() => {
    if (!slugManuallyEdited) setSlug(slugify(title));
  }, [title, slugManuallyEdited]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(path);
    setCoverImageUrl(publicUrl);
    setUploading(false);
  };

  const handleSave = async (publishNow = false) => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Preencha título e conteúdo", variant: "destructive" });
      return;
    }

    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content,
      meta_description: metaDescription.trim() || null,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      cover_image_url: coverImageUrl || null,
      author_id: session?.user.id,
      status: publishNow ? "published" : status,
      published_at: publishNow ? new Date().toISOString() : (status === "published" ? undefined : null),
      updated_at: new Date().toISOString(),
    };

    let error;
    if (isEditing) {
      ({ error } = await supabase.from("blog_posts").update(postData).eq("id", id));
    } else {
      ({ error } = await supabase.from("blog_posts").insert(postData));
    }

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: publishNow ? "Post publicado!" : "Post salvo!" });
      navigate("/admin/blog");
    }
    setSaving(false);
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card sticky top-0 z-10">
          <div className="container mx-auto px-4 flex items-center justify-between h-14">
            <button onClick={() => navigate("/admin/blog")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleSave(false)} disabled={saving}>
                <Save className="h-4 w-4 mr-1.5" />
                {saving ? "Salvando..." : "Salvar rascunho"}
              </Button>
              <Button size="sm" onClick={() => handleSave(true)} disabled={saving}>
                <Send className="h-4 w-4 mr-1.5" />
                Publicar
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título do artigo"
                className="text-lg"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManuallyEdited(true); }}
                placeholder="titulo-do-artigo"
              />
              <p className="text-xs text-muted-foreground mt-1">bvbp.com.br/blog/{slug || "..."}</p>
            </div>

            <div>
              <Label htmlFor="excerpt">Resumo</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Breve resumo para a listagem do blog"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="content">Conteúdo (HTML)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="<p>Escreva seu artigo aqui...</p>"
                rows={20}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <Label>Imagem de capa</Label>
              <div className="flex items-center gap-3 mt-1">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <div className="flex items-center gap-1.5 px-3 py-2 text-sm border rounded-md hover:bg-accent transition-colors">
                    <Upload className="h-4 w-4" />
                    {uploading ? "Enviando..." : "Upload"}
                  </div>
                </label>
                {coverImageUrl && (
                  <img src={coverImageUrl} alt="Capa" className="h-16 rounded object-cover" />
                )}
              </div>
              <Input
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="Ou cole a URL da imagem"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="gestão, processos, operações"
              />
            </div>

            <div>
              <Label htmlFor="meta">Meta description (SEO)</Label>
              <Textarea
                id="meta"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Descrição para mecanismos de busca (máx. 160 caracteres)"
                rows={2}
              />
              <p className="text-xs text-muted-foreground mt-1">{metaDescription.length}/160 caracteres</p>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
};

export default AdminBlogEditorPage;
