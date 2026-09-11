# LDU Commercial Launch V2.0

Production-oriented static build for GitHub Pages.

## Critical fixes
- No Google Drive iframe/embed or public Drive folder URL.
- Local self-hosted autoplay showreel (`assets/media/showreel.mp4`).
- Phone CTA uses a JS `tel:` handoff from a button plus the E.164 number in `config.js`.
- No `mailto:` address in public HTML.
- Qualified lead form: project type, budget, timeline, role, consent.
- Analytics and Meta Pixel are consent-gated and disabled until IDs are configured.
- Privacy Notice and Terms of Use included.
- Responsive kinetic typography, scroll reveals, visual gradients and motion.

## Before launch
1. Set `GA_MEASUREMENT_ID` and `META_PIXEL_ID` in `config.js` if approved.
2. Set `CONTACT_ENDPOINT` to a secure HTTPS form backend. Do not put API secrets in frontend code.
3. Add CAPTCHA/Turnstile validation server-side at that endpoint.
4. Replace `assets/media/showreel.mp4` with approved, rights-cleared event footage exported for web (H.264 MP4 + WebM if available). Keep source archives private.
5. Have Saudi privacy counsel validate the final Privacy Notice, retention, controller details, cross-border transfers and data-subject rights under PDPL.

## Deploy
Publish repository root with GitHub Pages.
