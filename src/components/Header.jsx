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
  const [tone, setTone] = useState("dark");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = [...document.querySelectorAll("[data-tone]")];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible?.target?.dataset?.tone) {
          setTone(visible.target.dataset.tone);
        }
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main">{t("a11y.skip")}</a>

      <header
        className={`topbar ${scrolled ? "topbar-solid" : ""} ${
          tone === "light" ? "topbar-light" : "topbar-dark"
        }`}
      >
        <a className="brand-button" href={import.meta.env.BASE_URL} aria-label="LDU home">
          <img src={ibex} alt="" />
          <span>LDU</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary">
          {nav.map(([href, key]) => (
            <a key={href} href={href}>{t(key)}</a>
          ))}
        </nav>

        <div className="header-actions">
          <div className="language">
            <button
              type="button"
              className="pill-button language-trigger"
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              onClick={() => setLangOpen((v) => !v)}
            >
              <span>{languages[lang].label}</span>
            </button>

            {langOpen && (
              <div className="language-menu" role="listbox">
                {Object.entries(languages).map(([code, meta]) => (
                  <button
                    key={code}
                    type="button"
                    role="option"
                    aria-selected={code === lang}
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
            className={`pill-button mobile-menu-button ${menuOpen ? "is-open" : ""}`}
            aria-expanded={menuOpen}
            aria-label={t(menuOpen ? "nav.close" : "nav.menu")}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="menu-glyph" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <button
            className="mobile-menu-backdrop"
            aria-label={t("nav.close")}
            onClick={() => setMenuOpen(false)}
          />
          <nav>
            <div className="mobile-menu-head">
              <span>LDU</span>
              <button type="button" onClick={() => setMenuOpen(false)}>
                {t("nav.close")}
              </button>
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
