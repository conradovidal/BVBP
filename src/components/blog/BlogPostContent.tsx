interface BlogPostContentProps {
  content: string;
}

const BlogPostContent = ({ content }: BlogPostContentProps) => {
  return (
    <div
      className="prose prose-lg max-w-none
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
