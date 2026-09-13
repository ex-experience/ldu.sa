import React from "react";
import { useI18n } from "../i18n/I18nContext";
import ibexRed from "../assets/brand-kit/LDU_ibex_red_2026.jpeg";
import logoIvory from "../assets/brand-kit/LDU_logo_ivory_on_transparent.svg";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero" id="top" data-tone="dark">
      <img className="hero-image hero-ibex-image" src={ibexRed} alt="" />
      <div className="hero-shade" />

      <div className="hero-copy">
        <div className="hero-brand-hierarchy">
          <strong className="hero-brand-top">LDU</strong>
          <p className="eyebrow hero-company-line">{t("hero.meta")}</p>
        </div>

        <h1 className="hero-statement">
          <span>{t("hero.l1")}</span>
          <span className="flame">{t("hero.l2")}</span>
          <span>{t("hero.l3")}</span>
        </h1>

        <div className="hero-actions">
          <a className="button fill" href="#position">
            {t("nav.position")}
          </a>
          <a className="button line" href="#contact">
            {t("nav.contact")}
          </a>
        </div>
      </div>

      <div className="hero-mark">
        <img className="hero-wordmark" src={logoIvory} alt="" />
        <span>{t("hero.rail")}</span>
      </div>

      <div className="scroll-cue">
        <i />
        {t("hero.scroll")}
      </div>
    </section>
  );
}