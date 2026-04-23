"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ctfWriteups } from "@/lib/site-data";
import { useLanguage } from "@/components/LanguageProvider";

export default function CTFPage() {
  const { t } = useLanguage();

  const events = Array.from(new Set(ctfWriteups.map((w) => w.ctfEvent ?? w.platform)));

  const byEvent = events.map((event) => ({
    event,
    writeups: ctfWriteups.filter((w) => (w.ctfEvent ?? w.platform) === event),
  }));

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6" id="ctf">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          {t.writeups.ctf.eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t.writeups.ctf.title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {t.writeups.ctf.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>
            {ctfWriteups.length} {t.common.entries}
          </span>
          <span>·</span>
          <span>{events.join(" · ")}</span>
        </div>
      </header>

      {byEvent.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.writeups.ctf.noEntries}</p>
      ) : (
        <div className="space-y-10">
          {byEvent.map(({ event, writeups: entries }) => (
            <section key={event}>
              <h2 className="mb-4 text-[11px] font-mono uppercase tracking-widest text-muted-foreground/60">
                {event}
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
                        <span className="font-mono text-primary">{event}</span>
                        <span>·</span>
                        <span>{entry.focus}</span>
                        <span>·</span>
                        <span>{entry.date}</span>
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
