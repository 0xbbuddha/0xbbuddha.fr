"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function MythicAgentsPage() {
  const { lang, t } = useLanguage();
  const items = [
    {
      href: "/red-team/c2/mythic/agents/aphrodite",
      name: "Aphrodite",
      description: lang === "fr"
        ? "Agent Mythic Linux en Nim. Check-in, tasking, primitives de contrôle opérateur."
        : "Mythic Linux agent written in Nim. Check-in, tasking, operator control primitives.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Mythic</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Agents</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Les agents que j'ai développés pour Mythic."
            : "Agents I developed for Mythic."}
        </p>
        <div className="mt-4 text-xs text-muted-foreground">{items.length} {t.common.entries}</div>
      </header>
      <div className="divide-y divide-border">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="group flex items-start gap-4 py-5">
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 font-mono text-xs text-primary">{item.name}</p>
              <p className="text-xs leading-6 text-muted-foreground">{item.description}</p>
            </div>
            <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
