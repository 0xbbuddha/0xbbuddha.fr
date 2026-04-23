"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const sections = [
  {
    href: "/red-team/ad-exploit",
    name: "AD Exploit",
    description: "Chemins d'exploitation Active Directory : Kerberoasting, AS-REP, ACL abuse, DCSync.",
  },
  {
    href: "/red-team/privesc-windows",
    name: "Privesc Windows",
    description: "Élévation de privilèges sur systèmes Windows : services, tokens, DLL hijacking.",
  },
  {
    href: "/red-team/privesc-linux",
    name: "Privesc Linux",
    description: "Élévation de privilèges sur Linux : SUID, sudo, capabilities, crons.",
  },
  {
    href: "/red-team/esc",
    name: "ESC",
    description: "Abus de mauvaises configurations ADCS : ESC1 à ESC13, Shadow Credentials.",
  },
  {
    href: "/red-team/pivoting",
    name: "Pivoting",
    description: "Techniques de pivot et tunnel dans un réseau compromis : port forwarding, SOCKS, Chisel.",
  },
];

export default function RedTeamPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          {t.redTeam.eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t.redTeam.title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {t.redTeam.description}
        </p>
        <div className="mt-4 text-xs text-muted-foreground">
          {sections.length} {t.common.entries}
        </div>
      </header>

      <div className="divide-y divide-border">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex items-start gap-4 py-5"
          >
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
