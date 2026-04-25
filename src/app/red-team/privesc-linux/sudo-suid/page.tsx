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
