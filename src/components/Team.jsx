import React from "react";
import { useI18n } from "../i18n/I18nContext";

const BASE = `${import.meta.env.BASE_URL}assets/team-logos`;

const deemaLogos = [
  { src: `${BASE}/deema/mdlbeast.png`, alt: "MDLBEAST" },
  { src: `${BASE}/deema/rotana.png`, alt: "Rotana" },
  { src: `${BASE}/deema/stc.svg`, alt: "STC" },
  { src: `${BASE}/deema/pepsi.png`, alt: "Pepsi" },
  { src: `${BASE}/deema/doritos.png`, alt: "Doritos" },
  { src: `${BASE}/deema/film-commission.svg`, alt: "Film Commission" },
  { src: `${BASE}/shared/ministry-of-culture.png`, alt: "Ministry of Culture" },
  { src: `${BASE}/deema/dna-studio.png`, alt: "DNA Studio" },
  { src: `${BASE}/deema/noon.webp`, alt: "Noon" },
  { src: `${BASE}/deema/lilo-artisan-patisserie.svg`, alt: "LILO Artisan Patisserie" },
  { src: `${BASE}/deema/madar-investment-company.svg`, alt: "Madar Investment Company" }
];

const emranLogos = [
  { src: "https://cdn.jsdelivr.net/gh/ex-experience/ldu.lcc@99e6004ca55d82edb8598877c13f28ad6fa0d810/assets/brands/emran/netflix.png", alt: "Netflix" },
  { src: "https://cdn.jsdelivr.net/gh/ex-experience/ldu.lcc@99e6004ca55d82edb8598877c13f28ad6fa0d810/assets/brands/emran/jeddah-season.png", alt: "Jeddah Season" },
  { src: "https://cdn.jsdelivr.net/gh/ex-experience/ldu.lcc@99e6004ca55d82edb8598877c13f28ad6fa0d810/assets/brands/emran/level-up.png", alt: "Level Up" }
];

const saraLogos = [
  { src: `${BASE}/sara/almarai.png`, alt: "Almarai" },
  { src: `${BASE}/sara/bank-aljazira.png`, alt: "Bank AlJazira" },
  { src: `${BASE}/shared/ministry-of-culture.png`, alt: "Ministry of Culture" },
  { src: `${BASE}/sara/simah.png`, alt: "SIMAH" },
  { src: `${BASE}/sara/bioderma.png`, alt: "Bioderma" },
  { src: `${BASE}/sara/radisson-blu.png`, alt: "Radisson Blu" },
  { src: `${BASE}/sara/bin-shihon.png`, alt: "Bin-Shihon Group" },
  { src: `${BASE}/sara/gastat.png`, alt: "GASTAT" },
  { src: `${BASE}/sara/monshaat.png`, alt: "Monsha’at" },
  { src: `${BASE}/sara/riyadh-boulevard.png`, alt: "Riyadh Boulevard" },
  { src: `${BASE}/sara/alsorayai-group.png`, alt: "Al Sorayai Group" },
  { src: `${BASE}/sara/eyewa.png`, alt: "Eyewa" },
  { src: `${BASE}/sara/the-entertainer.png`, alt: "The Entertainer" },
  { src: `${BASE}/sara/mawani.png`, alt: "Mawani" }
];

function CredentialRail({ logos, speed = 28, label }) {
  const doubled = [...logos, ...logos];

  return (
    <div className="credential-rail" aria-label={label}>
      <div className="credential-rail-mask">
        <div
          className="credential-rail-track"
          style={{ "--credential-duration": `${speed}s` }}
        >
          {doubled.map((logo, index) => (
            <span
              className="credential-mark"
              key={`${logo.alt}-${index}`}
              title={logo.alt}
              aria-hidden={index >= logos.length ? "true" : undefined}
            >
              <img src={logo.src} alt={index < logos.length ? logo.alt : ""} loading="lazy" decoding="async" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  const { t } = useI18n();

  return (
    <section className="section cream team" id="team" data-tone="light">
      <div data-reveal>
        <div className="section-kicker">{t("team.kicker")}</div>

        <div className="split-head">
          <h2>{t("team.title")}</h2>
          <p className="lead">{t("team.body")}</p>
        </div>
      </div>

      <div className="team-grid team-grid-credentials" data-reveal>
        <article className="founder-card credential-profile-card">
          <small>{t("team.deemaLane")}</small>
          <h3>{t("team.deema")}</h3>
          <strong>{t("team.deemaRole")}</strong>
          <p>{t("team.deemaBody")}</p>
          <CredentialRail logos={deemaLogos} speed={34} label={`${t("team.deema")} · ${t("team.priorLabel")}`} />
        </article>

        <article className="founder-card credential-profile-card">
          <small>{t("team.emranLane")}</small>
          <h3>{t("team.emran")}</h3>
          <strong>{t("team.emranRole")}</strong>
          <p>{t("team.emranBody")}</p>
          <CredentialRail logos={emranLogos} speed={16} label={`${t("team.emran")} · ${t("team.priorLabel")}`} />
        </article>

        <article className="founder-card credential-profile-card team-card-sara">
          <small>{t("team.saraLane")}</small>
          <h3>{t("team.sara")}</h3>
          <strong>{t("team.saraRole")}</strong>
          <p>{t("team.saraBody")}</p>
          <CredentialRail logos={saraLogos} speed={40} label={`${t("team.sara")} · ${t("team.priorLabel")}`} />
        </article>
      </div>

      <p className="attribution team-credentials-note">{t("team.credentialsNote")}</p>
    </section>
  );
}