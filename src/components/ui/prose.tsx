import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

/**
 * Rendu des corps de texte stockés en Markdown (pages service, articles).
 * Le composant s'exécute côté serveur : rien de la librairie n'est envoyé
 * au navigateur.
 */
export function Prose({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-[68ch]", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="display-3 mt-12 mb-4 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="display-4 mt-9 mb-3 text-xl">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-5 text-[1.0625rem] leading-[1.7] text-[var(--ink-74)]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-6 grid gap-2.5 pl-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 grid list-decimal gap-2.5 pl-5">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="relative pl-6 text-[1.0625rem] leading-[1.6] text-[var(--ink-74)] marker:text-aegean-500 [ol>&]:pl-0">
              <span
                aria-hidden
                className="absolute top-[0.65em] left-0 size-1.5 rounded-full bg-aegean-500 [ol>&]:hidden"
              />
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-display font-bold text-ink">{children}</strong>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="font-medium text-aegean-700 underline decoration-aegean-200 underline-offset-4 transition-colors hover:decoration-aegean-600"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-8 rounded-card bg-aegean-50 px-6 py-5 font-display text-lg font-semibold tracking-[-0.02em] text-aegean-900">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded-md bg-aegean-50 px-1.5 py-0.5 font-mono text-[0.875em] text-aegean-800">
              {children}
            </code>
          ),
          hr: () => <hr className="my-10 border-0 border-t border-[var(--ink-10)]" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
