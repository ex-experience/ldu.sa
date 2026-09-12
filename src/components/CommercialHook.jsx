import React from "react";
import { useI18n } from "../i18n/I18nContext";

const ASSET_ROOT =
  "https://cdn.jsdelivr.net/gh/ex-experience/ldu.lcc@99e6004ca55d82edb8598877c13f28ad6fa0d810/assets/editorial";

const frames = [
  { src: `${ASSET_ROOT}/ulba-story-01.webp`, code: "01" },
  { src: `${ASSET_ROOT}/ulba-story-02.webp`, code: "02" },
  { src: `${ASSET_ROOT}/ulba-story-03.webp`, code: "03" },
  { src: `${ASSET_ROOT}/ulba-story-04.webp`, code: "04" }
];

const copy = {
  en: {
    kicker: "COMMERCIAL HOOK / LIVE EXPERIENCE",
    title: "Real rooms. Real people. The feeling sells first.",
    body:
      "A concentrated edit of the strongest live-event imagery already held in the LDU repository — presented as visual proof, not as a file archive.",
    cue: "Swipe the live frames"
  },
  ar: {
    kicker: "الهوك التجاري / تجربة حية",
    title: "أماكن حقيقية. جمهور حقيقي. الإحساس يبيع الفكرة أولاً.",
    body:
      "اختيار مركز من أقوى صور الفعاليات الموجودة بالفعل في مستودع LDU، معروضة كطبقة إثبات بصري وليست كأرشيف ملفات.",
    cue: "اسحب لاستكشاف اللقطات"
  },
  fr: {
    kicker: "ACCROCHE COMMERCIALE / EXPÉRIENCE LIVE",
    title: "Des lieux réels. De vraies personnes. L’émotion vend d’abord.",
    body:
      "Une sélection concentrée des images live les plus fortes déjà présentes dans le dépôt LDU — montrées comme preuve visuelle, pas comme une archive de fichiers.",
    cue: "Faites glisser les images"
  },
  es: {
    kicker: "GANCHO COMERCIAL / EXPERIENCIA EN VIVO",
    title: "Espacios reales. Personas reales. La sensación vende primero.",
    body:
      "Una selección concentrada de las imágenes de eventos más fuertes ya presentes en el repositorio de LDU — mostradas como prueba visual, no como archivo.",
    cue: "Desliza para explorar"
  }
};

export default function CommercialHook() {
  const { lang } = useI18n();
  const c = copy[lang] || copy.en;

  return (
    <section className="commercial-hook" data-tone="dark" aria-labelledby="commercial-hook-title">
      <div className="commercial-hook-head" data-reveal>
        <div>
          <p className="commercial-kicker">{c.kicker}</p>
          <h2 id="commercial-hook-title">{c.title}</h2>
        </div>
        <div className="commercial-hook-copy">
          <p>{c.body}</p>
          <span className="commercial-swipe-cue">{c.cue} →</span>
        </div>
      </div>

      <div className="commercial-rail" data-reveal>
        {frames.map((frame, index) => (
          <figure
            className={`commercial-frame commercial-frame-${index + 1}`}
            key={frame.src}
          >
            <img
              src={frame.src}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>LIVE FRAME</span>
              <strong>{frame.code}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
