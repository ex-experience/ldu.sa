import React from "react";
import { useI18n } from "../i18n/I18nContext";
import ibex from "../../docs/brand/ibex.png";

const questions = [1, 2, 3, 4];

export default function Position() {
  const { t } = useI18n();
  return (
    <>
      <section className="section cream" id="position" data-tone="light">
        <div data-reveal>
          <div className="section-kicker"><span>01</span>{t("position.kicker")}</div>
          <div className="position-grid">
            <h2>{t("position.title")}</h2>
            <p className="lead">{t("position.body")}</p>
            <img className="watermark" src={ibex} alt="" />
          </div>
        </div>
      </section>

      <section className="section ink" data-tone="dark">
        <div data-reveal>
          <div className="section-kicker inverse"><span>—</span>{t("questions.kicker")}</div>
          <h2 className="section-title">{t("questions.title")}</h2>
        </div>
        <div className="question-grid" data-reveal>
          {questions.map((n) => (
            <article key={n}>
              <small>{String(n).padStart(2, "0")}</small>
              <h3>{t(`questions.q${n}`)}</h3>
              <p>{t(`questions.a${n}`)}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
