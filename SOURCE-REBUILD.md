# LDU source rebuild

This branch is a maintainable React/Vite reconstruction of the publicly deployed Grok production build.

## Source provenance

- `grok-import` remains the untouched production snapshot.
- `docs/` contains mirrored public production assets and bundles.
- `src/` is the reconstructed maintainable source.
- Text and structure are derived from the deployed public build.
- Original unpublished Grok source files, build config and server-side code were not recoverable from the public deployment.

## Commands

```bash
npm install
npm run dev
npm run build
```

GitHub Pages base is configured as `/ldu.sa/`.

## Reconstruction status

Phase 1:
- React/Vite source scaffold
- Header
- Hero
- Position
- Questions
- House visual structure
- Method
- Services
- Proof
- Team
- Contact
- Reuse of mirrored media and fonts

Phase 2:
- Restore multilingual i18n from the production bundle
- Reconstruct exact House card copy
- Rebuild legal routes
- Rebuild consent/analytics behavior
- Visual parity QA against the Grok deployment
