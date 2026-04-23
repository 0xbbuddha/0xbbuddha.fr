"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function RedTeamPage() {
  const { lang, t } = useLanguage();
  const sections = [
    {
      href: "/red-team/ad-exploit",
      name: "AD Exploit",
      description:
        lang === "fr"
          ? "Chemins d'exploitation Active Directory : Kerberoasting, AS-REP, ACL abuse, DCSync."
          : "Active Directory attack paths: Kerberoasting, AS-REP, ACL abuse, DCSync.",
    },
    {
      href: "/red-team/privesc-windows",
      name: "Privesc Windows",
      description:
        lang === "fr"
          ? "Élévation de privilèges sur systèmes Windows : services, tokens, DLL hijacking."
          : "Windows privilege escalation: services, tokens, DLL hijacking.",
    },
    {
      href: "/red-team/privesc-linux",
      name: "Privesc Linux",
      description:
        lang === "fr"
          ? "Élévation de privilèges sur Linux : SUID, sudo, capabilities, crons."
          : "Linux privilege escalation: SUID, sudo, capabilities, cron abuse.",
    },
    {
      href: "/red-team/esc",
      name: "ESC",
      description:
        lang === "fr"
          ? "Abus de mauvaises configurations ADCS : ESC1 à ESC13, Shadow Credentials."
          : "ADCS misconfiguration abuse: ESC1 to ESC13 and Shadow Credentials.",
    },
    {
      href: "/red-team/pivoting",
      name: "Pivoting",
      description:
        lang === "fr"
          ? "Techniques de pivot et tunnel dans un réseau compromis : port forwarding, SOCKS, Chisel."
          : "Pivoting and tunneling techniques in compromised networks: port forwarding, SOCKS, Chisel.",
    },
  ];

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
