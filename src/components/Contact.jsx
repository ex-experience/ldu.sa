import React from "react";
import { useI18n } from "../i18n/I18nContext";

const PHONE_DISPLAY = "+966 54 021 1883";
const PHONE_LINK = "tel:+966540211883";

export default function Contact() {
  const { t } = useI18n();
  return (
    <section className="section navy" id="contact">
      <div className="section-kicker inverse"><span>07</span>{t("contact.kicker")}</div>
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
          <a className="button fill contact-button" href={PHONE_LINK}>{t("contact.call")}</a>
        </aside>
      </div>
    </section>
  );
}
