import React from "react";
import { useI18n } from "../i18n/I18nContext";
import logoOnyx from "../assets/brand-kit/LDU_logo_onyx_on_transparent.svg";

export default function Position() {
  const { t } = useI18n();
  const positionParagraphs = t("position.body").split("\n\n");

  return (
    <section className="section cream" id="position" data-tone="light">
      <div data-reveal>
        <div className="section-kicker">{t("position.kicker")}</div>

        <div className="position-grid position-grid-editorial">
          <h2>{t("position.title")}</h2>

          <div className="position-copy">
            {positionParagraphs.map((paragraph, index) => (
              <p
                className={`lead ${index === 0 ? "position-statement" : ""}`}
                key={`${index}-${paragraph.slice(0, 18)}`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <img className="watermark wordmark-watermark" src={logoOnyx} alt="" />
        </div>
      </div>
    </section>
  );
}
