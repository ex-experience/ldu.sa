import React from "react";
import { useI18n } from "../i18n/I18nContext";

const services = ["advisory", "partnerships", "orchestration"];
const capabilities = [1, 2, 3, 4, 5];

export default function Services() {
  const { t } = useI18n();

  return (
    <section className="section ink" id="services" data-tone="dark">
      <div data-reveal>
        <div className="section-kicker inverse">{t("services.kicker")}</div>

        <div className="split-head">
          <h2>{t("services.title")}</h2>
          <p className="lead muted">{t("services.body")}</p>
        </div>
      </div>

      <div className="service-grid no-number-grid" data-reveal>
        {services.map((key) => (
          <article key={key}>
            <h3>{t(`services.${key}`)}</h3>
            <p>{t(`services.${key}Body`)}</p>
          </article>
        ))}
      </div>

      <div className="capability-list no-number-list" data-reveal>
        {capabilities.map((n) => (
          <article key={n}>
            <h3>{t(`cap.c${n}`)}</h3>
            <p>{t(`cap.c${n}b`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
