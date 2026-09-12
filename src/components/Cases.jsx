import React from "react";
import { useI18n } from "../i18n/I18nContext";
import arena from "../../docs/media/case-arena.jpg";
import banquet from "../../docs/media/case-banquet.jpg";
import horizon from "../../docs/media/case-horizon.jpg";
import stage from "../../docs/media/hero-stage.jpg";

const cases = [
  ["netflix", arena, "PRIOR · IP"],
  ["pepsi", banquet, "PRIOR · BRAND"],
  ["jeddah", horizon, "PRIOR · CITY"],
  ["mdl", stage, "PRIOR · STAGE"]
];

export default function Cases() {
  const { t } = useI18n();
  return (
    <section className="section cases-section" data-tone="light">
      <div data-reveal>
        <div className="section-kicker"><span>+</span>{t("cases.kicker")}</div>
        <h2 className="section-title">{t("cases.title")}</h2>
        <p className="case-note">{t("cases.note")}</p>
      </div>

      <div className="cases-grid" data-reveal>
        {cases.map(([key, image, tag]) => (
          <article className="case-card" key={key}>
            <img src={image} alt="" />
            <div className="case-overlay" />
            <div className="case-copy">
              <small>{tag}</small>
              <h3>{t(`cases.${key}Title`)}</h3>
              <p>{t(`cases.${key}`)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
