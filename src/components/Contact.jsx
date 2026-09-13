import React from "react";
import { useI18n } from "../i18n/I18nContext";

const PHONE_DISPLAY = "+966 54 021 1883";
const PHONE_LINK = "tel:+966540211883";
const WHATSAPP_LINK = "https://wa.me/966540211883";
const INSTAGRAM_LINK = "https://www.instagram.com/ladeuniqueco?stkn=M2FmOHVkOWQwMWN3";

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default function Contact() {
  const { t } = useI18n();

  return (
    <section className="section ink contact-section" id="contact" data-tone="dark">
      <div data-reveal>
        <div className="section-kicker inverse">{t("contact.kicker")}</div>

        <div className="contact-grid">
          <div>
            <h2>{t("contact.title")}</h2>
            <p className="lead muted">{t("contact.body")}</p>
          </div>

          <aside className="contact-direct">
            <span>{t("contact.locationLabel")}</span>
            <strong>{t("contact.location")}</strong>

            <span>{t("contact.phoneLabel")}</span>
            <a href={PHONE_LINK} dir="ltr">{PHONE_DISPLAY}</a>
          </aside>
        </div>

        <div className="quick-contact-grid" data-reveal>
          <a className="quick-contact-card whatsapp" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
            <span>{t("contact.whatsapp")}</span>
            <strong>{PHONE_DISPLAY}</strong>
            <ArrowIcon />
          </a>

          <a className="quick-contact-card call" href={PHONE_LINK}>
            <span>{t("contact.call")}</span>
            <strong>{PHONE_DISPLAY}</strong>
            <ArrowIcon />
          </a>

          <a className="quick-contact-card instagram" href={INSTAGRAM_LINK} target="_blank" rel="noreferrer">
            <span>{t("contact.instagram")}</span>
            <strong>@ladeuniqueco</strong>
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
