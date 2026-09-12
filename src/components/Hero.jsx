import React from "react";
import { content } from "../data/content";
import heroNight from "../../docs/media/hero-night.jpg";
import ibex from "../../docs/brand/ibex.png";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <img className="hero-image" src={heroNight} alt="" />
      <div className="hero-shade" />
      <div className="hero-copy">
        <p className="eyebrow">{content.hero.meta}</p>
        <h1>
          <span>{content.hero.line1}</span>
          <span className="flame">{content.hero.line2}</span>
          <span>{content.hero.line3}</span>
        </h1>
        <div className="purpose">
          <span>Purpose / 01</span>
          <p>{content.hero.purpose}</p>
        </div>
        <div className="hero-actions">
          <a className="button fill" href="#method">Enter the method</a>
          <a className="button line" href="#house">Walk the house</a>
        </div>
      </div>
      <div className="hero-mark">
        <img src={ibex} alt="" />
        <span>Culture is the code</span>
      </div>
    </section>
  );
}
