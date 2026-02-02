"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface RevealFlagBlockProps {
  title?: string;
  result?: boolean;
  children: string;
}

export function RevealFlagBlock({ title, result, children }: RevealFlagBlockProps) {
  const [revealed, setRevealed] = useState(false);
  const label = result ? "Résultat" : title;

  return (
    <div className="my-4">
      {label && (
        <p
          className={`mb-1 text-xs font-mono ${result ? "text-primary" : "text-muted-foreground"}`}
        >
          {label}
        </p>
      )}
      <pre
        className="overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-sm text-muted-foreground cursor-pointer select-none hover:border-primary/30 transition-colors"
        onClick={() => setRevealed((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setRevealed((v) => !v);
          }
        }}
        aria-label={revealed ? "Masquer le flag" : "Afficher le flag"}
      >
        <code className="whitespace-pre block">
          {revealed ? (
            <>
              {children}
              <span className="mt-2 block text-xs opacity-70 flex items-center gap-1">
                <EyeOff className="size-3.5" />
                Cliquer pour masquer
              </span>
            </>
          ) : (
            <span className="flex items-center gap-2">
              <span className="tracking-widest">••••••••••••••••••••••••••••••••</span>
              <span className="text-xs opacity-70 flex items-center gap-1">
                <Eye className="size-3.5" />
                Cliquer pour afficher
              </span>
            </span>
          )}
        </code>
      </pre>
    </div>
  );
}
