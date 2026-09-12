import { chromium } from "playwright";
import fs from "node:fs/promises";

const base = process.env.LDU_PREVIEW_URL || "http://127.0.0.1:4173/ldu.sa/";
const out = "visual-qa";

await fs.mkdir(out, { recursive: true });

const browser = await chromium.launch();

async function prepare(page, lang) {
  await page.goto(base, { waitUntil: "networkidle" });

  await page.evaluate((value) => {
    localStorage.setItem("ldu-language", value);
  }, lang);

  await page.reload({ waitUntil: "networkidle" });

  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });

  // Walk the page to trigger every IntersectionObserver reveal before
  // the full-page screenshot is captured.
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const root = document.documentElement;
    const step = Math.max(500, Math.floor(window.innerHeight * 0.75));
    const max = Math.max(root.scrollHeight, document.body.scrollHeight);

    for (let y = 0; y <= max; y += step) {
      window.scrollTo(0, y);
      await wait(75);
    }

    window.scrollTo(0, max);
    await wait(180);
    window.scrollTo(0, 0);
    await wait(180);
  });

  const hidden = await page.locator("[data-reveal]:not(.is-visible)").count();
  if (hidden !== 0) {
    throw new Error(`Visual QA found ${hidden} reveal block(s) that never became visible`);
  }
}

async function screenshotPage({ name, width, height, lang, legal }) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1
  });

  const target = legal ? `${base}?legal=${legal}` : base;

  await page.goto(target, { waitUntil: "networkidle" });
  await page.evaluate((value) => localStorage.setItem("ldu-language", value), lang);
  await page.goto(target, { waitUntil: "networkidle" });

  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });

  if (!legal) {
    await page.evaluate(async () => {
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const max = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const step = Math.max(500, Math.floor(window.innerHeight * 0.75));

      for (let y = 0; y <= max; y += step) {
        window.scrollTo(0, y);
        await wait(75);
      }

      window.scrollTo(0, max);
      await wait(180);
      window.scrollTo(0, 0);
      await wait(180);
    });

    const hidden = await page.locator("[data-reveal]:not(.is-visible)").count();
    if (hidden !== 0) {
      throw new Error(`${name}: ${hidden} reveal block(s) remained hidden`);
    }
  }

  await page.screenshot({
    path: `${out}/${name}.png`,
    fullPage: true,
    animations: "disabled"
  });

  return page;
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
  const page = await screenshotPage(capture);
  await page.close();
}

// Mobile navigation states.
for (const lang of ["en", "ar"]) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1
  });

  await prepare(page, lang);
  await page.locator(".mobile-menu-button").click();
  await page.waitForTimeout(120);

  await page.screenshot({
    path: `${out}/mobile-${lang}-menu.png`,
    fullPage: false,
    animations: "disabled"
  });

  await page.close();
}

// Legal pages in both primary languages.
for (const [lang, legal] of [["en", "privacy"], ["ar", "terms"]]) {
  const page = await screenshotPage({
    name: `legal-${lang}-${legal}`,
    width: 1440,
    height: 1000,
    lang,
    legal
  });
  await page.close();
}

await browser.close();
console.log("Visual QA passed: all reveal blocks were activated and 10 screenshots were saved.");
