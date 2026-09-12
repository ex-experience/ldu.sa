import React from "react";
import { useI18n } from "../i18n/I18nContext";

const services = ["advisory", "partnerships", "orchestration"];
const capabilities = [1, 2, 3, 4, 5];

export default function Services() {
  const { t } = useI18n();
  return (
    <section className="section navy" id="services" data-tone="dark">
      <div data-reveal>
        <div className="section-kicker inverse"><span>04</span>{t("services.kicker")}</div>
        <div className="split-head">
          <h2>{t("services.title")}</h2>
          <p className="lead muted">{t("services.body")}</p>
        </div>
      </div>

      <div className="service-grid" data-reveal>
        {services.map((key, i) => (
          <article key={key}>
            <small>{String(i + 1).padStart(2, "0")}</small>
            <h3>{t(`services.${key}`)}</h3>
            <p>{t(`services.${key}Body`)}</p>
          </article>
        ))}
      </div>

      <div className="capability-list" data-reveal>
        {capabilities.map((n) => (
          <article key={n}>
            <small>{String(n).padStart(2, "0")}</small>
            <h3>{t(`cap.c${n}`)}</h3>
            <p>{t(`cap.c${n}b`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
