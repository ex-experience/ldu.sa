import React from "react";
import { content } from "../data/content";
import ibex from "../../docs/brand/ibex.png";

export default function Position() {
  return (
    <>
      <section className="section cream" id="position">
        <div className="section-kicker"><span>01</span>{content.position.kicker}</div>
        <div className="position-grid">
          <h2>{content.position.title}</h2>
          <p className="lead">{content.position.body}</p>
          <img className="watermark" src={ibex} alt="" />
        </div>
      </section>

      <section className="section ink">
        <div className="section-kicker inverse"><span>&mdash;</span>The uncomfortable questions</div>
        <h2 className="section-title">The questions are not a warm-up to the work. They frequently are the work.</h2>
        <div className="question-grid">
          {content.questions.map(([q, a], i) => (
            <article key={q}>
              <small>{String(i + 1).padStart(2, "0")}</small>
              <h3>{q}</h3>
              <p>{a}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}