import React from "react";
import { useI18n } from "../i18n/I18nContext";
import heroNight from "../../docs/media/hero-night.jpg";
import heroStage from "../../docs/media/hero-stage.jpg";
import caseBanquet from "../../docs/media/case-banquet.jpg";
import caseDesert from "../../docs/media/case-desert.jpg";

const rooms = [heroNight, heroStage, caseBanquet, caseDesert];

export default function House() {
  const { t } = useI18n();
  return (
    <section className="section ink" id="house" data-tone="dark">
      <div data-reveal>
        <div className="section-kicker inverse"><span>02</span>{t("house.kicker")}</div>
        <div className="split-head">
          <h2>{t("house.title")}</h2>
          <p className="lead muted">{t("house.body")}</p>
        </div>
      </div>

      <div className="room-grid" data-reveal>
        {rooms.map((src, index) => {
          const n = index + 1;
          return (
            <article className="room" key={src}>
              <img src={src} alt="" />
              <div className="room-overlay" />
              <div className="room-copy">
                <small>{String(n).padStart(2, "0")}</small>
                <h3>{t(`house.w${n}t`)}</h3>
                <p>{t(`house.w${n}b`)}</p>
              </div>
            </article>
          );
        })}
      </div>
      <p className="editorial-note">{t("house.note")}</p>
    </section>
  );
}
