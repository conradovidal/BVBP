import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Send } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getBlogDraft } from "@/data/blogDrafts";

const emptyDraft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  metaDescription: "",
  tags: "",
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const AdminBlogEditorPortalPage = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const navigate = useNavigate();
  const draft = draftId ? getBlogDraft(draftId) : emptyDraft;
  const [title, setTitle] = useState(draft.title);
  const [slug, setSlug] = useState(draft.slug);
  const [excerpt, setExcerpt] = useState(draft.excerpt);
  const [content, setContent] = useState(draft.content);
  const [metaDescription, setMetaDescription] = useState(draft.metaDescription);
  const [tags, setTags] = useState(draft.tags);

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "link"],
        ["clean"],
      ],
    }),
    []
  );

  const updateTitle = (value: string) => {
    setTitle(value);
    if (!draftId) setSlug(slugify(value));
  };

  const handleSave = () => {
    navigate("/app/admin/blog");
  };

  return (
    <>
      <Helmet>
        <title>{draftId ? "Editar conteúdo" : "Novo conteúdo"} | Portal BVBP</title>
      </Helmet>

      <div className="mx-auto max-w-4xl space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/app/admin/blog" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-bvbp-muted-ink hover:text-bvbp-ink">
              <ArrowLeft className="h-4 w-4" />
              Conteúdo
            </Link>
            <h1 className="font-heading text-2xl font-bold text-bvbp-ink">{draftId ? "Editar conteúdo" : "Novo conteúdo"}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Rascunho
            </Button>
            <Button
              variant="outline"
              className="rounded-[8px] border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
              onClick={handleSave}
            >
              <Send className="h-4 w-4" />
              Publicar
            </Button>
          </div>
        </section>

        <section className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5 shadow-none">
          <div className="grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="blog-title">Título</Label>
              <Input id="blog-title" value={title} onChange={(event) => updateTitle(event.target.value)} placeholder="Título do conteúdo" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-slug">Slug</Label>
              <Input id="blog-slug" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="titulo-do-artigo" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-excerpt">Resumo</Label>
              <Textarea id="blog-excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={2} />
            </div>

            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <div className="[&_.ql-container]:rounded-b-md [&_.ql-container]:border-input [&_.ql-editor]:min-h-[320px] [&_.ql-editor]:bg-bvbp-raised [&_.ql-toolbar]:rounded-t-md [&_.ql-toolbar]:border-input">
                <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="blog-tags">Tags</Label>
                <Input id="blog-tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="gestão, operação" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-meta">Meta description</Label>
                <Input id="blog-meta" value={metaDescription} onChange={(event) => setMetaDescription(event.target.value)} placeholder="Descrição para busca" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminBlogEditorPortalPage;
