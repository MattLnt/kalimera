import { Plus } from "lucide-react";

export type FaqItem = { question: string; answer: string };

/**
 * Liste de questions dépliables.
 *
 * Un seul bloc blanc qui contient toutes les questions, séparées par des
 * filets, plutôt qu'une pile de cartes : l'empilement de cartes à ombre
 * fragmente la page et donne l'aspect serré qu'on cherche à éviter ici.
 *
 * L'ouverture reste native (`<details>`), donc fonctionnelle sans JavaScript
 * et correctement annoncée aux lecteurs d'écran. La rotation du signe est la
 * seule animation : `<details>` ne permet pas d'animer la hauteur sans
 * passer en JavaScript, et le gain ne justifie pas le coût.
 */
export function FaqList({
  items,
  numbered = true,
}: {
  items: FaqItem[];
  numbered?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <div className="surface-card overflow-hidden">
      {items.map((item, index) => (
        <details
          key={item.question}
          className="group border-b border-[var(--ink-10)] last:border-b-0 open:bg-aegean-50/40"
        >
          <summary className="flex cursor-pointer list-none items-start gap-4 p-6 transition-colors duration-300 hover:bg-aegean-50/60 sm:gap-6 sm:p-8">
            {numbered ? (
              <span
                aria-hidden
                className="mt-1 font-display text-[0.8125rem] font-extrabold tabular-nums text-[var(--ink-45)] transition-colors duration-300 group-open:text-aegean-600"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : null}

            <h3 className="display-4 flex-1 pr-2 text-[1.0625rem] sm:text-[1.1875rem]">
              {item.question}
            </h3>

            <span
              aria-hidden
              className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-aegean-100 text-aegean-700 transition-[rotate,background-color,color] duration-[450ms] ease-[var(--ease-out-expo)] group-open:rotate-45 group-open:bg-aegean-600 group-open:text-white"
            >
              <Plus className="size-4" />
            </span>
          </summary>

          <div className="px-6 pb-7 sm:px-8 sm:pb-9">
            {/* Aligné sur le titre : le numéro occupe la gouttière de gauche. */}
            <p className="max-w-[62ch] text-[1.0625rem] leading-[1.7] text-[var(--ink-74)] sm:ml-[calc(1.5rem+1.5ch)]">
              {item.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
