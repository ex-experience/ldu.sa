import React from "react";
import { useI18n } from "../i18n/I18nContext";

const steps = ["reframe", "harmonize", "connect", "build"];

export default function Method() {
  const { t } = useI18n();
  return (
    <section className="section cream" id="method" data-tone="light">
      <div data-reveal>
        <div className="section-kicker"><span>03</span>{t("method.kicker")}</div>
        <div className="split-head">
          <h2>{t("method.title")}</h2>
          <p className="lead">{t("method.intro")}</p>
        </div>
      </div>

      <div className="story-stage" data-reveal>
        <article>
          <small>STORY</small>
          <h3>{t("method.storyTitle")}</h3>
          <p>{t("method.storyBody")}</p>
        </article>
        <article>
          <small>STAGE</small>
          <h3>{t("method.stageTitle")}</h3>
          <p>{t("method.stageBody")}</p>
        </article>
      </div>

      <blockquote data-reveal>{t("method.quote")}</blockquote>

      <div className="method-grid" data-reveal>
        {steps.map((key, i) => (
          <article key={key}>
            <small>{String(i + 1).padStart(2, "0")}</small>
            <h3>{t(`method.${key}`)}</h3>
            <p>{t(`method.${key}Body`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
