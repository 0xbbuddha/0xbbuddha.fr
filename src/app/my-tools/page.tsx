"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function MyToolsPage() {
  const { lang, t } = useLanguage();
  const tools = [
    {
      href: "/my-tools/gofenrir",
      name: "GoFenrir",
      description:
        lang === "fr"
          ? "Outil de reconnaissance et énumération réseau écrit en Go."
          : "Network reconnaissance and enumeration tool written in Go.",
      status: "WIP",
    },
    {
      href: "/my-tools/bashhound-ce",
      name: "BashHound-CE",
      description:
        lang === "fr"
          ? "Collecteur Active Directory pour BloodHound CE, en Bash pur."
          : "Active Directory collector for BloodHound CE, written in pure Bash.",
      status: lang === "fr" ? "Stable" : "Stable",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          {t.myTools.eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t.myTools.title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {t.myTools.description}
        </p>
        <div className="mt-4 text-xs text-muted-foreground">
          {tools.length} {t.common.entries}
        </div>
      </header>

      <div className="divide-y divide-border">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex items-start gap-4 py-5"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="font-mono text-xs text-primary">{tool.name}</span>
                <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/60">
                  {tool.status}
                </span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">{tool.description}</p>
            </div>
            <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
