import React, { useEffect, useRef, useState } from "react";
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
  { src: `${BASE}/emran/jeddah-2026.png`, alt: "Jeddah 2026" },
  { src: `${BASE}/emran/level-up-2026.png`, alt: "Level Up" }
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

function CredentialCarousel({ logos, label, interval = 2500 }) {
  const railRef = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerInside = useRef(false);

  const reveal = (index) => {
    const count = logos.length;
    const next = ((index % count) + count) % count;
    setActive(next);
    requestAnimationFrame(() => {
      railRef.current?.children?.[next]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    });
  };

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (paused || reduced || logos.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => {
        const next = (current + 1) % logos.length;
        requestAnimationFrame(() => {
          railRef.current?.children?.[next]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
          });
        });
        return next;
      });
    }, interval);
    return () => window.clearInterval(timer);
  }, [interval, logos.length, paused]);

  return (
    <div
      className={`credential-carousel ${paused ? "is-paused" : ""}`}
      aria-label={label}
      onPointerEnter={() => { pointerInside.current = true; setPaused(true); }}
      onPointerLeave={() => { pointerInside.current = false; setPaused(false); }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => { if (!pointerInside.current) setPaused(false); }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => window.setTimeout(() => setPaused(false), 1400)}
    >
      <button className="credential-control" type="button" aria-label={`Previous · ${label}`} onClick={() => reveal(active - 1)}>‹</button>

      <div className="credential-carousel-track" ref={railRef} tabIndex="0">
        {logos.map((logo, index) => (
          <span className={`credential-mark ${index === active ? "is-active" : ""}`} key={logo.alt} title={logo.alt}>
            <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" />
          </span>
        ))}
      </div>

      <button className="credential-control" type="button" aria-label={`Next · ${label}`} onClick={() => reveal(active + 1)}>›</button>
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
          <CredentialCarousel logos={deemaLogos} interval={2400} label={`${t("team.deema")} · ${t("team.priorLabel")}`} />
        </article>

        <article className="founder-card credential-profile-card">
          <small>{t("team.emranLane")}</small>
          <h3>{t("team.emran")}</h3>
          <strong>{t("team.emranRole")}</strong>
          <p>{t("team.emranBody")}</p>
          <CredentialCarousel logos={emranLogos} interval={2100} label={`${t("team.emran")} · ${t("team.priorLabel")}`} />
        </article>

        <article className="founder-card credential-profile-card team-card-sara">
          <small>{t("team.saraLane")}</small>
          <h3>{t("team.sara")}</h3>
          <strong>{t("team.saraRole")}</strong>
          <p>{t("team.saraBody")}</p>
          <CredentialCarousel logos={saraLogos} interval={2600} label={`${t("team.sara")} · ${t("team.priorLabel")}`} />
        </article>
      </div>

      <p className="attribution team-credentials-note">{t("team.credentialsNote")}</p>
    </section>
  );
}