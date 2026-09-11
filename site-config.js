/* Production configuration.
   Keep secrets OUT of this file. It is public on GitHub Pages.
   - Analytics IDs are public identifiers, but trackers load only after consent.
   - contactEndpoint must point to the secure server-side intake function.
   - recaptchaSiteKey is the public Google reCAPTCHA v3 site key; the secret stays server-side.
*/
window.LDU_CONFIG = Object.freeze({
  ga4MeasurementId: "",
  metaPixelId: "",
  contactEndpoint: "",
  recaptchaSiteKey: "",
  contactPhone: "+966540211883",
  instagramUrl: "https://www.instagram.com/ladeeunique",
  analyticsConsentVersion: "2026-09-v2"
});
