import React from "react";
import { useI18n } from "../i18n/I18nContext";

const ASSET_ROOT =
  "https://cdn.jsdelivr.net/gh/ex-experience/ldu.lcc@99e6004ca55d82edb8598877c13f28ad6fa0d810/assets/brands";

const deemaLogos = [
  { src: `${ASSET_ROOT}/deema/pepsi.png`, alt: "Pepsi" },
  { src: `${ASSET_ROOT}/deema/rotana.png`, alt: "Rotana" },
  { src: `${ASSET_ROOT}/deema/mdlbeast.png`, alt: "MDLBEAST" }
];

const emranLogos = [
  { src: `${ASSET_ROOT}/emran/netflix.png`, alt: "Netflix" },
  { src: `${ASSET_ROOT}/emran/jeddah-season.png`, alt: "Jeddah Season" },
  { src: `${ASSET_ROOT}/emran/level-up.png`, alt: "Level Up" }
];

const credentialLabel = {
  en: "Selected founder-led brand credentials",
  ar: "نماذج مختارة من خبرات المؤسسين مع العلامات",
  fr: "Références de marques sélectionnées, portées par les fondateurs",
  es: "Credenciales de marca seleccionadas, lideradas por los fundadores"
};

function MiniLogos({ logos, label }) {
  return (
    <div className="founder-mini-logos" aria-label={label}>
      {logos.map((logo) => (
        <span className="founder-mini-logo" key={logo.alt} title={logo.alt}>
          <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" />
        </span>
      ))}
    </div>
  );
}

export default function Team() {
  const { t, lang } = useI18n();
  const label = credentialLabel[lang] || credentialLabel.en;
  const allLogos = [...deemaLogos, ...emranLogos];

  return (
    <section className="section cream team" id="team" data-tone="light">
      <div data-reveal>
        <div className="section-kicker"><span>06</span>{t("team.kicker")}</div>
        <div className="split-head">
          <h2>{t("team.title")}</h2>
          <p className="lead">{t("team.body")}</p>
        </div>
      </div>

      <div className="founders" data-reveal>
        <article className="founder-card">
          <small>{t("team.deemaLane")}</small>
          <h3>{t("team.deema")}</h3>
          <strong>{t("team.deemaRole")}</strong>
          <p>{t("team.deemaBody")}</p>
          <MiniLogos logos={deemaLogos} label={label} />
        </article>

        <article className="founder-card">
          <small>{t("team.emranLane")}</small>
          <h3>{t("team.emran")}</h3>
          <strong>{t("team.emranRole")}</strong>
          <p>{t("team.emranBody")}</p>
          <MiniLogos logos={emranLogos} label={label} />
        </article>
      </div>

      <div className="brand-credentials" data-reveal>
        <div className="brand-credentials-head">
          <span>{label}</span>
          <span>FOUNDER-LED / PRIOR COMPANIES</span>
        </div>
        <div className="brand-credentials-grid">
          {allLogos.map((logo) => (
            <div className="credential-logo" key={logo.alt}>
              <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>

      <p className="attribution">{t("cases.note")}</p>
    </section>
  );
}
