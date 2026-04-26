"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function KernelRecoveryPage() {
  const { lang } = useLanguage();

  const fixPacmanOutside =
`sudo pacman --sysroot /mnt -Syy pacman libarchive --overwrite '*'
sudo pacman --sysroot /mnt -Syu --overwrite '*'`;

  const reinstallLibs =
`pacman -S --overwrite '*' libedit libva graphviz libbluray libcurl-gnutls
ldconfig`;

  const findEmptySo = `sudo find /usr/lib -type f -empty \\( -name "*.so" -o -name "*.so.*" \\)`;

  const loginLoopFix =
`rm -rf ~/.cache/*
sudo pacman -S hyprland xdg-desktop-portal-hyprland --overwrite '*'`;

  const sections = [
    {
      id: "mount",
      title: lang === "fr" ? "Monter les partitions" : "Mount partitions",
      note: lang === "fr"
        ? "Depuis le live USB EndeavourOS/Arch - adapter les chemins selon lsblk"
        : "From the live USB EndeavourOS/Arch - adapt paths based on lsblk",
      entries: [
        {
          cmd: "lsblk -f",
          why: lang === "fr"
            ? "Identifie les partitions : repérer la partition système (ex: nvme0n1p5) et la partition EFI (ex: nvme0n1p1)."
            : "Identifies partitions: find the system partition (e.g. nvme0n1p5) and the EFI partition (e.g. nvme0n1p1).",
        },
        {
          cmd: "sudo mount /dev/nvme0n1p5 /mnt",
          why: lang === "fr"
            ? "Monte la partition système dans /mnt. Adapter nvme0n1p5 selon lsblk."
            : "Mounts the system partition to /mnt. Adapt nvme0n1p5 based on lsblk.",
        },
        {
          cmd: "sudo mount /dev/nvme0n1p1 /mnt/boot/efi",
          why: lang === "fr"
            ? "Monte la partition EFI. Nécessaire pour réinstaller GRUB ou régénérer l'initramfs avec accès UEFI."
            : "Mounts the EFI partition. Required to reinstall GRUB or regenerate initramfs with UEFI access.",
        },
      ],
    },
    {
      id: "bind-mounts",
      title: lang === "fr" ? "Bind mounts" : "Bind mounts",
      note: lang === "fr"
        ? "Expose les pseudo-systèmes de fichiers du live au chroot"
        : "Exposes live pseudo-filesystems to the chroot",
      entries: [
        {
          cmd: "sudo mount --bind /dev /mnt/dev",
          why: lang === "fr"
            ? "Bind-mount /dev pour que les outils dans le chroot puissent accéder aux périphériques."
            : "Bind-mounts /dev so tools inside the chroot can access devices.",
        },
        {
          cmd: "sudo mount --bind /proc /mnt/proc",
          why: lang === "fr"
            ? "Bind-mount /proc pour les informations kernel et processus."
            : "Bind-mounts /proc for kernel and process information.",
        },
        {
          cmd: "sudo mount --bind /sys /mnt/sys",
          why: lang === "fr"
            ? "Bind-mount /sys pour l'accès au sous-système hardware (requis par dracut/grub)."
            : "Bind-mounts /sys for hardware subsystem access (required by dracut/grub).",
        },
        {
          cmd: "sudo mount --bind /run /mnt/run",
          why: lang === "fr"
            ? "Bind-mount /run pour les sockets et données de runtime."
            : "Bind-mounts /run for sockets and runtime data.",
        },
      ],
    },
    {
      id: "chroot",
      title: "Chroot",
      entries: [
        {
          cmd: "sudo arch-chroot /mnt",
          why: lang === "fr"
            ? "Entre dans le système installé comme si on y était booté. Toutes les commandes suivantes s'exécutent dans ce contexte."
            : "Enters the installed system as if booted into it. All subsequent commands run in this context.",
        },
      ],
    },
    {
      id: "fix-pacman",
      title: lang === "fr" ? "Réparer pacman (si cassé)" : "Fix pacman (if broken)",
      note: lang === "fr"
        ? "Si pacman est inutilisable dans le chroot - exécuter depuis le live USB"
        : "If pacman is unusable inside the chroot - run from the live USB",
      entries: [
        {
          cmd: fixPacmanOutside,
          why: lang === "fr"
            ? "Réinstalle pacman et libarchive directement dans /mnt depuis le live. Contourne un pacman cassé incapable de se réparer lui-même."
            : "Reinstalls pacman and libarchive directly into /mnt from the live system. Bypasses a broken pacman unable to self-repair.",
        },
      ],
    },
    {
      id: "repair",
      title: lang === "fr" ? "Réparer les paquets" : "Repair packages",
      note: lang === "fr" ? "Dans le chroot" : "Inside the chroot",
      entries: [
        {
          cmd: "pacman -Syu --overwrite '*'",
          why: lang === "fr"
            ? "Met à jour tous les paquets en forçant l'écrasement des fichiers existants. Résout les conflits de fichiers après une mise à jour partielle."
            : "Updates all packages forcing overwrite of existing files. Resolves file conflicts after a partial upgrade.",
        },
        {
          cmd: reinstallLibs,
          why: lang === "fr"
            ? "Réinstalle les libs communes souvent corrompues lors d'une mise à jour avortée. ldconfig régénère le cache des liens dynamiques."
            : "Reinstalls common libs often corrupted during an aborted upgrade. ldconfig regenerates the dynamic linker cache.",
        },
      ],
    },
    {
      id: "check-files",
      title: lang === "fr" ? "Vérifier les fichiers système" : "Check system files",
      entries: [
        {
          cmd: "sudo find /usr/lib -type f -empty",
          why: lang === "fr"
            ? "Trouve tous les fichiers vides dans /usr/lib. Des .so vides indiquent une corruption - ils doivent être réinstallés."
            : "Finds all empty files in /usr/lib. Empty .so files indicate corruption - they need to be reinstalled.",
        },
        {
          cmd: findEmptySo,
          why: lang === "fr"
            ? "Restreint la recherche aux shared objects (.so) vides, les plus critiques pour le démarrage et les applications."
            : "Narrows the search to empty shared objects (.so), the most critical for boot and applications.",
        },
      ],
    },
    {
      id: "initramfs",
      title: lang === "fr" ? "Régénérer l'initramfs" : "Regenerate initramfs",
      note: lang === "fr"
        ? "Dans le chroot - dracut détecte automatiquement les kernels installés"
        : "Inside the chroot - dracut auto-detects installed kernels",
      entries: [
        {
          cmd: "dracut -f --regenerate-all",
          why: lang === "fr"
            ? "Régénère l'initramfs pour tous les kernels installés. Indispensable après une mise à jour kernel avortée ou une corruption de modules."
            : "Regenerates the initramfs for all installed kernels. Essential after an aborted kernel upgrade or module corruption.",
        },
      ],
    },
    {
      id: "fix-boot",
      title: lang === "fr" ? "Réparer le boot" : "Fix boot",
      note: lang === "fr" ? "Dans le chroot" : "Inside the chroot",
      entries: [
        {
          cmd: "grub-mkconfig -o /boot/grub/grub.cfg",
          why: lang === "fr"
            ? "Régénère la configuration GRUB pour détecter les nouveaux kernels et initramfs. À lancer après dracut."
            : "Regenerates the GRUB config to detect new kernels and initramfs. Run after dracut.",
        },
      ],
    },
    {
      id: "login-loop",
      title: lang === "fr" ? "Boucle de login (Hyprland)" : "Login loop (Hyprland)",
      note: lang === "fr"
        ? "Si le bureau ne démarre pas après reboot - passer en TTY avec Ctrl+Alt+F3"
        : "If the desktop fails to start after reboot - switch to TTY with Ctrl+Alt+F3",
      entries: [
        {
          cmd: loginLoopFix,
          why: lang === "fr"
            ? "Vide le cache Hyprland/XDG corrompu puis réinstalle Hyprland et son portail de bureau. Résout les boucles de login liées à des fichiers de session obsolètes."
            : "Clears the corrupted Hyprland/XDG cache then reinstalls Hyprland and its desktop portal. Fixes login loops caused by stale session files.",
        },
      ],
    },
    {
      id: "complete-repair",
      title: lang === "fr" ? "Réparation complète" : "Complete repair",
      note: lang === "fr" ? "Dans le chroot - réinstalle tout le système natif" : "Inside the chroot - reinstalls the entire native system",
      entries: [
        {
          cmd: "sudo pacman -Qqn | sudo pacman -S --overwrite '*' -",
          why: lang === "fr"
            ? "Réinstalle tous les paquets du dépôt officiel installés sur le système. Méthode nucléaire pour corriger toute corruption résiduelle."
            : "Reinstalls all officially-sourced packages on the system. Nuclear option to fix any remaining corruption.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Arch Linux</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Kernel Recovery</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Recovery depuis un live USB après une mise à jour qui casse le boot ou corrompt le kernel."
            : "Recovery from a live USB after an update that breaks boot or corrupts the kernel."}
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
