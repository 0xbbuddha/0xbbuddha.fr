"use client";

import Image from "next/image";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { projects, skillCategories, siteProfile, socialLinks } from "@/lib/site-data";
import { useLanguage } from "@/components/LanguageProvider";

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
};

function TerminalBlock({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="overflow-hidden rounded-sm border border-border bg-card font-mono text-xs">
      <div className="flex items-center gap-2 border-b border-border bg-black/20 px-4 py-2">
        <span className="size-2.5 rounded-full bg-border/60" />
        <span className="size-2.5 rounded-full bg-border/60" />
        <span className="size-2.5 rounded-full bg-border/60" />
        <span className="ml-2 text-muted-foreground/50">bash — {title}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export default function HomePage() {
  const { t } = useLanguage();

  const whoami = [
    { key: "handle",    value: siteProfile.handle,        accent: true },
    { key: "role",      value: siteProfile.currentRole },
    { key: "study",     value: siteProfile.currentStudy },
    { key: "territory", value: siteProfile.territory },
    { key: "focus",     value: siteProfile.focus.join("  ·  ") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">

      {/* ── Profile header ── */}
      <div className="mb-8 flex items-center gap-5 border-b border-border pb-8" id="overview">
        <Image
          src="/avatar_rounded.png"
          alt="0xbbuddha"
          width={72}
          height={72}
          className="shrink-0 rounded-md"
          priority
        />
        <div className="min-w-0">
          <p className="mb-1 text-[10px] font-mono uppercase tracking-widest text-primary">
            {t.home.eyebrow}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {siteProfile.handle}
          </h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {siteProfile.currentRole} · {siteProfile.currentStudy}
          </p>
          <div className="mt-3 flex gap-4">
            {socialLinks.map((link) => {
              const Icon = SOCIAL_ICONS[link.kind];
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  {Icon && <Icon className="size-3.5" />}
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">

        {/* ── whoami ── */}
        <TerminalBlock id="whoami" title="whoami">
          <p className="mb-3 text-primary">$ cat /etc/profile.d/0xbbuddha.sh</p>
          <div className="space-y-1.5">
            {whoami.map(({ key, value, accent }) => (
              <div key={key} className="flex gap-3">
                <span className="w-20 shrink-0 text-muted-foreground">{key}</span>
                <span className="text-muted-foreground/50">::</span>
                <span className={accent ? "font-semibold text-primary" : "text-foreground"}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 leading-6 text-foreground/80">{siteProfile.intro}</p>
          <p className="mt-3 animate-pulse text-primary/50">█</p>
        </TerminalBlock>

        {/* ── projects ── */}
        <TerminalBlock id="projects" title="ls ./projects/">
          <p className="mb-4 text-primary">$ ls -la ./projects/</p>
          <div className="space-y-5">
            {projects.map((project, i) => (
              <div key={project.title} className="flex gap-3">
                <span className="mt-px shrink-0 text-muted-foreground/60">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-foreground">{project.title}</span>
                    <span className="text-muted-foreground/50">#</span>
                    <span className="text-primary">{project.status}</span>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto shrink-0 text-muted-foreground/50 transition-colors hover:text-primary"
                      aria-label={`Ouvrir ${project.title}`}
                    >
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {project.tags.join("  ·  ")}
                  </p>
                  <p className="mt-1.5 leading-5 text-foreground/85">{project.description}</p>
                  <p className="mt-1 italic leading-5 text-muted-foreground">{project.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 animate-pulse text-primary/50">█</p>
        </TerminalBlock>

        {/* ── skills ── */}
        <TerminalBlock id="skills" title="cat /etc/skills.conf">
          <p className="mb-4 text-primary">$ cat /etc/skills.conf</p>
          <div className="space-y-4">
            {skillCategories.map((cat) => (
              <div key={cat.title}>
                <p className="mb-1 text-primary/80"># {cat.title}</p>
                <p className="leading-6 text-foreground/85">{cat.items.join("  ·  ")}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 animate-pulse text-primary/50">█</p>
        </TerminalBlock>

      </div>
    </div>
  );
}
