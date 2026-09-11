# LDU Secure Project Intake

This is the production backend for the GitHub Pages form. It intentionally avoids exposing an email address in the public site.

## Security properties
- Server-side validation and deterministic lead scoring.
- No public database policies; writes happen only through the Edge Function service role.
- Allowed-origin enforcement.
- Honeypot bot trap.
- Google reCAPTCHA v3 server-side verification.
- No credentials or secrets in the GitHub Pages bundle.
- Input length limits and no-store responses.

## Deploy
1. Create a **dedicated LDU Supabase project**.
2. Run `schema.sql` in SQL Editor.
3. Deploy this folder as an Edge Function named `ldu-intake` with JWT verification disabled **only because the function performs its own public-form authentication controls**.
4. Set Edge Function secrets:
   - `ALLOWED_ORIGINS=https://ex-experience.github.io,https://<your-production-domain>`
   - `RECAPTCHA_SECRET=<server-side-secret>`
5. Put the public reCAPTCHA site key and the deployed function URL in `/site-config.js`.
6. Test CORS, bot rejection and insertions before launch.

Do not reuse the unrelated AHAD Supabase project for this website.
