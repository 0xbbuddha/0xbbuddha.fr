"use client";

import Image from "next/image";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { projects, siteProfile, socialLinks } from "@/lib/site-data";
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
        <span className="ml-2 text-muted-foreground/50">bash - {title}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export default function HomePage() {
  const { lang, t } = useLanguage();

  const localizedProfile = {
    role: lang === "fr" ? siteProfile.currentRole : "SOC Engineer @ Aukfood",
    study: lang === "fr" ? siteProfile.currentStudy : "Cybersecurity MSc @ Oteria",
    territory: lang === "fr" ? siteProfile.territory : "France",
    focus:
      lang === "fr"
        ? siteProfile.focus.join("  ·  ")
        : ["Red / Purple Team tooling", "SOC & detection", "Active Directory", "Labs & writeups"].join("  ·  "),
    intro:
      lang === "fr"
        ? siteProfile.intro
        : "Cybersecurity MSc student at Oteria and SOC Engineer apprentice at Aukfood. I use this place to document projects, field notes, and what I learn while building tools.",
  };

  const projectEn: Record<string, { description: string; note: string; status: string }> = {
    ArchimedeaOS: {
      description: "Arch Linux distribution focused on Purple Team operations for consistent lab and engagement workflows.",
      note: "Unified tooling baseline for offensive and defensive experimentation.",
      status: "System build",
    },
    Nihil: {
      description: "Full pentest lab stack with Docker images for reproducible offensive testing.",
      note: "Built to prototype fast, break fast, and rebuild cleanly.",
      status: "Lab stack",
    },
    "BashHound-CE": {
      description: "Active Directory collector for BloodHound Community Edition, written entirely in Bash.",
      note: "A deep dive into LDAP, ASN.1 and AD graph collection without heavy dependencies.",
      status: "Open source",
    },
    Hermes: {
      description: "Linux Mythic C2 agent in Python with check-in, tasking and operator control primitives.",
      note: "Built to understand implant internals and C2 protocol behavior.",
      status: "C2 agent",
    },
    PantheonLab: {
      description: "Immersive AD + Linux lab themed around Greek mythology with Ansible/Vagrant deployment.",
      note: "A reproducible playground to document realistic attack chains.",
      status: "Training lab",
    },
    FreeMalwares: {
      description: "Educational C project exploring obfuscation and evasion techniques in controlled environments.",
      note: "Strictly educational research to understand mechanisms, not industrialize them.",
      status: "Research",
    },
  };

  const skillSectionsFr = [
    {
      title: "Red Team",
      parts: [
        { name: "Active Directory", detail: "Enumeration, abuse paths, ADCS, elevation de privileges, persistance." },
        { name: "Web & API", detail: "OWASP Top 10, fuzzing, analyse applicative, exploitation et post-exploitation." },
        { name: "Reseau & Infrastructure", detail: "Reconnaissance PTES, exploitation de services/protocoles, pivoting." },
        { name: "Operations", detail: "C2, OPSEC, mouvement lateral et scenarios offensifs en lab." },
      ],
    },
    {
      title: "Blue Team",
      parts: [
        { name: "Detection", detail: "Detection engineering, regles et signaux actionnables." },
        { name: "SOC/SOAR", detail: "Triage d'alertes, investigation, qualification et priorisation." },
        { name: "Defense", detail: "Hardening, reduction de surface d'attaque et remediations." },
      ],
    },
    {
      title: "Tooling",
      parts: [
        { name: "Languages", detail: "Python  ·  Bash  ·  Go  ·  C  ·  PowerShell  ·  ASM  ·  Git" },
      ],
    },
  ];

  const skillSectionsEn = [
    {
      title: "Red Team",
      parts: [
        { name: "Active Directory", detail: "Enumeration, abuse paths, ADCS, privilege escalation, and persistence." },
        { name: "Web & API", detail: "OWASP Top 10, fuzzing, application introspection, exploitation, and post-exploitation." },
        { name: "Network & Infrastructure", detail: "PTES reconnaissance, service/protocol exploitation, and pivoting." },
        { name: "Operations", detail: "C2, OPSEC, lateral movement, and offensive lab scenarios." },
      ],
    },
    {
      title: "Blue Team",
      parts: [
        { name: "Detection", detail: "Detection engineering, rules, and actionable signals." },
        { name: "SOC/SOAR", detail: "Alert triage, investigation, qualification, and prioritization." },
        { name: "Defense", detail: "Hardening, attack surface reduction, and remediation." },
      ],
    },
    {
      title: "Tooling",
      parts: [
        { name: "Languages", detail: "Python  ·  Bash  ·  Go  ·  C  ·  PowerShell  ·  ASM  ·  Git" },
      ],
    },
  ];

  const certifications = {
    fr: [
      { name: "CRTO", status: "in coming" },
    ],
    en: [
      { name: "CRTO", status: "upcoming" },
    ],
  };

  const whoami = [
    { key: "handle",    value: siteProfile.handle,        accent: true },
    { key: "role",      value: localizedProfile.role },
    { key: "study",     value: localizedProfile.study },
    { key: "territory", value: localizedProfile.territory },
    { key: "focus",     value: localizedProfile.focus },
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
            {localizedProfile.role} · {localizedProfile.study}
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
          <p className="mt-4 leading-6 text-foreground/80">{localizedProfile.intro}</p>
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
                    <span className="text-primary">
                      {lang === "fr" ? project.status : (projectEn[project.title]?.status ?? project.status)}
                    </span>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto shrink-0 text-muted-foreground/50 transition-colors hover:text-primary"
                      aria-label={lang === "fr" ? `Ouvrir ${project.title}` : `Open ${project.title}`}
                    >
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {project.tags.join("  ·  ")}
                  </p>
                  <p className="mt-1.5 leading-5 text-foreground/85">
                    {lang === "fr" ? project.description : (projectEn[project.title]?.description ?? project.description)}
                  </p>
                  <p className="mt-1 italic leading-5 text-muted-foreground">
                    {lang === "fr" ? project.note : (projectEn[project.title]?.note ?? project.note)}
                  </p>
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
            {(lang === "fr" ? skillSectionsFr : skillSectionsEn).map((section) => (
              <div key={section.title}>
                <p className="mb-1 text-primary/80"># {section.title}</p>
                <div className="space-y-1.5">
                  {section.parts.map((part) => (
                    <p key={`${section.title}-${part.name}`} className="leading-6 text-muted-foreground">
                      - <span className="text-foreground">{part.name}</span> :: {part.detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 animate-pulse text-primary/50">█</p>
        </TerminalBlock>

        {/* ── certifications ── */}
        <TerminalBlock id="certifications" title="cat /etc/certifications.conf">
          <p className="mb-4 text-primary">$ cat /etc/certifications.conf</p>
          <div className="space-y-1.5 text-muted-foreground">
            {(lang === "fr" ? certifications.fr : certifications.en).map((cert) => (
              <p key={cert.name}>
                - <span className="text-foreground">{cert.name}</span> :: {cert.status}
              </p>
            ))}
          </div>
          <p className="mt-4 animate-pulse text-primary/50">█</p>
        </TerminalBlock>

      </div>
    </div>
  );
}
