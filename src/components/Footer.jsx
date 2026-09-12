import React from "react";
import { useI18n } from "../i18n/I18nContext";
import ibex from "../../docs/brand/ibex.png";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img src={ibex} alt="" />
          <strong>LDU</strong>
        </div>
        <p>{t("footer.line")}</p>
      </div>

      <div className="footer-links">
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
