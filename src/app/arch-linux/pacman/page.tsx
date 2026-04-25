"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function PacmanPage() {
  const { lang } = useLanguage();

  const paccacheHook =
`[Trigger]
Operation = Upgrade
Operation = Install
Operation = Remove
Type = Package
Target = *

[Action]
Description = Nettoyage du cache pacman...
When = PostTransaction
Exec = /usr/bin/paccache -rk2`;

  const orphansHook =
`[Trigger]
Operation = Remove
Operation = Install
Operation = Upgrade
Type = Package
Target = *

[Action]
Description = Removing orphaned packages...
When = PostTransaction
Exec = /bin/sh -c 'pacman -Qdtq || echo "No orphans found."'`;

  const listPackagesHook =
`[Trigger]
Operation = Install
Operation = Remove
Type = Package
Target = *

[Action]
Description = Sauvegarde de la liste des paquets installés...
When = PostTransaction
Exec = /bin/sh -c '/usr/bin/pacman -Qqe > /home/TON_NOM_UTILISATEUR/.pkglist.txt'`;

  const pacnewHook =
`[Trigger]
Operation = Upgrade
Type = Package
Target = *

[Action]
Description = Recherche de fichiers .pacnew...
When = PostTransaction
Exec = /usr/bin/bash -c 'pacnews=$(find /etc -regextype posix-extended -regex ".+\\.pacnew$"); if [[ -n "$pacnews" ]]; then echo -e "\\n\\033[1;31m!!! FICHIERS .PACNEW DÉTECTÉS !!!\\033[0m"; echo "$pacnews"; echo -e "Pense à utiliser \\033[1;33mpacdiff\\033[0m pour les fusionner.\\n"; fi'`;

  const archAuditHook =
`[Trigger]
Operation = Install
Operation = Upgrade
Type = Package
Target = *

[Action]
Description = Audit de sécurité (Vulnérabilités CVE)...
When = PostTransaction
Exec = /usr/bin/arch-audit`;

  const sections = [
    {
      id: "export",
      title: lang === "fr" ? "Export de paquets" : "Package export",
      entries: [
        {
          cmd: "pacman -Qqe > packages.txt",
          why: lang === "fr"
            ? "Génère une liste des paquets installés explicitement. Utile avant une réinstallation pour tout retrouver."
            : "Generates a list of explicitly installed packages. Useful before a reinstall to recover everything.",
        },
      ],
    },
    {
      id: "hooks-setup",
      title: lang === "fr" ? "Préparation des hooks" : "Hooks setup",
      entries: [
        {
          cmd: "sudo pacman -S pacman-contrib",
          why: lang === "fr"
            ? "Installe paccache et les outils complémentaires pacman."
            : "Installs paccache and complementary pacman tools.",
        },
        {
          cmd: "sudo mkdir -p /etc/pacman.d/hooks",
          why: lang === "fr"
            ? "Crée le répertoire qui contient les hooks pacman. Les hooks s'exécutent automatiquement lors des transactions."
            : "Creates the directory that holds pacman hooks. Hooks run automatically during transactions.",
        },
      ],
    },
    {
      id: "paccache",
      title: "Paccache",
      entries: [
        {
          cmd: "sudo nano /etc/pacman.d/hooks/paccache.hook",
          why: lang === "fr"
            ? "Crée le fichier hook paccache."
            : "Creates the paccache hook file.",
        },
        {
          cmd: paccacheHook,
          why: lang === "fr"
            ? "Contenu du fichier. Nettoie le cache après chaque opération et garde les 2 dernières versions de chaque paquet."
            : "File content. Cleans the cache after each operation and keeps the last 2 versions of each package.",
        },
      ],
    },
    {
      id: "orphans",
      title: "Orphans",
      entries: [
        {
          cmd: "sudo nano /etc/pacman.d/hooks/remove-orphans.hook",
          why: lang === "fr"
            ? "Crée le fichier hook de détection des paquets orphelins."
            : "Creates the orphan detection hook file.",
        },
        {
          cmd: orphansHook,
          why: lang === "fr"
            ? "Contenu du fichier. Liste les paquets orphelins après chaque transaction pour les repérer rapidement."
            : "File content. Lists orphan packages after each transaction for quick identification.",
        },
      ],
    },
    {
      id: "list-packages",
      title: "List Packages",
      entries: [
        {
          cmd: "sudo nano /etc/pacman.d/hooks/list-packages.hook",
          why: lang === "fr"
            ? "Crée le fichier hook de sauvegarde de la liste des paquets. Adapter TON_NOM_UTILISATEUR."
            : "Creates the package list backup hook file. Replace TON_NOM_UTILISATEUR with your username.",
        },
        {
          cmd: listPackagesHook,
          why: lang === "fr"
            ? "Contenu du fichier. Sauvegarde la liste des paquets installés dans ~/.pkglist.txt après chaque install ou remove."
            : "File content. Backs up the installed package list to ~/.pkglist.txt after each install or remove.",
        },
      ],
    },
    {
      id: "pacnew",
      title: "Pacnew",
      entries: [
        {
          cmd: "sudo nano /etc/pacman.d/hooks/pacnew-check.hook",
          why: lang === "fr"
            ? "Crée le fichier hook de détection des fichiers .pacnew."
            : "Creates the .pacnew file detection hook.",
        },
        {
          cmd: pacnewHook,
          why: lang === "fr"
            ? "Contenu du fichier. Alerte en rouge après chaque mise à jour si des fichiers .pacnew ont été générés. Utiliser pacdiff pour les fusionner."
            : "File content. Alerts in red after each upgrade if .pacnew files were generated. Use pacdiff to merge them.",
        },
      ],
    },
    {
      id: "arch-audit",
      title: "Arch-Audit",
      entries: [
        {
          cmd: "sudo pacman -S arch-audit",
          why: lang === "fr"
            ? "Installe arch-audit, l'outil de vérification des CVEs pour les paquets installés."
            : "Installs arch-audit, the CVE checker for installed packages.",
        },
        {
          cmd: "sudo nano /etc/pacman.d/hooks/arch-audit.hook",
          why: lang === "fr"
            ? "Crée le fichier hook d'audit de sécurité."
            : "Creates the security audit hook file.",
        },
        {
          cmd: archAuditHook,
          why: lang === "fr"
            ? "Contenu du fichier. Lance un audit CVE après chaque installation ou mise à jour de paquet."
            : "File content. Runs a CVE audit after each package install or upgrade.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Arch Linux</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Pacman</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Gestion des paquets Arch Linux : export de liste et hooks pacman automatiques."
            : "Arch Linux package management: list export and automatic pacman hooks."}
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-10">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">
            {section.title}
          </h2>
          <div className="space-y-4">
            {section.entries.map((entry, i) => (
              <CheatsheetCommandCard key={i} cmd={entry.cmd} why={entry.why} lang={lang} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
