import { chromium } from "playwright";
import fs from "node:fs/promises";

const base =
  process.env.LDU_PREVIEW_URL ||
  "http://127.0.0.1:4173/ldu.sa/";

const out = "visual-qa";
const blockedRuntimeHosts = [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "cdn.jsdelivr.net"
];

await fs.mkdir(out, { recursive: true });

const browser = await chromium.launch();

function watchBlockedRuntimeRequests(page, bucket) {
  page.on("request", (request) => {
    try {
      const host = new URL(request.url()).hostname;
      if (blockedRuntimeHosts.includes(host)) {
        bucket.add(request.url());
      }
    } catch {}
  });
}

async function setLanguage(page, target, lang, stabilize = true) {
  await page.goto(target, { waitUntil: "networkidle" });

  await page.evaluate((value) => {
    localStorage.setItem("ldu-language", value);
  }, lang);

  await page.reload({ waitUntil: "networkidle" });

  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });

  if (stabilize) {
    await page.addStyleTag({
      content: `
        html {
          scroll-behavior: auto !important;
        }

        *, *::before, *::after {
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }

        .credential-carousel-track {
          scroll-behavior: auto !important;
        }
      `
    });
  }
}

async function activateAllReveals(page, name) {
  const reveals = page.locator("[data-reveal]");
  const count = await reveals.count();

  for (let index = 0; index < count; index += 1) {
    const item = reveals.nth(index);
    await item.scrollIntoViewIfNeeded();
    await page.waitForTimeout(35);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(80);

  const hidden = await page
    .locator("[data-reveal]:not(.is-visible)")
    .count();

  if (hidden !== 0) {
    throw new Error(
      `${name}: ${hidden} reveal block(s) remained hidden`
    );
  }
}

async function activateAllImages(page) {
  await page.evaluate(() => {
    document.querySelectorAll("img").forEach((img) => {
      img.loading = "eager";
      img.decoding = "sync";
    });
  });

  await page
    .waitForFunction(
      () => [...document.images].every((img) => img.complete),
      null,
      { timeout: 15000 }
    )
    .catch(() => {});

  await page.evaluate(() => {
    document
      .querySelectorAll(
        ".commercial-rail,.credential-carousel-track"
      )
      .forEach((rail) => {
        rail.scrollTo({
          left: 0,
          top: 0,
          behavior: "auto"
        });
      });

    window.scrollTo(0, 0);
  });

  await page.waitForTimeout(80);
}

async function auditResponsive(page, name, width) {
  const audit = await page.evaluate(() => {
    const root = document.documentElement;
    const overflow = root.scrollWidth - root.clientWidth;

    const headingOffenders = [
      ...document.querySelectorAll("h1,h2,h3")
    ]
      .map((node) => {
        const rect = node.getBoundingClientRect();

        return {
          text: (node.textContent || "").trim().slice(0, 80),
          left: rect.left,
          right: rect.right,
          width: rect.width
        };
      })
      .filter(
        (item) =>
          item.left < -2 ||
          item.right > window.innerWidth + 2
      )
      .slice(0, 8);

    const brokenImages = [...document.images]
      .filter(
        (img) =>
          img.complete &&
          img.naturalWidth === 0
      )
      .map((img) => img.currentSrc || img.src)
      .slice(0, 8);

    const touchSelectors = [
      ".pill-button",
      ".button",
      ".mobile-menu-button",
      ".brand-button",
      ".credential-control"
    ];

    const smallTargets = [
      ...document.querySelectorAll(
        touchSelectors.join(",")
      )
    ]
      .map((node) => {
        const rect = node.getBoundingClientRect();

        return {
          label: (
            node.textContent ||
            node.getAttribute("aria-label") ||
            ""
          ).trim(),
          width: rect.width,
          height: rect.height
        };
      })
      .filter(
        (item) =>
          item.width < 44 ||
          item.height < 44
      )
      .slice(0, 8);

    const brokenLocalAnchors = [
      ...document.querySelectorAll('a[href^="#"]')
    ]
      .map((anchor) => anchor.getAttribute("href"))
      .filter(
        (href) =>
          href &&
          href !== "#" &&
          !document.querySelector(href)
      )
      .slice(0, 8);

    return {
      overflow,
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      headingOffenders,
      brokenImages,
      smallTargets,
      brokenLocalAnchors
    };
  });

  if (audit.overflow > 2) {
    throw new Error(
      `${name}: horizontal page overflow ` +
      `(${audit.scrollWidth}px > ${audit.clientWidth}px)`
    );
  }

  if (
    width <= 820 &&
    audit.headingOffenders.length
  ) {
    throw new Error(
      `${name}: heading overflow: ` +
      JSON.stringify(audit.headingOffenders)
    );
  }

  if (audit.brokenImages.length) {
    throw new Error(
      `${name}: broken image(s): ` +
      audit.brokenImages.join(", ")
    );
  }

  if (
    width <= 1024 &&
    audit.smallTargets.length
  ) {
    throw new Error(
      `${name}: touch target(s) below 44px: ` +
      JSON.stringify(audit.smallTargets)
    );
  }

  if (audit.brokenLocalAnchors.length) {
    throw new Error(
      `${name}: broken local anchor(s): ` +
      audit.brokenLocalAnchors.join(", ")
    );
  }
}

async function auditHero(page) {
  const result = await page.evaluate(() => ({
    topBrand:
      document.querySelector(".hero-brand-top")
        ?.textContent?.trim() || "",
    purposeCount:
      document.querySelectorAll(".hero .purpose").length,
    title: document.title
  }));

  if (result.topBrand !== "LDU") {
    throw new Error(
      `Hero audit: expected dedicated top LDU brand line, got "${result.topBrand}".`
    );
  }

  if (result.purposeCount !== 0) {
    throw new Error(
      "Hero audit: Purpose block still exists."
    );
  }

  if (/^LDU\s*[—-]\s*LDU\b/i.test(result.title)) {
    throw new Error(
      `Title audit: duplicated LDU in "${result.title}".`
    );
  }
}

async function auditSeo(page) {
  const meta = await page.evaluate(() => ({
    canonical:
      document
        .querySelector('link[rel="canonical"]')
        ?.getAttribute("href") || "",
    ogUrl:
      document
        .querySelector('meta[property="og:url"]')
        ?.getAttribute("content") || "",
    ogImage:
      document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content") || "",
    favicon:
      document
        .querySelector('link[rel="icon"]')
        ?.getAttribute("href") || ""
  }));

  if (
    meta.canonical !==
    "https://ex-experience.github.io/ldu.sa/"
  ) {
    throw new Error(
      `SEO audit: unexpected canonical ${meta.canonical}`
    );
  }

  if (
    meta.ogUrl !==
    "https://ex-experience.github.io/ldu.sa/"
  ) {
    throw new Error(
      `SEO audit: unexpected og:url ${meta.ogUrl}`
    );
  }

  if (!meta.ogImage.startsWith("https://")) {
    throw new Error(
      "SEO audit: og:image must be absolute."
    );
  }

  if (!meta.favicon) {
    throw new Error(
      "SEO audit: favicon link is missing."
    );
  }
}

async function auditCarouselBehavior() {
  console.log("QA start: carousel-behavior");

  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1
  });

  page.setDefaultTimeout(12000);

  const blocked = new Set();
  watchBlockedRuntimeRequests(page, blocked);

  await setLanguage(page, base, "en", false);

  const carousel = page
    .locator(".credential-carousel")
    .nth(1);

  await carousel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);

  const initial = await carousel
    .locator(".credential-mark.is-active")
    .getAttribute("title");

  const pageYBefore = await page.evaluate(
    () => window.scrollY
  );

  await page.waitForTimeout(2350);

  const afterAuto = await carousel
    .locator(".credential-mark.is-active")
    .getAttribute("title");

  const pageYAfterAuto = await page.evaluate(
    () => window.scrollY
  );

  if (initial === afterAuto) {
    throw new Error(
      "Carousel audit: autoplay did not advance while the card was visible."
    );
  }

  if (
    Math.abs(pageYAfterAuto - pageYBefore) > 2
  ) {
    throw new Error(
      `Carousel audit: autoplay moved the page from ` +
      `${pageYBefore} to ${pageYAfterAuto}.`
    );
  }

  const buttonYBefore = await page.evaluate(
    () => window.scrollY
  );

  const activeBeforeButton = await carousel
    .locator(".credential-mark.is-active")
    .getAttribute("title");

  await carousel
    .locator(".credential-control-next")
    .click();

  await page.waitForTimeout(450);

  const activeAfterButton = await carousel
    .locator(".credential-mark.is-active")
    .getAttribute("title");

  const buttonYAfter = await page.evaluate(
    () => window.scrollY
  );

  if (activeBeforeButton === activeAfterButton) {
    throw new Error(
      "Carousel audit: next button did not change the active credential."
    );
  }

  if (
    Math.abs(buttonYAfter - buttonYBefore) > 2
  ) {
    throw new Error(
      "Carousel audit: manual carousel control moved the page."
    );
  }

  await page.evaluate(() =>
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "auto"
    })
  );

  await page.waitForTimeout(300);

  const activeOutOfView = await carousel
    .locator(".credential-mark.is-active")
    .getAttribute("title");

  await page.waitForTimeout(2400);

  const activeStillOutOfView = await carousel
    .locator(".credential-mark.is-active")
    .getAttribute("title");

  if (activeOutOfView !== activeStillOutOfView) {
    throw new Error(
      "Carousel audit: autoplay continued while the card was outside the viewport."
    );
  }

  if (blocked.size) {
    throw new Error(
      "Runtime privacy audit: blocked external assets requested: " +
      [...blocked].join(", ")
    );
  }

  await page.close();
  console.log("QA passed: carousel-behavior");
}

async function auditLegalNavigation() {
  console.log("QA start: legal-navigation");

  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1
  });

  page.setDefaultTimeout(12000);

  await setLanguage(
    page,
    `${base}?legal=privacy`,
    "en",
    false
  );

  const href = await page
    .locator(".desktop-nav a")
    .first()
    .getAttribute("href");

  if (!href?.includes("/ldu.sa/#position")) {
    throw new Error(
      `Legal navigation audit: expected an absolute home-section link, got "${href}".`
    );
  }

  await page.close();
  console.log("QA passed: legal-navigation");
}

async function screenshotMain({
  name,
  width,
  height,
  lang,
  mobile = false
}) {
  console.log(`QA start: ${name}`);

  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile || width <= 1024
  });

  page.setDefaultTimeout(12000);

  const blocked = new Set();
  watchBlockedRuntimeRequests(page, blocked);

  await setLanguage(page, base, lang);
  await activateAllReveals(page, name);
  await activateAllImages(page);
  await auditResponsive(page, name, width);

  if (name === "desktop-en") {
    await auditHero(page);
    await auditSeo(page);
  }

  if (blocked.size) {
    throw new Error(
      `${name}: blocked external asset request(s): ` +
      [...blocked].join(", ")
    );
  }

  await page.screenshot({
    path: `${out}/${name}.png`,
    fullPage: true,
    animations: "disabled",
    timeout: 20000
  });

  await page.close();
  console.log(`QA passed: ${name}`);
}

await auditCarouselBehavior();
await auditLegalNavigation();

const mainCaptures = [
  {
    name: "desktop-en",
    width: 1440,
    height: 1000,
    lang: "en"
  },
  {
    name: "desktop-ar",
    width: 1440,
    height: 1000,
    lang: "ar"
  },
  {
    name: "desktop-fr",
    width: 1440,
    height: 1000,
    lang: "fr"
  },
  {
    name: "desktop-es",
    width: 1440,
    height: 1000,
    lang: "es"
  },
  {
    name: "mobile-360-en",
    width: 360,
    height: 800,
    lang: "en",
    mobile: true
  },
  {
    name: "mobile-390-ar",
    width: 390,
    height: 844,
    lang: "ar",
    mobile: true
  },
  {
    name: "mobile-430-en",
    width: 430,
    height: 932,
    lang: "en",
    mobile: true
  },
  {
    name: "mobile-512-en",
    width: 512,
    height: 888,
    lang: "en",
    mobile: true
  },
  {
    name: "tablet-768-en",
    width: 768,
    height: 1024,
    lang: "en",
    mobile: true
  },
  {
    name: "tablet-768-ar",
    width: 768,
    height: 1024,
    lang: "ar",
    mobile: true
  },
  {
    name: "tablet-1024-en",
    width: 1024,
    height: 768,
    lang: "en"
  }
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

  page.setDefaultTimeout(12000);

  await setLanguage(page, base, lang);
  await page.locator(".mobile-menu-button").click();
  await page.waitForTimeout(120);
  await auditResponsive(
    page,
    `mobile-${lang}-menu`,
    390
  );

  await page.screenshot({
    path: `${out}/mobile-${lang}-menu.png`,
    fullPage: false,
    animations: "disabled",
    timeout: 20000
  });

  await page.close();
}

for (const [lang, legal] of [
  ["en", "privacy"],
  ["ar", "terms"]
]) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1
  });

  page.setDefaultTimeout(12000);

  const target = `${base}?legal=${legal}`;

  await setLanguage(page, target, lang);
  await auditResponsive(
    page,
    `legal-${lang}-${legal}`,
    1440
  );

  await page.screenshot({
    path: `${out}/legal-${lang}-${legal}.png`,
    fullPage: true,
    animations: "disabled",
    timeout: 20000
  });

  await page.close();
}

await browser.close();

console.log(
  "Production QA passed: carousel containment/visibility, legal navigation, SEO/runtime privacy, 15 screenshots, responsive overflow, broken images, anchors and touch targets."
);