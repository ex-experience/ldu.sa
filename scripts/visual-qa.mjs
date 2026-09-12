import { chromium } from "playwright";
import fs from "node:fs/promises";

const base = process.env.LDU_PREVIEW_URL || "http://127.0.0.1:4173/ldu.sa/";
const out = "visual-qa";

await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();

async function setLanguage(page, target, lang) {
  await page.goto(target, { waitUntil: "networkidle" });
  await page.evaluate((value) => {
    localStorage.setItem("ldu-language", value);
  }, lang);
  await page.reload({ waitUntil: "networkidle" });

  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
}

async function activateAllReveals(page, name) {
  const reveals = page.locator("[data-reveal]");
  const count = await reveals.count();

  for (let i = 0; i < count; i += 1) {
    const item = reveals.nth(i);
    await item.scrollIntoViewIfNeeded();
    await page.waitForTimeout(90);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(160);

  const hidden = await page.locator("[data-reveal]:not(.is-visible)").count();
  if (hidden !== 0) {
    throw new Error(`${name}: ${hidden} reveal block(s) remained hidden`);
  }
}

async function screenshotMain({ name, width, height, lang }) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1
  });

  await setLanguage(page, base, lang);
  await activateAllReveals(page, name);

  await page.screenshot({
    path: `${out}/${name}.png`,
    fullPage: true,
    animations: "disabled"
  });

  await page.close();
}

const mainCaptures = [
  { name: "desktop-en", width: 1440, height: 1000, lang: "en" },
  { name: "desktop-ar", width: 1440, height: 1000, lang: "ar" },
  { name: "desktop-fr", width: 1440, height: 1000, lang: "fr" },
  { name: "desktop-es", width: 1440, height: 1000, lang: "es" },
  { name: "mobile-en", width: 390, height: 844, lang: "en" },
  { name: "mobile-ar", width: 390, height: 844, lang: "ar" }
];

for (const capture of mainCaptures) {
  await screenshotMain(capture);
}

for (const lang of ["en", "ar"]) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1
  });

  await setLanguage(page, base, lang);
  await page.locator(".mobile-menu-button").click();
  await page.waitForTimeout(120);

  await page.screenshot({
    path: `${out}/mobile-${lang}-menu.png`,
    fullPage: false,
    animations: "disabled"
  });

  await page.close();
}

for (const [lang, legal] of [["en", "privacy"], ["ar", "terms"]]) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1
  });

  const target = `${base}?legal=${legal}`;
  await setLanguage(page, target, lang);

  await page.screenshot({
    path: `${out}/legal-${lang}-${legal}.png`,
    fullPage: true,
    animations: "disabled"
  });

  await page.close();
}

await browser.close();
console.log("Visual QA passed: 10 validated screenshots saved.");
