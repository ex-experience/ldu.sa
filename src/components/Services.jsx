import React from "react";
import { content } from "../data/content";

export default function Services() {
  return (
    <section className="section navy" id="services">
      <div className="section-kicker inverse"><span>04</span>What we do</div>
      <h2 className="section-title">Strategy. Relationships. Delivery.</h2>
      <div className="service-grid">
        {content.services.map(([title, body], i) => (
          <article key={title}>
            <small>{String(i + 1).padStart(2, "0")}</small>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
