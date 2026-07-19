"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, Github, Linkedin } from "lucide-react";
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
    "BashHound-CE": {
      description: "Active Directory collector for BloodHound Community Edition, written entirely in Bash.",
      note: "A deep dive into LDAP, ASN.1 and AD graph collection without heavy dependencies.",
      status: "AD collector",
    },
    GoFenrir: {
      description: "Active Directory enumeration and attack framework written in Go, inspired by NetExec, distributed as a single binary via Manticore.",
      note: "Portable and dependency-free - one binary to cover the essentials of AD recon.",
      status: "AD framework",
    },
    Ensh: {
      description: "Offensive network protocol library written in pure Bash - no binaries, no compilation - targeting Active Directory and red team operations.",
      note: "Replicate offensive AD network behaviors in pure Bash for contexts where compilation is not possible.",
      status: "Bash offensive lib",
    },
    "Wazuh-cli": {
      description: "CLI and live TUI dashboard for the Wazuh REST API - agent management, alerts, vulnerabilities and active responses from the terminal.",
      note: "Manage a full Wazuh environment from the command line without going through the web UI.",
      status: "SIEM CLI",
    },
    WazuhHound: {
      description: "BloodHound CE OpenGraph collector for Wazuh - maps agents, groups, cluster nodes, RBAC and OpenSearch users from the Wazuh REST API into a BloodHound-compatible graph, exposing privilege escalation paths and full infrastructure topology.",
      note: "Audit your Wazuh/OpenSearch infrastructure with Cypher queries - same BloodHound workflow as AD.",
      status: "BloodHound collector",
    },
    Aphrodite: {
      description: "Cross-platform Mythic C2 agent written in Nim, running on Linux and Windows. Hephaestus (dedicated Nim loader) receives shellcode via donut, encrypts it and injects it into a target process.",
      note: "Dedicated loader Hephaestus (https://github.com/0xbbuddha/Hephaestus) - focused on implant design and C2 protocol internals.",
      status: "Mythic agent",
    },
    Notion: {
      description: "Mythic C2 profile using the Notion API as a covert channel - Living off Trusted Sites integrated into Mythic.",
      note: "Hijacking a trusted SaaS as a C2 transport to fly under network radars.",
      status: "C2 profile",
    },
    "Chess.com": {
      description: "Mythic C2 profile using Chess.com as a covert channel - payloads encoded as FEN positions stored as PGN games, with Chrome TLS impersonation via curl_cffi.",
      note: "Encode payloads as FEN positions to hide C2 communications inside legitimate chess traffic.",
      status: "C2 profile",
    },
    PantheonLab: {
      description: "Immersive AD + Linux lab themed around Greek mythology with Ansible/Vagrant deployment.",
      note: "A reproducible playground to document realistic attack chains.",
      status: "Training lab",
    },
    Nihil: {
      description: "Full pentest lab stack with Docker images for reproducible offensive testing.",
      note: "Built to prototype fast, break fast, and rebuild cleanly.",
      status: "Pentest lab",
    },
    ArchimedeaOS: {
      description: "Arch Linux distribution focused on Purple Team operations for consistent lab and engagement workflows.",
      note: "Unified tooling baseline for offensive and defensive experimentation.",
      status: "Purple Team OS",
    },
    FreeMalwares: {
      description: "Educational C project exploring obfuscation and evasion techniques in controlled environments.",
      note: "Strictly educational research to understand mechanisms, not industrialize them.",
      status: "Maldev research",
    },
  };

  const skillSectionsFr = [
    {
      title: "Red Team",
      parts: [
        { name: "Active Directory", detail: "Enumeration, abuse paths, ADCS, élévation de privilèges, persistance." },
        { name: "Web & API", detail: "OWASP Top 10, fuzzing, analyse applicative, exploitation et post-exploitation." },
        { name: "Réseau & Infrastructure", detail: "Reconnaissance PTES, exploitation de services/protocoles, pivoting." },
        { name: "Operations", detail: "C2, OPSEC, mouvement lateral et scenarios offensifs en lab." },
      ],
    },
    {
      title: "Blue Team",
      parts: [
        { name: "Détection", detail: "Detection engineering, règles et signaux actionnables." },
        { name: "SOC/SOAR", detail: "Triage d'alertes, investigation, qualification et priorisation." },
        { name: "Défense", detail: "Hardening, réduction de surface d'attaque et remédiations." },
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

  const formation = [
    {
      key: "bacpro",
      label: "Bac Pro",
      year: null as string | null,
      sub: "SN option RISC",
      modules: [] as string[],
    },
    {
      key: "bts",
      label: "BTS",
      year: null as string | null,
      sub: "SIO option SISR",
      modules: [] as string[],
    },
    {
      key: "b3",
      label: "B3",
      year: "2024/2025",
      sub: "Oteria",
      modules: [
        "Python",
        "Bases de données",
        "Réseaux",
        "Architecture réseau",
        "Virtualisation",
        "Administration Linux",
        "Programmation en C",
      ],
    },
    {
      key: "m1",
      label: "M1",
      year: "2025/2026",
      sub: "Oteria",
      modules: [
        "Pentest Web",
        "Sécurité Windows",
        "Network Monitoring & SOC",
        "Analyse de risque / EBIOS RM",
        "Cryptographie",
        "Python for Ethical Hacking",
        "Exploitation binaire",
        "Risques juridiques & RGPD",
        "Anglais",
      ],
    },
    {
      key: "m2",
      label: "M2",
      year: "2026/2027",
      sub: lang === "fr" ? "Oteria - majeure Cybersecu Offensive" : "Oteria - Offensive Security major",
      modules: [
        "Reverse Engineering",
        "Recon Offensive",
        "Pentest réseau & infra",
        "Pentest Active Directory",
        "Pentest Cloud",
        "Pentest Web Avance",
        "Pentest Mobile",
        "Pentest OT",
        "Pentest IoT",
        "Red Teaming",
        "AI for Offensive Security",
        "Protection & remediation",
      ],
    },
  ];

  const certifications = {
    fr: [
      { name: "CRTO", status: "in coming" },
      { name: "HTB ProLab : Mythical", status: "validé · Red Team Operator I" },
      { name: "HTB ProLab : Unintended", status: "validé · Red Team Operator I" },
      { name: "HTB ProLab : Tengu", status: "validé · Red Team Operator I" },
      { name: "HTB ProLab : Dante", status: "validé · Red Team Operator I" },
    ],
    en: [
      { name: "CRTO", status: "upcoming" },
      { name: "HTB ProLab : Mythical", status: "completed · Red Team Operator I" },
      { name: "HTB ProLab : Unintended", status: "completed · Red Team Operator I" },
      { name: "HTB ProLab : Tengu", status: "completed · Red Team Operator I" },
      { name: "HTB ProLab : Dante", status: "completed · Red Team Operator I" },
    ],
  };

  const [openYear, setOpenYear] = useState<string | null>(null);

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

        {/* ── formation ── */}
        <TerminalBlock id="formation" title="cat /etc/formation.conf">
          <p className="mb-4 text-primary">$ cat /etc/formation.conf</p>
          <div className="space-y-1">
            {formation.map((year) => {
              const isOpen = openYear === year.key;
              const hasModules = year.modules.length > 0;
              return (
                <div key={year.key}>
                  <button
                    onClick={() => hasModules && setOpenYear(isOpen ? null : year.key)}
                    disabled={!hasModules}
                    className={`flex w-full items-center gap-2 py-1 text-left transition-colors ${hasModules ? "text-primary/80 hover:text-primary" : "text-primary/40 cursor-default"}`}
                  >
                    {hasModules ? (
                      <ChevronDown
                        className={`size-3.5 shrink-0 transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`}
                      />
                    ) : (
                      <span className="size-3.5 shrink-0" />
                    )}
                    <span># {year.label}</span>
                    <span className="text-muted-foreground/50 font-normal">::</span>
                    {year.year && (
                      <span className="text-muted-foreground/60 font-normal">{year.year} -</span>
                    )}
                    <span className="text-muted-foreground/60 font-normal">{year.sub}</span>
                  </button>
                  {isOpen && hasModules && (
                    <div className="ml-5 mt-1 mb-2 space-y-1 border-l border-border pl-4">
                      {year.modules.map((m) => (
                        <p key={m} className="text-muted-foreground">
                          - <span className="text-foreground">{m}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-4 animate-pulse text-primary/50">█</p>
        </TerminalBlock>

        {/* ── projects ── */}
        <TerminalBlock id="projects" title="ls ./projects/">
          <p className="mb-4 text-primary">$ ls -la ./projects/</p>
          <div className="space-y-8">
            {(["red", "blue"] as const).map((side) => {
              type Block =
                | { type: "single"; project: typeof projects[0]; index: number }
                | { type: "group"; group: string; items: Array<{ project: typeof projects[0]; index: number }> };

              const sideProjects = projects.filter((p) => p.side === side);
              const sideLabel = side === "red"
                ? (lang === "fr" ? "Red Team" : "Red Team")
                : (lang === "fr" ? "Blue Team" : "Blue Team");
              const sideColor = side === "red" ? "text-primary" : "text-blue-400";
              const sideBorder = side === "red" ? "border-primary/30" : "border-blue-400/30";
              const sideBg = side === "red" ? "bg-primary/5" : "bg-blue-400/5";

              const blocks = sideProjects.reduce<Block[]>((acc, project, i) => {
                if (project.group) {
                  const last = acc[acc.length - 1];
                  if (last?.type === "group" && last.group === project.group) {
                    last.items.push({ project, index: i });
                  } else {
                    acc.push({ type: "group", group: project.group, items: [{ project, index: i }] });
                  }
                } else {
                  acc.push({ type: "single", project, index: i });
                }
                return acc;
              }, []);

              return (
                <div key={side}>
                  <p className={`mb-4 text-xs font-semibold uppercase tracking-widest ${sideColor}/60`}>
                    # {sideLabel}
                  </p>
                  <div className="space-y-5">
                    {blocks.map((block) => {
                      if (block.type === "group") {
                        return (
                          <div key={block.group}>
                            <p className={`mb-2 ${sideColor}/50`}># {block.group}</p>
                            <div className="grid grid-cols-2 gap-3">
                              {block.items.map(({ project }) => (
                                <div key={project.title} className={`rounded border ${sideBorder} ${sideBg} p-3`}>
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <span className="font-semibold text-foreground">{project.title}</span>
                                      <span className={`ml-2 ${sideColor} text-xs`}>
                                        {lang === "fr" ? project.status : (projectEn[project.title]?.status ?? project.status)}
                                      </span>
                                    </div>
                                    <a
                                      href={project.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`shrink-0 text-muted-foreground/50 transition-colors hover:${sideColor}`}
                                    >
                                      <ArrowUpRight className="size-3.5" />
                                    </a>
                                  </div>
                                  <p className="mt-1.5 leading-5 text-foreground/80 text-xs">
                                    {lang === "fr" ? project.description : (projectEn[project.title]?.description ?? project.description)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      const { project, index } = block;
                      return (
                        <div key={project.title} className="flex gap-3">
                          <span className="mt-px shrink-0 text-muted-foreground/60">
                            [{String(index + 1).padStart(2, "0")}]
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="font-semibold text-foreground">{project.title}</span>
                              <span className="text-muted-foreground/50">#</span>
                              <span className={sideColor}>
                                {lang === "fr" ? project.status : (projectEn[project.title]?.status ?? project.status)}
                              </span>
                              <a
                                href={project.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`ml-auto shrink-0 text-muted-foreground/50 transition-colors hover:${sideColor}`}
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
                      );
                    })}
                  </div>
                </div>
              );
            })}
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

        {/* ── contributions ── */}
        <TerminalBlock id="contributions" title="cat /etc/contributions.conf">
          <p className="mb-4 text-primary">$ cat /etc/contributions.conf</p>
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-primary/80"># BlackArch Linux</p>
              <p className="leading-6 text-muted-foreground">
                - <span className="text-foreground">
                  {lang === "fr" ? "Mainteneur de paquets" : "Package maintainer"}
                </span>{" "}
                ::{" "}
                {lang === "fr"
                  ? "Mises à jour de paquets dans le dépôt officiel : evil-winrm-py, bettercap-ui."
                  : "Package version bumps in the official repository: evil-winrm-py, bettercap-ui."}
                {" "}
                <a
                  href="https://github.com/BlackArch/blackarch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary/50 transition-colors hover:text-primary"
                >
                  <ArrowUpRight className="size-3" />
                </a>
              </p>
            </div>
            <div>
              <p className="mb-1 text-primary/80"># Manticore</p>
              <p className="leading-6 text-muted-foreground">
                - <span className="text-foreground">
                  {lang === "fr" ? "Contributeur" : "Contributor"}
                </span>{" "}
                ::{" "}
                {lang === "fr"
                  ? "Librairie Go pour le tooling offensif et défensif - protocoles AD, LDAP, Kerberos, SMB."
                  : "Go library for offensive and defensive tooling - AD protocols, LDAP, Kerberos, SMB."}
                {" "}
                <a
                  href="https://github.com/TheManticoreProject/Manticore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary/50 transition-colors hover:text-primary"
                >
                  <ArrowUpRight className="size-3" />
                </a>
              </p>
            </div>
            <div>
              <p className="mb-1 text-primary/80"># Others</p>
              <p className="leading-6 text-muted-foreground">
                {lang === "fr"
                  ? "Contributeur open source actif dans l'écosystème sécurité - agents Mythic C2, tooling offensif et projets communautaires."
                  : "Active open source contributor in the security ecosystem - Mythic C2 agents, offensive tooling and community projects."}
              </p>
            </div>
          </div>
          <p className="mt-4 animate-pulse text-primary/50">█</p>
        </TerminalBlock>

      </div>
    </div>
  );
}
