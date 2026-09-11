# LDU — Commercial Launch Build

Static, GitHub Pages-ready website for **LDU — Entertainment Solutions Company**.

## Launch architecture

- Four languages: English, Arabic, French, Spanish.
- Responsive motion-led home page with kinetic typography and a lightweight local MP4 loop.
- No Google Drive embeds or public archive dependencies.
- Founder-led case studies with explicit attribution.
- Correct `tel:+966...` phone links.
- Contact form does not expose the destination email address directly in HTML.
- Analytics are consent-gated and **disabled until IDs are configured**.
- No external font dependency.
- Accessibility: skip link, reduced-motion support, keyboard-safe language/menu controls.

## Analytics

Edit `site-config.js`:

```js
window.LDU_CONFIG = Object.freeze({
  ga4MeasurementId: "G-XXXXXXXXXX",
  metaPixelId: "123456789012345",
  contactEndpoint: "",
  contactEmailParts: ["hala", "ladeunique", "com"],
  contactPhone: "+966540211883",
  instagramHandle: "Ladeeunique"
});
```

When GA4 / Meta IDs are blank, **no analytics scripts load and no consent banner is shown**.
When IDs are present, the site asks for analytics consent before loading trackers.

## Contact form

Two modes are supported:

1. `contactEndpoint` set to a secure HTTPS endpoint: the form sends JSON with `POST`.
2. Endpoint blank: it falls back to a locally generated email draft. The destination address is assembled in JavaScript instead of being placed in the page markup.

For a fully server-side commercial form, point `contactEndpoint` at an approved endpoint with rate limiting, validation and spam protection.

## Event media

Do **not** embed Google Drive folders. Instead:

1. Select approved public images/video from the source archive.
2. Export web derivatives only.
3. Put them under `assets/media/events/`.
4. Use AVIF/WebP for images and H.264 MP4 for video.
5. Keep contracts, RAW camera files, internal decks and source archives private.

The current hero uses `assets/media/brand-loop.mp4`, a lightweight brand-motion loop generated from the LDU identity assets. It can be replaced later by an approved 6–10 second cinematic event reel without changing the layout.

## GitHub Pages

Recommended repository name: `ldu`

Public URL after enabling Pages from the `main` branch/root:

`https://ex-experience.github.io/ldu/`

## Security notes

GitHub Pages is static hosting. Application-layer controls such as server-side rate limiting, secret storage and HTTP response headers must be implemented through the form/API service or a reverse proxy/CDN if required.
