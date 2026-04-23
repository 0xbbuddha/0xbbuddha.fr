"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const sheets = [
  {
    href: "/cheatsheets/netexec",
    name: "NetExec",
    description: "Énumération et exploitation SMB, WinRM, LDAP, MSSQL, RDP.",
    tags: ["SMB", "WinRM", "LDAP", "MSSQL"],
  },
  {
    href: "/cheatsheets/bloodyad",
    name: "BloodyAD",
    description: "Manipulation d'attributs Active Directory sans binaires suspects.",
    tags: ["AD", "LDAP", "Privesc"],
  },
  {
    href: "/cheatsheets/certipy",
    name: "Certipy",
    description: "Audit et exploitation d'ADCS depuis Linux : find, req, auth, ESC.",
    tags: ["ADCS", "ESC", "PKI"],
  },
];

export default function CheatsheetPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          {t.cheatsheets.eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t.cheatsheets.title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {t.cheatsheets.description}
        </p>
        <div className="mt-4 text-xs text-muted-foreground">
          {sheets.length} {t.common.entries}
        </div>
      </header>

      <div className="divide-y divide-border">
        {sheets.map((sheet) => (
          <Link
            key={sheet.href}
            href={sheet.href}
            className="group flex items-start gap-4 py-5"
          >
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 font-mono text-xs text-primary">{sheet.name}</p>
              <p className="mb-2 text-xs leading-6 text-muted-foreground">{sheet.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {sheet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
