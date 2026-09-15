import React from "react";
import { useI18n } from "../i18n/I18nContext";

const ASSET_ROOT = `${import.meta.env.BASE_URL}assets/editorial`;

const frames = [
  `${ASSET_ROOT}/ulba-story-01.webp`,
  `${ASSET_ROOT}/ulba-story-02.webp`,
  `${ASSET_ROOT}/ulba-story-03.webp`,
  `${ASSET_ROOT}/ulba-story-04.webp`
];

const copy = {
  en: {
    kicker: "LIVE EXPERIENCE / SELECTED EVENT IMAGERY",
    title: "Real rooms. Real people. The feeling sells first.",
    body:
      "A concentrated edit of live-event imagery already held in the LDU repository — kept separate from founder case studies so the attribution stays clear.",
    cue: "Swipe the live frames",
    frame: "LIVE EXPERIENCE"
  },
  ar: {
    kicker: "تجربة حية / لقطات مختارة من الفعاليات",
    title: "أماكن حقيقية. جمهور حقيقي. والإحساس يسبق الشرح.",
    body:
      "اختيار مركز من صور الفعاليات.",
    cue: "اسحب لاستكشاف اللقطات",
    frame: "تجربة حية"
  },
  fr: {
    kicker: "EXPÉRIENCE LIVE / IMAGES SÉLECTIONNÉES",
    title: "Des lieux réels. De vraies personnes. L’émotion vend d’abord.",
    body:
      "Une sélection d’images live déjà présentes dans le dépôt LDU, clairement séparée des références professionnelles antérieures des fondateurs.",
    cue: "Faites glisser les images",
    frame: "EXPÉRIENCE LIVE"
  },
  es: {
    kicker: "EXPERIENCIA EN VIVO / IMÁGENES SELECCIONADAS",
    title: "Espacios reales. Personas reales. La sensación vende primero.",
    body:
      "Una selección de imágenes de eventos ya presentes en el repositorio de LDU, separada de los trabajos previos de los fundadores para mantener la atribución clara.",
    cue: "Desliza para explorar",
    frame: "EXPERIENCIA EN VIVO"
  }
};

export default function CommercialHook() {
  const { lang } = useI18n();
  const c = copy[lang] || copy.en;

  return (
    <section
      className="commercial-hook"
      data-tone="dark"
      aria-labelledby="commercial-hook-title"
    >
      <div className="commercial-hook-head" data-reveal>
        <div>
          <p className="commercial-kicker">{c.kicker}</p>
          <h2 id="commercial-hook-title">{c.title}</h2>
        </div>

        <div className="commercial-hook-copy">
          <p>{c.body}</p>
          <span className="commercial-swipe-cue">
            {c.cue} →
          </span>
        </div>
      </div>

      <div className="commercial-rail" data-reveal>
        {frames.map((src) => (
          <figure className="commercial-frame" key={src}>
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>{c.frame}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}