"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function PivotingRoutingPage() {
  const { lang } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Pivoting</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Routing</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Catégorie mère pour les routes et rebonds internes."
            : "Parent category for internal routes and relays."}
        </p>
      </header>
      <div className="space-y-2 text-xs text-muted-foreground">
        <Link href="/red-team/pivoting/ligolo" className="block hover:text-foreground">
          - Ligolo-NG
        </Link>
      </div>
    </div>
  );
}
