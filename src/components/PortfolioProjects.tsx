"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useDeferredValue, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import type { ProjectEntry } from "@/lib/site-data";

function matchProject(query: string, project: ProjectEntry) {
  const q = query.toLowerCase();
  return (
    project.title.toLowerCase().includes(q) ||
    project.description.toLowerCase().includes(q) ||
    project.note.toLowerCase().includes(q) ||
    project.status.toLowerCase().includes(q) ||
    project.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export function PortfolioProjects({ projects }: { projects: ProjectEntry[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const deferredQuery = useDeferredValue(query);

  const filteredProjects = deferredQuery.trim()
    ? projects.filter((p) => matchProject(deferredQuery.trim(), p))
    : projects;

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setQuery(value);

    const url = new URL(window.location.href);
    if (value.trim()) {
      url.searchParams.set("q", value.trim());
    } else {
      url.searchParams.delete("q");
    }

    startTransition(() => {
      router.replace(url.pathname + url.search, { scroll: false });
    });
  }

  return (
    <>
      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/50"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={handleSearchChange}
          placeholder="Filtrer par tag, techno ou focus..."
          className="w-full rounded-sm border border-border bg-transparent py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label="Rechercher dans les projets"
        />
        {filteredProjects.length !== projects.length && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground/60">
            {filteredProjects.length}/{projects.length}
          </span>
        )}
      </div>

      {filteredProjects.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Aucun projet ne correspond à &quot;{query.trim()}&quot;.
        </p>
      ) : (
        <div className="divide-y divide-border">
          {filteredProjects.map((project) => (
            <article key={project.title} className="group py-5">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="font-mono text-primary">{project.status}</span>
                    <span>·</span>
                    <span>{project.external ? "external" : "local"}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                    {project.description}
                  </p>
                  <p className="mt-1.5 text-xs leading-6 text-muted-foreground/70 italic">
                    {project.note}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={project.href}
                  target={project.external ? "_blank" : undefined}
                  rel={project.external ? "noopener noreferrer" : undefined}
                  className="mt-0.5 shrink-0 text-muted-foreground/40 transition-colors hover:text-primary"
                  aria-label={`Ouvrir ${project.title}`}
                >
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
