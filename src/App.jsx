import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Position from "./components/Position";
import House from "./components/House";
import Method from "./components/Method";
import Services from "./components/Services";
import Proof from "./components/Proof";
import Cases from "./components/Cases";
import Team from "./components/Team";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import LegalPage from "./components/LegalPage";
import ExperienceChrome from "./components/ExperienceChrome";
import { useI18n } from "./i18n/I18nContext";

function Marquee() {
  const { t } = useI18n();
  const phrase = [t("marquee.q"), t("marquee.r"), t("marquee.h"), t("marquee.c"), t("marquee.s")].join(" ◆ ");
  return (
    <div className="marquee" aria-hidden="true">
      <div>{phrase} ◆ {phrase} ◆</div>
    </div>
  );
}

export default function App() {
  const legal = new URLSearchParams(window.location.search).get("legal");

  return (
    <>
      <ExperienceChrome />
      <Header />

      {legal === "privacy" || legal === "terms" ? (
        <LegalPage type={legal} />
      ) : (
        <main id="main">
          <Hero />
          <Marquee />
          <Position />
          <House />
          <Method />
          <Services />
          <Proof />
          <Cases />
          <Team />
          <Contact />
        </main>
      )}

      <Footer />
    </>
  );
}
