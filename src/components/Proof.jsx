import React from "react";
import { content } from "../data/content";
import arena from "../../docs/media/case-arena.jpg";
import horizon from "../../docs/media/case-horizon.jpg";

export default function Proof() {
  return (
    <section className="section cream" id="proof">
      <div className="section-kicker"><span>05</span>Proof</div>
      <h2 className="section-title">{content.proof.title}</h2>
      <p className="lead">{content.proof.body}</p>
      <div className="proof-grid">
        <figure><img src={arena} alt="LDU founder-led experience credential" /></figure>
        <figure><img src={horizon} alt="LDU founder-led experience credential" /></figure>
      </div>
    </section>
  );
}
