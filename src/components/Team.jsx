import React from "react";
import { content } from "../data/content";

export default function Team() {
  return (
    <section className="section cream team" id="team">
      <div className="section-kicker"><span>06</span>Who we are</div>
      <div className="split-head">
        <h2>{content.team.title}</h2>
        <p className="lead">{content.team.body}</p>
      </div>
      <div className="founders">
        <article>
          <small>PARTNERSHIPS / BUSINESS</small>
          <h3>Deema Alwaala</h3>
          <strong>Founder &amp; CEO</strong>
          <p>Leads partnerships, commercial relationships and the conversations that turn an opportunity into a real mandate.</p>
        </article>
        <article>
          <small>CULTURE / EXPERIENCE</small>
          <h3>Emran Arif</h3>
          <strong>Co-Founder &middot; Cultural Strategy</strong>
          <p>Leads cultural strategy, concept development and the audience journey &mdash; shaping how an idea is understood, felt and remembered.</p>
        </article>
      </div>
      <p className="attribution">Selected brand credentials are founder-led work delivered at previous companies; they are not presented as direct LDU client work.</p>
    </section>
  );
}