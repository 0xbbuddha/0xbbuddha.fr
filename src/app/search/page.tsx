"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { searchEntries } from "@/lib/search-data";

function norm(v: string) {
  return v.toLowerCase().trim();
}

export default function SearchPage() {
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = norm(query);
    if (!q) return searchEntries.slice(0, 14);
    return searchEntries.filter((entry) => {
      const haystack = [
        entry.title,
        entry.summary,
        entry.type,
        entry.command ?? "",
        ...entry.tags,
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          {lang === "fr" ? "Recherche" : "Search"}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {lang === "fr" ? "Recherche globale" : "Global search"}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Recherche par outil, commande, tag, writeup et article."
            : "Search by tool, command, tag, writeup, and article."}
        </p>
      </header>

      <div className="mb-6 rounded-sm border border-border bg-background px-3 py-2">
        <label className="flex items-center gap-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "fr" ? "Ex: nxc smb users, adcs, pivoting..." : "Ex: nxc smb users, adcs, pivoting..."}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
          />
        </label>
      </div>

      <div className="mb-3 text-xs text-muted-foreground">
        {results.length} {lang === "fr" ? "résultats" : "results"}
      </div>

      <div className="divide-y divide-border">
        {results.map((entry) => (
          <Link key={entry.id} href={entry.href} className="group flex items-start gap-4 py-4">
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="font-mono text-xs text-primary">{entry.title}</span>
                <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground/70">
                  {entry.type}
                </span>
              </div>
              <p className="mb-1 text-xs leading-6 text-muted-foreground">{entry.summary}</p>
              {entry.command && (
                <pre className="overflow-x-auto rounded-sm bg-muted/30 p-2 text-[11px] text-foreground">
                  <code>{entry.command}</code>
                </pre>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {entry.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="rounded border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
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
