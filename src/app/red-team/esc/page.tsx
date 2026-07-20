"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function ESCPage() {
  const { lang } = useLanguage();
  const sections = [
    {
      href: "/red-team/esc/abuse-paths",
      name: "Abuse Paths",
      description: lang === "fr" ? "Catégories d'abus ESC et shadow credentials." : "Abuse categories for ESC and shadow credentials.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Red Team Notes</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">ESC / ADCS Abuse</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Mon approche ADCS: trouver vite le mauvais template, prouver l'impact, nettoyer."
            : "My ADCS approach: find weak templates fast, prove impact, then clean up."}
        </p>
      </header>

      <div className="divide-y divide-border">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="group flex items-start gap-4 py-5">
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 font-mono text-xs text-primary">{section.name}</p>
              <p className="text-xs leading-6 text-muted-foreground">{section.description}</p>
            </div>
            <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
