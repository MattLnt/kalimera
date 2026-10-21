import Image from "next/image";

import { accentClass } from "@/components/ui/decor";
import { Link } from "@/i18n/navigation";
import { optimized } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

export type PostCardData = {
  slug: string;
  title: string;
  excerpt: string;
  categoryLabel: string;
  publishedAt: Date | null;
  cover: { url: string; alt: string } | null;
  accent: string;
};

export function PostCard({
  post,
  locale,
  className,
}: {
  post: PostCardData;
  locale: string;
  className?: string;
}) {
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(post.publishedAt)
    : null;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card bg-white shadow-lift",
        "transition-transform duration-[320ms] ease-[var(--ease-hover)] hover:-translate-y-1.5",
        className,
      )}
    >
      <div className="relative m-2.5 mb-0 aspect-16/10 overflow-hidden rounded-[20px]">
        {post.cover ? (
          <Image
            src={optimized(post.cover.url, { width: 700 })}
            alt={post.cover.alt}
            fill
            sizes="(max-width: 1080px) 100vw, 33vw"
            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-107"
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-107",
              accentClass(post.accent),
            )}
          />
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2.5 font-display text-xs font-semibold">
          <span className="rounded-full bg-aegean-50 px-3 py-1.5 text-aegean-700">
            {post.categoryLabel}
          </span>
          {date ? <time className="text-[var(--ink-45)]">{date}</time> : null}
        </div>

        <h3 className="mt-3.5 mb-2 font-display text-xl leading-[1.22] font-bold tracking-[-0.03em]">
          <Link
            href={{ pathname: "/journal/[slug]", params: { slug: post.slug } }}
            className="before:absolute before:inset-0 before:content-['']"
          >
            {post.title}
          </Link>
        </h3>

        <p className="text-body-muted">{post.excerpt}</p>
      </div>
    </article>
  );
}
