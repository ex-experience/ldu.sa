import React from "react";
import { useI18n } from "../i18n/I18nContext";

const steps = ["reframe", "harmonize", "connect", "build"];

export default function Method() {
  const { t } = useI18n();

  return (
    <section className="section cream" id="method" data-tone="light">
      <div data-reveal>
        <div className="section-kicker">{t("method.kicker")}</div>

        <div className="split-head">
          <h2>{t("method.title")}</h2>
          <p className="lead">{t("method.intro")}</p>
        </div>
      </div>

      <div className="story-stage" data-reveal>
        <article>
          <small>{t("method.storyLabel")}</small>
          <h3>{t("method.storyTitle")}</h3>
          <p>{t("method.storyBody")}</p>
        </article>

        <article>
          <small>{t("method.stageLabel")}</small>
          <h3>{t("method.stageTitle")}</h3>
          <p>{t("method.stageBody")}</p>
        </article>
      </div>

      <blockquote data-reveal>{t("method.quote")}</blockquote>

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
