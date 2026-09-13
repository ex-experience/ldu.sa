import React from "react";
import { useI18n } from "../i18n/I18nContext";
import heroNight from "../../docs/media/hero-night.jpg";
import heroStage from "../../docs/media/hero-stage.jpg";
import caseBanquet from "../../docs/media/case-banquet.jpg";
import caseDesert from "../../docs/media/case-desert.jpg";

const chapters = [
  { href: "#position", key: "nav.position", image: heroNight },
  { href: "#house", key: "nav.house", image: caseDesert },
  { href: "#method", key: "nav.method", image: caseBanquet },
  { href: "#services", key: "nav.services", image: heroStage },
  { href: "#proof", key: "nav.proof", image: heroNight },
  { href: "#founder-work", key: "cases.kicker", image: heroStage },
  { href: "#team", key: "nav.team", image: caseBanquet },
  { href: "#contact", key: "nav.contact", image: caseDesert }
];

export default function SectionIndex() {
  const { t } = useI18n();

  return (
    <section
      className="section ldu-section-index"
      id="section-index"
      data-tone="light"
      aria-labelledby="section-index-title"
    >
      <div className="section-index-head" data-reveal>
        <p className="section-kicker">{t("index.kicker")}</p>
        <h2 id="section-index-title">{t("index.title")}</h2>
        <p className="lead">{t("index.body")}</p>
      </div>

      <nav className="section-index-grid" aria-label={t("index.title")} data-reveal>
        {chapters.map((chapter) => (
          <a className="section-index-card" href={chapter.href} key={chapter.href}>
            <img src={chapter.image} alt="" loading="lazy" decoding="async" />
            <span className="section-index-shade" />
            <strong>{t(chapter.key)}</strong>
          </a>
        ))}
      </nav>
    </section>
  );
}