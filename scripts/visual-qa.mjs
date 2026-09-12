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
    await page.waitForTimeout(70);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(140);

  const hidden = await page.locator("[data-reveal]:not(.is-visible)").count();
  if (hidden !== 0) {
    throw new Error(`${name}: ${hidden} reveal block(s) remained hidden`);
  }
}

async function activateAllImages(page) {
  const images = page.locator("img");
  const count = await images.count();

  for (let i = 0; i < count; i += 1) {
    const image = images.nth(i);
    await image.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(35);
  }

  await page.waitForFunction(
    () => [...document.images].every((img) => img.complete),
    null,
    { timeout: 12000 }
  ).catch(() => {});

  await page.evaluate(() => {
    document.querySelectorAll(".commercial-rail").forEach((rail) => {
      rail.scrollTo({ left: 0, top: 0, behavior: "auto" });
    });
    window.scrollTo(0, 0);
  });

  await page.waitForTimeout(140);
}

async function auditResponsive(page, name, width) {
  const audit = await page.evaluate(() => {
    const root = document.documentElement;
    const overflow = root.scrollWidth - root.clientWidth;

    const headingOffenders = [...document.querySelectorAll("h1,h2,h3")]
      .map((node) => {
        const r = node.getBoundingClientRect();
        return {
          text: (node.textContent || "").trim().slice(0, 80),
          left: r.left,
          right: r.right,
          width: r.width
        };
      })
      .filter((x) => x.left < -2 || x.right > window.innerWidth + 2)
      .slice(0, 8);

    const brokenImages = [...document.images]
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src)
      .slice(0, 8);

    const touchSelectors = [
      ".pill-button",
      ".button",
      ".mobile-menu-button",
      ".brand-button"
    ];

    const smallTargets = [...document.querySelectorAll(touchSelectors.join(","))]
      .map((node) => {
        const r = node.getBoundingClientRect();
        return {
          label: (node.textContent || node.getAttribute("aria-label") || "").trim(),
          width: r.width,
          height: r.height
        };
      })
      .filter((x) => x.width < 44 || x.height < 44)
      .slice(0, 8);

    return {
      overflow,
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      headingOffenders,
      brokenImages,
      smallTargets
    };
  });

  if (audit.overflow > 2) {
    throw new Error(
      `${name}: horizontal page overflow (${audit.scrollWidth}px > ${audit.clientWidth}px)`
    );
  }

  if (width <= 820 && audit.headingOffenders.length) {
    throw new Error(
      `${name}: heading overflow: ${JSON.stringify(audit.headingOffenders)}`
    );
  }

  if (audit.brokenImages.length) {
    throw new Error(
      `${name}: broken image(s): ${audit.brokenImages.join(", ")}`
    );
  }

  if (width <= 1024 && audit.smallTargets.length) {
    throw new Error(
      `${name}: touch target(s) below 44px: ${JSON.stringify(audit.smallTargets)}`
    );
  }
}

async function screenshotMain({ name, width, height, lang, mobile = false }) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile || width <= 1024
  });

  await setLanguage(page, base, lang);
  await activateAllReveals(page, name);
  await activateAllImages(page);
  await auditResponsive(page, name, width);

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

  { name: "mobile-360-en", width: 360, height: 800, lang: "en", mobile: true },
  { name: "mobile-390-ar", width: 390, height: 844, lang: "ar", mobile: true },
  { name: "mobile-430-en", width: 430, height: 932, lang: "en", mobile: true },
  { name: "mobile-512-en", width: 512, height: 888, lang: "en", mobile: true },

  { name: "tablet-768-en", width: 768, height: 1024, lang: "en", mobile: true },
  { name: "tablet-768-ar", width: 768, height: 1024, lang: "ar", mobile: true },
  { name: "tablet-1024-en", width: 1024, height: 768, lang: "en" }
];

for (const capture of mainCaptures) {
  await screenshotMain(capture);
}

for (const lang of ["en", "ar"]) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true
  });

  await setLanguage(page, base, lang);
  await page.locator(".mobile-menu-button").click();
  await page.waitForTimeout(120);
  await auditResponsive(page, `mobile-${lang}-menu`, 390);

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
  await auditResponsive(page, `legal-${lang}-${legal}`, 1440);

  await page.screenshot({
    path: `${out}/legal-${lang}-${legal}.png`,
    fullPage: true,
    animations: "disabled"
  });

  await page.close();
}

await browser.close();
console.log("Responsive visual QA passed: 15 screenshots, no page overflow, no broken images, and touch targets validated.");
