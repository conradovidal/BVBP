import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  coverImagePosition?: string | null;
  publishedAt?: string | null;
  tags?: string[] | null;
}

const BlogCard = ({ title, slug, excerpt, coverImageUrl, coverImagePosition, publishedAt, tags }: BlogCardProps) => {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  return (
    <Link to={`/blog/${slug}`} className="group block">
      <article className="rounded-lg border border-border bg-card overflow-hidden transition-shadow duration-200 hover:shadow-lg h-full flex flex-col">
        {coverImageUrl && (
          <div className="aspect-video overflow-hidden">
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ objectPosition: coverImagePosition || "center" }}
              loading="lazy"
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          {excerpt && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{excerpt}</p>
          )}
          {formattedDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={publishedAt!}>{formattedDate}</time>
            </div>
          )}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
