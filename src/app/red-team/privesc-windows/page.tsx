"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function PrivescWindowsPage() {
  const { lang } = useLanguage();
  const sections = [
    {
      href: "/red-team/privesc-windows/local-enum",
      name: "Local Enum",
      description: lang === "fr" ? "Collecte locale structurée avant action." : "Structured local collection before action.",
    },
    {
      href: "/red-team/privesc-windows/credential-access",
      name: "Credential Access",
      description: lang === "fr" ? "Sous-catégories pour le dump et la récupération de secrets." : "Sub-categories for dump and secret recovery.",
    },
    {
      href: "/red-team/privesc-windows/privilege-abuse",
      name: "Privilege Abuse",
      description: lang === "fr" ? "Sous-catégories pour l'abus de services et de configurations." : "Sub-categories for service and configuration abuse.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Red Team Notes</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Privesc Windows</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Privesc Windows version terrain: prioriser vite, abuser proprement, valider sans casser."
            : "Field-oriented Windows privesc: prioritize fast, abuse cleanly, validate safely."}
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
