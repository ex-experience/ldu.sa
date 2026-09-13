import React from "react";
import { useI18n } from "../i18n/I18nContext";
import logoIvory from "../assets/brand-kit/LDU_logo_ivory_on_transparent.svg";

const PHONE_LINK = "tel:+966540211883";
const WHATSAPP_LINK = "https://wa.me/966540211883";
const INSTAGRAM_LINK = "https://www.instagram.com/ladeuniqueco?stkn=M2FmOHVkOWQwMWN3";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img src={logoIvory} alt="LDU" />
        </div>
        <p>{t("footer.line")}</p>
      </div>

      <div className="footer-links">
        <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">{t("contact.whatsapp")}</a>
        <a href={PHONE_LINK}>{t("contact.call")}</a>
        <a href={INSTAGRAM_LINK} target="_blank" rel="noreferrer">Instagram</a>
        <a href="?legal=privacy">{t("footer.privacy")}</a>
        <a href="?legal=terms">{t("footer.terms")}</a>
      </div>

      <div className="footer-bottom">
        <span>{t("footer.location")}</span>
        <span>{t("footer.rights")}</span>
      </div>
    </footer>
  );
}
