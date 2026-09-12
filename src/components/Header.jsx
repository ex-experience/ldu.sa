import React, { useEffect, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import ibex from "../../docs/brand/ibex.png";

const nav = [
  ["#position", "nav.position", "01"],
  ["#house", "nav.house", "02"],
  ["#method", "nav.method", "03"],
  ["#services", "nav.services", "04"],
  ["#proof", "nav.proof", "05"],
  ["#team", "nav.team", "06"],
  ["#contact", "nav.contact", "07"]
];

export default function Header() {
  const { t, lang, setLang, languages } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const goHome = (hash = "") => {
    const base = `${import.meta.env.BASE_URL}${hash}`;
    window.location.href = base;
  };

  return (
    <>
      <a className="skip-link" href="#main">{t("a11y.skip")}</a>
      <header className={`topbar ${scrolled ? "topbar-solid" : ""}`}>
        <button className="brand-button" type="button" onClick={() => goHome()}>
          <img src={ibex} alt="" />
          <span>LDU</span>
        </button>

        <nav className="desktop-nav" aria-label="Primary">
          {nav.map(([href, key]) => (
            <a key={href} href={href}>{t(key)}</a>
          ))}
        </nav>

        <div className="header-actions">
          <div className="language">
            <button
              type="button"
              className="pill-button"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((v) => !v)}
            >
              {languages[lang].label}
            </button>
            {langOpen && (
              <div className="language-menu">
                {Object.entries(languages).map(([code, meta]) => (
                  <button
                    key={code}
                    type="button"
                    className={code === lang ? "active" : ""}
                    onClick={() => {
                      setLang(code);
                      setLangOpen(false);
                    }}
                  >
                    {meta.native}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="pill-button mobile-menu-button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {t(menuOpen ? "nav.close" : "nav.menu")}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-menu-backdrop" aria-label={t("nav.close")} onClick={() => setMenuOpen(false)} />
          <nav>
            <div className="mobile-menu-head">
              <span>LDU</span>
              <button type="button" onClick={() => setMenuOpen(false)}>{t("nav.close")}</button>
            </div>
            {nav.map(([href, key, n]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                <small>{n}</small>
                <strong>{t(key)}</strong>
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
