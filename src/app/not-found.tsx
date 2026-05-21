"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function NotFound() {
  const { lang } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <div className="overflow-hidden rounded-sm border border-border bg-card font-mono text-xs">
        <div className="flex items-center gap-2 border-b border-border bg-black/20 px-4 py-2">
          <span className="size-2.5 rounded-full bg-border/60" />
          <span className="size-2.5 rounded-full bg-border/60" />
          <span className="size-2.5 rounded-full bg-border/60" />
          <span className="ml-2 text-muted-foreground/50">bash - 404</span>
        </div>
        <div className="px-5 py-8">
          <p className="text-primary">$ cd {lang === "fr" ? "cette-page" : "this-page"}</p>
          <p className="mt-2 text-destructive">
            bash: cd: {lang === "fr" ? "cette-page" : "this-page"}:{" "}
            {lang === "fr" ? "Aucun fichier ou dossier de ce type" : "No such file or directory"}
          </p>

          <div className="mt-6 space-y-1.5">
            <p className="text-primary">$ ls ./</p>
            <div className="mt-2 space-y-1 text-muted-foreground">
              {[
                { href: "/", label: "README" },
                { href: "/writeups/htb", label: "writeups/htb/" },
                { href: "/writeups/ctf", label: "writeups/ctf/" },
                { href: "/blog", label: "blog/" },
                { href: "/red-team", label: "red-team/" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex gap-2 hover:text-primary transition-colors"
                >
                  <span className="text-primary/50">drwxr-xr-x</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-6 text-primary">
            $ {lang === "fr" ? "# retourner en arriere ?" : "# go back ?"}
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <span className="text-primary/50">$</span>
            <span>cd ~</span>
          </Link>

          <p className="mt-6 animate-pulse text-primary/50">█</p>
        </div>
      </div>
    </div>
  );
}
