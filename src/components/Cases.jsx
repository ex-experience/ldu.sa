import React from "react";
import { useI18n } from "../i18n/I18nContext";

const BRAND_ROOT =
  "https://cdn.jsdelivr.net/gh/ex-experience/ldu.lcc@99e6004ca55d82edb8598877c13f28ad6fa0d810/assets/brands";

const cases = [
  {
    key: "netflix",
    tag: "GLOBAL ENTERTAINMENT",
    logo: `${BRAND_ROOT}/emran/netflix.png`,
    logoAlt: "Netflix"
  },
  {
    key: "pepsi",
    tag: "BRAND PARTNERSHIP",
    logo: `${BRAND_ROOT}/deema/pepsi.png`,
    logoAlt: "Pepsi / Doritos"
  },
  {
    key: "jeddah",
    tag: "SEASONAL PROGRAM",
    logo: `${import.meta.env.BASE_URL}assets/team-logos/emran/jeddah-2026.png`,
    logoAlt: "Jeddah 2026"
  },
  {
    key: "mdl",
    tag: "LIVE ENTERTAINMENT",
    logo: `${BRAND_ROOT}/deema/mdlbeast.png`,
    logoAlt: "MDLBEAST"
  }
];

export default function Cases() {
  const { t } = useI18n();

  return (
    <section
      className="section cases-section founder-work-section"
      id="founder-work"
      data-tone="light"
    >
      <div data-reveal>
        <div className="section-kicker">{t("cases.kicker")}</div>
        <h2 className="section-title">{t("cases.title")}</h2>
        <p className="case-note">{t("cases.note")}</p>
      </div>

      <div className="founder-work-grid" data-reveal>
        {cases.map((item) => {
          const title = t(`cases.${item.key}Title`);

          return (
            <article className="founder-work-card" key={item.key}>
              <div className="founder-work-tag">{item.tag}</div>

              <div className="founder-work-logo-lock" aria-label={title}>
                <img
                  src={item.logo}
                  alt={item.logoAlt}
                  loading="lazy"
                  decoding="async"
                />
                <small>{title}</small>
              </div>

              <div className="founder-work-copy">
                <h3>{title}</h3>
                <p>{t(`cases.${item.key}`)}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}