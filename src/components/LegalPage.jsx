import React from "react";
import { useI18n } from "../i18n/I18nContext";

export default function LegalPage({ type }) {
  const { t } = useI18n();
  const isPrivacy = type === "privacy";
  const prefix = isPrivacy ? "privacy" : "terms";
  const sections = isPrivacy ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5];

  return (
    <main className="legal-page" id="main">
      <a className="legal-back" href={import.meta.env.BASE_URL}>← {t("legal.back")}</a>
      <p className="eyebrow">{t(`${prefix}.eyebrow`)}</p>
      <h1>{t(`${prefix}.title`)}</h1>
      <p className="legal-intro">{t(`${prefix}.intro`)}</p>
      <p className="legal-updated">{t("legal.updated")}</p>

      <div className="legal-sections">
        {sections.map((n) => (
          <section key={n}>
            <small>{String(n).padStart(2, "0")}</small>
            <h2>{t(`${prefix}.s${n}t`)}</h2>
            <p>{t(`${prefix}.s${n}b`)}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
