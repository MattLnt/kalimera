import { Check } from "lucide-react";

import { Arches, Orbs } from "@/components/ui/decor";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Transforme un corps Markdown en sections mises en page.
 *
 * Le contenu reste rédigé en Markdown dans l'administration — c'est le format
 * le plus simple à écrire — mais il n'est plus rendu comme un article. Chaque
 * bloc de niveau 2 devient une section à part entière, dont la mise en page
 * dépend de ce qu'il contient : une liste devient une grille de cartes, un
 * passage sur le budget devient un panneau sombre, un texte courant devient
 * une colonne lisible face à son titre.
 *
 * Deuxième principe, aussi important : **deux pages ne se ressemblent pas**.
 * Une empreinte stable tirée de l'identifiant de la page décide du sens de
 * lecture, du nombre de colonnes, du style des cartes et de l'alternance des
 * fonds. Le résultat reste le même à chaque rendu — il n'y a rien d'aléatoire
 * — mais la page secteur « courtage » ne se lit pas comme la page « Luxembourg ».
 */

type Bullet = { title?: string; body: string };
type Block = { heading: string; paragraphs: string[]; bullets: Bullet[] };

/* ------------------------------------------------------------------ parsing */

/** Ponctuation de liaison laissée par la coupure titre / corps. */
const trimLead = (text: string) => text.replace(/^[\s.:,;–—-]+/, "").trim();

/**
 * Sépare « **Titre.** reste », « **Titre**, reste » ou « Titre : reste ».
 *
 * La ponctuation qui reliait les deux moitiés est retirée du corps : sans
 * cela, la carte afficherait « : annonce anonymisée » sous son titre.
 */
function splitBullet(raw: string): Bullet {
  const bold = raw.match(/^\*\*([\s\S]+?)\*\*([\s\S]*)$/);
  if (bold) {
    const title = bold[1].replace(/[.:,;]$/, "").trim();
    const body = trimLead(bold[2]);
    if (body) return { title, body };
    return { body: title };
  }

  const colon = raw.match(/^([^:]{3,48})\s:\s([\s\S]+)$/);
  if (colon) return { title: colon[1].trim(), body: trimLead(colon[2]) };

  return { body: raw };
}

export function parseBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  let current: Block | null = null;

  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("## ")) {
      current = { heading: trimmed.slice(3).trim(), paragraphs: [], bullets: [] };
      blocks.push(current);
      continue;
    }
    if (!current) {
      current = { heading: "", paragraphs: [], bullets: [] };
      blocks.push(current);
    }

    if (trimmed.startsWith("- ")) {
      current.bullets.push(splitBullet(trimmed.slice(2).trim()));
    } else if (!trimmed.startsWith("#")) {
      current.paragraphs.push(trimmed);
    }
  }

  return blocks.filter((block) => block.heading || block.paragraphs.length > 0);
}

/** Rend le gras inline sans embarquer un moteur Markdown complet. */
function Inline({ text, tone = "light" }: { text: string; tone?: "light" | "dark" }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong
            key={index}
            className={cn(
              "font-display font-bold",
              tone === "dark" ? "text-white" : "text-ink",
            )}
          >
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

/* ----------------------------------------------------------------- variantes */

/** Empreinte stable d'une chaîne : même page, même mise en page, toujours. */
function hash(seed: string) {
  let value = 0;
  for (let i = 0; i < seed.length; i += 1) {
    value = (value * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return value;
}

type Variant = {
  /** Le titre passe à droite du texte sur les sections courantes. */
  mirrored: boolean;
  /** Trois colonnes serrées, ou deux colonnes plus généreuses. */
  gridCols: 2 | 3;
  /** Marqueur des cartes : coche ou numéro. */
  cardMark: "check" | "number";
  /** Fond de la première section courante ; les suivantes alternent. */
  startsWhite: boolean;
  /** Sur-titre numéroté, ou filet vertical. */
  headingMark: "number" | "rule";
};

export function variantFor(seed: string): Variant {
  const h = hash(seed);
  return {
    mirrored: (h & 1) === 1,
    gridCols: (h >> 1) % 2 === 0 ? 3 : 2,
    cardMark: (h >> 2) % 2 === 0 ? "check" : "number",
    startsWhite: (h >> 4) % 2 === 0,
    headingMark: (h >> 5) % 2 === 0 ? "number" : "rule",
  };
}

/* -------------------------------------------------------------------- types */

type Layout = "intro" | "grid" | "checklist" | "price" | "split";

/** Le contenu décide de la mise en page, pas la personne qui rédige. */
function layoutFor(block: Block, index: number): Layout {
  if (index === 0 && block.bullets.length === 0) return "intro";
  if (block.bullets.length >= 3) return "grid";
  if (block.bullets.length > 0) return "checklist";

  const text = block.paragraphs.join(" ");
  // Les passages sur le budget portent le chiffre qui décide : ils méritent
  // leur propre panneau plutôt qu'un paragraphe de plus.
  if (/\d\s?\d{3}\s?(€|EUR)|à partir de|from €|desde \d/i.test(text)) return "price";

  return "split";
}

/* ------------------------------------------------------------------- rendus */

function Section({
  white,
  children,
}: {
  white: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("py-[clamp(2.75rem,6vh,4.5rem)]", white && "bg-white")}>
      <div className="page-shell">{children}</div>
    </section>
  );
}

function Heading({
  index,
  mark,
  children,
  tone = "light",
}: {
  index: number;
  mark: Variant["headingMark"];
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  if (mark === "rule") {
    return (
      <div>
        <span
          aria-hidden
          className={cn(
            "mb-5 block h-1 w-12 rounded-full",
            tone === "dark" ? "bg-aegean-400" : "bg-aegean-600",
          )}
        />
        <h2 className={cn("display-2", tone === "dark" && "text-white")}>{children}</h2>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <span
        aria-hidden
        className={cn(
          "mt-[0.62em] font-display text-[0.75rem] font-extrabold tabular-nums",
          tone === "dark" ? "text-aegean-300/70" : "text-aegean-500",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <h2 className={cn("display-2 flex-1", tone === "dark" && "text-white")}>
        {children}
      </h2>
    </div>
  );
}

function CardMark({ mark, index }: { mark: Variant["cardMark"]; index: number }) {
  if (mark === "number") {
    return (
      <span className="grid size-10 place-items-center rounded-field bg-aegean-100 font-display text-[0.875rem] font-extrabold tabular-nums text-aegean-700 transition-colors duration-500 group-hover:bg-aegean-600 group-hover:text-white">
        {String(index + 1).padStart(2, "0")}
      </span>
    );
  }
  return (
    <span className="grid size-10 place-items-center rounded-field bg-aegean-100 text-aegean-700 transition-colors duration-500 group-hover:bg-aegean-600 group-hover:text-white">
      <Check className="size-5" strokeWidth={2.4} />
    </span>
  );
}

export function ContentSections({
  markdown,
  seed,
}: {
  markdown: string;
  /** Identifiant de la page : il fixe sa mise en page propre. */
  seed: string;
}) {
  const blocks = parseBlocks(markdown);
  const v = variantFor(seed);

  // L'alternance des fonds part du pied choisi par la variante, et ne compte
  // que les sections claires : un panneau sombre ne doit pas décaler le rythme.
  let lightIndex = 0;

  return (
    <>
      {blocks.map((block, index) => {
        const layout = layoutFor(block, index);
        const key = `${index}-${block.heading}`;
        const white =
          layout === "price" ? false : (lightIndex++ % 2 === 0) === v.startsWhite;

        /* L'ouverture : le titre face au texte, pour poser le sujet. */
        if (layout === "intro") {
          return (
            <Section key={key} white={white}>
              <Reveal
                className={cn(
                  "grid gap-8 lg:gap-16",
                  v.mirrored
                    ? "lg:grid-cols-[1.15fr_1fr]"
                    : "lg:grid-cols-[1fr_1.15fr]",
                )}
              >
                <h2
                  className={cn(
                    "display-2 max-w-[18ch] text-balance",
                    v.mirrored && "lg:order-2",
                  )}
                >
                  {block.heading}
                </h2>
                <div className={cn("grid gap-5", v.mirrored && "lg:order-1")}>
                  {block.paragraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className={cn(
                        "leading-[1.65] text-[var(--ink-74)]",
                        i === 0 ? "text-[1.1875rem]" : "text-[1.0625rem]",
                      )}
                    >
                      <Inline text={paragraph} />
                    </p>
                  ))}
                </div>
              </Reveal>
            </Section>
          );
        }

        /* Une liste longue : une grille de cartes, pas des puces. */
        if (layout === "grid") {
          return (
            <Section key={key} white={white}>
              <Reveal className="max-w-[54ch]">
                <Heading index={index} mark={v.headingMark}>
                  {block.heading}
                </Heading>
                {block.paragraphs.length > 0 ? (
                  <p className="text-lead mt-5">
                    <Inline text={block.paragraphs[0]} />
                  </p>
                ) : null}
              </Reveal>

              <div
                className={cn(
                  "mt-9 grid gap-3 sm:grid-cols-2",
                  v.gridCols === 3 && "lg:grid-cols-3",
                )}
              >
                {block.bullets.map((bullet, i) => (
                  <Reveal key={i} delay={(i % 3) as 0 | 1 | 2}>
                    <article
                      className={cn(
                        "group h-full rounded-card p-6 transition-[transform,box-shadow] duration-[550ms] ease-[var(--ease-out-expo)] hover:-translate-y-1.5",
                        white
                          ? "bg-canvas shadow-[inset_0_0_0_1px_var(--ink-10)] hover:shadow-lift"
                          : "surface-card hover:shadow-lift",
                      )}
                    >
                      <CardMark mark={v.cardMark} index={i} />
                      {bullet.title ? (
                        <h3 className="display-4 mt-4">{bullet.title}</h3>
                      ) : null}
                      <p
                        className={cn(
                          "text-[0.9375rem] leading-[1.6] text-[var(--ink-65)]",
                          bullet.title ? "mt-1.5" : "mt-4",
                        )}
                      >
                        <Inline text={bullet.body} />
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </Section>
          );
        }

        /* Une liste courte : une checklist face à son titre. */
        if (layout === "checklist") {
          return (
            <Section key={key} white={white}>
              <Reveal
                className={cn(
                  "grid gap-8 lg:gap-16",
                  v.mirrored
                    ? "lg:grid-cols-[1.15fr_1fr]"
                    : "lg:grid-cols-[1fr_1.15fr]",
                )}
              >
                <div className={v.mirrored ? "lg:order-2" : undefined}>
                  <Heading index={index} mark={v.headingMark}>
                    {block.heading}
                  </Heading>
                </div>

                <div className={v.mirrored ? "lg:order-1" : undefined}>
                  {block.paragraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className="mb-5 text-[1.0625rem] leading-[1.65] text-[var(--ink-74)]"
                    >
                      <Inline text={paragraph} />
                    </p>
                  ))}
                  <ul className="grid gap-2.5">
                    {block.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className={cn(
                          "flex items-start gap-3.5 rounded-field p-4",
                          white ? "bg-canvas" : "bg-white",
                        )}
                      >
                        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-aegean-600 text-white">
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                        <span className="text-[0.9375rem] leading-[1.55] text-[var(--ink-74)]">
                          {bullet.title ? (
                            <strong className="font-display font-bold text-ink">
                              {bullet.title}
                              {". "}
                            </strong>
                          ) : null}
                          <Inline text={bullet.body} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </Section>
          );
        }

        /* Le budget : un panneau sombre, parce que c'est ce qu'on vient lire. */
        if (layout === "price") {
          return (
            <section key={key} className="py-[clamp(2.75rem,6vh,4.5rem)]">
              <div className="page-shell">
                <Reveal className="night-panel relative overflow-hidden rounded-panel p-7 sm:p-10 lg:p-14">
                  <Orbs />
                  <Arches count={v.gridCols === 3 ? 9 : 6} className="h-[60%] opacity-30" />
                  <span aria-hidden className="grain-layer" />

                  <div className="relative z-2 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
                    <Heading index={index} mark={v.headingMark} tone="dark">
                      {block.heading}
                    </Heading>
                    <div className="grid gap-5 self-center">
                      {block.paragraphs.map((paragraph, i) => (
                        <p
                          key={i}
                          className="text-[1.0625rem] leading-[1.65] text-white/72"
                        >
                          <Inline text={paragraph} tone="dark" />
                        </p>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </section>
          );
        }

        /* Par défaut : le titre d'un côté, le texte de l'autre. */
        return (
          <Section key={key} white={white}>
            <Reveal
              className={cn(
                "grid gap-8 lg:gap-16",
                v.mirrored ? "lg:grid-cols-[1.15fr_1fr]" : "lg:grid-cols-[1fr_1.15fr]",
              )}
            >
              <div className={v.mirrored ? "lg:order-2" : undefined}>
                <Heading index={index} mark={v.headingMark}>
                  {block.heading}
                </Heading>
              </div>
              <div className={cn("grid gap-5", v.mirrored && "lg:order-1")}>
                {block.paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[1.0625rem] leading-[1.65] text-[var(--ink-74)]"
                  >
                    <Inline text={paragraph} />
                  </p>
                ))}
              </div>
            </Reveal>
          </Section>
        );
      })}
    </>
  );
}
