import React from "react";
import { content } from "../data/content";
import heroNight from "../../docs/media/hero-night.jpg";
import heroStage from "../../docs/media/hero-stage.jpg";
import caseBanquet from "../../docs/media/case-banquet.jpg";
import caseDesert from "../../docs/media/case-desert.jpg";

const rooms = [heroNight, heroStage, caseBanquet, caseDesert];

export default function House() {
  return (
    <section className="section ink" id="house">
      <div className="section-kicker inverse"><span>02</span>The house</div>
      <div className="split-head">
        <h2>{content.house.title}</h2>
        <p className="lead muted">{content.house.body}</p>
      </div>
      <div className="room-grid">
        {rooms.map((src, i) => (
          <figure key={src}>
            <img src={src} alt={`LDU atmosphere ${i + 1}`} />
          </figure>
        ))}
      </div>
    </section>
  );
}
