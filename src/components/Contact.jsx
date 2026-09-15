import React from "react";
import { useI18n } from "../i18n/I18nContext";

const PHONE_DISPLAY = "+966 54 021 1883";
const PHONE_LINK = "tel:+966540211883";
const WHATSAPP_LINK = "https://wa.me/966540211883";
const INSTAGRAM_LINK = "https://www.instagram.com/ladeuniqueco?stkn=M2FmOHVkOWQwMWN3";

const cards = [
  {
    key: "whatsapp",
    href: WHATSAPP_LINK,
    labelKey: "contact.whatsapp",
    value: PHONE_DISPLAY,
    external: true
  },
  {
    key: "call",
    href: PHONE_LINK,
    labelKey: "contact.call",
    value: PHONE_DISPLAY,
    external: false
  },
  {
    key: "instagram",
    href: INSTAGRAM_LINK,
    labelKey: "contact.instagram",
    value: "@ladeuniqueco",
    external: true
  }
];

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

          </aside>
        </div>

        <div className="quick-contact-grid" data-reveal>
          {cards.map((card) => (
            <a
              key={card.key}
              className={`quick-contact-card ${card.key}`}
              href={card.href}
              target={card.external ? "_blank" : undefined}
              rel={card.external ? "noreferrer" : undefined}
            >
              <span>{t(card.labelKey)}</span>
              <strong dir="ltr">{card.value}</strong>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}