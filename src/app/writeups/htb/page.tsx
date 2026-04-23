"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { htbWriteups, type HTBDifficulty, type MachineOS } from "@/lib/site-data";
import { useLanguage } from "@/components/LanguageProvider";

const DIFFICULTIES: HTBDifficulty[] = ["Easy", "Medium", "Hard", "Insane"];
const OS_ORDER: MachineOS[] = ["Linux", "Windows"];

export default function HTBPage() {
  const { t } = useLanguage();

  const byDifficulty = DIFFICULTIES.map((diff) => ({
    diff,
    byOS: OS_ORDER.map((os) => ({
      os,
      machines: htbWriteups.filter((w) => w.difficulty === diff && w.os === os),
    })).filter((g) => g.machines.length > 0),
  })).filter((g) => g.byOS.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          {t.writeups.htb.eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t.writeups.htb.title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {t.writeups.htb.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>
            {htbWriteups.length} {t.common.entries}
          </span>
          <span>·</span>
          <span>HackTheBox</span>
        </div>
      </header>

      {byDifficulty.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.writeups.htb.noEntries}</p>
      ) : (
        <div className="space-y-10">
          {byDifficulty.map(({ diff, byOS }) => (
            <section key={diff} id={diff.toLowerCase()}>
              <h2 className="mb-4 text-[11px] font-mono uppercase tracking-widest text-muted-foreground/60">
                {diff}
              </h2>
              <div className="space-y-6">
                {byOS.map(({ os, machines }) => (
                  <div key={os}>
                    <h3 className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                      {os}
                    </h3>
                    <div className="divide-y divide-border">
                      {machines.map((entry) => (
                        <Link
                          key={entry.slug}
                          href={`/writeups/${entry.slug}`}
                          className="group flex items-start gap-4 py-4"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                              <span className="font-mono text-primary">{diff}</span>
                              <span>·</span>
                              <span>{os}</span>
                              <span>·</span>
                              <span>{entry.focus}</span>
                              <span>·</span>
                              <span>{entry.date}</span>
                              {entry.spoiler && (
                                <>
                                  <span>·</span>
                                  <span className="text-primary">protégé</span>
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
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
