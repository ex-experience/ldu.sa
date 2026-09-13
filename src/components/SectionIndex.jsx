import React from "react";
import { useI18n } from "../i18n/I18nContext";

import explorePosition from "../assets/explore/01-position.webp";
import exploreFourRooms from "../assets/explore/02-four-rooms.webp";
import exploreMethod from "../assets/explore/03-method.webp";
import exploreSolutions from "../assets/explore/04-solutions.webp";
import exploreProof from "../assets/explore/05-proof.webp";
import exploreFounderWork from "../assets/explore/06-selected-founder-work.webp";
import exploreTeam from "../assets/explore/07-team.webp";
import exploreContact from "../assets/explore/08-contact.webp";

const chapters = [
  { href: "#position", key: "nav.position", image: explorePosition },
  { href: "#house", key: "nav.house", image: exploreFourRooms },
  { href: "#method", key: "nav.method", image: exploreMethod },
  { href: "#services", key: "nav.services", image: exploreSolutions },
  { href: "#proof", key: "nav.proof", image: exploreProof },
  { href: "#founder-work", key: "cases.kicker", image: exploreFounderWork },
  { href: "#team", key: "nav.team", image: exploreTeam },
  { href: "#contact", key: "nav.contact", image: exploreContact }
];

export default function SectionIndex() {
  const { t } = useI18n();

  return (
    <section
      className="section ldu-section-index"
      id="section-index"
      data-tone="light"
      aria-labelledby="section-index-title"
    >
      <div className="section-index-head" data-reveal>
        <p className="section-kicker">{t("index.kicker")}</p>
        <h2 id="section-index-title">{t("index.title")}</h2>
        <p className="lead">{t("index.body")}</p>
      </div>

      <nav className="section-index-grid" aria-label={t("index.title")} data-reveal>
        {chapters.map((chapter) => (
          <a className="section-index-card" href={chapter.href} key={chapter.href}>
            <img src={chapter.image} alt="" loading="lazy" decoding="async" />
            <span className="section-index-shade" />
            <strong>{t(chapter.key)}</strong>
          </a>
        ))}
      </nav>
    </section>
  );
}