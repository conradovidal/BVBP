interface BlogPostContentProps {
  content: string;
}

const BlogPostContent = ({ content }: BlogPostContentProps) => {
  return (
    <div
      lang="pt-BR"
      className="prose prose-lg max-w-prose [overflow-wrap:anywhere] [hyphens:auto] [text-wrap:pretty]
        prose-headings:text-foreground prose-headings:font-heading
        prose-p:text-foreground/80
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground
        prose-ul:text-foreground/80 prose-ol:text-foreground/80
        prose-blockquote:border-primary prose-blockquote:text-muted-foreground
        prose-code:text-primary prose-code:bg-secondary prose-code:px-1 prose-code:rounded
        prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogPostContent;
