"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, type Lang, type Tr } from "@/lib/i18n";

type LanguageCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Tr;
};

const LanguageContext = createContext<LanguageCtx>({
  lang: "fr",
  setLang: () => {},
  t: translations.fr,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "fr" || stored === "en") {
      setLangState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem("lang", next);
    document.documentElement.lang = next;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
