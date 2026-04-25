"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function WinServiceAbusePage() {
  const { lang } = useLanguage();
  const entries = [
    { cmd: "nxc smb $TARGET -u $USER -p $PASS -x 'sc query state= all'", why: lang === "fr" ? "Lister services et état pour triage." : "List services and state for triage." },
    { cmd: "nxc smb $TARGET -u $USER -p $PASS -x 'sc qc <service>'", why: lang === "fr" ? "Inspecter binPath/start type d'un service cible." : "Inspect binPath/start type for a target service." },
    { cmd: "nxc smb $TARGET -u $USER -p $PASS -x 'schtasks /query /fo LIST /v'", why: lang === "fr" ? "Cartographier tâches planifiées abusables." : "Map potentially abusable scheduled tasks." },
    { cmd: "nxc winrm $TARGET -u $USER -p $PASS -X 'Get-Service | ? {$_.StartType -ne \"Disabled\"}'", why: lang === "fr" ? "Vérification PowerShell des services actifs." : "PowerShell validation of active services." },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Privesc Windows</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Service Abuse</h1>
      </header>
      <section className="space-y-4">
        {entries.map((item) => <CheatsheetCommandCard key={item.cmd} cmd={item.cmd} why={item.why} lang={lang} />)}
      </section>
    </div>
  );
}
