"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function BashHoundCEPage() {
  const { lang } = useLanguage();
  const translateWhy = (text: string) => {
    if (lang === "fr") return text;
    const map: Record<string, string> = {
      "Recupere la release tar.gz, extrait les fichiers et rend le binaire executable.":
        "Downloads the tar.gz release, extracts files, and makes the binary executable.",
      "Alternative en ZIP si tu preferes ce format d'archive.":
        "ZIP alternative if you prefer this archive format.",
      "Installation directe via AUR sur Arch Linux.":
        "Direct installation through AUR on Arch Linux.",
      "Affiche l'aide complete et verifie que le binaire est fonctionnel.":
        "Shows full help and verifies the binary works.",
      "Affiche la version installee de BashHound-CE.":
        "Displays installed BashHound-CE version.",
      "Syntaxe generale du collecteur.":
        "General collector syntax.",
      "Le domaine AD est obligatoire pour lancer la collecte.":
        "AD domain is required to start collection.",
      "Authentification LDAP standard avec identifiants explicites.":
        "Standard LDAP authentication with explicit credentials.",
      "Force un DC/FQDN LDAP specifique au lieu de l'auto-decouverte.":
        "Forces a specific LDAP DC/FQDN instead of auto-discovery.",
      "Definit le nom du fichier JSON de sortie.":
        "Sets output JSON filename.",
      "Genere le ZIP puis supprime les JSON pour reduire les traces locales.":
        "Creates ZIP then removes JSON files to reduce local artifacts.",
      "Force LDAP en clair sur le port 389.":
        "Forces plain LDAP on port 389.",
      "Active LDAPS/TLS (equivalent a `--port 636`).":
        "Enables LDAPS/TLS (equivalent to `--port 636`).",
      "Force explicitement l'absence de TLS meme sur 636 (cas de labo/legacy).":
        "Explicitly disables TLS even on 636 (lab/legacy cases).",
      "Mode verbeux pour suivre toutes les etapes de collecte.":
        "Verbose mode to follow all collection steps.",
      "Affiche l'aide courte sans lancer de collecte.":
        "Shows short help without starting collection.",
      "Collecte complete BloodHound CE (methode par defaut).":
        "Full BloodHound CE collection (default method).",
      "Collecte centree DC, sans collecte de sessions.":
        "DC-focused collection without session collection.",
      "Recupere uniquement les sessions utilisateurs.":
        "Collects user sessions only.",
      "Collecte uniquement les relations de confiance AD.":
        "Collects AD trust relationships only.",
      "Collecte uniquement les ACLs pour analyse des abuse paths.":
        "Collects ACLs only for abuse path analysis.",
      "Collecte les memberships de groupes AD uniquement.":
        "Collects AD group memberships only.",
    };
    return map[text] ?? text;
  };
  type CommandItem = {
    cmd: string;
    why: string;
  };

  type CommandSection = {
    title: string;
    groupId?: string;
    commands: CommandItem[];
  };

  const installation: CommandSection = {
    title: "Installation",
    commands: [
      {
        cmd: "curl -LO https://github.com/0xbbuddha/BashHound-CE/releases/download/r40.521ddae/bashhound-ce.tar.gz\ntar -xzf bashhound-ce.tar.gz\ncd bashhound-ce\nchmod +x bashhound-ce",
        why: "Recupere la release tar.gz, extrait les fichiers et rend le binaire executable.",
      },
      {
        cmd: "curl -LO https://github.com/0xbbuddha/BashHound-CE/releases/download/r40.521ddae/bashhound-ce.zip\nunzip bashhound-ce.zip\ncd bashhound-ce\nchmod +x bashhound-ce",
        why: "Alternative en ZIP si tu preferes ce format d'archive.",
      },
      {
        cmd: "yay -S bashhound-ce-git",
        why: "Installation directe via AUR sur Arch Linux.",
      },
    ],
  };

  const basics: CommandSection = {
    title: "Verify + Syntax",
    commands: [
      { cmd: "./bashhound-ce --help", why: "Affiche l'aide complete et verifie que le binaire est fonctionnel." },
      { cmd: "./bashhound-ce -V", why: "Affiche la version installee de BashHound-CE." },
      { cmd: "./bashhound-ce [options]", why: "Syntaxe generale du collecteur." },
    ],
  };

  const sections: CommandSection[] = [
    {
      title: "Mandatory",
      groupId: "mandatory",
      commands: [
        {
          cmd: "./bashhound-ce -d domain.local",
          why: "Le domaine AD est obligatoire pour lancer la collecte.",
        },
      ],
    },
    {
      title: "Optional - Auth & Target",
      groupId: "optional",
      commands: [
        {
          cmd: "./bashhound-ce -d domain.local -u USERNAME -p PASSWORD",
          why: "Authentification LDAP standard avec identifiants explicites.",
        },
        {
          cmd: "./bashhound-ce -d domain.local -u USERNAME -p PASSWORD -f dc01.domain.local",
          why: "Force un DC/FQDN LDAP specifique au lieu de l'auto-decouverte.",
        },
      ],
    },
    {
      title: "Optional - Output",
      commands: [
        {
          cmd: "./bashhound-ce -d domain.local -o bloodhound_custom.json",
          why: "Definit le nom du fichier JSON de sortie.",
        },
        {
          cmd: "./bashhound-ce -d domain.local -o bloodhound_custom.json --zip-only",
          why: "Genere le ZIP puis supprime les JSON pour reduire les traces locales.",
        },
      ],
    },
    {
      title: "Optional - Transport LDAP/LDAPS",
      commands: [
        {
          cmd: "./bashhound-ce -d domain.local --port 389",
          why: "Force LDAP en clair sur le port 389.",
        },
        {
          cmd: "./bashhound-ce -d domain.local --ldaps",
          why: "Active LDAPS/TLS (equivalent a `--port 636`).",
        },
        {
          cmd: "./bashhound-ce -d domain.local --port 636 --no-tls",
          why: "Force explicitement l'absence de TLS meme sur 636 (cas de labo/legacy).",
        },
      ],
    },
    {
      title: "Optional - Runtime",
      commands: [
        {
          cmd: "./bashhound-ce -d domain.local -v",
          why: "Mode verbeux pour suivre toutes les etapes de collecte.",
        },
        {
          cmd: "./bashhound-ce -d domain.local -h",
          why: "Affiche l'aide courte sans lancer de collecte.",
        },
      ],
    },
    {
      title: "Collection Methods - All",
      groupId: "collection",
      commands: [
        {
          cmd: "./bashhound-ce -d domain.local -u USERNAME -p PASSWORD -c All",
          why: "Collecte complete BloodHound CE (methode par defaut).",
        },
      ],
    },
    {
      title: "Collection Methods - DCOnly",
      commands: [
        {
          cmd: "./bashhound-ce -d domain.local -u USERNAME -p PASSWORD -c DCOnly",
          why: "Collecte centree DC, sans collecte de sessions.",
        },
      ],
    },
    {
      title: "Collection Methods - Session",
      commands: [
        {
          cmd: "./bashhound-ce -d domain.local -u USERNAME -p PASSWORD -c Session",
          why: "Recupere uniquement les sessions utilisateurs.",
        },
      ],
    },
    {
      title: "Collection Methods - Trusts",
      commands: [
        {
          cmd: "./bashhound-ce -d domain.local -u USERNAME -p PASSWORD -c Trusts",
          why: "Collecte uniquement les relations de confiance AD.",
        },
      ],
    },
    {
      title: "Collection Methods - ACL",
      commands: [
        {
          cmd: "./bashhound-ce -d domain.local -u USERNAME -p PASSWORD -c ACL",
          why: "Collecte uniquement les ACLs pour analyse des abuse paths.",
        },
      ],
    },
    {
      title: "Collection Methods - Group",
      commands: [
        {
          cmd: "./bashhound-ce -d domain.local -u USERNAME -p PASSWORD -c Group",
          why: "Collecte les memberships de groupes AD uniquement.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          My Tools
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          BashHound-CE
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Cheatsheet complete de `bashhound-ce` avec toutes les options du help, classees par section et expliquees."
            : "Complete `bashhound-ce` cheatsheet with help options grouped by sections and explained."}
        </p>
      </header>

      <section id="install" className="mb-6 rounded-sm border border-border p-5">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">{installation.title}</h2>
        <div className="space-y-4">
          {installation.commands.map((item) => (
            <article key={item.cmd} className="rounded-sm border border-border/60 p-3">
              <pre className="overflow-x-auto rounded-sm bg-muted/30 p-3 text-xs text-foreground">
                <code>{item.cmd}</code>
              </pre>
              <p className="mt-2 text-xs text-muted-foreground">{translateWhy(item.why)}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="syntax" className="mb-6 rounded-sm border border-border p-5">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">{basics.title}</h2>
        <div className="space-y-4">
          {basics.commands.map((item) => (
            <article key={item.cmd} className="rounded-sm border border-border/60 p-3">
              <pre className="overflow-x-auto rounded-sm bg-muted/30 p-3 text-xs text-foreground">
                <code>{item.cmd}</code>
              </pre>
              <p className="mt-2 text-xs text-muted-foreground">{translateWhy(item.why)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {sections.map((section) => (
          <article key={section.title} id={section.groupId} className="rounded-sm border border-border p-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">{section.title}</h2>
            <div className="mt-3 space-y-4">
              {section.commands.map((item) => (
                <article key={item.cmd} className="rounded-sm border border-border/60 p-3">
                  <pre className="overflow-x-auto rounded-sm bg-muted/30 p-3 text-xs text-foreground">
                    <code>{item.cmd}</code>
                  </pre>
                  <p className="mt-2 text-xs text-muted-foreground">{translateWhy(item.why)}</p>
                </article>
              ))}
            </div>
          </article>
        ))}
      </section>

      <div className="mt-6 text-xs text-muted-foreground/80">
        {lang === "fr"
          ? "Variables a remplacer : `domain.local`, `USERNAME`, `PASSWORD`, `dc01.domain.local`."
          : "Replace these variables: `domain.local`, `USERNAME`, `PASSWORD`, `dc01.domain.local`."}
      </div>
    </div>
  );
}
