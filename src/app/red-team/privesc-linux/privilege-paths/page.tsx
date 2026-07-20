"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function PrivescLinuxPrivilegePathsPage() {
  const { lang } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Privesc Linux</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Privilege Paths</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Catégorie mère qui regroupe les chemins d'escalade de privilèges."
            : "Parent category that groups privilege escalation paths."}
        </p>
      </header>
      <div className="space-y-2 text-xs text-muted-foreground">
        <Link href="/red-team/privesc-linux/sudo-suid" className="block hover:text-foreground">
          - Sudo & SUID
        </Link>
        <Link href="/red-team/privesc-linux/capabilities-cron" className="block hover:text-foreground">
          - Capabilities & Cron
        </Link>
        <Link href="/red-team/privesc-linux/docker-privesc" className="block hover:text-foreground">
          - Docker
        </Link>
      </div>
    </div>
  );
}
