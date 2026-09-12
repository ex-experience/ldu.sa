import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries, languages } from "./translations";

const I18nContext = createContext(null);
const STORAGE_KEY = "ldu-language";

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && languages[saved] ? saved : "en";
  });

  useEffect(() => {
    const meta = languages[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    localStorage.setItem(STORAGE_KEY, lang);

    const dict = dictionaries[lang] || dictionaries.en;
    const suffix = dict["hero.meta"] || dictionaries.en["hero.meta"];
    document.title = `LDU — ${suffix}`;
  }, [lang]);

  const value = useMemo(() => {
    const dict = dictionaries[lang] || dictionaries.en;
    const t = (key) => dict[key] ?? dictionaries.en[key] ?? key;
    return { lang, setLang, t, languages };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
