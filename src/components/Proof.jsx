import React from "react";
import { useI18n } from "../i18n/I18nContext";

const proof = [1, 2, 3, 4];

export default function Proof() {
  const { t } = useI18n();

  return (
    <section className="section cream" id="proof" data-tone="light">
      <div data-reveal>
        <div className="section-kicker">{t("proof.kicker")}</div>

        <div className="split-head">
          <h2>{t("proof.title")}</h2>
          <p className="lead">{t("proof.body")}</p>
        </div>
      </div>

      <div className="proof-metrics no-number-grid" data-reveal>
        {proof.map((n) => (
          <article key={n}>
            <h3>{t(`proof.m${n}`)}</h3>
            <p>{t(`proof.p${n}`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
