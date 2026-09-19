import React from "react";
import { useI18n } from "../i18n/I18nContext";

const steps = ["reframe", "harmonize", "connect", "build"];

export default function Method() {
  const { t } = useI18n();

  return (
    <section className="section cream" id="method" data-tone="light">
      <div data-reveal>
        <div className="section-kicker">{t("method.kicker")}</div>
      </div>

      <div className="method-grid no-number-grid" data-reveal>
        {steps.map((key) => {
          const paragraphs = t(`method.${key}Body`).split("\n\n");
          return (
            <article key={key}>
              <h3>{t(`method.${key}`)}</h3>
              <div className="method-step-copy">
                {paragraphs.map((paragraph, index) => (
                  <p
                    className={index > 0 ? "method-conclusion" : ""}
                    key={`${key}-${index}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
