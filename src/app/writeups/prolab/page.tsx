"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prolabWriteups } from "@/lib/site-data";
import { useLanguage } from "@/components/LanguageProvider";

export default function ProLabPage() {
  const { t } = useLanguage();

  const tiers = Array.from(new Set(prolabWriteups.map((w) => w.tier ?? w.platform)));

  const byTier = tiers.map((tier) => ({
    tier,
    writeups: prolabWriteups.filter((w) => (w.tier ?? w.platform) === tier),
  }));

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6" id="prolab">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          {t.writeups.prolab.eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t.writeups.prolab.title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {t.writeups.prolab.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>
            {prolabWriteups.length} {t.common.entries}
          </span>
          <span>·</span>
          <span>HackTheBox ProLabs</span>
        </div>
      </header>

      {byTier.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.writeups.prolab.noEntries}</p>
      ) : (
        <div className="space-y-10">
          {byTier.map(({ tier, writeups: entries }) => (
            <section key={tier}>
              <h2 className="mb-4 text-[11px] font-mono uppercase tracking-widest text-muted-foreground/60">
                {tier}
              </h2>
              <div className="divide-y divide-border">
                {entries.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/writeups/${entry.slug}`}
                    className="group flex items-start gap-4 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                        <span className="font-mono text-primary">{tier}</span>
                        <span>·</span>
                        <span>{entry.focus}</span>
                        <span>·</span>
                        <span>{entry.date}</span>
                        {entry.spoiler && (
                          <>
                            <span>·</span>
                            <span className="text-primary">{t.common.protected}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        {entry.title}
                      </p>
                      <p className="mt-1 text-xs leading-6 text-muted-foreground">
                        {entry.excerpt}
                      </p>
                    </div>
                    <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
