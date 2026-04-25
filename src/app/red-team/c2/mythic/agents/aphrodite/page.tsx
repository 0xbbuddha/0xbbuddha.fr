"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function AphroditePage() {
  const { lang } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Agents</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Aphrodite</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Agent Mythic Linux en Nim. Check-in, tasking, primitives de contrôle opérateur."
            : "Mythic Linux agent written in Nim. Check-in, tasking, operator control primitives."}
        </p>
      </header>
      <div className="rounded-sm border border-border p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-2">
          {lang === "fr" ? "En cours" : "Work in progress"}
        </p>
        <p className="text-xs leading-6 text-muted-foreground">
          {lang === "fr"
            ? "Le contenu de cette page arrive bientôt. L'article de blog associé est déjà disponible."
            : "Content for this page is coming soon. The associated blog post is already available."}
        </p>
      </div>
    </div>
  );
}
