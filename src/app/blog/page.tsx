"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { articles } from "@/lib/site-data";
import { useLanguage } from "@/components/LanguageProvider";

export default function BlogPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6" id="archive">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          {t.blog.eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t.blog.title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {t.blog.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>
            {articles.length} {t.common.entries}
          </span>
          <span>·</span>
          <span>C2 · AD · Tooling</span>
        </div>
      </header>

      <div className="divide-y divide-border">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group flex items-start gap-4 py-5"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                <span className="font-mono text-primary">{article.category}</span>
                <span>·</span>
                <span>{article.focus}</span>
                <span>·</span>
                <span>{article.date}</span>
              </div>
              <h2 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                {article.title}
              </h2>
              <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                {article.excerpt}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
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

      <section className="mt-10 border-t border-border pt-8" id="topics">
        <h2 className="mb-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground/50">
          {t.blog.topics}
        </h2>
        <div className="flex flex-wrap gap-2">
          {["C2 engineering", "AD & offensive paths", "Toolsmithing", "Mythic", "Bash", "Nim"].map(
            (topic) => (
              <span
                key={topic}
                className="rounded border border-border px-2.5 py-1 text-xs text-muted-foreground"
              >
                {topic}
              </span>
            )
          )}
        </div>
      </section>
    </div>
  );
}
