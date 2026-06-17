export type ProjectEntry = {
  title: string;
  description: string;
  tags: string[];
  href: string;
  external: boolean;
  status: string;
  note: string;
  group?: string;
  side: "red" | "blue";
};

export type SkillCategory = {
  title: string;
  summary: string;
  items: string[];
};

export type ArticleEntry = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  date: string;
  excerpt: string;
  focus: string;
};

export type WriteupType = "htb" | "ctf" | "prolab";
export type HTBDifficulty = "Easy" | "Medium" | "Hard" | "Insane";
export type MachineOS = "Linux" | "Windows";

export type WriteupEntry = {
  slug: string;
  title: string;
  type: WriteupType;
  platform: string;
  date: string;
  excerpt: string;
  focus: string;
  spoiler?: boolean;
  // HTB specific
  difficulty?: HTBDifficulty;
  os?: MachineOS;
  // CTF specific
  ctfEvent?: string;
  // ProLab specific (tier/track HTB, ex: "Red Team Operator I")
  tier?: string;
};

export type NavigationItem = {
  href?: string;
  label: string;
  description?: string;
  badge?: string;
  children?: NavigationItem[];
};

export type RailLink = {
  href: string;
  label: string;
};

export type RailFact = {
  label: string;
  value: string;
};

export type RailContext = {
  eyebrow: string;
  title: string;
  summary: string;
  anchors: RailLink[];
  facts: RailFact[];
  related: Array<RailLink & { meta: string }>;
};

export const siteProfile = {
  name: "Killian '0xbbuddha' Prin-Abeil",
  handle: "0xbbuddha",
  tagline:
    "Base de connaissances personnelle autour de la sécu offensive, du tooling, des writeups et des notes de terrain.",
  intro:
    "Étudiant en Mastère cybersécurité à Oteria et alternant en SOC Engineer chez Aukfood. J'y range mes projets, mes retours d'expérience et ce que j'apprends en construisant des outils.",
  currentStudy: "Mastère cybersécurité @ Oteria",
  currentRole: "SOC Engineer @ Aukfood",
  territory: "France",
  focus: [
    "Red / Purple Team tooling",
    "SOC & détection",
    "Active Directory",
    "Labs & writeups",
  ],
};

export const socialLinks = [
  {
    kind: "github" as const,
    label: "GitHub",
    href: "https://github.com/0xbbuddha",
  },
  {
    kind: "linkedin" as const,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/killianprinabeil",
  },
];

export const projects: ProjectEntry[] = [
  // ── Red Team ──────────────────────────────────────────────────────────────
  {
    title: "BashHound-CE",
    description:
      "Collecteur Active Directory pour BloodHound Community Edition, écrit entièrement en Bash.",
    tags: ["BloodHound", "AD", "Bash", "Red Team"],
    href: "https://github.com/0xbbuddha/BashHound-CE",
    external: true,
    status: "AD collector",
    note: "Une exploration technique sur LDAP, ASN.1 et les graphes AD sans dépendance lourde.",
    side: "red",
  },
  {
    title: "GoFenrir",
    description:
      "Framework d'énumération et d'attaque Active Directory en Go, inspiré de NetExec et distribué en binaire unique via Manticore.",
    tags: ["Active Directory", "Go", "Red Team"],
    href: "https://github.com/0xbbuddha/GoFenrir",
    external: true,
    status: "AD framework",
    note: "Portable et sans dépendances - un binaire unique pour couvrir l'essentiel de la reconnaissance AD.",
    side: "red",
  },
  {
    title: "Ensh",
    description:
      "Bibliothèque réseau offensive en Bash pur - sans binaire, sans compilation - ciblant Active Directory et les opérations red team.",
    tags: ["Red Team", "Bash", "Active Directory"],
    href: "https://github.com/0xbbuddha/Ensh",
    external: true,
    status: "Bash offensive lib",
    note: "Reproduire des comportements réseau AD offensifs en Bash pur pour des contextes sans compilation.",
    side: "red",
  },
  {
    title: "Aphrodite",
    description:
      "Agent Mythic C2 cross-platform écrit en Nim, tournant sur Linux et Windows. Hephaestus (loader Nim dédié) reçoit le shellcode via donut, le chiffre et l'injecte en mémoire.",
    tags: ["Mythic C2", "Nim", "Red Team"],
    href: "https://github.com/0xbbuddha/Aphrodite",
    external: true,
    status: "Mythic agent",
    note: "Loader dédié Hephaestus (https://github.com/0xbbuddha/Hephaestus) - projet orienté design d'implant et internals du protocole C2.",
    side: "red",
  },
  {
    title: "Notion",
    description:
      "Profile Mythic C2 utilisant l'API Notion comme canal covert - Living off Trusted Sites intégré à Mythic.",
    tags: ["Mythic C2", "LoTS", "Python"],
    href: "https://github.com/0xbbuddha/Notion",
    external: true,
    status: "C2 profile",
    note: "Détourner un SaaS de confiance comme transport C2 pour passer sous les radars réseau.",
    group: "Profiles C2 Mythic",
    side: "red",
  },
  {
    title: "Chess.com",
    description:
      "Profile Mythic C2 utilisant Chess.com comme canal covert - payloads encodés en positions FEN stockés en parties PGN, impersonation TLS Chrome via curl_cffi.",
    tags: ["Mythic C2", "LoTS", "Python"],
    href: "https://github.com/0xbbuddha/Chess.com",
    external: true,
    status: "C2 profile",
    note: "Encoder les payloads en positions FEN pour cacher les communications C2 dans du trafic chess légitime.",
    group: "Profiles C2 Mythic",
    side: "red",
  },
  {
    title: "PantheonLab",
    description:
      "Lab immersif AD + Linux sur le thème de la mythologie grecque, avec déploiement Ansible/Vagrant et documentation.",
    tags: ["Lab", "Active Directory", "Vagrant", "Ansible"],
    href: "https://0xbbuddha.github.io/pantheon-lab.github.io/index.html",
    external: true,
    status: "Training lab",
    note: "Un terrain de jeu pour documenter des chaînes d'attaque crédibles sans perdre la reproductibilité.",
    side: "red",
  },
  {
    title: "Nihil",
    description:
      "Environnement de pentest complet avec images Docker et stack de labo pour tests d'intrusion reproductibles.",
    tags: ["Pentest", "Docker", "Python"],
    href: "https://github.com/TheNullPigeons",
    external: true,
    status: "Pentest lab",
    note: "Pensé pour prototyper vite, casser vite, reconstruire proprement.",
    side: "red",
  },
  {
    title: "FreeMalwares",
    description:
      "Projet en C dédié à l'étude pédagogique de techniques d'obfuscation et d'évasion en environnement contrôlé.",
    tags: ["C", "Maldev", "Educatif"],
    href: "https://github.com/FreeMalwares",
    external: true,
    status: "Maldev research",
    note: "Approche strictement éducative pour comprendre les mécanismes, pas pour les industrialiser.",
    side: "red",
  },
  // ── Blue Team ─────────────────────────────────────────────────────────────
  {
    title: "Wazuh-cli",
    description:
      "CLI et dashboard TUI temps réel pour l'API REST Wazuh - gestion d'agents, alertes, vulnérabilités et réponses actives depuis le terminal.",
    tags: ["SOC", "Wazuh", "Go"],
    href: "https://github.com/0xbbuddha/Wazuh-cli",
    external: true,
    status: "SIEM CLI",
    note: "Gérer un environnement Wazuh complet en ligne de commande sans passer par l'interface web.",
    side: "blue",
  },
  {
    title: "WazuhHound",
    description:
      "Collecteur OpenGraph BloodHound CE pour Wazuh - mappe agents, groupes, nœuds de cluster, RBAC et utilisateurs OpenSearch depuis l'API REST Wazuh dans un graphe compatible BloodHound, exposant chemins d'escalade de privilèges et topologie d'infrastructure.",
    tags: ["SOC", "Wazuh", "BloodHound", "OpenGraph"],
    href: "https://github.com/0xbbuddha/WazuhHound",
    external: true,
    status: "BloodHound collector",
    note: "Auditer l'infrastructure Wazuh/OpenSearch avec des requêtes Cypher - même workflow que BloodHound AD.",
    side: "blue",
  },
  {
    title: "ArchimedeaOS",
    description:
      "Distribution Arch Linux orientée Purple Team pour disposer d'un environnement cohérent pendant les exercices red/blue.",
    tags: ["Purple Team", "Arch Linux", "Distribution"],
    href: "https://github.com/ArchimedeaOS-Development",
    external: true,
    status: "Purple Team OS",
    note: "Base d'outillage unifiée pour labs et expérimentations offensives.",
    side: "blue",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "SOC & Détection",
    summary:
      "Construire des signaux utiles, faire remonter les alertes pertinentes et garder un niveau de lisibilité correct côté analyste.",
    items: ["Wazuh", "CrowdSec", "SIEM", "Alerting", "Incident Response"],
  },
  {
    title: "Pentest & Offensive Web",
    summary:
      "Reconnaissance, énumération, exploitation et restitution avec un souci constant du pourquoi, pas seulement du comment.",
    items: ["Reconnaissance", "Enumeration", "Exploitation", "Post-exploitation"],
  },
  {
    title: "Pentest & Offensive AD",
    summary:
      "Chaînes d'attaque Active Directory, abuse paths, privilèges et pivots après accès initial.",
    items: ["Reconnaissance", "Enumeration AD", "Acces initial", "Privesc", "Persistance"],
  },
  {
    title: "Systeme & Réseau",
    summary:
      "Infra de labo, outillage système, déploiement et hygiène de build pour pouvoir tester vite sans perdre la maîtrise.",
    items: ["Linux", "Shell", "Docker", "Vagrant", "Ansible", "Reseau"],
  },
  {
    title: "Langages & Outils",
    summary:
      "Construire les briques soi-même quand il faut descendre d'un niveau pour comprendre ou adapter le workflow.",
    items: ["Python", "C", "Bash", "PowerShell", "Go", "CMake", "Git"],
  },
];

export const articles: ArticleEntry[] = [
  {
    slug: "marshall-ble-re",
    title: "Reverse engineering du protocole BLE Marshall",
    category: "Reverse Engineering",
    tags: ["BLE", "GATT", "Go", "Wails", "BlueZ"],
    date: "2026-06-07",
    excerpt:
      "De l'APK Android a une appli Linux fonctionnelle : decompilation Kotlin, authentification BLE Just Works, encodage EQ en 3 octets, et gestion multi-appareils par detection de caracteristiques.",
    focus: "Protocol RE",
  },
  {
    slug: "dirty-frag-pagecache",
    title: "Dirty Frag : quand le noyau Linux ecrit dans ses propres fichiers",
    category: "Kernel Security",
    tags: ["Linux", "LPE", "Kernel", "XFRM", "RxRPC", "CVE"],
    date: "2026-06-01",
    excerpt:
      "Quatre CVE 2026, quatre chemins differents, un seul primitif : splice() + dechiffrement en place = ecriture arbitraire dans le page cache de n'importe quel fichier lisible. Analyse de la famille dirty frag.",
    focus: "Kernel LPE",
  },
  {
    slug: "aphrodite",
    title: "J'ai codé mon propre agent Mythic en Nim",
    category: "Red Team",
    tags: ["Mythic", "C2", "Nim", "Agent"],
    date: "2026-04-07",
    excerpt:
      "Comprendre de l'intérieur comment un agent C2 fonctionne vraiment, en partant d'un design natif et cross-platform orienté Mythic.",
    focus: "Agent design",
  },
  {
    slug: "notion-c2",
    title: "Quand Notion devient un canal C2",
    category: "Red Team",
    tags: ["Mythic", "C2", "LoTS", "Python"],
    date: "2026-03-20",
    excerpt:
      "Détourner l'API Notion comme transport covert, avec une logique Living off Trusted Sites intégrée à Mythic.",
    focus: "Covert channel",
  },
  {
    slug: "bashhound",
    title: "Et si on recodait un collecteur AD en pur Bash ?",
    category: "Tools",
    tags: ["Active Directory", "BloodHound", "Bash"],
    date: "2026-03-18",
    excerpt:
      "Reconstruction d'un collecteur AD avec Bash pur, LDAP, parsing ASN.1 et export JSON compatible BloodHound.",
    focus: "AD tooling",
  },
];

export const writeups: WriteupEntry[] = [
  {
    slug: "breizh-kybeurre-demi-sel",
    title: "Kybeurre demi-sel",
    type: "ctf",
    platform: "BreizhCTF 2026",
    ctfEvent: "BreizhCTF 2026",
    date: "2026-05-22",
    excerpt:
      "Secret binaire dans {0,1}^50 et bruit negligeable : l'embedding de Kannan + LLL retrouve le secret en quelques secondes depuis 50 echantillons LWE.",
    focus: "Crypto / Lattice",
  },
  {
    slug: "breizh-kvmillesime",
    title: "KVMillesime - Mise en fut",
    type: "ctf",
    platform: "BreizhCTF 2026",
    ctfEvent: "BreizhCTF 2026",
    date: "2026-05-22",
    excerpt:
      "Hyperviseur KVM modifie qui compte les borrows d'une soustraction bit a bit et renvoie le total en telemetrie. 75 requetes pour reconstruire la cle 128 bits.",
    focus: "Crypto / Side-channel",
  },
  {
    slug: "breizh-tremendous-2",
    title: "Tremendous 2",
    type: "ctf",
    platform: "BreizhCTF 2026",
    ctfEvent: "BreizhCTF 2026",
    date: "2026-05-22",
    excerpt:
      "RSA textbook + oracle de parite via /api/verify. Dichotomie sur 1024 bits pour retrouver le mot de passe admin sans connaitre la cle privee.",
    focus: "Crypto / RSA oracle",
  },
  {
    slug: "breizh-trust-issues",
    title: "Trust Issues",
    type: "ctf",
    platform: "BreizhCTF 2026",
    ctfEvent: "BreizhCTF 2026",
    date: "2026-05-22",
    excerpt:
      "APK Android avec cle HMAC hardcodee dans le binaire et verification PIN uniquement cote client. jadx + 30 lignes de Python pour appeler /admin/flag directement.",
    focus: "Mobile / APK reverse",
  },
  {
    slug: "pipehop",
    title: "PipeHop",
    type: "ctf",
    platform: "Hack'In 2K26",
    ctfEvent: "Hack'In 2K26",
    date: "2026-04-11",
    excerpt:
      "Chaîne d'exploitation autour d'une instance Gitea ouverte, de faux actions/* et d'un runner partagé qui fuit un token privé.",
    focus: "CI/CD abuse",
  },
  {
    slug: "hardback",
    title: "Hardback",
    type: "ctf",
    platform: "Hack'In 2K26",
    ctfEvent: "Hack'In 2K26",
    date: "2026-04-11",
    excerpt:
      "Depuis une simple lecture MariaDB jusqu'à un shell root, en passant par un vieux log, un rôle migration et PAM.",
    focus: "Linux privesc",
  },
  {
    slug: "insomnihack-escape",
    title: "Escape",
    type: "ctf",
    platform: "Insomni'hack 2K26",
    ctfEvent: "Insomni'hack 2K26",
    date: "2026-03-21",
    excerpt:
      "Writeup pwn autour d'un bypass seccomp, d'une fuite mémoire pré-filtre et d'un oracle aveugle bâti au timeout.",
    focus: "Pwn / seccomp",
  },
  {
    slug: "eighteen",
    title: "Eighteen",
    type: "htb",
    platform: "HackTheBox",
    difficulty: "Easy",
    os: "Windows",
    date: "2025-12-16",
    excerpt:
      "MSSQL impersonation pour extraire un hash Flask depuis une DB interne, crack et spray WinRM, puis BadSuccessor pour hériter des credentials Administrator via un dMSA.",
    focus: "MSSQL / dMSA BadSuccessor",
  },
  {
    slug: "signed",
    title: "Signed",
    type: "htb",
    platform: "HackTheBox",
    difficulty: "Medium",
    os: "Windows",
    date: "2026-02-18",
    excerpt:
      "Capture NTLM via xp_dirtree, crack d'un compte MSSQL et Silver Ticket pour reprendre la main sur la machine.",
    focus: "Windows / MSSQL",
  },
  {
    slug: "pirate",
    title: "Pirate",
    type: "htb",
    platform: "HackTheBox",
    difficulty: "Hard",
    os: "Windows",
    date: "2026-05-10",
    excerpt:
      "Cinq techniques AD enchaînées : Pre2k sur MS01$, extraction gMSA, RBCD via NTLM relay, S4U2Proxy sur WEB01 pour récupérer a.white, puis WriteSPN + altservice pour obtenir un ticket CIFS/DC01 en tant qu'Administrator.",
    focus: "Pre2k / gMSA / RBCD / WriteSPN",
  },
  {
    slug: "overwatch",
    title: "Overwatch",
    type: "htb",
    platform: "HackTheBox",
    difficulty: "Medium",
    os: "Windows",
    date: "2026-02-17",
    excerpt:
      "SMB guest, linked server MSSQL, capture de credentials par DNS et exécution PowerShell dans un service SOAP.",
    focus: "AD path",
  },
  {
    slug: "mythical",
    title: "Mythical",
    type: "prolab",
    platform: "HackTheBox ProLabs",
    tier: "Red Team Operator I",
    date: "2026-06-16",
    excerpt:
      "Opération red team à travers un C2 Mythic déjà en place : flag Backup via un partage rsync, ESC4→ESC1 avec bypass du Full Enforcement Mode (extension SID) pour le flag Certified, pivot cross-forest et abus MSSQL TRUSTWORTHY jusqu'au flag Mythical Master sur le second domaine.",
    focus: "C2 / ADCS / Cross-forest",
  },
];

export const htbWriteups = writeups.filter((w) => w.type === "htb");
export const ctfWriteups = writeups.filter((w) => w.type === "ctf");
export const prolabWriteups = writeups.filter((w) => w.type === "prolab");

export type NavigationGroup = {
  titleKey: string;
  items: NavigationItem[];
};

function buildHTBTree(): NavigationItem[] {
  const DIFFICULTIES: HTBDifficulty[] = ["Easy", "Medium", "Hard", "Insane"];
  const OS_ORDER: MachineOS[] = ["Linux", "Windows"];

  return DIFFICULTIES.flatMap((diff): NavigationItem[] => {
    const byDiff = htbWriteups.filter((w) => w.difficulty === diff);
    if (!byDiff.length) return [];

    const osChildren = OS_ORDER.flatMap((os): NavigationItem[] => {
      const machines = byDiff.filter((w) => w.os === os);
      if (!machines.length) return [];
      return [{
        label: os,
        children: machines.map((w): NavigationItem => ({
          href: `/writeups/${w.slug}`,
          label: w.title,
        })),
      }];
    });

    return [{ label: diff, children: osChildren }];
  });
}

function buildCTFTree(): NavigationItem[] {
  const events = [...new Set(ctfWriteups.map((w) => w.ctfEvent ?? w.platform))];
  return events.map((event): NavigationItem => ({
    label: event,
    children: ctfWriteups
      .filter((w) => (w.ctfEvent ?? w.platform) === event)
      .map((w): NavigationItem => ({
        href: `/writeups/${w.slug}`,
        label: w.title,
      })),
  }));
}

function buildProlabTree(): NavigationItem[] {
  const tiers = [...new Set(prolabWriteups.map((w) => w.tier ?? w.platform))];
  return tiers.map((tier): NavigationItem => ({
    label: tier,
    children: prolabWriteups
      .filter((w) => (w.tier ?? w.platform) === tier)
      .map((w): NavigationItem => ({
        href: `/writeups/${w.slug}`,
        label: w.title,
      })),
  }));
}

export const navigationGroups: NavigationGroup[] = [
  {
    titleKey: "startHere",
    items: [
      { href: "/", label: "README", badge: "00" },
      { href: "/search", label: "Search" },
    ],
  },
  {
    titleKey: "writeups",
    items: [
      {
        href: "/writeups/htb",
        label: "HackTheBox",
        badge: String(htbWriteups.length).padStart(2, "0"),
        children: buildHTBTree(),
      },
      {
        href: "/writeups/ctf",
        label: "CTF",
        badge: String(ctfWriteups.length).padStart(2, "0"),
        children: buildCTFTree(),
      },
      {
        href: "/writeups/prolab",
        label: "ProLab",
        badge: String(prolabWriteups.length).padStart(2, "0"),
        children: buildProlabTree(),
      },
    ],
  },
  {
    titleKey: "redTeam",
    items: [{
      href: "/red-team",
      label: "Red Team Notes",
      children: [
        {
          href: "/red-team/ad-exploit",
          label: "AD Exploit",
          children: [
            {
              href: "/red-team/ad-exploit/information-gathering",
              label: "Enumeration",
              children: [
                { href: "/red-team/ad-exploit/information-gathering/netexec", label: "nxc" },
                { href: "/red-team/ad-exploit/information-gathering/bloodyad", label: "bloodyAD" },
                { href: "/red-team/ad-exploit/information-gathering/bloodhound", label: "BloodHound" },
                { href: "/red-team/ad-exploit/information-gathering/password-misconfigs", label: "Exposed Secrets" },
                { href: "/red-team/ad-exploit/information-gathering/laps-enum", label: "LAPS" },
                { href: "/red-team/ad-exploit/information-gathering/kerberos-auth", label: "Kerberos" },
              ],
            },
            {
              href: "/red-team/ad-exploit/pre-exploitation",
              label: "Pre-Exploitation",
              children: [
                { href: "/red-team/ad-exploit/pre-exploitation/relay-attacks", label: "NTLM Relay" },
                { href: "/red-team/ad-exploit/pre-exploitation/phishing", label: "Initial Access" },
                { href: "/red-team/ad-exploit/pre-exploitation/network-attacks", label: "Network Attacks" },
                { href: "/red-team/ad-exploit/pre-exploitation/wsus", label: "WSUS" },
                { href: "/red-team/ad-exploit/pre-exploitation/password-misconfigs", label: "GPP & Secrets" },
                { href: "/red-team/ad-exploit/pre-exploitation/coercion", label: "Coercion" },
              ],
            },
            {
              href: "/red-team/ad-exploit/exploitation",
              label: "Exploitation",
              children: [
                { href: "/red-team/ad-exploit/exploitation/credential-attacks", label: "Cred Dump" },
                { href: "/red-team/ad-exploit/exploitation/kerberos-attacks", label: "Kerberos" },
                { href: "/red-team/ad-exploit/exploitation/delegation-attacks", label: "Delegation" },
                { href: "/red-team/ad-exploit/exploitation/domain-privesc", label: "Domain PrivEsc" },
                { href: "/red-team/ad-exploit/exploitation/bloodyad-attacks", label: "bloodyAD" },
                {
                  href: "/red-team/ad-exploit/exploitation/acl-gpo",
                  label: "ACL & GPO",
                  children: [
                    { href: "/red-team/ad-exploit/exploitation/acl-gpo/acl-abuse", label: "ACL" },
                    { href: "/red-team/ad-exploit/exploitation/acl-gpo/adcs-attacks", label: "ADCS" },
                  ],
                },
                { href: "/red-team/ad-exploit/exploitation/mssql-attacks", label: "MSSQL" },
                { href: "/red-team/ad-exploit/exploitation/laps-abuse", label: "LAPS" },
                { href: "/red-team/ad-exploit/exploitation/process-injection", label: "Injection" },
                { href: "/red-team/ad-exploit/exploitation/account-operators", label: "Account Operators" },
                { href: "/red-team/ad-exploit/exploitation/ad-recycle-bin", label: "AD Recycle Bin" },
                { href: "/red-team/ad-exploit/exploitation/gpo-abuse", label: "GPO" },
                { href: "/red-team/ad-exploit/exploitation/misc-cves", label: "Notable CVEs" },
              ],
            },
            {
              href: "/red-team/ad-exploit/post-exploitation",
              label: "Post-Exploitation",
              children: [
                { href: "/red-team/ad-exploit/post-exploitation/lateral-movement", label: "Lateral Movement" },
                { href: "/red-team/ad-exploit/post-exploitation/procedures", label: "Cleanup" },
                {
                  href: "/red-team/ad-exploit/post-exploitation/win-privesc",
                  label: "Windows PrivEsc",
                  children: [
                    { href: "/red-team/ad-exploit/post-exploitation/win-privesc/potato-attacks", label: "Potatoes" },
                    { href: "/red-team/ad-exploit/post-exploitation/win-privesc/credential-dumping", label: "Cred Dump" },
                    { href: "/red-team/ad-exploit/post-exploitation/win-privesc/local-privesc", label: "Local PrivEsc" },
                    { href: "/red-team/ad-exploit/post-exploitation/win-privesc/server-operators", label: "Server Operators" },
                    { href: "/red-team/ad-exploit/post-exploitation/win-privesc/ad-recycle-bin", label: "AD Recycle Bin" },
                  ],
                },
              ],
            },
          ],
        },
        {
          href: "/red-team/privesc-windows",
          label: "Privesc Windows",
          children: [
            { href: "/red-team/privesc-windows/local-enum", label: "Local Enum" },
            {
              href: "/red-team/privesc-windows/credential-access",
              label: "Credential Access",
              children: [
                { href: "/red-team/privesc-windows/credential-dumping", label: "Credential Dumping" },
              ],
            },
            {
              href: "/red-team/privesc-windows/privilege-abuse",
              label: "Privilege Abuse",
              children: [
                { href: "/red-team/privesc-windows/service-abuse", label: "Service Abuse" },
              ],
            },
          ],
        },
        {
          href: "/red-team/privesc-linux",
          label: "Privesc Linux",
          children: [
            {
              href: "/red-team/privesc-linux/privilege-paths",
              label: "Privilege Paths",
              children: [
                { href: "/red-team/privesc-linux/sudo-suid", label: "Sudo / SUID" },
                { href: "/red-team/privesc-linux/capabilities-cron", label: "Capabilities / Cron" },
                { href: "/red-team/privesc-linux/docker-privesc", label: "Docker" },
              ],
            },
          ],
        },
        {
          href: "/red-team/esc",
          label: "ESC",
          children: [
            {
              href: "/red-team/esc/abuse-paths",
              label: "Abuse Paths",
              children: [
                { href: "/red-team/esc/esc1-esc2", label: "ESC1 / ESC2" },
                { href: "/red-team/esc/shadow-credentials", label: "Shadow Credentials" },
              ],
            },
          ],
        },
        {
          href: "/red-team/pivoting",
          label: "Pivoting",
          children: [
            { href: "/red-team/pivoting/ligolo", label: "Ligolo-NG" },
          ],
        },
        {
          href: "/red-team/c2",
          label: "C2",
          children: [
            {
              href: "/red-team/c2/mythic",
              label: "Mythic",
              children: [
                {
                  href: "/red-team/c2/mythic/agents",
                  label: "Agents",
                  children: [
                    { href: "/red-team/c2/mythic/agents/aphrodite", label: "Aphrodite" },
                  ],
                },
              ],
            },
          ],
        },
        {
          href: "/red-team/defense-evasion",
          label: "Defense Evasion",
          children: [
            { href: "/red-team/defense-evasion/disable-av", label: "Disable AV" },
            {
              href: "/red-team/defense-evasion/cobalt-strike",
              label: "Evading with Cobalt Strike",
              children: [
                { href: "/red-team/defense-evasion/cobalt-strike/payload-bypass", label: "Payload Bypass" },
                { href: "/red-team/defense-evasion/cobalt-strike/memory-config", label: "Memory & Config" },
                { href: "/red-team/defense-evasion/cobalt-strike/process-opsec", label: "Process OPSEC" },
              ],
            },
          ],
        },
      ],
    }],
  },
  {
    titleKey: "pentestWeb",
    items: [{ href: "/red-team/pentest-web", label: "Pentest Web Notes" }],
  },
  {
    titleKey: "archLinux",
    items: [{
      href: "/arch-linux",
      label: "Arch Linux Notes",
      children: [
        { href: "/arch-linux/pacman", label: "Pacman" },
        { href: "/arch-linux/zram", label: "Zram" },
        { href: "/arch-linux/grub-rescue", label: "GRUB Rescue" },
        { href: "/arch-linux/kernel-recovery", label: "Kernel Recovery" },
        { href: "/arch-linux/hp-printer", label: "HP Printer" },
        { href: "/arch-linux/kernel-setup", label: "Kernel Setup" },
      ],
    }],
  },
  {
    titleKey: "cheatsheets",
    items: [{
      href: "/cheatsheets",
      label: "Cheatsheets",
      children: [
        { href: "/cheatsheets/netexec", label: "NetExec" },
        { href: "/cheatsheets/bloodyad", label: "BloodyAD" },
        { href: "/cheatsheets/certipy", label: "Certipy" },
        {
          href: "/my-tools",
          label: "My Tools",
          children: [
            { href: "/my-tools/gofenrir", label: "GoFenrir" },
            { href: "/my-tools/bashhound-ce", label: "BashHound-CE" },
          ],
        },
      ],
    }],
  },
  {
    titleKey: "blog",
    items: [{ href: "/blog", label: "Blog", badge: String(articles.length).padStart(2, "0") }],
  },
  {
    titleKey: "misc",
    items: [
      { href: "/music", label: "Music" },
      { href: "/chess", label: "Chess" },
    ],
  },
];

const staticRailContexts: Record<string, RailContext> = {
  "/search": {
    eyebrow: "Search",
    title: "Recherche globale",
    summary: "Recherche par outil, commande, tag, writeup et article.",
    anchors: [],
    facts: [],
    related: [
      { href: "/cheatsheets", label: "Cheatsheets", meta: "Command references" },
      { href: "/my-tools", label: "My Tools", meta: "Personal tooling" },
    ],
  },
  "/": {
    eyebrow: "README",
    title: "0xbbuddha",
    summary: "Portfolio, projets, compétences et notes de terrain.",
    anchors: [
      { href: "#overview", label: "Overview" },
      { href: "#whoami", label: "whoami" },
      { href: "#formation", label: "Formation" },
      { href: "#projects", label: "Projects" },
      { href: "#skills", label: "Skills" },
      { href: "#certifications", label: "Certifications" },
      { href: "#contributions", label: "Contributions" },
    ],
    facts: [],
    related: [
      { href: "/writeups/htb", label: "HackTheBox", meta: `${htbWriteups.length} machines` },
      { href: "/blog", label: "Blog", meta: `${articles.length} articles` },
    ],
  },
  "/red-team": {
    eyebrow: "Red Team Notes",
    title: "Notes offensives",
    summary: "Méthodologie, chaînes d'attaque et notes de terrain.",
    anchors: [],
    facts: [],
    related: [
      { href: "/cheatsheets", label: "Cheatsheets", meta: "Références rapides" },
      { href: "/my-tools", label: "My Tools", meta: "Outils perso" },
    ],
  },
  "/red-team/defense-evasion": {
    eyebrow: "Red Team Notes",
    title: "Defense Evasion",
    summary: "OPSEC artefacts, scripts, mémoire et comportement d'exécution.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/c2", label: "C2", meta: "Infrastructure et agents" },
      { href: "/red-team/pivoting", label: "Pivoting", meta: "Mouvement réseau" },
    ],
  },
  "/red-team/defense-evasion/disable-av": {
    eyebrow: "Defense Evasion",
    title: "Disable AV",
    summary: "Désactiver Windows Defender via PowerShell.",
    anchors: [
      { href: "#disable-defender", label: "Minimal" },
      { href: "#disable-full", label: "Complet" },
      { href: "#status", label: "Status" },
      { href: "#exclusions", label: "Exclusions" },
    ],
    facts: [],
    related: [
      { href: "/red-team/defense-evasion", label: "Defense Evasion", meta: "Vue d'ensemble" },
      { href: "/red-team/defense-evasion/cobalt-strike", label: "Cobalt Strike", meta: "OPSEC CS" },
    ],
  },
  "/red-team/defense-evasion/cobalt-strike": {
    eyebrow: "Defense Evasion",
    title: "Evading with Cobalt Strike",
    summary: "OPSEC Cobalt Strike : artefacts, scripts, mémoire, commandes, post-ex.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/defense-evasion", label: "Defense Evasion", meta: "Vue d'ensemble" },
      { href: "/red-team/c2", label: "C2", meta: "Infrastructure" },
    ],
  },
  "/red-team/defense-evasion/cobalt-strike/payload-bypass": {
    eyebrow: "Cobalt Strike",
    title: "Payload Bypass",
    summary: "Bypass AV/AMSI sur les payloads compilés et scripts PowerShell.",
    anchors: [
      { href: "#compiled", label: "Payloads compilés" },
      { href: "#script", label: "Script / AMSI" },
    ],
    facts: [],
    related: [
      { href: "/red-team/defense-evasion/cobalt-strike", label: "Cobalt Strike", meta: "Vue d'ensemble" },
      { href: "/red-team/defense-evasion/cobalt-strike/memory-config", label: "Memory & Config", meta: "Stage + Malleable C2" },
    ],
  },
  "/red-team/defense-evasion/cobalt-strike/memory-config": {
    eyebrow: "Cobalt Strike",
    title: "Memory & Config",
    summary: "OPSEC mémoire Beacon et blocs Malleable C2.",
    anchors: [
      { href: "#stage", label: "Stage" },
      { href: "#inject-config", label: "process-inject / post-ex" },
    ],
    facts: [],
    related: [
      { href: "/red-team/defense-evasion/cobalt-strike", label: "Cobalt Strike", meta: "Vue d'ensemble" },
      { href: "/red-team/defense-evasion/cobalt-strike/process-opsec", label: "Process OPSEC", meta: "PPID + spawnto" },
    ],
  },
  "/red-team/defense-evasion/cobalt-strike/process-opsec": {
    eyebrow: "Cobalt Strike",
    title: "Process OPSEC",
    summary: "PPID spoofing, spawnto et bypass des détections kernel.",
    anchors: [
      { href: "#blending", label: "Process blending" },
      { href: "#detections", label: "Détections & bypass" },
    ],
    facts: [],
    related: [
      { href: "/red-team/defense-evasion/cobalt-strike", label: "Cobalt Strike", meta: "Vue d'ensemble" },
      { href: "/red-team/defense-evasion/cobalt-strike/memory-config", label: "Memory & Config", meta: "Stage + Malleable C2" },
    ],
  },
  "/cheatsheets": {
    eyebrow: "Cheatsheets",
    title: "Références rapides",
    summary: "Commandes et syntaxes essentielles par outil.",
    anchors: [],
    facts: [],
    related: [
      { href: "/my-tools", label: "My Tools", meta: "Outils perso" },
      { href: "/red-team", label: "Red Team Notes", meta: "Méthodologie" },
    ],
  },
  "/my-tools": {
    eyebrow: "My Tools",
    title: "Documentation personnelle",
    summary: "Usage et notes techniques pour les outils que j'ai construits.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team", label: "Red Team Notes", meta: "Méthodologie" },
      { href: "/cheatsheets", label: "Cheatsheets", meta: "Références rapides" },
    ],
  },
  "/cheatsheets/netexec": {
    eyebrow: "Cheatsheets",
    title: "NetExec",
    summary: "Commandes nxc par protocole : SMB, LDAP, MSSQL, WinRM, SSH.",
    anchors: [
      { href: "#install", label: "Installation" },
      { href: "#syntax", label: "Syntax" },
      { href: "#auth", label: "Auth" },
      { href: "#smb", label: "SMB" },
      { href: "#ldap", label: "LDAP" },
      { href: "#mssql", label: "MSSQL" },
      { href: "#winrm", label: "WinRM" },
      { href: "#ssh", label: "SSH" },
    ],
    facts: [],
    related: [
      { href: "/cheatsheets/bloodyad", label: "BloodyAD", meta: "Cheatsheet" },
      { href: "/cheatsheets/certipy", label: "Certipy", meta: "Cheatsheet" },
    ],
  },
  "/cheatsheets/bloodyad": {
    eyebrow: "Cheatsheets",
    title: "BloodyAD",
    summary: "Énumération AD, ACL, Kerberos et exploitation depuis Linux.",
    anchors: [
      { href: "#install", label: "Installation" },
      { href: "#syntax", label: "Syntax" },
      { href: "#enum", label: "Enumeration" },
      { href: "#acl", label: "ACL" },
      { href: "#kerberos", label: "Kerberos" },
      { href: "#creds", label: "Credentials" },
      { href: "#group", label: "Groups" },
      { href: "#uac", label: "UAC" },
      { href: "#computer", label: "Computer" },
      { href: "#dns", label: "DNS" },
    ],
    facts: [],
    related: [
      { href: "/cheatsheets/netexec", label: "NetExec", meta: "Cheatsheet" },
      { href: "/cheatsheets/certipy", label: "Certipy", meta: "Cheatsheet" },
    ],
  },
  "/cheatsheets/certipy": {
    eyebrow: "Cheatsheets",
    title: "Certipy",
    summary: "Enumération et exploitation ADCS avec Certipy.",
    anchors: [],
    facts: [],
    related: [
      { href: "/cheatsheets/netexec", label: "NetExec", meta: "Cheatsheet" },
      { href: "/cheatsheets/bloodyad", label: "BloodyAD", meta: "Cheatsheet" },
    ],
  },
  "/my-tools/gofenrir": {
    eyebrow: "My Tools",
    title: "GoFenrir",
    summary: "Enumérateur AD/SMB Go : LDAP et SMB par section.",
    anchors: [
      { href: "#install", label: "Installation" },
      { href: "#syntax", label: "Syntax" },
      { href: "#ldap", label: "LDAP" },
      { href: "#smb", label: "SMB" },
    ],
    facts: [],
    related: [
      { href: "/my-tools/bashhound-ce", label: "BashHound-CE", meta: "My Tools" },
      { href: "/cheatsheets/netexec", label: "NetExec", meta: "Cheatsheet" },
    ],
  },
  "/my-tools/bashhound-ce": {
    eyebrow: "My Tools",
    title: "BashHound-CE",
    summary: "Collecteur AD BloodHound CE en Bash pur.",
    anchors: [
      { href: "#install", label: "Installation" },
      { href: "#syntax", label: "Syntax" },
      { href: "#mandatory", label: "Mandatory" },
      { href: "#optional", label: "Optional" },
      { href: "#collection", label: "Collection" },
    ],
    facts: [],
    related: [
      { href: "/my-tools/gofenrir", label: "GoFenrir", meta: "My Tools" },
      { href: "/cheatsheets/netexec", label: "NetExec", meta: "Cheatsheet" },
    ],
  },
  "/red-team/ad-exploit": {
    eyebrow: "Red Team Notes",
    title: "AD Exploit",
    summary: "Workflow AD de bout en bout : de la cartographie à la compromission.",
    anchors: [],
    facts: [],
    related: [
      { href: "/cheatsheets/netexec", label: "NetExec", meta: "Cheatsheet" },
      { href: "/cheatsheets/bloodyad", label: "BloodyAD", meta: "Cheatsheet" },
    ],
  },
  "/red-team/ad-exploit/information-gathering": {
    eyebrow: "AD Exploit",
    title: "Information Gathering",
    summary: "Cartographier le domaine avant d'agir : NetExec, BloodyAD, BloodHound et plus.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/pre-exploitation", label: "Pre-Exploitation", meta: "AD Exploit" },
      { href: "/cheatsheets/netexec", label: "NetExec", meta: "Cheatsheet" },
    ],
  },
  "/red-team/ad-exploit/pre-exploitation": {
    eyebrow: "AD Exploit",
    title: "Pre-Exploitation",
    summary: "Relay, coercition, phishing et abus réseau avant exploitation.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/information-gathering", label: "Information Gathering", meta: "AD Exploit" },
      { href: "/red-team/ad-exploit/exploitation", label: "Exploitation", meta: "AD Exploit" },
    ],
  },
  "/red-team/privesc-windows": {
    eyebrow: "Red Team Notes",
    title: "Privesc Windows",
    summary: "Escalade de privilèges sur Windows.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit", label: "AD Exploit", meta: "Red Team Notes" },
      { href: "/red-team/privesc-linux", label: "Privesc Linux", meta: "Red Team Notes" },
    ],
  },
  "/red-team/privesc-linux": {
    eyebrow: "Red Team Notes",
    title: "Privesc Linux",
    summary: "Escalade de privilèges sur Linux.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/privesc-windows", label: "Privesc Windows", meta: "Red Team Notes" },
      { href: "/red-team/pivoting", label: "Pivoting", meta: "Red Team Notes" },
    ],
  },
  "/red-team/privesc-linux/docker-privesc": {
    eyebrow: "Privesc Linux",
    title: "Docker Privesc",
    summary: "Groupe docker = root sur l'hôte via mount + chroot.",
    anchors: [
      { href: "#enum", label: "Enumeration" },
      { href: "#exploit", label: "Exploitation" },
    ],
    facts: [],
    related: [
      { href: "/red-team/privesc-linux/sudo-suid", label: "Sudo / SUID", meta: "Privesc Linux" },
      { href: "/red-team/privesc-linux/capabilities-cron", label: "Capabilities / Cron", meta: "Privesc Linux" },
    ],
  },
  "/red-team/esc": {
    eyebrow: "Red Team Notes",
    title: "ESC",
    summary: "Exploitation des mauvaises configurations ADCS.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit", label: "AD Exploit", meta: "Red Team Notes" },
      { href: "/cheatsheets/certipy", label: "Certipy", meta: "Cheatsheet" },
    ],
  },
  "/red-team/pivoting": {
    eyebrow: "Red Team Notes",
    title: "Pivoting",
    summary: "Tunnels, routing de subnets internes et double pivot.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/pivoting/ligolo", label: "Ligolo-NG", meta: "Pivoting" },
      { href: "/red-team/ad-exploit", label: "AD Exploit", meta: "Red Team Notes" },
    ],
  },
  "/red-team/c2": {
    eyebrow: "Red Team Notes",
    title: "C2",
    summary: "Frameworks C2 et agents perso.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/c2/mythic", label: "Mythic", meta: "C2" },
      { href: "/blog/aphrodite", label: "Aphrodite", meta: "Blog" },
    ],
  },
  "/red-team/c2/mythic": {
    eyebrow: "C2",
    title: "Mythic",
    summary: "Agents Mythic perso : design et implémentation.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/c2/mythic/agents", label: "Agents", meta: "Mythic" },
      { href: "/blog/aphrodite", label: "Article blog", meta: "Blog" },
    ],
  },
  "/red-team/c2/mythic/agents": {
    eyebrow: "Mythic",
    title: "Agents",
    summary: "Agents Mythic que j'ai développés.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/c2/mythic/agents/aphrodite", label: "Aphrodite", meta: "Agents" },
      { href: "/red-team/c2/mythic", label: "Mythic", meta: "C2" },
    ],
  },
  "/red-team/c2/mythic/agents/aphrodite": {
    eyebrow: "Agents",
    title: "Aphrodite",
    summary: "Agent Mythic Linux en Nim.",
    anchors: [],
    facts: [],
    related: [
      { href: "/blog/aphrodite", label: "Article blog", meta: "Blog" },
      { href: "/red-team/c2/mythic", label: "Mythic", meta: "C2" },
    ],
  },
  "/red-team/pentest-web": {
    eyebrow: "Red Team Notes",
    title: "Pentest Web",
    summary: "Notes offensives web : injections, auth bypass, API.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit", label: "AD Exploit", meta: "Red Team Notes" },
      { href: "/cheatsheets", label: "Cheatsheets", meta: "Références rapides" },
    ],
  },
  "/arch-linux": {
    eyebrow: "Arch Linux Notes",
    title: "Arch Linux Notes",
    summary: "Notes de configuration et de maintenance pour Arch Linux.",
    anchors: [],
    facts: [],
    related: [
      { href: "/arch-linux/pacman", label: "Pacman", meta: "Arch Linux" },
      { href: "/arch-linux/grub-rescue", label: "GRUB Rescue", meta: "Arch Linux" },
    ],
  },
  "/arch-linux/pacman": {
    eyebrow: "Arch Linux",
    title: "Pacman",
    summary: "Gestion des paquets, export et hooks automatiques.",
    anchors: [
      { href: "#export", label: "Export" },
      { href: "#hooks-setup", label: "Hooks Setup" },
      { href: "#paccache", label: "Paccache" },
      { href: "#orphans", label: "Orphans" },
      { href: "#list-packages", label: "List Packages" },
      { href: "#pacnew", label: "Pacnew" },
      { href: "#arch-audit", label: "Arch-Audit" },
    ],
    facts: [],
    related: [
      { href: "/arch-linux/kernel-recovery", label: "Kernel Recovery", meta: "Arch Linux" },
      { href: "/arch-linux/grub-rescue", label: "GRUB Rescue", meta: "Arch Linux" },
    ],
  },
  "/arch-linux/zram": {
    eyebrow: "Arch Linux",
    title: "Zram",
    summary: "Swap compressé en RAM avec zram-generator et zstd.",
    anchors: [
      { href: "#install", label: "Install" },
      { href: "#config", label: "Config" },
      { href: "#enable", label: "Enable" },
      { href: "#verify", label: "Verify" },
      { href: "#swappiness", label: "Swappiness" },
    ],
    facts: [],
    related: [
      { href: "/arch-linux/pacman", label: "Pacman", meta: "Arch Linux" },
      { href: "/arch-linux/kernel-recovery", label: "Kernel Recovery", meta: "Arch Linux" },
    ],
  },
  "/arch-linux/grub-rescue": {
    eyebrow: "Arch Linux",
    title: "GRUB Rescue",
    summary: "Réparer GRUB depuis le prompt rescue quand Windows écrase l'EFI.",
    anchors: [
      { href: "#find-partition", label: "Find Partition" },
      { href: "#load-grub", label: "Load GRUB" },
      { href: "#reinstall", label: "Reinstall" },
      { href: "#verify", label: "Verify" },
    ],
    facts: [],
    related: [
      { href: "/arch-linux/kernel-recovery", label: "Kernel Recovery", meta: "Arch Linux" },
      { href: "/arch-linux/pacman", label: "Pacman", meta: "Arch Linux" },
    ],
  },
  "/arch-linux/kernel-recovery": {
    eyebrow: "Arch Linux",
    title: "Kernel Recovery",
    summary: "Recovery depuis un live USB après une mise à jour qui casse le boot.",
    anchors: [
      { href: "#mount", label: "Mount Partitions" },
      { href: "#bind", label: "Bind Mounts" },
      { href: "#chroot", label: "Chroot" },
      { href: "#fix-pacman", label: "Fix Pacman" },
      { href: "#repair", label: "Repair Packages" },
      { href: "#initramfs", label: "Initramfs" },
      { href: "#boot", label: "Fix Boot" },
    ],
    facts: [],
    related: [
      { href: "/arch-linux/grub-rescue", label: "GRUB Rescue", meta: "Arch Linux" },
      { href: "/arch-linux/pacman", label: "Pacman", meta: "Arch Linux" },
    ],
  },
  "/arch-linux/hp-printer": {
    eyebrow: "Arch Linux",
    title: "HP Printer",
    summary: "Configurer une imprimante HP avec HPLIP et CUPS.",
    anchors: [
      { href: "#install", label: "Install" },
      { href: "#manage", label: "Manage" },
    ],
    facts: [],
    related: [
      { href: "/arch-linux/pacman", label: "Pacman", meta: "Arch Linux" },
      { href: "/arch-linux/zram", label: "Zram", meta: "Arch Linux" },
    ],
  },
  "/red-team/pivoting/ligolo": {
    eyebrow: "Pivoting",
    title: "Ligolo-NG",
    summary: "Tunnel TUN kernel-space, routing de subnets internes et double pivot.",
    anchors: [
      { href: "#setup", label: "Setup" },
      { href: "#proxy", label: "Proxy" },
      { href: "#agent", label: "Agent" },
      { href: "#session", label: "Session" },
      { href: "#routing", label: "Routing" },
      { href: "#doublepivot", label: "Double Pivot" },
    ],
    facts: [],
    related: [
      { href: "/red-team/pivoting", label: "← Pivoting", meta: "Red Team Notes" },
      { href: "/red-team/ad-exploit", label: "AD Exploit", meta: "Red Team Notes" },
    ],
  },
  "/red-team/ad-exploit/information-gathering/netexec": {
    eyebrow: "Information Gathering",
    title: "NetExec (nxc)",
    summary: "Enumération SMB, LDAP, utilisateurs et délégation via nxc.",
    anchors: [
      { href: "#access", label: "Access Check" },
      { href: "#users", label: "Users & Groups" },
      { href: "#deleg", label: "Delegation" },
      { href: "#shares", label: "Shares" },
    ],
    facts: [],
    related: [
      { href: "/cheatsheets/netexec", label: "NetExec", meta: "Cheatsheet" },
      { href: "/red-team/ad-exploit/information-gathering/bloodyad", label: "BloodyAD", meta: "Information Gathering" },
    ],
  },
  "/red-team/ad-exploit/information-gathering/bloodyad": {
    eyebrow: "Information Gathering",
    title: "BloodyAD",
    summary: "Enumération LDAP profonde via bloodyAD : domaine, users, délégation.",
    anchors: [
      { href: "#domain", label: "Domain Info" },
      { href: "#users", label: "Users" },
      { href: "#creds", label: "Credentials" },
      { href: "#deleg", label: "Delegation" },
    ],
    facts: [],
    related: [
      { href: "/cheatsheets/bloodyad", label: "BloodyAD", meta: "Cheatsheet" },
      { href: "/red-team/ad-exploit/information-gathering/netexec", label: "NetExec", meta: "Information Gathering" },
    ],
  },
  "/red-team/ad-exploit/information-gathering/bloodhound": {
    eyebrow: "Information Gathering",
    title: "BloodHound & SharpHound",
    summary: "Collecte BloodHound CE pour visualisation des chemins d'attaque.",
    anchors: [],
    facts: [],
    related: [
      { href: "/my-tools/bashhound-ce", label: "BashHound-CE", meta: "My Tools" },
      { href: "/red-team/ad-exploit/information-gathering/netexec", label: "NetExec", meta: "Information Gathering" },
    ],
  },
  "/red-team/ad-exploit/information-gathering/password-misconfigs": {
    eyebrow: "Information Gathering",
    title: "Password Misconfigs",
    summary: "GPP, descriptions, AutoLogon et shares pour trouver des credentials exposés.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/pre-exploitation/password-misconfigs", label: "Password Misconfigs", meta: "Pre-Exploitation" },
      { href: "/red-team/ad-exploit/information-gathering/netexec", label: "NetExec", meta: "Information Gathering" },
    ],
  },
  "/red-team/ad-exploit/information-gathering/laps-enum": {
    eyebrow: "Information Gathering",
    title: "LAPS Enum",
    summary: "Détection et lecture des mots de passe LAPS v1 et v2.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/laps-abuse", label: "LAPS Abuse", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/information-gathering/netexec", label: "NetExec", meta: "Information Gathering" },
    ],
  },
  "/red-team/ad-exploit/information-gathering/kerberos-auth": {
    eyebrow: "Information Gathering",
    title: "Kerberos Auth",
    summary: "Obtention de TGT, gestion ccache et vérification Kerberos.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/kerberos-attacks", label: "Kerberos Attacks", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/information-gathering/netexec", label: "NetExec", meta: "Information Gathering" },
    ],
  },
  "/red-team/ad-exploit/information-gathering/pre-win2000": {
    eyebrow: "Information Gathering",
    title: "Pre-Win2000",
    summary: "Abus du groupe Pre-Windows 2000 Compatible Access pour null session.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/information-gathering/netexec", label: "NetExec", meta: "Information Gathering" },
      { href: "/red-team/ad-exploit/exploitation/maq-abuse", label: "MAQ Abuse", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/information-gathering/maq-abuse": {
    eyebrow: "Information Gathering",
    title: "MAQ Abuse",
    summary: "Vérification et exploitation de la Machine Account Quota.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/maq-abuse", label: "MAQ Abuse", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/exploitation/delegation-attacks", label: "Delegation Attacks", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/information-gathering/linux-ad": {
    eyebrow: "Information Gathering",
    title: "Linux in AD",
    summary: "Enumération depuis Linux : realm, keytab, ccache et tickets Kerberos.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/information-gathering/kerberos-auth", label: "Kerberos Auth", meta: "Information Gathering" },
      { href: "/red-team/ad-exploit/information-gathering/netexec", label: "NetExec", meta: "Information Gathering" },
    ],
  },
  "/red-team/ad-exploit/pre-exploitation/relay-attacks": {
    eyebrow: "Pre-Exploitation",
    title: "Relay Attacks",
    summary: "Repérer les cibles sans signing, capturer et relayer les hashes NTLM.",
    anchors: [
      { href: "#recon", label: "Recon" },
      { href: "#responder", label: "Responder" },
      { href: "#ntlmrelayx", label: "ntlmrelayx" },
    ],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/pre-exploitation/network-attacks", label: "Network Attacks", meta: "Pre-Exploitation" },
      { href: "/red-team/ad-exploit/pre-exploitation/coercion", label: "Coercion", meta: "Pre-Exploitation" },
    ],
  },
  "/red-team/ad-exploit/pre-exploitation/phishing": {
    eyebrow: "Pre-Exploitation",
    title: "Phishing & Initial Access",
    summary: "HTA, macros Office et combinaisons avec relay pour accès initial.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/pre-exploitation/relay-attacks", label: "Relay Attacks", meta: "Pre-Exploitation" },
      { href: "/red-team/ad-exploit/pre-exploitation/network-attacks", label: "Network Attacks", meta: "Pre-Exploitation" },
    ],
  },
  "/red-team/ad-exploit/pre-exploitation/network-attacks": {
    eyebrow: "Pre-Exploitation",
    title: "Network Attacks",
    summary: "IPv6 takeover avec mitm6, LLMNR/NBT-NS poisoning et WPAD abuse.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/pre-exploitation/relay-attacks", label: "Relay Attacks", meta: "Pre-Exploitation" },
      { href: "/red-team/ad-exploit/pre-exploitation/coercion", label: "Coercion", meta: "Pre-Exploitation" },
    ],
  },
  "/red-team/ad-exploit/pre-exploitation/wsus": {
    eyebrow: "Pre-Exploitation",
    title: "WSUS Attack",
    summary: "Exploiter un WSUS mal configuré (HTTP) pour pousser de fausses mises à jour.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/pre-exploitation/relay-attacks", label: "Relay Attacks", meta: "Pre-Exploitation" },
      { href: "/red-team/ad-exploit/exploitation/gpo-abuse", label: "GPO Abuse", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/pre-exploitation/exchange": {
    eyebrow: "Pre-Exploitation",
    title: "Exchange / Outlook Attacks",
    summary: "PrivExchange, ProxyShell et relay NTLM via Exchange.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/pre-exploitation/relay-attacks", label: "Relay Attacks", meta: "Pre-Exploitation" },
      { href: "/red-team/ad-exploit/exploitation/credential-attacks", label: "Credential Attacks", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/pre-exploitation/password-misconfigs": {
    eyebrow: "Pre-Exploitation",
    title: "Password Misconfigs",
    summary: "GPP, descriptions et shares pour trouver des credentials exposés.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/information-gathering/password-misconfigs", label: "Password Misconfigs", meta: "Information Gathering" },
      { href: "/red-team/ad-exploit/exploitation/credential-attacks", label: "Credential Attacks", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/pre-exploitation/coercion": {
    eyebrow: "Pre-Exploitation",
    title: "Coercion",
    summary: "PetitPotam, PrinterBug et Coercer pour forcer des authentifications NTLM.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/pre-exploitation/relay-attacks", label: "Relay Attacks", meta: "Pre-Exploitation" },
      { href: "/red-team/ad-exploit/exploitation/delegation-attacks", label: "Delegation Attacks", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/exploitation": {
    eyebrow: "AD Exploit",
    title: "Exploitation",
    summary: "Kerberos, délégation, ACL, ADCS et abus de groupes sensibles.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/pre-exploitation", label: "Pre-Exploitation", meta: "AD Exploit" },
      { href: "/red-team/ad-exploit/post-exploitation", label: "Post-Exploitation", meta: "AD Exploit" },
    ],
  },
  "/red-team/ad-exploit/exploitation/credential-attacks": {
    eyebrow: "Exploitation",
    title: "Credential Attacks",
    summary: "LAPS, gMSA, DCSync et secrets locaux.",
    anchors: [
      { href: "#managed", label: "LAPS & gMSA" },
      { href: "#dcsync", label: "DCSync" },
      { href: "#local", label: "SAM / LSA" },
    ],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/kerberos-attacks", label: "Kerberos Attacks", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/post-exploitation/win-privesc/credential-dumping", label: "Credential Dumping", meta: "Win PrivEsc" },
    ],
  },
  "/red-team/ad-exploit/exploitation/kerberos-attacks": {
    eyebrow: "Exploitation",
    title: "Kerberos Attacks",
    summary: "AS-REP, Kerberoasting, PTT et tickets forgés.",
    anchors: [
      { href: "#asrep", label: "AS-REP Roasting" },
      { href: "#kerb", label: "Kerberoasting" },
      { href: "#ptt", label: "Pass-the-Ticket" },
      { href: "#forged", label: "Forged Tickets" },
    ],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/delegation-attacks", label: "Delegation Attacks", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/exploitation/credential-attacks", label: "Credential Attacks", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/exploitation/delegation-attacks": {
    eyebrow: "Exploitation",
    title: "Delegation Attacks",
    summary: "Unconstrained, constrained et RBCD.",
    anchors: [
      { href: "#enum", label: "Enumeration" },
      { href: "#rbcd", label: "RBCD" },
      { href: "#constrained", label: "Constrained" },
      { href: "#unconstrained", label: "Unconstrained" },
    ],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/kerberos-attacks", label: "Kerberos Attacks", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/exploitation/acl-gpo/acl-abuse", label: "ACL Abuse", meta: "ACL & GPO" },
    ],
  },
  "/red-team/ad-exploit/exploitation/domain-privesc": {
    eyebrow: "Exploitation",
    title: "Domain Privilege Escalation",
    summary: "Groupes sensibles, AdminSDHolder et trust attacks.",
    anchors: [
      { href: "#groups", label: "Sensitive Groups" },
      { href: "#sdprop", label: "AdminSDHolder" },
      { href: "#trust", label: "Trust Attacks" },
    ],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/acl-gpo/acl-abuse", label: "ACL Abuse", meta: "ACL & GPO" },
      { href: "/red-team/ad-exploit/exploitation/credential-attacks", label: "Credential Attacks", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/exploitation/bloodyad-attacks": {
    eyebrow: "Exploitation",
    title: "BloodyAD Attacks",
    summary: "Manipulation LDAP directe : objets, ACLs et persistance.",
    anchors: [
      { href: "#objects", label: "Objects" },
      { href: "#reads", label: "Sensitive Reads" },
      { href: "#deleg", label: "Delegation" },
    ],
    facts: [],
    related: [
      { href: "/cheatsheets/bloodyad", label: "BloodyAD", meta: "Cheatsheet" },
      { href: "/red-team/ad-exploit/exploitation/acl-gpo/acl-abuse", label: "ACL Abuse", meta: "ACL & GPO" },
    ],
  },
  "/red-team/ad-exploit/exploitation/acl-gpo": {
    eyebrow: "Exploitation",
    title: "ACL & GPO",
    summary: "ACL abuse et ADCS attacks pour escalade domaine.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/acl-gpo/acl-abuse", label: "ACL Abuse", meta: "ACL & GPO" },
      { href: "/red-team/ad-exploit/exploitation/acl-gpo/adcs-attacks", label: "ADCS Attacks", meta: "ACL & GPO" },
    ],
  },
  "/red-team/ad-exploit/exploitation/acl-gpo/acl-abuse": {
    eyebrow: "ACL & GPO",
    title: "ACL Abuse",
    summary: "GenericAll, WriteDacl, owner takeover et shadow credentials.",
    anchors: [
      { href: "#recon", label: "Recon" },
      { href: "#generic", label: "GenericAll" },
      { href: "#dacl", label: "WriteDacl" },
      { href: "#group", label: "AddMember" },
    ],
    facts: [],
    related: [
      { href: "/cheatsheets/bloodyad", label: "BloodyAD", meta: "Cheatsheet" },
      { href: "/red-team/ad-exploit/exploitation/acl-gpo/adcs-attacks", label: "ADCS Attacks", meta: "ACL & GPO" },
    ],
  },
  "/red-team/ad-exploit/exploitation/acl-gpo/adcs-attacks": {
    eyebrow: "ACL & GPO",
    title: "ADCS Attacks",
    summary: "ESC1, ESC4, ESC8 et relay vers Web Enrollment.",
    anchors: [
      { href: "#enum", label: "Enumeration" },
      { href: "#esc1", label: "ESC1 & ESC2" },
      { href: "#esc4", label: "ESC4 & ESC6" },
      { href: "#esc8", label: "ESC8 Relay" },
    ],
    facts: [],
    related: [
      { href: "/cheatsheets/certipy", label: "Certipy", meta: "Cheatsheet" },
      { href: "/red-team/esc", label: "ESC", meta: "Red Team Notes" },
    ],
  },
  "/red-team/ad-exploit/exploitation/backup-operator": {
    eyebrow: "Exploitation",
    title: "Backup Operator",
    summary: "Extraire SAM, SYSTEM et ntds.dit via les droits Backup Operators.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/credential-attacks", label: "Credential Attacks", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/exploitation/server-operators", label: "Server Operators", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/exploitation/mssql-attacks": {
    eyebrow: "Exploitation",
    title: "MSSQL Attacks",
    summary: "xp_cmdshell, capture de hash et pivot via linked servers.",
    anchors: [
      { href: "#enum", label: "Enumeration" },
      { href: "#exec", label: "Command Exec" },
      { href: "#pivot", label: "Hash & Pivot" },
    ],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/credential-attacks", label: "Credential Attacks", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/pre-exploitation/relay-attacks", label: "Relay Attacks", meta: "Pre-Exploitation" },
    ],
  },
  "/red-team/ad-exploit/exploitation/applocker-wdac": {
    eyebrow: "Exploitation",
    title: "AppLocker / WDAC Bypass",
    summary: "Contourner les restrictions d'exécution via LOLBAS et compilation.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/process-injection", label: "Process Injection", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/post-exploitation/win-privesc/local-privesc", label: "Local PrivEsc", meta: "Win PrivEsc" },
    ],
  },
  "/red-team/ad-exploit/exploitation/laps-abuse": {
    eyebrow: "Exploitation",
    title: "LAPS Abuse",
    summary: "Lire les mots de passe LAPS v1/v2 et les utiliser pour mouvement latéral.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/information-gathering/laps-enum", label: "LAPS Enum", meta: "Information Gathering" },
      { href: "/red-team/ad-exploit/exploitation/credential-attacks", label: "Credential Attacks", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/exploitation/process-injection": {
    eyebrow: "Exploitation",
    title: "Process Injection",
    summary: "Shellcode injection et process hollowing pour exécution furtive.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/applocker-wdac", label: "AppLocker / WDAC", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/post-exploitation/win-privesc/credential-dumping", label: "Credential Dumping", meta: "Win PrivEsc" },
    ],
  },
  "/red-team/ad-exploit/exploitation/maq-abuse": {
    eyebrow: "Exploitation",
    title: "MAQ Abuse",
    summary: "Créer un compte machine via MAQ pour une chaîne RBCD.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/delegation-attacks", label: "Delegation Attacks", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/information-gathering/maq-abuse", label: "MAQ Abuse", meta: "Information Gathering" },
    ],
  },
  "/red-team/ad-exploit/exploitation/account-operators": {
    eyebrow: "Exploitation",
    title: "Account Operators",
    summary: "Créer et modifier des utilisateurs via le groupe Account Operators.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/domain-privesc", label: "Domain PrivEsc", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/exploitation/backup-operator", label: "Backup Operator", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/exploitation/print-server-operators": {
    eyebrow: "Exploitation",
    title: "Print & Server Operators",
    summary: "SeLoadDriverPrivilege via Print Operators pour obtenir SYSTEM sur le DC.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/post-exploitation/win-privesc/server-operators", label: "Server Operators", meta: "Win PrivEsc" },
      { href: "/red-team/ad-exploit/exploitation/backup-operator", label: "Backup Operator", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/exploitation/ad-recycle-bin": {
    eyebrow: "Exploitation",
    title: "AD Recycle Bin",
    summary: "Lire les objets supprimés pour retrouver des credentials résiduels.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/credential-attacks", label: "Credential Attacks", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/post-exploitation/win-privesc/ad-recycle-bin", label: "AD Recycle Bin", meta: "Win PrivEsc" },
    ],
  },
  "/red-team/ad-exploit/exploitation/dns-admins": {
    eyebrow: "Exploitation",
    title: "DNS Admins",
    summary: "Charger une DLL dans le service DNS via DnsAdmins pour SYSTEM.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/post-exploitation/win-privesc/dns-admins", label: "DNS Admins", meta: "Win PrivEsc" },
      { href: "/red-team/ad-exploit/exploitation/print-server-operators", label: "Print & Server Operators", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/exploitation/gpo-abuse": {
    eyebrow: "Exploitation",
    title: "GPO Abuse",
    summary: "Modifier des GPOs pour exécuter du code sur les machines d'une OU.",
    anchors: [
      { href: "#enum", label: "Enumeration" },
      { href: "#modify", label: "Modification" },
    ],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/acl-gpo/acl-abuse", label: "ACL Abuse", meta: "ACL & GPO" },
      { href: "/red-team/ad-exploit/exploitation/domain-privesc", label: "Domain PrivEsc", meta: "Exploitation" },
    ],
  },
  "/red-team/ad-exploit/exploitation/misc-cves": {
    eyebrow: "Exploitation",
    title: "Misc CVEs",
    summary: "Zerologon, PrintNightmare, noPac et EternalBlue : détection rapide.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/kerberos-attacks", label: "Kerberos Attacks", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/exploitation/acl-gpo/adcs-attacks", label: "ADCS Attacks", meta: "ACL & GPO" },
    ],
  },
  "/red-team/ad-exploit/post-exploitation": {
    eyebrow: "AD Exploit",
    title: "Post-Exploitation",
    summary: "Mouvement latéral, persistance et nettoyage OPSEC.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation", label: "Exploitation", meta: "AD Exploit" },
      { href: "/red-team/pivoting", label: "Pivoting", meta: "Red Team Notes" },
    ],
  },
  "/red-team/ad-exploit/post-exploitation/lateral-movement": {
    eyebrow: "Post-Exploitation",
    title: "Lateral Movement",
    summary: "SMB, WMI, WinRM et Kerberos pour mouvement latéral.",
    anchors: [
      { href: "#smb", label: "SMB" },
      { href: "#kerberos", label: "Kerberos" },
      { href: "#remote", label: "WinRM & RDP" },
    ],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/post-exploitation/win-privesc/credential-dumping", label: "Credential Dumping", meta: "Win PrivEsc" },
      { href: "/red-team/pivoting", label: "Pivoting", meta: "Red Team Notes" },
    ],
  },
  "/red-team/ad-exploit/post-exploitation/procedures": {
    eyebrow: "Post-Exploitation",
    title: "Procedures & Cleanup",
    summary: "Persistance discrète et nettoyage OPSEC après compromission.",
    anchors: [
      { href: "#persist", label: "Persistence" },
      { href: "#cleanup", label: "Cleanup" },
    ],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/post-exploitation/lateral-movement", label: "Lateral Movement", meta: "Post-Exploitation" },
      { href: "/red-team/ad-exploit/exploitation/acl-gpo/acl-abuse", label: "ACL Abuse", meta: "ACL & GPO" },
    ],
  },
  "/red-team/ad-exploit/post-exploitation/win-privesc": {
    eyebrow: "Post-Exploitation",
    title: "Windows Privilege Escalation",
    summary: "Potato attacks, credential dumping et abus de groupes privilegiés.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/post-exploitation/lateral-movement", label: "Lateral Movement", meta: "Post-Exploitation" },
      { href: "/red-team/privesc-windows", label: "Privesc Windows", meta: "Red Team Notes" },
    ],
  },
  "/red-team/ad-exploit/post-exploitation/win-privesc/potato-attacks": {
    eyebrow: "Windows Privilege Escalation",
    title: "Potato Attacks",
    summary: "GodPotato, PrintSpoofer et RoguePotato pour SeImpersonate vers SYSTEM.",
    anchors: [
      { href: "#enum", label: "Privileges" },
      { href: "#godpotato", label: "GodPotato" },
      { href: "#printspoofer", label: "PrintSpoofer" },
    ],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/post-exploitation/win-privesc/credential-dumping", label: "Credential Dumping", meta: "Win PrivEsc" },
      { href: "/red-team/ad-exploit/post-exploitation/win-privesc/local-privesc", label: "Local PrivEsc", meta: "Win PrivEsc" },
    ],
  },
  "/red-team/ad-exploit/post-exploitation/win-privesc/credential-dumping": {
    eyebrow: "Windows Privilege Escalation",
    title: "Credential Dumping",
    summary: "LSASS, SAM, LSA et DPAPI : tout extraire d'une machine Windows.",
    anchors: [
      { href: "#lsass", label: "LSASS" },
      { href: "#sam", label: "SAM & Registry" },
    ],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/credential-attacks", label: "Credential Attacks", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/post-exploitation/lateral-movement", label: "Lateral Movement", meta: "Post-Exploitation" },
    ],
  },
  "/red-team/ad-exploit/post-exploitation/win-privesc/local-privesc": {
    eyebrow: "Windows Privilege Escalation",
    title: "Local PrivEsc",
    summary: "Services, tâches planifiées et credentials en clair pour escalade locale.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/post-exploitation/win-privesc/potato-attacks", label: "Potato Attacks", meta: "Win PrivEsc" },
      { href: "/red-team/privesc-windows", label: "Privesc Windows", meta: "Red Team Notes" },
    ],
  },
  "/red-team/ad-exploit/post-exploitation/win-privesc/server-operators": {
    eyebrow: "Windows Privilege Escalation",
    title: "Server Operators",
    summary: "Modifier des services pour exécuter du code SYSTEM sur le DC.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/print-server-operators", label: "Print & Server Operators", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/post-exploitation/win-privesc/potato-attacks", label: "Potato Attacks", meta: "Win PrivEsc" },
    ],
  },
  "/red-team/ad-exploit/post-exploitation/win-privesc/dns-admins": {
    eyebrow: "Windows Privilege Escalation",
    title: "DNS Admins",
    summary: "Charger une DLL dans le service DNS pour SYSTEM sur le DC.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/dns-admins", label: "DNS Admins", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/post-exploitation/win-privesc/server-operators", label: "Server Operators", meta: "Win PrivEsc" },
    ],
  },
  "/red-team/ad-exploit/post-exploitation/win-privesc/ad-recycle-bin": {
    eyebrow: "Windows Privilege Escalation",
    title: "AD Recycle Bin",
    summary: "Explorer les objets supprimés pour retrouver des credentials résiduels.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/ad-exploit/exploitation/ad-recycle-bin", label: "AD Recycle Bin", meta: "Exploitation" },
      { href: "/red-team/ad-exploit/exploitation/credential-attacks", label: "Credential Attacks", meta: "Exploitation" },
    ],
  },
  "/writeups/htb": {
    eyebrow: "Writeups HackTheBox",
    title: "Machines HTB",
    summary: "Résolutions triées par difficulté et OS.",
    anchors: [
      { href: "#easy", label: "Easy" },
      { href: "#medium", label: "Medium" },
      { href: "#hard", label: "Hard" },
      { href: "#insane", label: "Insane" },
    ],
    facts: [],
    related: [
      { href: "/writeups/ctf", label: "CTF", meta: "Compétitions et challenges" },
      { href: "/writeups/prolab", label: "ProLab", meta: "Labs red team HTB" },
    ],
  },
  "/writeups/ctf": {
    eyebrow: "Writeups CTF",
    title: "CTF & Compétitions",
    summary: "Writeups de challenges CTF par événement.",
    anchors: [{ href: "#ctf", label: "Challenges" }],
    facts: [],
    related: [
      { href: "/writeups/htb", label: "HackTheBox", meta: "Machines par difficulté" },
      { href: "/blog", label: "Blog", meta: "Articles techniques" },
    ],
  },
  "/writeups/prolab": {
    eyebrow: "Writeups ProLab",
    title: "HackTheBox ProLabs",
    summary: "Scénarios red team multi-machines, triés par tier.",
    anchors: [{ href: "#prolab", label: "Labs" }],
    facts: [],
    related: [
      { href: "/writeups/htb", label: "HackTheBox", meta: "Machines par difficulté" },
      { href: "/red-team", label: "Red Team Notes", meta: "Méthodologie" },
    ],
  },
  "/blog": {
    eyebrow: "Blog",
    title: "Notes techniques",
    summary: "Billets plus longs sur l'implémentation et les choix de design.",
    anchors: [
      { href: "#archive", label: "Articles" },
      { href: "#topics", label: "Topics" },
    ],
    facts: [],
    related: [
      { href: `/blog/${articles[0].slug}`, label: articles[0].title, meta: articles[0].category },
      { href: "/red-team", label: "Red Team Notes", meta: "Méthodologie offensive" },
    ],
  },
};

export function getRailContext(pathname: string): RailContext {
  if (staticRailContexts[pathname]) {
    return staticRailContexts[pathname];
  }

  const article = articles.find((a) => pathname === `/blog/${a.slug}`);
  if (article) {
    return {
      eyebrow: "Article",
      title: article.title,
      summary: article.excerpt,
      anchors: [{ href: "/blog", label: "← Blog" }],
      facts: [],
      related: articles
        .filter((a) => a.slug !== article.slug)
        .slice(0, 2)
        .map((a) => ({ href: `/blog/${a.slug}`, label: a.title, meta: `${a.category} · ${a.date}` })),
    };
  }

  const writeup = writeups.find((w) => pathname === `/writeups/${w.slug}`);
  if (writeup) {
    const backHref =
      writeup.type === "htb" ? "/writeups/htb" : writeup.type === "ctf" ? "/writeups/ctf" : "/writeups/prolab";
    const backLabel =
      writeup.type === "htb" ? "← HackTheBox" : writeup.type === "ctf" ? "← CTF" : "← ProLab";
    return {
      eyebrow: "Writeup",
      title: writeup.title,
      summary: writeup.excerpt,
      anchors: [{ href: backHref, label: backLabel }],
      facts: [],
      related: writeups
        .filter((w) => w.slug !== writeup.slug && w.type === writeup.type)
        .slice(0, 2)
        .map((w) => ({ href: `/writeups/${w.slug}`, label: w.title, meta: `${w.platform} · ${w.date}` })),
    };
  }

  return {
    eyebrow: "0xbbuddha",
    title: "Knowledge Base",
    summary: "Portfolio, writeups et notes techniques.",
    anchors: [],
    facts: [],
    related: [{ href: "/", label: "README", meta: "Accueil" }],
  };
}
