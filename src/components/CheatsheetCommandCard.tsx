"use client";

import { useState } from "react";
import { Copy, CopyCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type CheatsheetCommandCardProps = {
  cmd: string;
  why: string;
  lang: "fr" | "en";
};

export function CheatsheetCommandCard({
  cmd,
  why,
  lang,
}: CheatsheetCommandCardProps) {
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    await navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <article className="rounded-sm border border-border/60 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
          {lang === "fr" ? "Copy command" : "Copy command"}
        </span>
        <button
          type="button"
          onClick={doCopy}
          className={cn(
            "inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors",
            copied ? "border-primary/60 text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {copied ? <CopyCheck className="size-3" /> : <Copy className="size-3" />}
          {copied ? (lang === "fr" ? "Copié" : "Copied") : (lang === "fr" ? "Copier" : "Copy")}
        </button>
      </div>

      <pre className="overflow-x-auto rounded-sm bg-muted/30 p-3 text-xs text-foreground">
        <code>{cmd}</code>
      </pre>

      <div className="mt-3 space-y-2 text-xs text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">{lang === "fr" ? "Description:" : "Description:"}</span>{" "}
          {why}
        </p>
      </div>
    </article>
  );
}
