import React from "react";
import { content } from "../data/content";

export default function Method() {
  return (
    <section className="section cream" id="method">
      <div className="section-kicker"><span>03</span>The LDU method</div>
      <div className="split-head">
        <h2>{content.method.title}</h2>
        <p className="lead">{content.method.intro}</p>
      </div>
      <blockquote>{content.method.quote}</blockquote>
      <div className="method-grid">
        {content.method.steps.map(([title, body], i) => (
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
