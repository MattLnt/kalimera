/**
 * E-mail d'envoi d'un devis ou d'une facture : sobre, aux couleurs froides
 * du studio, lisible dans tous les clients mail (tableaux et styles en
 * ligne, pas de CSS externe ni d'image).
 */

export type EmailSender = {
  /** Personne qui signe : le contact de l'identité, sinon son nom. */
  signer: string;
  /** Raison sociale, sous le nom du signataire (si différente). */
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  /** Mention légale courte, en pied d'e-mail. */
  footer?: string | null;
};

export type EmailSummary = { label: string; value: string; strong?: boolean }[];

const NAVY = "#0B3A75";
const BLUE = "#1F6FD1";
const INK = "#0B1B2E";
const MUTED = "#5A6A80";
const LINE = "#E3E9F2";

function esc(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Identité émettrice → signature : « Contact : Estelle Pages » dans l'en-tête donne le signataire. */
export function senderFromIssuer(
  issuer: { name: string; headerLines?: string | null; email?: string | null; phone?: string | null; website?: string | null; footer?: string | null } | null | undefined,
  fallbackName: string,
): EmailSender {
  if (!issuer) return { signer: fallbackName };
  const contact = (issuer.headerLines ?? "")
    .split("\n")
    .map((line) => line.trim())
    .find((line) => /^contact\s*:/i.test(line))
    ?.replace(/^contact\s*:\s*/i, "")
    .trim();
  const signer = contact || issuer.name;
  return {
    signer,
    company: signer === issuer.name ? null : issuer.name,
    email: issuer.email,
    phone: issuer.phone,
    website: issuer.website,
    footer: issuer.footer,
  };
}

/** Texte libre → paragraphes : une ligne vide sépare deux paragraphes, un retour à la ligne reste un retour. */
function paragraphs(body: string) {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${INK};">${esc(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function renderDocumentEmail({
  body,
  sender,
  summary,
  button,
  attachmentName,
  banner,
}: {
  body: string;
  sender: EmailSender;
  summary?: EmailSummary;
  button?: { href: string; label: string };
  attachmentName?: string;
  /** Bandeau discret en tête (e-mail de test). */
  banner?: string;
}) {
  const website = sender.website?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const contactLine = [
    sender.email ? `<a href="mailto:${esc(sender.email)}" style="color:${BLUE};text-decoration:none;">${esc(sender.email)}</a>` : "",
    sender.phone ? `<a href="tel:${esc(sender.phone.replace(/\s+/g, ""))}" style="color:${BLUE};text-decoration:none;">${esc(sender.phone)}</a>` : "",
    website ? `<a href="https://${esc(website)}" style="color:${BLUE};text-decoration:none;">${esc(website)}</a>` : "",
  ]
    .filter(Boolean)
    .join(`<span style="color:${LINE};">&nbsp;&nbsp;|&nbsp;&nbsp;</span>`);

  const initials = sender.signer
    .split(/\s+/)
    .filter((part) => /^\p{L}/u.test(part))
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");

  return `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:#EEF2F7;-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F7;">
<tr><td align="center" style="padding:32px 14px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    ${
      banner
        ? `<tr><td style="padding:0 0 12px;"><div style="background:#DCE5F1;color:${NAVY};font-size:12.5px;line-height:1.5;padding:10px 16px;border-radius:12px;">${esc(banner)}</div></td></tr>`
        : ""
    }
    <tr><td style="background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 1px 2px rgba(11,27,46,0.06);">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="height:5px;background:${NAVY};background-image:linear-gradient(90deg,${NAVY},${BLUE});font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:34px 36px 8px;">
          ${paragraphs(body)}
        </td></tr>
        ${
          summary?.length
            ? `<tr><td style="padding:4px 36px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F8FC;border-radius:14px;">
            ${summary
              .map(
                (row, index) => `<tr>
              <td style="padding:${index === 0 ? "16px" : "6px"} 20px ${index === summary.length - 1 ? "16px" : "6px"};font-size:13px;color:${MUTED};">${esc(row.label)}</td>
              <td align="right" style="padding:${index === 0 ? "16px" : "6px"} 20px ${index === summary.length - 1 ? "16px" : "6px"};font-size:${row.strong ? "17px" : "14px"};font-weight:${row.strong ? "800" : "600"};color:${INK};white-space:nowrap;">${esc(row.value)}</td>
            </tr>`,
              )
              .join("")}
          </table>
        </td></tr>`
            : ""
        }
        ${
          button
            ? `<tr><td style="padding:18px 36px 6px;">
          <a href="${esc(button.href)}" style="display:inline-block;background:${BLUE};color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:14px 26px;border-radius:12px;">${esc(button.label)}&nbsp;&nbsp;→</a>
        </td></tr>`
            : ""
        }
        ${
          attachmentName
            ? `<tr><td style="padding:10px 36px 0;font-size:12.5px;color:${MUTED};">Pièce jointe : ${esc(attachmentName)}</td></tr>`
            : ""
        }
        <tr><td style="padding:28px 36px 34px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE};width:100%;">
            <tr><td style="padding-top:22px;">
              <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td valign="top" style="padding-right:14px;">
                  <div style="width:44px;height:44px;border-radius:12px;background:${NAVY};background-image:linear-gradient(135deg,${BLUE},${NAVY});color:#FFFFFF;font-size:15px;font-weight:800;line-height:44px;text-align:center;">${esc(initials || "K")}</div>
                </td>
                <td valign="top">
                  <div style="font-size:15px;font-weight:800;color:${INK};line-height:1.3;">${esc(sender.signer)}</div>
                  ${sender.company ? `<div style="font-size:13px;color:${MUTED};line-height:1.5;">${esc(sender.company)}</div>` : ""}
                  ${contactLine ? `<div style="font-size:13px;line-height:1.6;margin-top:4px;">${contactLine}</div>` : ""}
                </td>
              </tr></table>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
    ${
      sender.footer
        ? `<tr><td align="center" style="padding:18px 20px 0;font-size:11.5px;line-height:1.6;color:#8A96A8;">${esc(sender.footer)}</td></tr>`
        : ""
    }
  </table>
</td></tr>
</table>
</body>
</html>`;
}

/** Version texte, pour les clients mail sans HTML. */
export function renderDocumentEmailText({ body, sender, summary, button }: { body: string; sender: EmailSender; summary?: EmailSummary; button?: { href: string; label: string } }) {
  return [
    body.trim(),
    summary?.map((row) => `${row.label} : ${row.value}`).join("\n") ?? "",
    button ? `${button.label} : ${button.href}` : "",
    ["—", sender.signer, sender.company ?? "", [sender.email, sender.phone, sender.website].filter(Boolean).join(" · ")].filter(Boolean).join("\n"),
  ]
    .filter(Boolean)
    .join("\n\n");
}
