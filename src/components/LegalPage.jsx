import React from "react";
import { useI18n } from "../i18n/I18nContext";

export default function LegalPage({ type }) {
  const { t } = useI18n();

  const isPrivacy = type === "privacy";
  const prefix = isPrivacy ? "privacy" : "terms";
  const sections = isPrivacy
    ? [1, 2, 3, 4, 5, 6, 7]
    : [1, 2, 3, 4, 5];

  return (
    <main className="legal-page" id="main">
      <a className="legal-back" href={import.meta.env.BASE_URL}>
        ← {t("legal.back")}
      </a>

      <p className="eyebrow">{t(`${prefix}.eyebrow`)}</p>
      <h1>{t(`${prefix}.title`)}</h1>
      <p className="legal-intro">{t(`${prefix}.intro`)}</p>
      <p className="legal-updated">{t("legal.updated")}</p>

      <div className="legal-sections no-number-legal">
        {sections.map((number) => (
          <section key={number}>
            <h2>{t(`${prefix}.s${number}t`)}</h2>
            <p>{t(`${prefix}.s${number}b`)}</p>
          </section>
        ))}
      </div>
    </main>
  );
}