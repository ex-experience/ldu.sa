# LDU Website V2.0 — Commercial Launch Build

A rebuilt GitHub Pages site for **LDU — Entertainment Solutions Company** based on the supplied 2026 foundational document, company profile, portfolio and business-card identity files.

## V2.0 fixes

### Conversion / contact
- No `mailto:` fallback and no visible corporate email in the public HTML.
- Phone handoff is implemented at runtime with the real telephone protocol on mobile; on desktop it copies the number to clipboard. This avoids sandbox/sanitizer rewriting of static `tel:` anchors while preserving production behavior.
- Structured project-intake form with market, territory, budget, timeline, objective and context.
- Deterministic lead-fit score shown in the UI and recomputed server-side in the supplied Edge Function template.
- Form **fails closed** when the secure production endpoint is not configured; it never falls back to email scraping-prone behavior.

### Media / assets
- Zero Google Drive embeds or public Drive folder URLs.
- Local, optimized MP4 assets built from LDU's supplied portfolio/identity material:
  - `assets/media/hero-reel.mp4`
  - `assets/media/proof-reel.mp4`
- Local case-study posters and portfolio frames.
- Source archives remain private; only approved web assets belong in the public repo.

### Visual / interaction system
- Kinetic hero typography.
- Scroll-reveal choreography.
- Section-driven header tone changes.
- Magnetic CTA micro-interactions.
- Animated brand rail, marquee and stage transitions.
- Full responsive layout with reduced-motion support.
- Four language modes: English, Arabic (RTL), French and Spanish.

### Analytics / privacy
- GA4 and Meta Pixel loaders are implemented but consent-gated.
- No tracker loads until the user explicitly opts in.
- Analytics IDs are intentionally blank until the real production IDs are supplied.
- Privacy notice and Terms of Use included.
- Privacy copy references the Saudi PDPL/SDAIA framework without claiming legal certification.

### Secure intake backend
`backend/contact-intake/` contains a Supabase Edge Function and SQL schema with:
- server-side validation
- server-side lead scoring
- no public table access
- allowed-origin enforcement
- honeypot
- Google reCAPTCHA v3 server-side verification
- input limits and no-store responses

**Use a dedicated LDU Supabase project. Do not deploy this into the unrelated AHAD project.**

## Required production configuration
Edit `site-config.js` only with public configuration values:

```js
window.LDU_CONFIG = {
  ga4MeasurementId: "G-...",
  metaPixelId: "...",
  contactEndpoint: "https://<ldu-project>.supabase.co/functions/v1/ldu-intake",
  recaptchaSiteKey: "<public-site-key>",
  contactPhone: "+966540211883",
  instagramUrl: "https://www.instagram.com/ladeeunique",
  analyticsConsentVersion: "2026-09-v2"
};
```

Never put the reCAPTCHA secret, Supabase service-role key, SMTP password or other secrets in GitHub Pages.

## Factual / attribution rule
Founder work from previous companies is explicitly labelled **FOUNDER-LED WORK**. Case studies do not invent KPIs where the source files do not provide them.

## Event footage
The two Drive folders supplied in the brief were not directly readable by the available file/runtime integration. V2.0 therefore uses only assets that are actually available in the attached LDU files and generated editorial motion derived from those assets. Do not label non-event footage as MDLBEAST/Jeddah Season event footage. Once rights-cleared event masters are supplied as files, replace the editorial reel assets under `assets/media/`.

## GitHub Pages
Expected project URL after repository creation and Pages activation:

`https://ex-experience.github.io/ldu/`

## V2.1 patch
- Hardened responsive navigation drawer.
- Added explicit What we do / Who we are anchors.
- Prevented mobile navigation from rendering as a persistent desktop column.
- Added escape, backdrop, close-button and resize handling.
