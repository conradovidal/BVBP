const normalizeContent = (html: string) =>
  html.replace(/&nbsp;/gi, " ").replace(/&#160;/g, " ").replace(/\u00A0/g, " ");

interface BlogPostContentProps {
  content: string;
}

const BlogPostContent = ({ content }: BlogPostContentProps) => {
  return (
    <div
      lang="pt-BR"
      className="prose prose-lg max-w-prose [word-break:normal] [overflow-wrap:normal] [hyphens:none] [text-wrap:pretty]
        prose-headings:text-foreground prose-headings:font-heading prose-headings:[word-break:normal]
        prose-p:text-foreground/80 prose-p:[word-break:normal] prose-p:[overflow-wrap:normal]
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground
        prose-ul:text-foreground/80 prose-ol:text-foreground/80
        prose-li:[word-break:normal] prose-li:[overflow-wrap:normal]
        prose-blockquote:border-primary prose-blockquote:text-muted-foreground
        prose-code:text-primary prose-code:bg-secondary prose-code:px-1 prose-code:rounded
        prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: normalizeContent(content) }}
    />
  );
};

export default BlogPostContent;
