"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function ArchLinuxPage() {
  const { lang, t } = useLanguage();

  const items = [
    {
      href: "/arch-linux/pacman",
      name: "Pacman",
      description: lang === "fr"
        ? "Gestion des paquets, export et hooks automatiques."
        : "Package management, export and automatic hooks.",
    },
    {
      href: "/arch-linux/zram",
      name: "Zram",
      description: lang === "fr"
        ? "Swap compressé en RAM avec zram-generator et zstd."
        : "Compressed swap in RAM with zram-generator and zstd.",
    },
    {
      href: "/arch-linux/grub-rescue",
      name: "GRUB Rescue",
      description: lang === "fr"
        ? "Réparer GRUB quand Windows écrase l'entrée EFI."
        : "Repair GRUB when Windows wipes the EFI entry.",
    },
    {
      href: "/arch-linux/kernel-recovery",
      name: "Kernel Recovery",
      description: lang === "fr"
        ? "Recovery depuis un live USB après une mise à jour qui casse le boot."
        : "Recovery from a live USB after an update that breaks boot.",
    },
    {
      href: "/arch-linux/hp-printer",
      name: "HP Printer",
      description: lang === "fr"
        ? "Configurer une imprimante HP avec HPLIP et CUPS."
        : "Set up an HP printer with HPLIP and CUPS.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Arch Linux Notes</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Arch Linux Notes</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Notes de configuration et de maintenance pour Arch Linux."
            : "Configuration and maintenance notes for Arch Linux."}
        </p>
        <div className="mt-4 text-xs text-muted-foreground">{items.length} {t.common.entries}</div>
      </header>
      <div className="divide-y divide-border">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="group flex items-start gap-4 py-5">
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 font-mono text-xs text-primary">{item.name}</p>
              <p className="text-xs leading-6 text-muted-foreground">{item.description}</p>
            </div>
            <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
