import React, { useEffect, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import logoIvory from "../assets/brand-kit/LDU_logo_ivory_on_transparent.svg";
import logoOnyx from "../assets/brand-kit/LDU_logo_onyx_on_transparent.svg";

const nav = [
  ["#position", "nav.position"],
  ["#house", "nav.house"],
  ["#method", "nav.method"],
  ["#services", "nav.services"],
  ["#proof", "nav.proof"],
  ["#team", "nav.team"],
  ["#contact", "nav.contact"]
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
        <a className="brand-button brand-wordmark" href={import.meta.env.BASE_URL} aria-label="LDU home">
          <img className="brand-logo brand-logo-ivory" src={logoIvory} alt="LDU" />
          <img className="brand-logo brand-logo-onyx" src={logoOnyx} alt="LDU" />
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
              <img src={logoIvory} alt="LDU" />
              <button type="button" onClick={() => setMenuOpen(false)}>
                {t("nav.close")}
              </button>
            </div>

            {nav.map(([href, key]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                <strong>{t(key)}</strong>
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
