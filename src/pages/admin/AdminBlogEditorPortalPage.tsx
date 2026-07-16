import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Send, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalizeNbsp = (html: string) =>
  html.replace(/&nbsp;/gi, " ").replace(/&#160;/g, " ").replace(/\u00A0/g, " ");

const AdminBlogEditorPortalPage = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const isEditing = Boolean(draftId);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImagePosition, setCoverImagePosition] = useState("center");
  const [status, setStatus] = useState("draft");
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (!isEditing || !draftId) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", draftId)
        .maybeSingle();

      if (error || !data) {
        setLoadError("Não foi possível carregar este conteúdo.");
        setLoading(false);
        return;
      }

      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt || "");
      setContent(data.content);
      setMetaDescription(data.meta_description || "");
      setTags((data.tags || []).join(", "));
      setCoverImageUrl(data.cover_image_url || "");
      setCoverImagePosition(data.cover_image_position || "center");
      setStatus(data.status);
      setPublishedAt(data.published_at);
      setSlugManuallyEdited(true);
      setLoading(false);
    };

    void fetchPost();
  }, [draftId, isEditing]);

  useEffect(() => {
    if (!slugManuallyEdited) setSlug(slugify(title));
  }, [title, slugManuallyEdited]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const extension = file.name.split(".").pop();
    const path = `${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);

    if (error) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage.from("blog-images").getPublicUrl(path);
    setCoverImageUrl(publicData.publicUrl);
    setUploading(false);
  };

  const handleSave = async (publishNow = false) => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast({ title: "Preencha título, slug e conteúdo", variant: "destructive" });
      return;
    }

    setSaving(true);
    const nextStatus = publishNow ? "published" : status;
    const nextPublishedAt = nextStatus === "published" ? publishedAt || new Date().toISOString() : null;
    const commonPostData = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: normalizeNbsp(content),
      meta_description: metaDescription.trim() || null,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      cover_image_url: coverImageUrl.trim() || null,
      cover_image_position: coverImagePosition,
      status: nextStatus,
      published_at: nextPublishedAt,
      updated_at: new Date().toISOString(),
    };

    let saveError;
    if (isEditing && draftId) {
      ({ error: saveError } = await supabase.from("blog_posts").update(commonPostData).eq("id", draftId));
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      ({ error: saveError } = await supabase.from("blog_posts").insert({
        ...commonPostData,
        author_id: session?.user.id,
      }));
    }

    if (saveError) {
      toast({ title: "Erro ao salvar", description: saveError.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    toast({ title: publishNow ? "Conteúdo publicado" : "Conteúdo salvo" });
    navigate("/app/admin/content");
  };

  if (loading) {
    return <div className="h-80 animate-pulse rounded-[8px] bg-bvbp-inset" aria-label="Carregando conteúdo" />;
  }

  if (loadError) {
    return (
      <section className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-8 text-center">
        <p className="font-semibold text-bvbp-ink">{loadError}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/app/admin/content">Voltar para conteúdo</Link>
        </Button>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? "Editar conteúdo" : "Novo conteúdo"} | Portal BVBP</title>
      </Helmet>

      <div className="mx-auto max-w-4xl space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Link to="/app/admin/content" className="inline-flex items-center gap-2 text-sm font-semibold text-bvbp-muted-ink hover:text-bvbp-ink">
            <ArrowLeft className="h-4 w-4" />
            Conteúdo
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void handleSave(false)} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              className="rounded-[8px] bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark"
              onClick={() => void handleSave(true)}
              disabled={saving}
            >
              <Send className="h-4 w-4" />
              Publicar
            </Button>
          </div>
        </section>

        <section className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5">
          <div className="grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="blog-title">Título</Label>
              <Input id="blog-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Título do conteúdo" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-slug">Slug</Label>
              <Input
                id="blog-slug"
                value={slug}
                onChange={(event) => { setSlug(event.target.value); setSlugManuallyEdited(true); }}
                placeholder="titulo-do-artigo"
              />
              <p className="text-xs text-bvbp-muted-ink">bvbp.com.br/blog/{slug || "..."}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-excerpt">Resumo</Label>
              <Textarea id="blog-excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={2} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-content">Conteúdo</Label>
              <Textarea
                id="blog-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={18}
                className="min-h-[400px] resize-y font-mono text-sm leading-6"
                placeholder="Escreva ou edite o conteúdo em texto simples. HTML existente pode ser ajustado manualmente."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="blog-status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="blog-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="review">Em revisão</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-tags">Tags</Label>
                <Input id="blog-tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="gestão, operação" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imagem de capa</Label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <span className="inline-flex items-center gap-2 rounded-[8px] border border-bvbp-ink/15 px-3 py-2 text-sm font-semibold hover:bg-bvbp-inset">
                    <Upload className="h-4 w-4" />
                    {uploading ? "Enviando..." : "Fazer upload"}
                  </span>
                </label>
                {coverImageUrl && <img src={coverImageUrl} alt="Prévia da capa" className="h-16 w-24 rounded-[8px] object-cover" style={{ objectPosition: coverImagePosition }} />}
              </div>
              <Input value={coverImageUrl} onChange={(event) => setCoverImageUrl(event.target.value)} placeholder="Ou cole a URL da imagem" />
              <Select value={coverImagePosition} onValueChange={setCoverImagePosition}>
                <SelectTrigger><SelectValue placeholder="Posição da imagem" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Topo</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="bottom">Base</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-meta">Meta description</Label>
              <Textarea id="blog-meta" value={metaDescription} onChange={(event) => setMetaDescription(event.target.value)} rows={2} maxLength={160} />
              <p className="text-right text-xs text-bvbp-muted-ink">{metaDescription.length}/160</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminBlogEditorPortalPage;
