"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function C2Page() {
  const { lang, t } = useLanguage();
  const items = [
    {
      href: "/red-team/c2/mythic",
      name: "Mythic",
      description: lang === "fr"
        ? "Framework C2 open-source multi-agent, multi-opérateur. Base de mes agents perso."
        : "Open-source multi-agent, multi-operator C2 framework. Base for my personal agents.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Red Team Notes</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">C2</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Frameworks de Command & Control que j'utilise et que j'ai codés."
            : "Command & Control frameworks I use and have coded."}
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
