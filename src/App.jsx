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
            ASK THE UNCOMFORTABLE QUESTION â—† REFRAME THE OPPORTUNITY â—† ROOT IT IN CULTURE â—† CONNECT THE PEOPLE â—† BUILD THE STAGE â—†
            ASK THE UNCOMFORTABLE QUESTION â—† REFRAME THE OPPORTUNITY â—† ROOT IT IN CULTURE â—† CONNECT THE PEOPLE â—† BUILD THE STAGE â—†
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
        <span>Entertainment House Â· Riyadh</span>
      </footer>
    </>
  );
}
