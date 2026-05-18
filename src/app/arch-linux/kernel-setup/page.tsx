"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function KernelSetupPage() {
  const { lang } = useLanguage();

  // ── Installation ────────────────────────────────────────────────────────────
  const installAegis =
`sudo pacman -S linux-aegis-offensive linux-aegis-offensive-headers
sudo pacman -S linux-aegis-hardened linux-aegis-hardened-headers
sudo pacman -S linux-lts linux-lts-headers`;

  // ── GRUB ────────────────────────────────────────────────────────────────────
  const grubDefault =
`# Dans /etc/default/grub :
GRUB_DEFAULT=saved
GRUB_SAVEDEFAULT=true`;

  const grubMkconfig = `sudo grub-mkconfig -o /boot/grub/grub.cfg`;

  const grubReset =
`sudo rm /boot/grub/grubenv
sudo grub-mkconfig -o /boot/grub/grub.cfg`;

  const grubListEntries = `grep -E "^menuentry|submenu" /boot/grub/grub.cfg | head -20`;

  // ── Secure Boot ─────────────────────────────────────────────────────────────
  const sbctlStatus = `sbctl status`;

  const sbctlCreateKeys = `sudo sbctl create-keys`;

  const mountEfi =
`lsblk -f | grep -i efi
sudo mount /dev/nvme0n1p1 /boot/efi`;

  const grubInstallTpm =
`sudo grub-install \\
  --target=x86_64-efi \\
  --efi-directory=/boot/efi \\
  --bootloader-id=GRUB \\
  --modules="tpm" \\
  --disable-shim-lock

sudo grub-mkconfig -o /boot/grub/grub.cfg`;

  const enrollKeys = `sudo sbctl enroll-keys --microsoft`;

  const findEfi = `find /boot/efi -name "*.efi" 2>/dev/null`;

  const signFiles =
`sudo sbctl sign -s /boot/efi/EFI/GRUB/grubx64.efi
sudo sbctl sign -s /boot/efi/EFI/endeavouros/grubx64.efi
sudo sbctl sign -s /boot/efi/EFI/Boot/bootx64.efi
sudo sbctl sign -s /boot/vmlinuz-linux-aegis-offensive
sudo sbctl sign -s /boot/vmlinuz-linux-lts
sudo sbctl sign -s /boot/vmlinuz-linux-zen
sudo sbctl sign -s /boot/vmlinuz-linux`;

  const listFiles = `sudo sbctl list-files`;

  // ── Problèmes connus ────────────────────────────────────────────────────────
  const dkmsStatus = `dkms status`;

  const dkmsRemove = `sudo dkms remove scap/9.1.0 -k $(uname -r)`;

  const dkmsAutoinstall = `sudo dkms autoinstall -k $(uname -r)`;

  const capPerfmon = `sudo setcap cap_perfmon+eip $(which hashcat)`;

  // ── Sections ────────────────────────────────────────────────────────────────
  const installSections = [
    {
      id: "install",
      title: lang === "fr" ? "Installation des kernels" : "Install kernels",
      note: lang === "fr"
        ? "Les trois kernels du setup : aegis-offensive (default), aegis-hardened, lts"
        : "The three kernels in the setup: aegis-offensive (default), aegis-hardened, lts",
      entries: [
        {
          cmd: installAegis,
          why: lang === "fr"
            ? "J'installe les trois d'un coup avec leurs headers. Les headers sont indispensables pour DKMS - sans ca, scap et les autres modules out-of-tree ne compilent pas."
            : "I install all three at once with their headers. Headers are required for DKMS - without them, scap and other out-of-tree modules won't compile.",
        },
        {
          cmd: "ls /boot/vmlinuz*",
          why: lang === "fr"
            ? "Je verifie que les trois vmlinuz sont bien la avant de toucher a GRUB. Si un manque, l'install a rater quelque part."
            : "I check all three vmlinuz are present before touching GRUB. If one is missing, something went wrong during install.",
        },
      ],
    },
    {
      id: "grub-default",
      title: lang === "fr" ? "GRUB - Kernel par défaut" : "GRUB - Default kernel",
      note: lang === "fr"
        ? "Méthode persistante : GRUB mémorise le dernier kernel sélectionné au démarrage"
        : "Persistent method: GRUB remembers the last kernel selected at boot",
      entries: [
        {
          cmd: grubDefault,
          why: lang === "fr"
            ? "Ces deux lignes font que GRUB retient le dernier kernel choisi au demarrage. Je selectionne aegis-offensive une fois, et il reboot dessus par defaut ensuite. A coller dans /etc/default/grub."
            : "These two lines make GRUB remember the last kernel I picked at boot. I select aegis-offensive once, and it defaults to it on every reboot after that. Add them to /etc/default/grub.",
        },
        {
          cmd: grubMkconfig,
          why: lang === "fr"
            ? "A relancer a chaque fois qu'on touche a /etc/default/grub ou qu'on installe un nouveau kernel. Sans ca, les changements ne sont pas pris en compte."
            : "Re-run every time I touch /etc/default/grub or install a new kernel. Without this, changes don't take effect.",
        },
        {
          cmd: grubListEntries,
          why: lang === "fr"
            ? "Si la methode saved ne marche pas, cette commande donne le nom exact des entrees GRUB. Pratique pour forcer le defaut directement par nom dans le fichier de config."
            : "If the saved method doesn't work, this gives the exact GRUB entry names. Useful to force the default by name directly in the config file.",
        },
      ],
    },
    {
      id: "grub-reset",
      title: lang === "fr" ? "GRUB - Reset" : "GRUB - Reset",
      note: lang === "fr"
        ? "Si GRUB a un comportement anormal ou boucle sur un mauvais kernel"
        : "If GRUB behaves unexpectedly or loops on the wrong kernel",
      entries: [
        {
          cmd: grubReset,
          why: lang === "fr"
            ? "Le grubenv stocke le kernel selectionne. Si GRUB boucle sur le mauvais kernel ou a un comportement bizarre, je supprime ce fichier et je regenere - ca repart propre."
            : "grubenv stores the selected kernel. If GRUB loops on the wrong kernel or acts weird, I delete this file and regenerate - starts clean.",
        },
      ],
    },
  ];

  const secureSections = [
    {
      id: "sb-prereqs",
      title: lang === "fr" ? "Prérequis" : "Prerequisites",
      entries: [
        {
          cmd: `sudo pacman -S sbctl\n${sbctlStatus}`,
          why: lang === "fr"
            ? "J'installe sbctl et je verifie l'etat avant de commencer. Setup Mode doit etre Enabled - si ce n'est pas le cas, c'est que le passage en Setup Mode dans le BIOS n'a pas ete fait."
            : "I install sbctl and check the state before starting. Setup Mode must be Enabled - if not, the BIOS Setup Mode step hasn't been done yet.",
        },
      ],
    },
    {
      id: "sb-keys",
      title: lang === "fr" ? "Créer les clés" : "Create keys",
      entries: [
        {
          cmd: sbctlCreateKeys,
          why: lang === "fr"
            ? "Ca genere mes cles de signature perso (PK, KEK, db) dans /var/lib/sbctl/keys/. C'est ces cles qui vont signer tous les binaires EFI."
            : "Generates my personal signing keys (PK, KEK, db) in /var/lib/sbctl/keys/. These are the keys that will sign all EFI binaries.",
        },
      ],
    },
    {
      id: "sb-efi-mount",
      title: lang === "fr" ? "Monter la partition EFI" : "Mount EFI partition",
      note: lang === "fr"
        ? "Vérifier que la partition EFI est bien montée avant de continuer"
        : "Verify the EFI partition is mounted before continuing",
      entries: [
        {
          cmd: mountEfi,
          why: lang === "fr"
            ? "La partition EFI n'est pas toujours montee automatiquement. La premiere commande permet de la reperer (type vfat), la deuxieme la monte si ce n'est pas deja fait."
            : "The EFI partition isn't always auto-mounted. The first command helps identify it (vfat type), the second mounts it if not already done.",
        },
        {
          cmd: findEfi,
          why: lang === "fr"
            ? "Je liste tous les .efi de la partition pour savoir exactement quels chemins je dois signer. Ca evite de rater un fichier et d'avoir une surprise au reboot."
            : "I list all .efi files in the partition to know exactly which paths to sign. Avoids missing a file and getting a nasty surprise at reboot.",
        },
      ],
    },
    {
      id: "sb-grub",
      title: lang === "fr" ? "Réinstaller GRUB (TPM)" : "Reinstall GRUB (TPM)",
      note: lang === "fr"
        ? "--modules=\"tpm\" et --disable-shim-lock sont obligatoires pour sbctl sans shim"
        : "--modules=\"tpm\" and --disable-shim-lock are required for sbctl without shim",
      entries: [
        {
          cmd: grubInstallTpm,
          why: lang === "fr"
            ? "C'est l'etape qui se loupe le plus souvent. Sans --modules=\"tpm\" et --disable-shim-lock, sbctl ne peut pas signer correctement. Autre piege : bien verifier le chemin --efi-directory avec lsblk avant de lancer."
            : "This is the step most people get wrong. Without --modules=\"tpm\" and --disable-shim-lock, sbctl can't sign correctly. Also double-check the --efi-directory path with lsblk before running.",
        },
      ],
    },
    {
      id: "sb-enroll",
      title: lang === "fr" ? "Enrolle les clés" : "Enroll keys",
      entries: [
        {
          cmd: enrollKeys,
          why: lang === "fr"
            ? "J'enrolle mes cles dans le firmware EFI. Le flag --microsoft est obligatoire pour moi - dual-boot Windows et Option ROMs sur le firmware. Sans ce flag, Windows ne boot plus. Si le terminal affiche un warning rouge sur les Option ROMs, c'est encore plus important de le mettre."
            : "I enroll my keys into the EFI firmware. The --microsoft flag is mandatory for me - Windows dual-boot and firmware Option ROMs. Without it, Windows won't boot. If the terminal shows a red warning about Option ROMs, that flag is even more critical.",
        },
      ],
    },
    {
      id: "sb-sign",
      title: lang === "fr" ? "Signer les fichiers" : "Sign files",
      note: lang === "fr"
        ? "Le flag -s enregistre le chemin dans sbctl - le hook pacman re-signera automatiquement à chaque update"
        : "The -s flag registers the path in sbctl - the pacman hook will auto-re-sign on every update",
      entries: [
        {
          cmd: signFiles,
          why: lang === "fr"
            ? "Le -s est crucial. Sans lui le fichier est signe une fois mais pas enregistre, donc a la prochaine mise a jour kernel c'est plus signe et ca boot plus. Avec -s, le hook pacman s'en occupe tout seul."
            : "The -s flag is crucial. Without it the file is signed once but not registered, so after the next kernel update it's unsigned and won't boot. With -s, the pacman hook handles it automatically.",
        },
        {
          cmd: listFiles,
          why: lang === "fr"
            ? "Je verifie que tous les fichiers sont bien dans la liste. Tout ce qui est la sera re-signe automatiquement a chaque pacman -Syu - plus besoin d'y toucher apres ca."
            : "I check all files are in the list. Everything listed gets re-signed automatically on every pacman -Syu - no need to touch it after this.",
        },
      ],
    },
    {
      id: "sb-verify",
      title: lang === "fr" ? "Vérifier après reboot" : "Verify after reboot",
      note: lang === "fr"
        ? "Après avoir réactivé Secure Boot dans le BIOS"
        : "After re-enabling Secure Boot in the BIOS",
      entries: [
        {
          cmd: sbctlStatus,
          why: lang === "fr"
            ? "Si tout s'est bien passe : Secure Boot: Enabled, Setup Mode: Disabled, Vendor Keys: microsoft. C'est exactement ce que j'ai apres setup. Si Secure Boot est encore Disabled, retour dans le BIOS."
            : "If everything went well: Secure Boot: Enabled, Setup Mode: Disabled, Vendor Keys: microsoft. That's exactly what I have after setup. If Secure Boot is still Disabled, go back into BIOS.",
        },
      ],
    },
  ];

  const issueSections = [
    {
      id: "dkms-scap",
      title: "DKMS / scap",
      note: lang === "fr"
        ? "Les modules scap (Sysdig/Falco) peuvent casser après une mise à jour de kernel aegis"
        : "scap modules (Sysdig/Falco) may break after an aegis kernel update",
      entries: [
        {
          cmd: dkmsStatus,
          why: lang === "fr"
            ? "Premier reflexe quand quelque chose cloche avec les modules - ca donne l'etat de tout ce qui est installe et si c'est compatible avec les kernels actifs."
            : "First reflex when something is wrong with modules - shows the state of everything installed and whether it's compatible with the active kernels.",
        },
        {
          cmd: dkmsRemove,
          why: lang === "fr"
            ? "scap a des problemes de compatibilite avec les kernels aegis. Je retire le module pour le kernel actif. Adapter la version (9.1.0) selon la sortie de dkms status."
            : "scap has compatibility issues with aegis kernels. I remove the module for the current kernel. Adapt the version (9.1.0) based on dkms status output.",
        },
        {
          cmd: dkmsAutoinstall,
          why: lang === "fr"
            ? "Si scap refuse de se rebuilder sur les kernels aegis, je boote sur linux-lts le temps de regler ca - c'est d'ailleurs pour ca qu'il est dans le setup."
            : "If scap refuses to rebuild on aegis kernels, I boot into linux-lts until it's fixed - that's actually why it's in the setup.",
        },
      ],
    },
    {
      id: "cap-perfmon",
      title: "CAP_PERFMON (aegis-hardened)",
      note: lang === "fr"
        ? "Sur linux-aegis-hardened, perf_event_open est restreint à CAP_PERFMON"
        : "On linux-aegis-hardened, perf_event_open is restricted to CAP_PERFMON",
      entries: [
        {
          cmd: capPerfmon,
          why: lang === "fr"
            ? "Sur aegis-hardened, hashcat, bcc et perf passent pas sans root a cause de la restriction perf_event_open. Cette commande accorde la capability directement sur le binaire - a refaire si hashcat est mis a jour."
            : "On aegis-hardened, hashcat, bcc and perf fail without root because of the perf_event_open restriction. This grants the capability directly on the binary - redo it if hashcat gets updated.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Arch Linux</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Kernel Setup</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "J'utilise trois kernels en parallele. aegis-offensive au quotidien pour le lab et les CTF - c'est le defaut. Je boote sur aegis-hardened quand je suis chez un client. linux-lts est la en secours si un module DKMS part en vrille. Le Secure Boot tourne via sbctl - un hook pacman re-signe tout automatiquement a chaque update, donc c'est transparent une fois en place."
            : "I run three kernels in parallel. aegis-offensive daily for lab and CTF - that's the default. I boot into aegis-hardened when on a client engagement. linux-lts is there as a fallback if a DKMS module breaks. Secure Boot runs via sbctl - a pacman hook re-signs everything automatically on each update, so it's transparent once set up."}
        </p>

        {/* Kernel overview table */}
        <div className="mt-6 overflow-x-auto rounded-sm border border-border/60">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-primary">Kernel</th>
                <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-primary">
                  {lang === "fr" ? "Usage" : "Use case"}
                </th>
                <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-primary">Scheduler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              <tr>
                <td className="px-3 py-2 font-mono text-foreground">linux-aegis-offensive</td>
                <td className="px-3 py-2 text-muted-foreground">
                  {lang === "fr" ? "Default - Lab / CTF / Pentest" : "Default - Lab / CTF / Pentest"}
                </td>
                <td className="px-3 py-2 text-muted-foreground">BORE + sched-ext</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-foreground">linux-aegis-hardened</td>
                <td className="px-3 py-2 text-muted-foreground">
                  {lang === "fr" ? "Client / audit formel" : "Client / formal audit"}
                </td>
                <td className="px-3 py-2 text-muted-foreground">BORE</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-foreground">linux-lts</td>
                <td className="px-3 py-2 text-muted-foreground">
                  {lang === "fr" ? "Fallback / compatibilité DKMS" : "Fallback / DKMS compatibility"}
                </td>
                <td className="px-3 py-2 text-muted-foreground">Standard</td>
              </tr>
            </tbody>
          </table>
        </div>
      </header>

      {/* ── Installation & GRUB ── */}
      {installSections.map((section) => (
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

      {/* ── Secure Boot header ── */}
      <div className="mb-8 mt-12 border-t border-border pt-8">
        <p className="mb-1 text-[11px] font-mono uppercase tracking-widest text-primary">Secure Boot</p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">sbctl</h2>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          {lang === "fr"
            ? "sbctl genere mes cles de signature et les inscrit dans le firmware UEFI. Un hook pacman (zz-sbctl.hook) re-signe tout automatiquement a chaque update - une fois le setup fait, je n'y touche plus jamais."
            : "sbctl generates my signing keys and registers them in the UEFI firmware. A pacman hook (zz-sbctl.hook) re-signs everything automatically on each update - once the setup is done, I never touch it again."}
        </p>
      </div>

      {/* ── Étape 0 : BIOS Setup Mode ── */}
      <section id="sb-bios-setup" className="mb-10">
        <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">
          {lang === "fr" ? "Étape 0 - BIOS : Setup Mode" : "Step 0 - BIOS: Setup Mode"}
        </h2>
        <div className="mt-4 rounded-sm border border-border/60 p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-primary">
            {lang === "fr" ? "Étape manuelle dans le BIOS/UEFI" : "Manual step in BIOS/UEFI"}
          </p>
          <ol className="space-y-1.5 text-xs text-muted-foreground">
            <li>1. {lang === "fr" ? "Redémarrer dans le BIOS (ASUS : touche Del ou F2)" : "Reboot into BIOS (ASUS: Del or F2 key)"}</li>
            <li>2. {lang === "fr" ? "Section Security ou Boot → désactiver Secure Boot si actif" : "Security or Boot section → disable Secure Boot if active"}</li>
            <li>3. {lang === "fr" ? 'Chercher "Reset to Setup Mode" ou "Clear Secure Boot Keys" → confirmer' : 'Find "Reset to Setup Mode" or "Clear Secure Boot Keys" → confirm'}</li>
            <li>4. {lang === "fr" ? "Sauvegarder (F10) et rebooter" : "Save (F10) and reboot"}</li>
          </ol>
          <p className="mt-3 text-[10px] text-muted-foreground/60">
            {lang === "fr"
              ? "Vérifier ensuite : sbctl status → Setup Mode: ✓ Enabled"
              : "Then verify: sbctl status → Setup Mode: ✓ Enabled"}
          </p>
        </div>
      </section>

      {/* ── Étapes Secure Boot ── */}
      {secureSections.map((section) => (
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

      {/* ── Étape finale : BIOS re-enable ── */}
      <section id="sb-bios-enable" className="mb-10">
        <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">
          {lang === "fr" ? "Étape finale - BIOS : Activer Secure Boot" : "Final step - BIOS: Enable Secure Boot"}
        </h2>
        <div className="mt-4 rounded-sm border border-border/60 p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-primary">
            {lang === "fr" ? "Étape manuelle dans le BIOS/UEFI" : "Manual step in BIOS/UEFI"}
          </p>
          <ol className="space-y-1.5 text-xs text-muted-foreground">
            <li>1. {lang === "fr" ? "Retourner dans le BIOS/UEFI" : "Go back into BIOS/UEFI"}</li>
            <li>2. {lang === "fr" ? "Réactiver Secure Boot" : "Re-enable Secure Boot"}</li>
            <li>3. {lang === "fr" ? "Sauvegarder (F10) et rebooter" : "Save (F10) and reboot"}</li>
          </ol>
          <p className="mt-3 text-[10px] text-muted-foreground/60">
            {lang === "fr"
              ? "Vérifier ensuite : sbctl status → Secure Boot: ✓ Enabled / Vendor Keys: microsoft"
              : "Then verify: sbctl status → Secure Boot: ✓ Enabled / Vendor Keys: microsoft"}
          </p>
        </div>
      </section>

      {/* ── Problèmes connus ── */}
      <div className="mb-8 mt-12 border-t border-border pt-8">
        <p className="mb-1 text-[11px] font-mono uppercase tracking-widest text-primary">
          {lang === "fr" ? "Problèmes connus" : "Known issues"}
        </p>
      </div>

      {issueSections.map((section) => (
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

      {/* ── Recovery ── */}
      <section id="recovery" className="mb-10 mt-12 border-t border-border pt-8">
        <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">Recovery</h2>
        <div className="mt-4 rounded-sm border border-border/60 p-4">
          <p className="text-xs text-muted-foreground">
            {lang === "fr"
              ? "Ca boot plus apres l'activation du Secure Boot ? Pas de panique. Retour dans le BIOS, Secure Boot off, reboot. Aucun risque de brick - les cles restent dans le firmware, il suffit de diagnostiquer et de recommencer."
              : "Won't boot after enabling Secure Boot? No panic. Back into BIOS, Secure Boot off, reboot. No brick risk - keys stay in the firmware, just diagnose and try again."}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {lang === "fr" ? "Diagnostiquer avec :" : "Diagnose with:"}
          </p>
          <pre className="mt-2 overflow-x-auto rounded-sm bg-muted/30 p-3 text-xs text-foreground">
            <code>{`sbctl status\nsudo sbctl list-files`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
