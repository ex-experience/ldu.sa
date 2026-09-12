import React from "react";
import { useI18n } from "../i18n/I18nContext";
import arena from "../../docs/media/case-arena.jpg";
import banquet from "../../docs/media/case-banquet.jpg";
import horizon from "../../docs/media/case-horizon.jpg";
import stage from "../../docs/media/hero-stage.jpg";

const BRAND_ROOT =
  "https://cdn.jsdelivr.net/gh/ex-experience/ldu.lcc@99e6004ca55d82edb8598877c13f28ad6fa0d810/assets/brands";

const cases = [
  {
    key: "netflix",
    image: arena,
    tag: "PRIOR · IP",
    logo: `${BRAND_ROOT}/emran/netflix.png`,
    logoAlt: "Netflix"
  },
  {
    key: "pepsi",
    image: banquet,
    tag: "PRIOR · BRAND",
    logo: `${BRAND_ROOT}/deema/pepsi.png`,
    logoAlt: "Pepsi"
  },
  {
    key: "jeddah",
    image: horizon,
    tag: "PRIOR · CITY",
    logo: `${BRAND_ROOT}/emran/jeddah-season.png`,
    logoAlt: "Jeddah Season"
  },
  {
    key: "mdl",
    image: stage,
    tag: "PRIOR · STAGE",
    logo: `${BRAND_ROOT}/deema/mdlbeast.png`,
    logoAlt: "MDLBEAST"
  }
];

export default function Cases() {
  const { t } = useI18n();

  return (
    <section className="section cases-section" data-tone="light">
      <div data-reveal>
        <div className="section-kicker">
          <span>+</span>{t("cases.kicker")}
        </div>
        <h2 className="section-title">{t("cases.title")}</h2>
        <p className="case-note">{t("cases.note")}</p>
      </div>

      <div className="cases-grid" data-reveal>
        {cases.map((item) => (
          <article className="case-card" key={item.key}>
            <img className="case-image" src={item.image} alt="" />
            <div className="case-overlay" />

            <div className="case-copy">
              <small>{item.tag}</small>

              <div className="case-brandline">
                <img
                  className="case-brand-logo"
                  src={item.logo}
                  alt={item.logoAlt}
                  loading="lazy"
                  decoding="async"
                />
                <h3>{t(`cases.${item.key}Title`)}</h3>
              </div>

              <p>{t(`cases.${item.key}`)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
