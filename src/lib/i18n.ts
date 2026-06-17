export type Lang = "fr" | "en";

const fr = {
  nav: {
    groups: {
      startHere: "Par ici",
      redTeam: "Red Team Notes",
      pentestWeb: "Pentest Web Notes",
      archLinux: "Arch Linux Notes",
      cheatsheets: "Cheatsheets",
      myTools: "My Tools",
      writeups: "Writeups",
      blog: "Blog",
      misc: "Misc",
    },
    items: {
      readme: "README",
      search: "Recherche",
      redTeam: "Red Team Notes",
      cheatsheets: "Cheatsheets",
      myTools: "My Tools",
      htb: "HackTheBox",
      ctf: "CTF",
      prolab: "ProLab",
      blog: "Blog",
    },
  },
  home: {
    eyebrow: "README",
    sections: "Sections",
    recent: "Dernières entrées",
    focus: "Focus actuel",
  },
  writeups: {
    htb: {
      eyebrow: "Writeups HackTheBox",
      title: "Machines HackTheBox",
      description:
        "Résolutions organisées par difficulté et système d'exploitation.",
      noEntries: "Aucune machine dans cette catégorie.",
    },
    ctf: {
      eyebrow: "Writeups CTF",
      title: "CTF & Compétitions",
      description:
        "Writeups de challenges CTF et compétitions de hacking.",
      noEntries: "Aucun writeup CTF pour l'instant.",
    },
    prolab: {
      eyebrow: "Writeups ProLab",
      title: "HackTheBox ProLabs",
      description:
        "Scénarios red team multi-machines, triés par tier (Operator, Adversary...).",
      noEntries: "Aucun ProLab dans cette catégorie.",
    },
  },
  blog: {
    eyebrow: "Blog",
    title: "Notes techniques",
    description:
      "Des billets plus longs pour raconter l'implémentation, les compromis et les angles de design derrière les outils.",
    topics: "Topics récurrents",
  },
  portfolio: {
    eyebrow: "Portfolio",
    title: "Outils & labs",
    description:
      "Un inventaire de projets présenté comme un workbench documentaire. Chaque projet est traité comme une brique de travail.",
    domains: "Domaines de travail",
  },
  redTeam: {
    eyebrow: "Red Team Notes",
    title: "Notes de terrain offensif",
    description:
      "Méthodologie, techniques, chaînes d'attaque et notes de terrain accumulées pendant des labs et des engagements.",
    wip: "Ce contenu est en cours de rédaction.",
  },
  cheatsheets: {
    eyebrow: "Cheatsheets",
    title: "Références rapides",
    description:
      "Commandes, syntaxes et usages essentiels pour les outils courants.",
    wip: "Les cheatsheets sont en cours d'ajout.",
  },
  myTools: {
    eyebrow: "My Tools",
    title: "Documentation outils perso",
    description:
      "Documentation d'usage et notes techniques pour les outils que j'ai construits.",
    wip: "La documentation est en cours de rédaction.",
  },
  common: {
    entries: "entrées",
    comingSoon: "À venir",
    langToggle: "EN",
    protected: "protégé",
  },
  shell: {
    knowledgeBase: "Base de connaissances",
    onThisPage: "Sur cette page",
    related: "Liens liés",
    navigation: "Navigation",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },
  article: {
    backBlog: "Blog",
    backWriteups: "Writeups",
    backHTB: "HackTheBox",
    backCTF: "CTF",
  },
};

const en = {
  nav: {
    groups: {
      startHere: "Start Here",
      redTeam: "Red Team Notes",
      pentestWeb: "Pentest Web Notes",
      archLinux: "Arch Linux Notes",
      cheatsheets: "Cheatsheets",
      myTools: "My Tools",
      writeups: "Writeups",
      blog: "Blog",
      misc: "Misc",
    },
    items: {
      readme: "README",
      search: "Search",
      redTeam: "Red Team Notes",
      cheatsheets: "Cheatsheets",
      myTools: "My Tools",
      htb: "HackTheBox",
      ctf: "CTF",
      prolab: "ProLab",
      blog: "Blog",
    },
  },
  home: {
    eyebrow: "README",
    sections: "Sections",
    recent: "Latest entries",
    focus: "Current focus",
  },
  writeups: {
    htb: {
      eyebrow: "Writeups HackTheBox",
      title: "HackTheBox Machines",
      description:
        "Writeups organized by difficulty and operating system.",
      noEntries: "No machines in this category yet.",
    },
    ctf: {
      eyebrow: "Writeups CTF",
      title: "CTF & Competitions",
      description:
        "Writeups for CTF challenges and hacking competitions.",
      noEntries: "No CTF writeups yet.",
    },
    prolab: {
      eyebrow: "Writeups ProLab",
      title: "HackTheBox ProLabs",
      description:
        "Multi-machine red team scenarios, sorted by tier (Operator, Adversary...).",
      noEntries: "No ProLab in this category yet.",
    },
  },
  blog: {
    eyebrow: "Blog",
    title: "Technical Notes",
    description:
      "Longer posts to cover implementation details, trade-offs and design decisions behind the tools.",
    topics: "Recurring topics",
  },
  portfolio: {
    eyebrow: "Portfolio",
    title: "Tools & Labs",
    description:
      "A project inventory presented as a documentation workbench. Each project is treated as a functional building block.",
    domains: "Work domains",
  },
  redTeam: {
    eyebrow: "Red Team Notes",
    title: "Offensive Field Notes",
    description:
      "Methodology, techniques, attack chains and field notes accumulated during labs and engagements.",
    wip: "This content is being written.",
  },
  cheatsheets: {
    eyebrow: "Cheatsheets",
    title: "Quick References",
    description:
      "Commands, syntax and essential usage for common tools.",
    wip: "Cheatsheets are being added.",
  },
  myTools: {
    eyebrow: "My Tools",
    title: "Personal Tools Docs",
    description:
      "Usage documentation and technical notes for tools I built.",
    wip: "Documentation is being written.",
  },
  common: {
    entries: "entries",
    comingSoon: "Coming soon",
    langToggle: "FR",
    protected: "protected",
  },
  shell: {
    knowledgeBase: "Knowledge Base",
    onThisPage: "On this page",
    related: "Related",
    navigation: "Navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  article: {
    backBlog: "Blog",
    backWriteups: "Writeups",
    backHTB: "HackTheBox",
    backCTF: "CTF",
  },
} satisfies typeof fr;

export const translations: Record<Lang, typeof fr> = { fr, en };
export type Tr = typeof fr;
