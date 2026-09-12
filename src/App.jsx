import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Position from "./components/Position";
import House from "./components/House";
import Method from "./components/Method";
import Services from "./components/Services";
import Proof from "./components/Proof";
import Team from "./components/Team";
import Contact from "./components/Contact";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="marquee">
          <div>
            ASK THE UNCOMFORTABLE QUESTION &#9670; REFRAME THE OPPORTUNITY &#9670; ROOT IT IN CULTURE &#9670; CONNECT THE PEOPLE &#9670; BUILD THE STAGE &#9670;
            ASK THE UNCOMFORTABLE QUESTION &#9670; REFRAME THE OPPORTUNITY &#9670; ROOT IT IN CULTURE &#9670; CONNECT THE PEOPLE &#9670; BUILD THE STAGE &#9670;
          </div>
        </div>
        <Position />
        <House />
        <Method />
        <Services />
        <Proof />
        <Team />
        <Contact />
      </main>
      <footer>
        <strong>LDU LLC</strong>
        <span>Entertainment House &middot; Riyadh</span>
      </footer>
    </>
  );
}