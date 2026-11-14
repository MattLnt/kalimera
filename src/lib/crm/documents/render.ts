/**
 * Gabarit HTML des devis et factures.
 *
 * Reproduction fidèle de la charte (docs/private/fiche-devis-factures.md) :
 * sobre, sans pastille ni coin arrondi, deux colonnes Description / Montant,
 * total affiché une seule fois. Le même HTML sert à l'aperçu dans le CRM, à
 * la page envoyée au client et au PDF : ce que l'on voit est ce qui part.
 */

export type DocIssuer = {
  name: string;
  headerLines: string;
  footer: string;
  vatMention?: string | null;
  paymentTerms?: string | null;
  latePenalty?: string | null;
  recoveryFee?: string | null;
  bankHolder?: string | null;
  bankName?: string | null;
  iban?: string | null;
  bic?: string | null;
};

/** `idLines` : numéro d'entreprise et de TVA, imprimés en gris sous l'adresse. */
export type DocClient = { name: string; addressLines: string[]; idLines?: string[] };

export type DocLine = { title: string; description?: string | null; amountCents: number };

export type DocSignature =
  | { mode: "SIGNATURE"; name: string; signedAt: Date; image?: string | null; ip?: string | null; hash?: string | null }
  | { mode: "VERBAL" | "EMAIL" | "PURCHASE_ORDER" | "OTHER"; acceptedAt: Date; note?: string | null };

type Common = {
  number: string | null;
  date: Date;
  currency: string;
  title: string;
  issuer: DocIssuer;
  client: DocClient;
  lines: DocLine[];
  totalCents: number;
  /** Mention de brouillon en filigrane : document pas encore émis. */
  draft?: boolean;
};

export type QuoteDoc = Common & {
  kind: "QUOTE";
  validityDays: number;
  context?: string | null;
  perimeter?: string | null;
  stack: string[];
  depositPercent: number;
  paymentNote?: string | null;
  delay?: string | null;
  outOfScope?: string | null;
  evolutions: string[];
  terms?: string | null;
  signature?: DocSignature | null;
};

export type InvoiceDoc = Common & {
  kind: "INVOICE";
  docType: "FACTURE" | "AVOIR";
  contextLine?: string | null;
  notes?: string | null;
};

export type Doc = QuoteDoc | InvoiceDoc;

// ------------------------------------------------------------------ outils

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const lines = (value: string) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

/** 190000 → « 1 900,00 $ », 20000 → « 200,00 € » — espaces insécables. */
export function money(cents: number, currency: string) {
  const amount = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(cents / 100)
    .replace(/[   ]/g, " ");
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency;
  return `${amount} ${symbol}`;
}

function dateFr(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

/**
 * Contenu d'un lot : paragraphes, listes à puces (« - »), et note finale en
 * gris (ligne commençant par « > »).
 */
function lotContent(text: string) {
  const out: string[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) out.push(`<ul>${list.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`);
    list = [];
  };
  for (const line of lines(text)) {
    if (/^[-•·]\s+/.test(line)) list.push(line.replace(/^[-•·]\s+/, ""));
    else if (line.startsWith(">")) {
      flush();
      out.push(`<div class="lot-note">${esc(line.replace(/^>\s*/, ""))}</div>`);
    } else {
      flush();
      out.push(`<div>${esc(line)}</div>`);
    }
  }
  flush();
  return out.join("");
}

// ------------------------------------------------------------------ styles

const css = `
  * { box-sizing: border-box; }
  @page { size: A4; margin: 18mm 16mm; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, "Liberation Sans", Helvetica, sans-serif; color: #0D0D12; background: #fff; margin: 0; }
  .doc { position: relative; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid #1D2B3A; gap: 24px; }
  .brand { font-size: 16px; font-weight: 700; margin-bottom: 2px; letter-spacing: 0.01em; }
  .brand-sub { font-size: 11px; color: #555; line-height: 1.5; }
  .doc-meta { text-align: right; white-space: nowrap; }
  .doc-type { font-size: 11px; color: #555; margin-bottom: 2px; }
  .doc-number { font-size: 15px; font-weight: 700; }
  .doc-date { font-size: 11px; color: #555; margin-top: 6px; }
  .title-block { margin-bottom: 18px; }
  .title-block h1 { font-size: 16px; margin: 0 0 4px 0; font-weight: 700; }
  .info-blocks { display: flex; gap: 40px; margin-bottom: 22px; flex-wrap: wrap; }
  .info-label { font-size: 10.5px; color: #555; margin-bottom: 3px; }
  .info-value { font-size: 12px; font-weight: 600; line-height: 1.6; }
  h2 { font-size: 12.5px; font-weight: 700; margin: 26px 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid #D9D9D9; page-break-after: avoid; break-after: avoid; }
  p.context { font-size: 12.5px; line-height: 1.7; color: #262626; margin: 0 0 8px 0; white-space: pre-line; }
  table.lots { width: 100%; border-collapse: collapse; margin-bottom: 4px; border: 1px solid #D9D9D9; }
  table.lots thead { display: table-header-group; }
  table.lots tbody tr { page-break-inside: avoid; break-inside: avoid; }
  table.lots thead td { font-size: 10.5px; color: #262626; font-weight: 700; background: #F2F2F2; padding: 8px 10px; border-bottom: 1px solid #D9D9D9; }
  table.lots thead td:last-child { text-align: right; }
  table.lots tbody td { font-size: 12px; padding: 10px; border-bottom: 1px solid #EAEAEA; vertical-align: top; }
  table.lots tbody td:last-child { text-align: right; font-weight: 600; white-space: nowrap; }
  .lot-name { font-weight: 600; margin-bottom: 4px; }
  .lot-content { font-size: 11px; color: #555; line-height: 1.6; }
  .lot-content ul { margin: 6px 0; padding-left: 16px; }
  .lot-content li { margin-bottom: 3px; }
  .lot-note { font-size: 11px; color: #555; line-height: 1.6; margin-top: 6px; }
  .total-row { display: flex; justify-content: flex-end; margin: 10px 0 24px 0; }
  .total-box { width: 240px; display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; padding: 8px 10px; border-top: 2px solid #1D2B3A; }
  ul.clean { margin: 0; padding-left: 18px; }
  ul.clean li { font-size: 12px; color: #262626; line-height: 1.8; }
  .payment-terms { display: flex; gap: 30px; margin-bottom: 10px; }
  .payment-box .label { font-size: 10.5px; color: #555; margin-bottom: 3px; }
  .payment-box .value { font-size: 14px; font-weight: 700; }
  .payment-note { font-size: 11px; color: #555; margin-top: 10px; line-height: 1.6; }
  .delay-box { font-size: 12px; color: #262626; line-height: 1.6; white-space: pre-line; }
  .out-of-scope { font-size: 11.5px; color: #555; line-height: 1.7; margin: 0; white-space: pre-line; }
  table.evol { width: 100%; border-collapse: collapse; margin-top: 8px; }
  table.evol td { font-size: 11.5px; color: #262626; padding: 6px 0; border-bottom: 1px solid #EAEAEA; }
  table.evol td::before { content: "– "; color: #555; }
  .validity-block { margin-top: 26px; padding-top: 14px; border-top: 1px solid #D9D9D9; font-size: 12px; color: #262626; line-height: 1.7; }
  .signature-row { display: flex; justify-content: space-between; margin-top: 24px; page-break-inside: avoid; break-inside: avoid; }
  .signature-box { width: 45%; border-top: 1px solid #CBD5E1; padding-top: 8px; font-size: 11px; color: #555; min-height: 70px; }
  .signature-box img { display: block; max-height: 56px; max-width: 100%; margin: 6px 0 4px; }
  .signature-proof { font-size: 9.5px; color: #555; line-height: 1.5; margin-top: 4px; word-break: break-all; }
  .legal { font-size: 10px; color: #555; line-height: 1.6; margin-top: 18px; white-space: pre-line; }
  .block { page-break-inside: avoid; break-inside: avoid; }
  .footer { font-size: 10px; color: #555; text-align: center; border-top: 1px solid #D9D9D9; padding-top: 14px; margin-top: 26px; line-height: 1.6; }
  .draft-mark { position: fixed; top: 40%; left: 0; right: 0; text-align: center; font-size: 72px; font-weight: 700; color: rgba(13, 13, 18, 0.05); transform: rotate(-24deg); pointer-events: none; }

  /* À l'écran (aperçu, onglet, page client) : une feuille A4 blanche, centrée
     sur fond gris, avec les marges du PDF. À l'impression et dans le PDF,
     ce sont les marges de @page qui s'appliquent, sans ce cadre. */
  @media screen {
    html { background: #E9ECF1; }
    body { background: transparent; padding: 24px 12px; }
    .doc { max-width: 210mm; min-height: 297mm; margin: 0 auto; padding: 18mm 16mm; background: #fff; box-shadow: 0 1px 3px rgba(13, 13, 18, 0.08), 0 12px 32px -12px rgba(13, 13, 18, 0.18); }
    .draft-mark { position: absolute; }
  }
  @media screen and (max-width: 640px) {
    body { padding: 0; }
    .doc { padding: 22px 18px; min-height: 0; box-shadow: none; }
    .header { flex-direction: column; }
    .doc-meta { text-align: left; }
  }
`;

// ------------------------------------------------------------------ blocs

function header(doc: Doc, docType: string, extraDate = "") {
  const sub = lines(doc.issuer.headerLines).map(esc).join("<br>");
  return `
    <div class="header">
      <div>
        <div class="brand">${esc(doc.issuer.name)}</div>
        ${sub ? `<div class="brand-sub">${sub}</div>` : ""}
      </div>
      <div class="doc-meta">
        <div class="doc-type">${docType}</div>
        <div class="doc-number">${esc(doc.number ?? "Brouillon")}</div>
        <div class="doc-date">Date : ${dateFr(doc.date)}${extraDate}</div>
      </div>
    </div>`;
}

function clientBlock(client: DocClient) {
  const value = [client.name, ...client.addressLines].map(esc).join("<br>");
  const ids = (client.idLines ?? []).map(esc).join("<br>");
  return `
    <div class="info-blocks">
      <div class="info-block">
        <div class="info-label">Client</div>
        <div class="info-value">${value}</div>
        ${ids ? `<div class="info-label" style="margin-top:4px;line-height:1.6;">${ids}</div>` : ""}
      </div>
    </div>`;
}

function lotsTable(doc: Doc, firstCol: string, lastCol: string, totalLabel: string) {
  const rows = doc.lines
    .map(
      (line) => `
        <tr>
          <td>
            <div class="lot-name">${esc(line.title)}</div>
            ${line.description ? `<div class="lot-content">${lotContent(line.description)}</div>` : ""}
          </td>
          <td>${money(line.amountCents, doc.currency)}</td>
        </tr>`,
    )
    .join("");
  return `
    <table class="lots">
      <thead><tr><td>${firstCol}</td><td style="text-align:right;">${lastCol}</td></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="total-row">
      <div class="total-box"><span>${totalLabel}</span><span>${money(doc.totalCents, doc.currency)}</span></div>
    </div>`;
}

/** Mentions légales : imprimées seulement si l'identité les a saisies. */
function legal(issuer: DocIssuer) {
  const parts = [issuer.vatMention, issuer.paymentTerms, issuer.latePenalty, issuer.recoveryFee]
    .map((part) => part?.trim())
    .filter(Boolean) as string[];
  return parts.length ? `<div class="legal block">${parts.map(esc).join("\n")}</div>` : "";
}

function bank(issuer: DocIssuer) {
  if (!issuer.bankHolder && !issuer.iban && !issuer.bic) return "";
  const rows = [
    issuer.bankHolder ? `Titulaire : ${esc(issuer.bankHolder)}` : null,
    issuer.bankName ? `Banque : ${esc(issuer.bankName)}` : null,
    issuer.iban ? `IBAN : ${esc(issuer.iban)}` : null,
    issuer.bic ? `BIC : ${esc(issuer.bic)}` : null,
  ].filter(Boolean) as string[];
  return `
    <div class="block">
      <h2>Coordonnées bancaires</h2>
      ${rows.map((row, index) => `<p class="context" style="margin-bottom:${index === rows.length - 1 ? 8 : 2}px;">${row}</p>`).join("")}
    </div>`;
}

const acceptanceLabels: Record<Exclude<DocSignature["mode"], "SIGNATURE">, string> = {
  VERBAL: "Accepté à l'oral",
  EMAIL: "Accepté par e-mail",
  PURCHASE_ORDER: "Accepté sur bon de commande",
  OTHER: "Accepté",
};

function signatureRow(doc: QuoteDoc) {
  const signature = doc.signature;
  let clientBox = `Bon pour accord — ${esc(doc.client.name)}`;
  if (signature?.mode === "SIGNATURE") {
    clientBox = `Bon pour accord — ${esc(doc.client.name)}
      ${signature.image ? `<img src="${signature.image}" alt="Signature">` : ""}
      <div><strong>${esc(signature.name)}</strong>, le ${dateFr(signature.signedAt)}</div>
      <div class="signature-proof">Signé électroniquement${signature.ip ? ` · IP ${esc(signature.ip)}` : ""}${
        signature.hash ? `<br>Empreinte SHA-256 : ${esc(signature.hash)}` : ""
      }</div>`;
  } else if (signature) {
    clientBox = `Bon pour accord — ${esc(doc.client.name)}
      <div style="margin-top:10px;"><strong>${acceptanceLabels[signature.mode]}</strong> le ${dateFr(signature.acceptedAt)}</div>
      ${signature.note ? `<div class="signature-proof">${esc(signature.note)}</div>` : ""}`;
  }
  return `
    <div class="signature-row">
      <div class="signature-box">Date et signature — ${esc(doc.issuer.name)}</div>
      <div class="signature-box">${clientBox}</div>
    </div>`;
}

// ------------------------------------------------------------------ documents

function quoteBody(doc: QuoteDoc) {
  const deposit = Math.round((doc.totalCents * doc.depositPercent) / 100);
  const balance = doc.totalCents - deposit;
  const payment =
    doc.depositPercent > 0 && doc.depositPercent < 100
      ? `<div class="payment-box"><div class="label">Acompte à la commande</div><div class="value">${money(deposit, doc.currency)}</div></div>
         <div class="payment-box"><div class="label">Solde à la livraison</div><div class="value">${money(balance, doc.currency)}</div></div>`
      : `<div class="payment-box"><div class="label">${doc.depositPercent >= 100 ? "Paiement à la commande" : "Paiement à la livraison"}</div><div class="value">${money(doc.totalCents, doc.currency)}</div></div>`;

  return `
    ${header(doc, "DEVIS", ` &nbsp;·&nbsp; Validité : ${doc.validityDays} jours`)}
    <div class="title-block"><h1>${esc(doc.title)}</h1></div>
    ${clientBlock(doc.client)}

    ${
      doc.context || doc.perimeter
        ? `<h2>Contexte</h2>
           ${doc.context ? `<p class="context">${esc(doc.context)}</p>` : ""}
           ${doc.perimeter ? `<p class="context"><strong>Périmètre :</strong> ${esc(doc.perimeter)}</p>` : ""}`
        : ""
    }

    <h2>Détail des prestations et tarification par lot</h2>
    ${lotsTable(doc, "Lot", "Prix", "Total")}

    ${
      doc.stack.length
        ? `<div class="block"><h2>Stack technique</h2><ul class="clean">${doc.stack.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div>`
        : ""
    }

    <div class="block">
      <h2>Modalités de paiement</h2>
      <div class="payment-terms">${payment}</div>
      ${doc.paymentNote ? `<div class="payment-note">${esc(doc.paymentNote)}</div>` : ""}
    </div>

    ${doc.delay ? `<div class="block"><h2>Délai</h2><div class="delay-box">${esc(doc.delay)}</div></div>` : ""}
    ${doc.outOfScope ? `<div class="block"><h2>Hors périmètre de ce devis</h2><p class="out-of-scope">${esc(doc.outOfScope)}</p></div>` : ""}
    ${
      doc.evolutions.length
        ? `<div class="block"><h2>Évolutions envisageables</h2>
           <p class="out-of-scope" style="margin-bottom:6px;">Les pistes suivantes pourront faire l'objet d'un devis complémentaire une fois l'outil en usage :</p>
           <table class="evol">${doc.evolutions.map((item) => `<tr><td>${esc(item)}</td></tr>`).join("")}</table></div>`
        : ""
    }
    ${doc.terms ? `<div class="block"><h2>Conditions particulières</h2><p class="out-of-scope">${esc(doc.terms)}</p></div>` : ""}

    <div class="validity-block block">Ce devis est valable ${doc.validityDays} jours à compter de sa date d'émission. Il est considéré comme accepté à réception d'un retour écrit (e-mail) et du versement de l'acompte.</div>
    ${signatureRow(doc)}
    ${legal(doc.issuer)}`;
}

function invoiceBody(doc: InvoiceDoc) {
  return `
    ${header(doc, doc.docType)}
    <div class="title-block"><h1>${esc(doc.title)}</h1></div>
    ${clientBlock(doc.client)}
    ${doc.contextLine ? `<p class="context">${esc(doc.contextLine)}</p>` : ""}

    <h2>Détail des prestations</h2>
    ${lotsTable(doc, "Description", "Montant", doc.docType === "AVOIR" ? "Total de l'avoir" : "Total net à payer")}
    ${doc.notes ? `<p class="out-of-scope">${esc(doc.notes)}</p>` : ""}
    ${doc.docType === "FACTURE" ? bank(doc.issuer) : ""}
    ${legal(doc.issuer)}`;
}

export function renderDocument(doc: Doc) {
  const body = doc.kind === "QUOTE" ? quoteBody(doc) : invoiceBody(doc);
  const title = `${doc.kind === "QUOTE" ? "Devis" : doc.docType === "AVOIR" ? "Avoir" : "Facture"} ${doc.number ?? "brouillon"} — ${doc.issuer.name}`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<style>${css}</style>
</head>
<body>
  <div class="doc">
    ${doc.draft ? '<div class="draft-mark">BROUILLON</div>' : ""}
    ${body}
    ${doc.issuer.footer ? `<div class="footer">${esc(doc.issuer.footer)}</div>` : ""}
  </div>
</body>
</html>`;
}

/** Nom de fichier de la fiche : FAC-2026-11-04-Client-Projet.pdf */
export function documentFileName(doc: Doc) {
  const slug = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
  return [doc.number ?? (doc.kind === "QUOTE" ? "Devis-brouillon" : "Facture-brouillon"), slug(doc.client.name), slug(doc.title)]
    .filter(Boolean)
    .join("-")
    .concat(".pdf");
}
