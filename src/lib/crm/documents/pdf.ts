import "server-only";

import { existsSync } from "node:fs";

/**
 * HTML → PDF avec un vrai moteur de navigateur, pour que le PDF soit
 * identique à l'aperçu (sauts de page, en-têtes de tableau répétés…).
 *
 * Sur Vercel : le Chromium allégé de @sparticuz/chromium. En local : le
 * Chrome ou l'Edge installés, ou le chemin donné par CHROME_PATH.
 */
async function launch() {
  const puppeteer = (await import("puppeteer-core")).default;

  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteer.launch({
      args: await puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
      executablePath: await chromium.executablePath(),
      headless: "shell",
    });
  }

  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter((path): path is string => Boolean(path));
  const executablePath = candidates.find((path) => existsSync(path));
  if (!executablePath) throw new Error("Aucun navigateur trouvé pour générer le PDF : renseignez CHROME_PATH.");
  return puppeteer.launch({ executablePath, headless: true });
}

export async function htmlToPdf(html: string) {
  const browser = await launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
