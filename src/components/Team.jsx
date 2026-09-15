import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import "./TeamLogoCarousel.css";

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
  { src: `${BASE}/emran/netflix.png`, alt: "Netflix" },
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

function CredentialCarousel({
  logos,
  label,
  previousLabel,
  nextLabel,
  interval = 2500
}) {
  const rootRef = useRef(null);
  const railRef = useRef(null);
  const scrollFrame = useRef(0);
  const resumeTimer = useRef(0);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  const centerItem = (index, behavior = "smooth") => {
    const rail = railRef.current;
    const item = rail?.children?.[index];

    if (!rail || !item) return;

    const left =
      item.offsetLeft - (rail.clientWidth - item.clientWidth) / 2;

    rail.scrollTo({
      left: Math.max(0, left),
      top: 0,
      behavior
    });
  };

  const reveal = (index, behavior = "smooth") => {
    const count = logos.length;
    const next = ((index % count) + count) % count;

    setActive(next);

    requestAnimationFrame(() => {
      centerItem(next, behavior);
    });
  };

  useEffect(() => {
    const node = rootRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(
          Boolean(entry?.isIntersecting) &&
          (entry?.intersectionRatio ?? 0) >= 0.18
        );
      },
      {
        threshold: [0, 0.18, 0.5, 1],
        rootMargin: "0px 0px -4% 0px"
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (
      !inView ||
      paused ||
      reduced ||
      document.hidden ||
      logos.length < 2
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActive((current) => {
        const next = (current + 1) % logos.length;

        requestAnimationFrame(() => {
          centerItem(next, "smooth");
        });

        return next;
      });
    }, interval);

    return () => window.clearInterval(timer);
  }, [inView, interval, logos.length, paused]);

  useEffect(() => {
    return () => {
      if (scrollFrame.current) {
        cancelAnimationFrame(scrollFrame.current);
      }
      if (resumeTimer.current) {
        window.clearTimeout(resumeTimer.current);
      }
    };
  }, []);

  const syncActiveToScroll = () => {
    if (scrollFrame.current) return;

    scrollFrame.current = requestAnimationFrame(() => {
      scrollFrame.current = 0;

      const rail = railRef.current;
      if (!rail || !rail.children.length) return;

      const center = rail.scrollLeft + rail.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      [...rail.children].forEach((item, index) => {
        const itemCenter = item.offsetLeft + item.clientWidth / 2;
        const distance = Math.abs(itemCenter - center);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setActive(nearestIndex);
    });
  };

  const pauseForTouch = () => {
    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current);
    }
    setPaused(true);
  };

  const resumeAfterTouch = () => {
    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current);
    }

    resumeTimer.current = window.setTimeout(() => {
      setPaused(false);
    }, 1400);
  };

  return (
    <div
      className={`credential-carousel ${paused ? "is-paused" : ""}`}
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      data-in-view={inView ? "true" : "false"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
      onTouchStart={pauseForTouch}
      onTouchEnd={resumeAfterTouch}
      onTouchCancel={resumeAfterTouch}
    >
      <button
        className="credential-control credential-control-prev"
        type="button"
        aria-label={`${previousLabel} · ${label}`}
        onClick={() => reveal(active - 1)}
      >
        ‹
      </button>

      <div
        className="credential-carousel-track"
        ref={railRef}
        tabIndex="0"
        onScroll={syncActiveToScroll}
      >
        {logos.map((logo, index) => (
          <span
            className={`credential-mark ${index === active ? "is-active" : ""}`}
            key={logo.alt}
            title={logo.alt}
            aria-current={index === active ? "true" : undefined}
          >
            <img
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              decoding="async"
            />
          </span>
        ))}
      </div>

      <button
        className="credential-control credential-control-next"
        type="button"
        aria-label={`${nextLabel} · ${label}`}
        onClick={() => reveal(active + 1)}
      >
        ›
      </button>
    </div>
  );
}

export default function Team() {
  const { t } = useI18n();

  const carouselProps = {
    previousLabel: t("a11y.previous"),
    nextLabel: t("a11y.next")
  };

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

          <CredentialCarousel
            {...carouselProps}
            logos={deemaLogos}
            interval={2400}
            label={`${t("team.deema")} · ${t("team.priorLabel")}`}
          />
        </article>

        <article className="founder-card credential-profile-card">
          <small>{t("team.emranLane")}</small>
          <h3>{t("team.emran")}</h3>
          <strong>{t("team.emranRole")}</strong>
          <p>{t("team.emranBody")}</p>

          <CredentialCarousel
            {...carouselProps}
            logos={emranLogos}
            interval={2100}
            label={`${t("team.emran")} · ${t("team.priorLabel")}`}
          />
        </article>

        <article className="founder-card credential-profile-card team-card-sara">
          <small>{t("team.saraLane")}</small>
          <h3>{t("team.sara")}</h3>
          <strong>{t("team.saraRole")}</strong>
          <p>{t("team.saraBody")}</p>

          <CredentialCarousel
            {...carouselProps}
            logos={saraLogos}
            interval={2600}
            label={`${t("team.sara")} · ${t("team.priorLabel")}`}
          />
        </article>
      </div>

      <p className="attribution team-credentials-note">
        {t("team.credentialsNote")}
      </p>
    </section>
  );
}