"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function HpPrinterPage() {
  const { lang } = useLanguage();

  const sections = [
    {
      id: "install",
      title: lang === "fr" ? "Installation" : "Installation",
      entries: [
        {
          cmd: "sudo pacman -S hplip cups sane",
          why: lang === "fr"
            ? "Installe HPLIP (driver HP), CUPS (serveur d'impression) et SANE (scanner)."
            : "Installs HPLIP (HP driver), CUPS (print server) and SANE (scanner).",
        },
        {
          cmd: "sudo systemctl enable --now cups",
          why: lang === "fr"
            ? "Active et démarre le service CUPS immédiatement."
            : "Enables and starts the CUPS service immediately.",
        },
        {
          cmd: "hp-setup",
          why: lang === "fr"
            ? "Lance l'assistant d'installation HPLIP pour détecter et configurer l'imprimante HP."
            : "Launches the HPLIP setup wizard to detect and configure the HP printer.",
        },
      ],
    },
    {
      id: "manage",
      title: lang === "fr" ? "Gestion" : "Manage",
      entries: [
        {
          cmd: "lpstat -p -d",
          why: lang === "fr"
            ? "Liste les imprimantes disponibles et affiche l'imprimante par défaut."
            : "Lists available printers and shows the default printer.",
        },
        {
          cmd: "lp -d HP_OfficeJet_Pro_9020 'mon-fichier.pdf'",
          why: lang === "fr"
            ? "Envoie un fichier PDF à l'imprimante spécifiée. Adapter le nom d'imprimante."
            : "Sends a PDF file to the specified printer. Adapt the printer name.",
        },
        {
          cmd: "lpstat -o",
          why: lang === "fr"
            ? "Affiche les jobs d'impression en cours."
            : "Shows currently queued print jobs.",
        },
        {
          cmd: "lpoptions -d HP_OfficeJet_Pro_9020",
          why: lang === "fr"
            ? "Définit l'imprimante comme imprimante par défaut."
            : "Sets the printer as the default printer.",
        },
        {
          cmd: "cancel -a HP_OfficeJet_Pro_9020",
          why: lang === "fr"
            ? "Annule tous les jobs d'impression en cours sur cette imprimante."
            : "Cancels all queued print jobs on this printer.",
        },
        {
          cmd: "http://localhost:631",
          why: lang === "fr"
            ? "Interface web CUPS pour gérer les imprimantes, jobs et options depuis le navigateur."
            : "CUPS web interface to manage printers, jobs and options from the browser.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Arch Linux</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">HP Printer</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Configuration d'une imprimante HP avec HPLIP et CUPS sur Arch Linux."
            : "Setting up an HP printer with HPLIP and CUPS on Arch Linux."}
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
