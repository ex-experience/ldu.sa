import { chromium } from "playwright";
import fs from "node:fs/promises";

const base = process.env.LDU_PREVIEW_URL || "http://127.0.0.1:4173/ldu.sa/";
const out = "visual-qa";

await fs.mkdir(out, { recursive: true });

const browser = await chromium.launch();

const captures = [
  { name: "desktop-en", width: 1440, height: 1000, lang: "en" },
  { name: "desktop-ar", width: 1440, height: 1000, lang: "ar" },
  { name: "desktop-fr", width: 1440, height: 1000, lang: "fr" },
  { name: "desktop-es", width: 1440, height: 1000, lang: "es" },
  { name: "mobile-en", width: 390, height: 844, lang: "en" },
  { name: "mobile-ar", width: 390, height: 844, lang: "ar" }
];

for (const capture of captures) {
  const page = await browser.newPage({
    viewport: { width: capture.width, height: capture.height },
    deviceScaleFactor: 1
  });

  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate((lang) => {
    localStorage.setItem("ldu-language", lang);
  }, capture.lang);
  await page.reload({ waitUntil: "networkidle" });

  await page.screenshot({
    path: `${out}/${capture.name}.png`,
    fullPage: true
  });

  await page.close();
}

await browser.close();
console.log(`Saved ${captures.length} visual QA screenshots to ${out}/`);
