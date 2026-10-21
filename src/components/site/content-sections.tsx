import { Check } from "lucide-react";

import { Arches, Orbs } from "@/components/ui/decor";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Transforme un corps Markdown en sections mises en page.
 *
 * Le contenu reste rédigé en Markdown dans l'administration — c'est le format
 * le plus simple à écrire — mais il n'est plus rendu comme un article.
 *
 * Trois principes :
 *
 * 1. **La forme suit le contenu.** Une liste longue devient une grille ou une
 *    suite d'étapes, une liste courte une checklist, un passage sur le budget
 *    un panneau sombre, une phrase isolée une accroche centrée.
 * 2. **Les titres de section ne hurlent pas.** Un seul grand titre par page,
 *    celui du hero. Les sections descendent d'une échelle, sinon la page n'est
 *    qu'une succession de pancartes de même taille.
 * 3. **Deux pages ne se ressemblent pas.** Une empreinte stable tirée de la
 *    clé de la page arbitre entre les formes concurrentes — grille ou étapes,
 *    vis-à-vis ou colonnes — et fixe le sens de lecture. Rien d'aléatoire : le
 *    rendu est identique à chaque construction.
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
    return body ? { title, body } : { body: title };
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
  /** Le titre passe à droite du texte sur les sections en vis-à-vis. */
  mirrored: boolean;
  /** Trois colonnes serrées, ou deux colonnes plus généreuses. */
  gridCols: 2 | 3;
  /** Une liste longue se lit en grille, ou en suite d'étapes. */
  listAsSteps: boolean;
  /** Un texte long se lit en vis-à-vis, ou en deux colonnes sous son titre. */
  proseAsColumns: boolean;
  /** Marqueur des cartes : coche ou numéro. */
  cardMark: "check" | "number";
  /** Fond de la première section claire ; les suivantes alternent. */
  startsWhite: boolean;
  /** Sur-titre numéroté, ou filet. */
  headingMark: "number" | "rule";
};

export function variantFor(seed: string): Variant {
  const h = hash(seed);
  return {
    mirrored: (h & 1) === 1,
    gridCols: (h >> 1) % 2 === 0 ? 3 : 2,
    listAsSteps: (h >> 2) % 2 === 1,
    proseAsColumns: (h >> 3) % 2 === 1,
    cardMark: (h >> 4) % 2 === 0 ? "check" : "number",
    startsWhite: (h >> 5) % 2 === 0,
    headingMark: (h >> 6) % 2 === 0 ? "number" : "rule",
  };
}

/* -------------------------------------------------------------------- types */

type Layout =
  | "intro"
  | "callout"
  | "grid"
  | "steps"
  | "checklist"
  | "price"
  | "columns"
  | "split";

/** Le contenu et la variante décident ensemble de la forme. */
function layoutFor(block: Block, index: number, v: Variant): Layout {
  const text = block.paragraphs.join(" ");

  if (index === 0 && block.bullets.length === 0) return "intro";

  // Les passages sur le budget portent le chiffre qui décide.
  if (
    block.bullets.length === 0 &&
    /\d\s?\d{3}\s?(€|EUR)|à partir de|from €|desde \d/i.test(text)
  ) {
    return "price";
  }

  if (block.bullets.length >= 3) return v.listAsSteps ? "steps" : "grid";
  if (block.bullets.length > 0) return "checklist";

  // Une phrase isolée se met en valeur au lieu de se perdre dans une colonne.
  if (block.paragraphs.length === 1 && text.length < 240) return "callout";
  if (block.paragraphs.length >= 3 && v.proseAsColumns) return "columns";

  return "split";
}

/* ------------------------------------------------------------------- rendus */

/**
 * Échelle des titres de section : nettement sous celle du hero. Un seul très
 * grand titre par page suffit, sinon chaque section crie aussi fort que la
 * précédente et plus rien ne hiérarchise.
 */
const SECTION_TITLE =
  "font-display font-extrabold tracking-[-0.035em] leading-[1.08] text-[clamp(1.5rem,2.4vw,2.15rem)]";

function Section({ white, children }: { white: boolean; children: React.ReactNode }) {
  return (
    <section className={cn("py-[clamp(2.5rem,5.5vh,4rem)]", white && "bg-white")}>
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
            "mb-4 block h-[3px] w-10 rounded-full",
            tone === "dark" ? "bg-aegean-400" : "bg-aegean-600",
          )}
        />
        <h2 className={cn(SECTION_TITLE, tone === "dark" && "text-white")}>
          {children}
        </h2>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3.5">
      <span
        aria-hidden
        className={cn(
          "mt-[0.5em] font-display text-[0.6875rem] font-extrabold tabular-nums",
          tone === "dark" ? "text-aegean-300/70" : "text-aegean-500",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <h2 className={cn(SECTION_TITLE, "flex-1", tone === "dark" && "text-white")}>
        {children}
      </h2>
    </div>
  );
}

function CardMark({ mark, index }: { mark: Variant["cardMark"]; index: number }) {
  return (
    <span className="grid size-9 place-items-center rounded-[11px] bg-aegean-100 font-display text-[0.8125rem] font-extrabold tabular-nums text-aegean-700 transition-colors duration-500 group-hover:bg-aegean-600 group-hover:text-white">
      {mark === "number" ? (
        String(index + 1).padStart(2, "0")
      ) : (
        <Check className="size-[18px]" strokeWidth={2.6} />
      )}
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

  // L'alternance des fonds ne compte que les sections claires : un panneau
  // sombre ne doit pas décaler le rythme des suivantes.
  let lightIndex = 0;
  // Les sections en vis-à-vis alternent de sens entre elles : deux titres de
  // suite du même côté se lisent comme une répétition, pas comme un rythme.
  let facingIndex = 0;

  return (
    <>
      {blocks.map((block, index) => {
        const layout = layoutFor(block, index, v);
        const key = `${index}-${block.heading}`;
        const white =
          layout === "price" ? false : (lightIndex++ % 2 === 0) === v.startsWhite;
        const facing = ["intro", "checklist", "split"].includes(layout);
        const mirrored = facing
          ? v.mirrored !== (facingIndex++ % 2 === 1)
          : v.mirrored;

        /* L'ouverture : le titre face au texte, pour poser le sujet. */
        if (layout === "intro") {
          return (
            <Section key={key} white={white}>
              <Reveal
                className={cn(
                  "grid gap-8 lg:items-center lg:gap-16",
                  mirrored ? "lg:grid-cols-[1.15fr_1fr]" : "lg:grid-cols-[1fr_1.15fr]",
                )}
              >
                <h2
                  className={cn(
                    "font-display text-[clamp(1.7rem,2.9vw,2.6rem)] leading-[1.05] font-extrabold tracking-[-0.04em] text-balance",
                    mirrored && "lg:order-2",
                  )}
                >
                  {block.heading}
                </h2>
                <div className={cn("grid gap-5", mirrored && "lg:order-1")}>
                  {block.paragraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className={cn(
                        "leading-[1.68] text-[var(--ink-74)]",
                        i === 0 ? "text-[1.125rem]" : "text-[1.0625rem]",
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

        /* Une phrase isolée : une accroche, pas un paragraphe perdu. */
        if (layout === "callout") {
          return (
            <Section key={key} white={white}>
              <Reveal className="mx-auto max-w-[62ch] text-center">
                <p className="font-display text-[0.6875rem] font-bold tracking-[0.1em] text-aegean-600 uppercase">
                  {block.heading}
                </p>
                <p className="mt-5 font-display text-[clamp(1.25rem,2.1vw,1.75rem)] leading-[1.38] font-bold tracking-[-0.025em] text-balance text-ink">
                  <Inline text={block.paragraphs[0]} />
                </p>
              </Reveal>
            </Section>
          );
        }

        /* Une liste longue, en suite d'étapes reliées. */
        if (layout === "steps") {
          return (
            <Section key={key} white={white}>
              <Reveal className="max-w-[52ch]">
                <Heading index={index} mark={v.headingMark}>
                  {block.heading}
                </Heading>
                {block.paragraphs.length > 0 ? (
                  <p className="text-lead mt-4">
                    <Inline text={block.paragraphs[0]} />
                  </p>
                ) : null}
              </Reveal>

              <ol className="mt-8">
                {block.bullets.map((bullet, i) => (
                  <Reveal key={i} delay={(i % 3) as 0 | 1 | 2}>
                    <li className="group relative grid gap-1.5 border-t border-[var(--ink-10)] py-5 pl-14 last:border-b sm:grid-cols-[17rem_1fr] sm:gap-8 sm:pl-16">
                      <span
                        aria-hidden
                        className="absolute top-5 left-0 grid size-9 place-items-center rounded-full bg-ink font-display text-[0.75rem] font-extrabold tabular-nums text-white transition-colors duration-300 group-hover:bg-aegean-600"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {bullet.title ? (
                        <h3 className="display-4 self-center">{bullet.title}</h3>
                      ) : null}
                      <p
                        className={cn(
                          "self-center text-[0.9375rem] leading-[1.6] text-[var(--ink-65)]",
                          !bullet.title && "sm:col-span-2",
                        )}
                      >
                        <Inline text={bullet.body} />
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </Section>
          );
        }

        /* Une liste longue, en grille de cartes. */
        if (layout === "grid") {
          return (
            <Section key={key} white={white}>
              <Reveal className="max-w-[52ch]">
                <Heading index={index} mark={v.headingMark}>
                  {block.heading}
                </Heading>
                {block.paragraphs.length > 0 ? (
                  <p className="text-lead mt-4">
                    <Inline text={block.paragraphs[0]} />
                  </p>
                ) : null}
              </Reveal>

              <div
                className={cn(
                  "mt-8 grid gap-3 sm:grid-cols-2",
                  v.gridCols === 3 && "lg:grid-cols-3",
                )}
              >
                {block.bullets.map((bullet, i) => (
                  <Reveal key={i} delay={(i % 3) as 0 | 1 | 2}>
                    <article
                      className={cn(
                        "group h-full rounded-card p-5 transition-transform duration-[320ms] ease-[var(--ease-hover)] hover:-translate-y-1.5 sm:p-6",
                        white
                          ? "bg-canvas card-ring"
                          : "surface-card",
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
                  "grid gap-8 lg:items-center lg:gap-16",
                  mirrored ? "lg:grid-cols-[1.15fr_1fr]" : "lg:grid-cols-[1fr_1.15fr]",
                )}
              >
                <div className={mirrored ? "lg:order-2" : undefined}>
                  <Heading index={index} mark={v.headingMark}>
                    {block.heading}
                  </Heading>
                </div>

                <div className={mirrored ? "lg:order-1" : undefined}>
                  {block.paragraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className="mb-5 text-[1.0625rem] leading-[1.68] text-[var(--ink-74)]"
                    >
                      <Inline text={paragraph} />
                    </p>
                  ))}
                  <ul className="grid gap-2">
                    {block.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className={cn(
                          "flex items-start gap-3.5 rounded-field p-4",
                          white ? "bg-canvas" : "bg-white",
                        )}
                      >
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-aegean-600 text-white">
                          <Check className="size-3" strokeWidth={3.2} />
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
            <section key={key} className="py-[clamp(2.5rem,5.5vh,4rem)]">
              <div className="page-shell">
                <Reveal className="night-panel relative overflow-hidden rounded-panel p-7 sm:p-10 lg:p-12">
                  <Orbs />
                  <Arches
                    count={v.gridCols === 3 ? 9 : 6}
                    className="h-[60%] opacity-30"
                  />
                  <span aria-hidden className="grain-layer" />

                  <div className="relative z-2 grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
                    <Heading index={index} mark={v.headingMark} tone="dark">
                      {block.heading}
                    </Heading>
                    <div className="grid gap-5 self-center">
                      {block.paragraphs.map((paragraph, i) => (
                        <p
                          key={i}
                          className="text-[1.0625rem] leading-[1.68] text-white/72"
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

        /* Un texte long : le titre dessus, le texte en deux colonnes. */
        if (layout === "columns") {
          return (
            <Section key={key} white={white}>
              <Reveal>
                <div className="max-w-[46ch]">
                  <Heading index={index} mark={v.headingMark}>
                    {block.heading}
                  </Heading>
                </div>
                <div className="mt-7 grid gap-x-12 gap-y-5 md:grid-cols-2">
                  {block.paragraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-[1.0625rem] leading-[1.68] text-[var(--ink-74)]"
                    >
                      <Inline text={paragraph} />
                    </p>
                  ))}
                </div>
              </Reveal>
            </Section>
          );
        }

        /* Par défaut : le titre d'un côté, le texte de l'autre. */
        return (
          <Section key={key} white={white}>
            <Reveal
              className={cn(
                "grid gap-8 lg:items-center lg:gap-16",
                mirrored ? "lg:grid-cols-[1.15fr_1fr]" : "lg:grid-cols-[1fr_1.15fr]",
              )}
            >
              <div className={mirrored ? "lg:order-2" : undefined}>
                <Heading index={index} mark={v.headingMark}>
                  {block.heading}
                </Heading>
              </div>
              <div className={cn("grid gap-5", mirrored && "lg:order-1")}>
                {block.paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[1.0625rem] leading-[1.68] text-[var(--ink-74)]"
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
