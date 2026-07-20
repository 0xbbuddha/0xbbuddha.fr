"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function LinuxCapabilitiesCronPage() {
  const { lang } = useLanguage();
  const entries = [
    { cmd: "getcap -r / 2>/dev/null", why: lang === "fr" ? "Repérer binaires avec capabilities dangereuses." : "Identify binaries with dangerous capabilities." },
    { cmd: "cat /etc/crontab && ls -la /etc/cron* 2>/dev/null", why: lang === "fr" ? "Identifier tâches cron et scripts modifiables." : "Identify cron jobs and writable scripts." },
    { cmd: "find / -writable -type d 2>/dev/null | head", why: lang === "fr" ? "Trouver chemins écrasables pour hijack d'exécution." : "Find writable paths for execution hijacking." },
    { cmd: "nxc ssh $TARGET -u $USER -p $PASS -x 'getcap -r / 2>/dev/null'", why: lang === "fr" ? "Enum capabilities à distance via accès SSH." : "Enumerate capabilities remotely through SSH access." },
    { cmd: "python3 -c \"import sys; print(sys.path)\"", why: lang === "fr" ? "Library/module hijacking : si un script root (cron/systemd) importe un module non standard (ex: `import call`) qui échoue, tout répertoire inscriptible du sys.path permet de déposer le module et de le faire exécuter en root. Piège : placer le payload au niveau module (exécuté à l'import), pas dans une fonction qui ne sera jamais appelée si le script plante avant." : "Library/module hijacking: if a root script (cron/systemd) imports a non-standard module (e.g. `import call`) that fails, any writable directory in sys.path lets you drop the module and get it executed as root. Gotcha: put the payload at module level (runs on import), not inside a function that never gets called if the script crashes earlier." },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Privesc Linux</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Capabilities / Cron</h1>
      </header>
      <section className="space-y-4">
        {entries.map((item) => <CheatsheetCommandCard key={item.cmd} cmd={item.cmd} why={item.why} lang={lang} />)}
      </section>
    </div>
  );
}
