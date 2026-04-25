"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function GrubRescuePage() {
  const { lang } = useLanguage();

  const reinstallUefi =
`# UEFI
sudo grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
sudo grub-mkconfig -o /boot/grub/grub.cfg

# BIOS/Legacy
sudo grub-install /dev/sdX
sudo grub-mkconfig -o /boot/grub/grub.cfg`;

  const sections = [
    {
      id: "find-partition",
      title: lang === "fr" ? "Trouver la partition" : "Find partition",
      note: lang === "fr"
        ? "Depuis le prompt grub rescue>"
        : "From the grub rescue> prompt",
      entries: [
        {
          cmd: "ls",
          why: lang === "fr"
            ? "Liste les disques et partitions détectés par GRUB (ex: (hd0), (hd1,gpt1)...)."
            : "Lists disks and partitions detected by GRUB (e.g. (hd0), (hd1,gpt1)...).",
        },
        {
          cmd: "ls (hd1,gpt5)/",
          why: lang === "fr"
            ? "Vérifie le contenu d'une partition. Adapter hd1,gpt5 selon la sortie de ls."
            : "Checks partition content. Adapt hd1,gpt5 based on the ls output.",
        },
        {
          cmd: "ls (hd1,gpt5)/boot/grub",
          why: lang === "fr"
            ? "Confirme que /boot/grub existe sur cette partition. Si oui, c'est la bonne."
            : "Confirms /boot/grub exists on this partition. If yes, this is the right one.",
        },
      ],
    },
    {
      id: "load-grub",
      title: lang === "fr" ? "Charger GRUB" : "Load GRUB",
      note: lang === "fr"
        ? "Depuis le prompt grub rescue> - adapter hd1,gpt5 selon votre partition"
        : "From the grub rescue> prompt - adapt hd1,gpt5 to your partition",
      entries: [
        {
          cmd: "set prefix=(hd1,gpt5)/boot/grub",
          why: lang === "fr"
            ? "Indique à GRUB rescue où se trouve le répertoire grub."
            : "Tells GRUB rescue where the grub directory is located.",
        },
        {
          cmd: "set root=(hd1,gpt5)",
          why: lang === "fr"
            ? "Définit la partition racine pour GRUB."
            : "Sets the root partition for GRUB.",
        },
        {
          cmd: "insmod normal",
          why: lang === "fr"
            ? "Charge le module normal de GRUB."
            : "Loads the GRUB normal module.",
        },
        {
          cmd: "normal",
          why: lang === "fr"
            ? "Lance GRUB en mode normal pour afficher le menu et booter."
            : "Launches GRUB in normal mode to show the menu and boot.",
        },
      ],
    },
    {
      id: "reinstall",
      title: lang === "fr" ? "Réinstaller GRUB" : "Reinstall GRUB",
      note: lang === "fr"
        ? "Une fois sur le système Linux booté"
        : "Once booted into the Linux system",
      entries: [
        {
          cmd: reinstallUefi,
          why: lang === "fr"
            ? "Réinstalle GRUB sur le disque principal. Choisir UEFI ou BIOS/Legacy selon le firmware. Adapter /dev/sdX pour BIOS."
            : "Reinstalls GRUB on the main disk. Choose UEFI or BIOS/Legacy depending on firmware. Adapt /dev/sdX for BIOS.",
        },
        {
          cmd: "sudo reboot",
          why: lang === "fr"
            ? "Redémarre pour vérifier que GRUB charge correctement."
            : "Reboots to verify GRUB loads correctly.",
        },
      ],
    },
    {
      id: "verify",
      title: lang === "fr" ? "Vérifier le boot" : "Verify boot",
      entries: [
        {
          cmd: "sudo efibootmgr -v",
          why: lang === "fr"
            ? "Affiche les entrées boot dans la NVRAM du firmware EFI. Vérifie que l'entrée GRUB est bien présente et active."
            : "Shows boot entries in the EFI firmware NVRAM. Verifies the GRUB entry is present and active.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Arch Linux</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">GRUB Rescue</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Réparer GRUB depuis le prompt rescue quand Windows écrase l'entrée EFI au démarrage."
            : "Repair GRUB from the rescue prompt when Windows overwrites the EFI entry at startup."}
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-10">
          <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">
            {section.title}
          </h2>
          {section.note && (
            <p className="mb-4 font-mono text-[10px] text-muted-foreground/50">{section.note}</p>
          )}
          <div className={section.note ? "mt-3 space-y-4" : "mt-4 space-y-4"}>
            {section.entries.map((entry, i) => (
              <CheatsheetCommandCard key={i} cmd={entry.cmd} why={entry.why} lang={lang} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
