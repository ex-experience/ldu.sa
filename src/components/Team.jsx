import React from "react";
import { useI18n } from "../i18n/I18nContext";

export default function Team() {
  const { t } = useI18n();
  return (
    <section className="section cream team" id="team">
      <div className="section-kicker"><span>06</span>{t("team.kicker")}</div>
      <div className="split-head">
        <h2>{t("team.title")}</h2>
        <p className="lead">{t("team.body")}</p>
      </div>

      <div className="founders">
        <article>
          <small>{t("team.deemaLane")}</small>
          <h3>{t("team.deema")}</h3>
          <strong>{t("team.deemaRole")}</strong>
          <p>{t("team.deemaBody")}</p>
        </article>
        <article>
          <small>{t("team.emranLane")}</small>
          <h3>{t("team.emran")}</h3>
          <strong>{t("team.emranRole")}</strong>
          <p>{t("team.emranBody")}</p>
        </article>
      </div>

      <p className="attribution">{t("cases.note")}</p>
    </section>
  );
}
