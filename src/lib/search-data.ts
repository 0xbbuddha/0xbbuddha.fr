import { articles, writeups } from "@/lib/site-data";

export type SearchEntryType = "tool" | "cheatsheet" | "command" | "writeup" | "article" | "hub";

export type SearchEntry = {
  id: string;
  type: SearchEntryType;
  title: string;
  href: string;
  summary: string;
  tags: string[];
  command?: string;
};

const staticEntries: SearchEntry[] = [
  {
    id: "tool-gofenrir",
    type: "tool",
    title: "GoFenrir",
    href: "/my-tools/gofenrir",
    summary: "AD/SMB enumeration tool written in Go.",
    tags: ["tool", "ad", "ldap", "smb", "gofenrir"],
  },
  {
    id: "tool-bashhound-ce",
    type: "tool",
    title: "BashHound-CE",
    href: "/my-tools/bashhound-ce",
    summary: "BloodHound CE collector in pure Bash.",
    tags: ["tool", "bloodhound", "ldap", "bash", "bashhound-ce"],
  },
  {
    id: "sheet-netexec",
    type: "cheatsheet",
    title: "NetExec Cheatsheet",
    href: "/cheatsheets/netexec",
    summary: "SMB, LDAP, MSSQL, WinRM and SSH quick references.",
    tags: ["cheatsheet", "nxc", "netexec", "smb", "ldap", "mssql", "winrm", "ssh"],
  },
  {
    id: "sheet-bloodyad",
    type: "cheatsheet",
    title: "BloodyAD Cheatsheet",
    href: "/cheatsheets/bloodyad",
    summary: "AD enumeration and abuse from Linux.",
    tags: ["cheatsheet", "bloodyad", "ad", "acl", "kerberos"],
  },
  {
    id: "sheet-certipy",
    type: "cheatsheet",
    title: "Certipy Cheatsheet",
    href: "/cheatsheets/certipy",
    summary: "ADCS enumeration and ESC exploitation.",
    tags: ["cheatsheet", "certipy", "adcs", "esc", "pki"],
  },
  {
    id: "hub-ad",
    type: "hub",
    title: "Hub AD",
    href: "/hub/ad",
    summary: "Active Directory exploitation, cheatsheets, and tools.",
    tags: ["hub", "ad", "active-directory", "ldap", "kerberos"],
  },
  {
    id: "hub-c2",
    type: "hub",
    title: "Hub C2",
    href: "/hub/c2",
    summary: "C2 notes, tooling and related posts.",
    tags: ["hub", "c2", "mythic", "agent"],
  },
  {
    id: "hub-privesc",
    type: "hub",
    title: "Hub PrivEsc",
    href: "/hub/privesc",
    summary: "Windows and Linux privilege escalation resources.",
    tags: ["hub", "privesc", "windows", "linux"],
  },
  {
    id: "hub-pivoting",
    type: "hub",
    title: "Hub Pivoting",
    href: "/hub/pivoting",
    summary: "Pivoting techniques, tunnels, and routing.",
    tags: ["hub", "pivoting", "ligolo", "tunnel", "routing"],
  },
  {
    id: "cmd-netexec-users",
    type: "command",
    title: "NetExec SMB users",
    href: "/cheatsheets/netexec",
    summary: "Enumerate domain users through SMB.",
    command: "nxc smb $TARGET -u $USER -p $PASS --users",
    tags: ["command", "nxc", "smb", "users", "enum"],
  },
  {
    id: "cmd-netexec-shares",
    type: "command",
    title: "NetExec SMB shares",
    href: "/cheatsheets/netexec",
    summary: "List accessible SMB shares and permissions.",
    command: "nxc smb $TARGET -u $USER -p $PASS --shares",
    tags: ["command", "nxc", "smb", "shares"],
  },
  {
    id: "cmd-bloodyad-gmsa",
    type: "command",
    title: "BloodyAD gMSA password",
    href: "/cheatsheets/bloodyad",
    summary: "Read managed password from gMSA account.",
    command: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get object '$GMSA$' --attr msDS-ManagedPassword",
    tags: ["command", "bloodyad", "gmsa", "credential"],
  },
  {
    id: "cmd-gf-ldap-users",
    type: "command",
    title: "GoFenrir LDAP users",
    href: "/my-tools/gofenrir",
    summary: "Enumerate all AD users with GoFenrir.",
    command: "gf ldap -t $TARGET -u $USER -p $PASS --users",
    tags: ["command", "gofenrir", "ldap", "users", "enum"],
  },
  {
    id: "cmd-bhce-all",
    type: "command",
    title: "BashHound-CE full collection",
    href: "/my-tools/bashhound-ce",
    summary: "Run full BloodHound CE collection.",
    command: "./bashhound-ce -d domain.local -u USERNAME -p PASSWORD -c All",
    tags: ["command", "bashhound-ce", "bloodhound", "collection"],
  },
];

const writeupEntries: SearchEntry[] = writeups.map((w) => ({
  id: `writeup-${w.slug}`,
  type: "writeup",
  title: w.title,
  href: `/writeups/${w.slug}`,
  summary: w.excerpt,
  tags: ["writeup", w.type, w.platform, w.focus].map((t) => t.toLowerCase()),
}));

const articleEntries: SearchEntry[] = articles.map((a) => ({
  id: `article-${a.slug}`,
  type: "article",
  title: a.title,
  href: `/blog/${a.slug}`,
  summary: a.excerpt,
  tags: ["article", a.category, ...a.tags].map((t) => t.toLowerCase()),
}));

export const searchEntries: SearchEntry[] = [
  ...staticEntries,
  ...writeupEntries,
  ...articleEntries,
];
