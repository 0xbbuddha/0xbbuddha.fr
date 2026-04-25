"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function PrivescLinuxPage() {
  const { lang } = useLanguage();
  const sections = [
    {
      href: "/red-team/privesc-linux/local-enum",
      name: "Local Enum",
      description: lang === "fr" ? "Base d'énumération locale avant exploitation." : "Local enumeration baseline before exploitation.",
    },
    {
      href: "/red-team/privesc-linux/privilege-paths",
      name: "Privilege Paths",
      description: lang === "fr" ? "Sous-catégories d'escalade : sudo/suid, capabilities et cron." : "Escalation sub-categories: sudo/suid, capabilities, and cron.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Red Team Notes</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Privesc Linux</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Privesc Linux orienté efficacité: enum courte, chemins exploitables, impact contrôlé."
            : "Linux privesc focused on efficiency: short enum, exploitable paths, controlled impact."}
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
