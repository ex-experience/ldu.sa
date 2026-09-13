import React from "react";
import { useI18n } from "../i18n/I18nContext";
import ibexGold from "../assets/brand-kit/LDU_ibex_gold_attached.jpeg";
import logoIvory from "../assets/brand-kit/LDU_logo_ivory_on_transparent.svg";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero" id="top" data-tone="dark">
      <img className="hero-image hero-ibex-image" src={ibexGold} alt="" />
      <div className="hero-shade" />

      <div className="hero-copy">
        <p className="eyebrow">{t("hero.meta")}</p>

        <h1>
          <span>{t("hero.l1")}</span>
          <span className="flame">{t("hero.l2")}</span>
          <span>{t("hero.l3")}</span>
        </h1>

        <div className="purpose">
          <span>{t("hero.purposeLabel")}</span>
          <p>{t("hero.purpose")}</p>
        </div>

        <div className="hero-actions">
          <a className="button fill" href="#position">{t("nav.position")}</a>
          <a className="button line" href="#contact">{t("nav.contact")}</a>
        </div>
      </div>

      <div className="hero-mark">
        <img className="hero-wordmark" src={logoIvory} alt="" />
        <span>{t("hero.rail")}</span>
      </div>

      <div className="scroll-cue"><i />{t("hero.scroll")}</div>
    </section>
  );
}