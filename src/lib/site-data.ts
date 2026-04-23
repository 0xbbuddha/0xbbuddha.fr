export type ProjectEntry = {
  title: string;
  description: string;
  tags: string[];
  href: string;
  external: boolean;
  status: string;
  note: string;
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

export type WriteupType = "htb" | "ctf";
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
  {
    title: "ArchimedeaOS",
    description:
      "Distribution Arch Linux orientée Purple Team pour disposer d'un environnement cohérent pendant les exercices red/blue.",
    tags: ["Purple Team", "Arch Linux", "Distribution"],
    href: "https://github.com/ArchimedeaOS-Development",
    external: true,
    status: "System build",
    note: "Base d'outillage unifiée pour labs et expérimentations offensives.",
  },
  {
    title: "Nihil",
    description:
      "Environnement de pentest complet avec images Docker et stack de labo pour tests d'intrusion reproductibles.",
    tags: ["Pentest", "Docker", "Python"],
    href: "https://github.com/TheNullPigeons",
    external: true,
    status: "Lab stack",
    note: "Pensé pour prototyper vite, casser vite, reconstruire proprement.",
  },
  {
    title: "BashHound-CE",
    description:
      "Collecteur Active Directory pour BloodHound Community Edition, écrit entièrement en Bash.",
    tags: ["BloodHound", "AD", "Bash", "Red Team"],
    href: "https://github.com/0xbbuddha/BashHound-CE",
    external: true,
    status: "Open source",
    note: "Une exploration technique sur LDAP, ASN.1 et les graphes AD sans dépendance lourde.",
  },
  {
    title: "Hermes",
    description:
      "Agent Mythic C2 Linux écrit en Python avec check-in, tasking et primitives de contrôle opérateur.",
    tags: ["Mythic C2", "Python", "Red Team"],
    href: "https://github.com/0xbbuddha/hermes",
    external: true,
    status: "Agent C2",
    note: "Projet orienté compréhension interne du fonctionnement d'un implant et de son protocole.",
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
  },
  {
    title: "FreeMalwares",
    description:
      "Projet en C dédié à l'étude pédagogique de techniques d'obfuscation et d'évasion en environnement contrôlé.",
    tags: ["C", "Maldev", "Educatif"],
    href: "https://github.com/FreeMalwares",
    external: true,
    status: "Research",
    note: "Approche strictement éducative pour comprendre les mécanismes, pas pour les industrialiser.",
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
];

export const htbWriteups = writeups.filter((w) => w.type === "htb");
export const ctfWriteups = writeups.filter((w) => w.type === "ctf");

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

export const navigationGroups: NavigationGroup[] = [
  {
    titleKey: "startHere",
    items: [{ href: "/", label: "README", badge: "00" }],
  },
  {
    titleKey: "redTeam",
    items: [{
      href: "/red-team",
      label: "Red Team Notes",
      children: [
        { href: "/red-team/ad-exploit", label: "AD Exploit" },
        { href: "/red-team/privesc-windows", label: "Privesc Windows" },
        { href: "/red-team/privesc-linux", label: "Privesc Linux" },
        { href: "/red-team/esc", label: "ESC" },
        { href: "/red-team/pivoting", label: "Pivoting", children: [
          { href: "/red-team/pivoting/ligolo", label: "Ligolo-NG" },
        ]},
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
      ],
    }],
  },
  {
    titleKey: "myTools",
    items: [{
      href: "/my-tools",
      label: "My Tools",
      children: [
        { href: "/my-tools/gofenrir", label: "GoFenrir" },
        { href: "/my-tools/bashhound-ce", label: "BashHound-CE" },
      ],
    }],
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
    ],
  },
  {
    titleKey: "blog",
    items: [{ href: "/blog", label: "Blog", badge: String(articles.length).padStart(2, "0") }],
  },
];

const staticRailContexts: Record<string, RailContext> = {
  "/": {
    eyebrow: "README",
    title: "0xbbuddha",
    summary: "Portfolio, projets, compétences et notes de terrain.",
    anchors: [
      { href: "#overview", label: "Overview" },
      { href: "#whoami", label: "whoami" },
      { href: "#projects", label: "Projects" },
      { href: "#skills", label: "Skills" },
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
    summary: "Commandes nxc par protocole — SMB, LDAP, MSSQL, WinRM, SSH.",
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
    summary: "Enumérateur AD/SMB Go — LDAP et SMB par section.",
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
    summary: "Chaînes d'exploitation Active Directory.",
    anchors: [],
    facts: [],
    related: [
      { href: "/red-team/privesc-windows", label: "Privesc Windows", meta: "Red Team Notes" },
      { href: "/cheatsheets/netexec", label: "NetExec", meta: "Cheatsheet" },
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
  "/writeups/htb": {
    eyebrow: "Writeups — HackTheBox",
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
      { href: "/red-team", label: "Red Team Notes", meta: "Méthodologie" },
    ],
  },
  "/writeups/ctf": {
    eyebrow: "Writeups — CTF",
    title: "CTF & Compétitions",
    summary: "Writeups de challenges CTF par événement.",
    anchors: [{ href: "#ctf", label: "Challenges" }],
    facts: [],
    related: [
      { href: "/writeups/htb", label: "HackTheBox", meta: "Machines par difficulté" },
      { href: "/blog", label: "Blog", meta: "Articles techniques" },
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
    const backHref = writeup.type === "htb" ? "/writeups/htb" : "/writeups/ctf";
    const backLabel = writeup.type === "htb" ? "← HackTheBox" : "← CTF";
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
