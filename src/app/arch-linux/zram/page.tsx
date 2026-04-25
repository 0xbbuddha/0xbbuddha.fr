"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function ZramPage() {
  const { lang } = useLanguage();

  const zramConf = `[zram0]\nzram-size = ram / 2\ncompression-algorithm = zstd\nswap-priority = 100`;

  const sections = [
    {
      id: "install",
      title: lang === "fr" ? "Installation" : "Installation",
      entries: [
        {
          cmd: "sudo pacman -S zram-generator",
          why: lang === "fr"
            ? "Installe zram-generator, le service systemd qui configure les devices zram au démarrage."
            : "Installs zram-generator, the systemd service that configures zram devices at boot.",
        },
      ],
    },
    {
      id: "config",
      title: lang === "fr" ? "Configuration" : "Configuration",
      entries: [
        {
          cmd: "sudo mkdir -p /etc/systemd/zram-generator.conf.d",
          why: lang === "fr"
            ? "Crée le répertoire de configuration de zram-generator."
            : "Creates the zram-generator configuration directory.",
        },
        {
          cmd: zramConf,
          why: lang === "fr"
            ? "Contenu du fichier /etc/systemd/zram-generator.conf.d/zram.conf. Crée un device zram de taille RAM/2, compressé avec zstd, priorité 100."
            : "Content for /etc/systemd/zram-generator.conf.d/zram.conf. Creates a zram device of size RAM/2, compressed with zstd, priority 100.",
        },
      ],
    },
    {
      id: "enable",
      title: lang === "fr" ? "Activer" : "Enable",
      entries: [
        {
          cmd: "sudo systemctl daemon-reexec",
          why: lang === "fr"
            ? "Recharge le daemon systemd pour prendre en compte le nouveau fichier de configuration."
            : "Reloads the systemd daemon to pick up the new configuration file.",
        },
        {
          cmd: "sudo systemctl start systemd-zram-setup@zram0.service",
          why: lang === "fr"
            ? "Démarre le service de setup zram pour initialiser le device zram0."
            : "Starts the zram setup service to initialize the zram0 device.",
        },
      ],
    },
    {
      id: "verify",
      title: lang === "fr" ? "Vérifier" : "Verify",
      entries: [
        {
          cmd: "swapon --show",
          why: lang === "fr"
            ? "Affiche les espaces swap actifs pour confirmer que zram0 est bien monté."
            : "Shows active swap spaces to confirm zram0 is mounted.",
        },
      ],
    },
    {
      id: "swappiness",
      title: "Swappiness",
      entries: [
        {
          cmd: `echo "vm.swappiness=120" | sudo tee /etc/sysctl.d/99-zram.conf`,
          why: lang === "fr"
            ? "Définit la swappiness à 120, valeur recommandée pour zram (favorise l'utilisation du swap compressé)."
            : "Sets swappiness to 120, the recommended value for zram (favors using compressed swap).",
        },
        {
          cmd: "sudo sysctl --system",
          why: lang === "fr"
            ? "Applique le paramètre sysctl sans redémarrer."
            : "Applies the sysctl parameter without rebooting.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Arch Linux</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Zram</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Swap compressé en RAM via zram-generator. Plus rapide que le swap disque, réduit les writes SSD."
            : "Compressed RAM swap via zram-generator. Faster than disk swap, reduces SSD writes."}
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
