"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function RpcclientNgPage() {
  const { lang } = useLanguage();
  const translateWhy = (text: string) => {
    if (lang === "fr") return text;
    const map: Record<string, string> = {
      "Installe le binaire `rpcclient-ng` depuis la derniere version publiee.":
        "Installs the `rpcclient-ng` binary from the latest published version.",
      "Compile depuis les sources locales (dev, patch ou branche specifique).":
        "Builds from local source (development, patching, or a specific branch).",
      "Ajoute le repertoire de binaires Go utilisateur pour lancer l'outil globalement.":
        "Adds the user Go bin directory so the tool runs globally.",
      "Affiche l'usage et la liste des flags.":
        "Shows usage and the list of flags.",
      "Ouvre le shell interactif (auto-completion, historique).":
        "Opens the interactive shell (tab-completion, history).",
      "Liste toutes les commandes disponibles dans le shell.":
        "Lists all commands available in the shell.",
      "Authentification par mot de passe (convention impacket : `-u`/`-p`/`-d`).":
        "Password authentication (impacket convention: `-u`/`-p`/`-d`).",
      "Pass-the-hash avec le hash NT (`LM:NT` ou NT seul).":
        "Pass-the-hash with the NT hash (`LM:NT` or bare NT).",
      "Kerberos depuis un ccache (`KRB5CCNAME`) ; la cible doit etre le FQDN.":
        "Kerberos from a ccache (`KRB5CCNAME`); the target must be the FQDN.",
      "Session null / anonyme (sans identifiants).":
        "Null / anonymous session (no credentials).",
      "Se connecte a une IP tout en gardant le FQDN comme nom de SPN Kerberos.":
        "Connects to an IP while keeping the FQDN as the Kerberos SPN name.",
      "Liste les domaines SAM heberges et leurs SID.":
        "Lists the SAM domains hosted by the server and their SIDs.",
      "Enumere les utilisateurs ; bascule sur le RID cycling LSAT si SAMR est refuse.":
        "Enumerates users; falls back to LSAT RID cycling if SAMR is denied.",
      "Enumere les groupes du domaine actif.":
        "Enumerates groups in the active domain.",
      "Enumere les alias (groupes locaux) du domaine actif.":
        "Enumerates aliases (local groups) in the active domain.",
      "Liste les users avec description et flags de compte decodes (marche souvent quand enumdomusers est refuse).":
        "Lists users with description and decoded account-control flags (often works when enumdomusers is denied).",
      "Detail d'un compte utilisateur, par RID ou par nom.":
        "Details of a user account, by RID or name.",
      "Liste les groupes dont un utilisateur est membre.":
        "Lists the groups a user is a member of.",
      "Liste les membres d'un groupe (RID + nom).":
        "Lists the members of a group (RID + name).",
      "Affiche la politique de mot de passe du domaine.":
        "Displays the domain password policy.",
      "Traduit des noms de comptes en SID (LSAT).":
        "Translates account names to SIDs (LSAT).",
      "Traduit des SID en noms de comptes (LSAT).":
        "Translates SIDs to account names (LSAT).",
      "Balaye une plage de RID contre le SID de domaine et resout les comptes.":
        "Sweeps a RID range against the domain SID and resolves the accounts.",
      "Infos de policy LSA : domaine de comptes, SID, nom DNS, foret.":
        "LSA policy info: account domain, SID, DNS name, forest.",
      "Affiche le compte et le domaine de l'utilisateur authentifie.":
        "Shows the account and domain of the authenticated user.",
      "Enumere les domaines de confiance (direction, type, attributs decodes).":
        "Enumerates trusted domains (direction, type, decoded attributes).",
      "Enumere les privileges connus de la LSA cible, avec leurs LUID.":
        "Enumerates the privileges known to the target LSA, with their LUIDs.",
      "Enumere les comptes detenant des privileges/droits LSA, resolus en noms.":
        "Enumerates accounts holding LSA privileges or rights, resolved to names.",
      "Liste les privileges et droits d'acces systeme d'un compte.":
        "Lists the privileges and system-access rights held by an account.",
      "Identite serveur, version d'OS et flags de type serveur decodes.":
        "Server identity, OS version and decoded server-type flags.",
      "Identite workstation : nom machine, groupe LAN et version.":
        "Workstation identity: computer name, LAN group and version.",
      "Enumere les partages du serveur cible.":
        "Enumerates the shared resources on the target.",
      "Enumere les sessions SMB ouvertes sur la cible (admin requis).":
        "Enumerates the SMB sessions open on the target (admin-only).",
      "Enumere les utilisateurs connectes sur la cible (admin requis).":
        "Enumerates the users logged on at the target (admin-only).",
      "Recon complet en une commande : domaine, users a risque, groupes privilegies, partages.":
        "Full recon in one command: domain, risky users, privileged groups, shares.",
      "Meme rapport en JSON structure pour le pipeline.":
        "Same report as a structured JSON object for piping.",
      "Cree un compte (desactive et sans mot de passe). Requiert des droits.":
        "Creates a user (disabled and without a password). Requires privileges.",
      "Supprime un compte par RID.":
        "Deletes a user account by RID.",
      "Ajoute un utilisateur (RID) a un groupe (RID) ; ex. 512 = Domain Admins.":
        "Adds a user (RID) to a group (RID); e.g. 512 = Domain Admins.",
      "Retire un utilisateur d'un groupe.":
        "Removes a user from a group.",
      "Ajoute un membre (par SID) a un alias/groupe local, ex. Builtin Administrators.":
        "Adds a member (by SID) to an alias/local group, e.g. Builtin Administrators.",
    };
    return map[text] ?? "Command purpose available in French only.";
  };

  type CommandItem = { cmd: string; why: string };
  type CommandSection = { title: string; groupId?: string; commands: CommandItem[] };

  const installMethods: CommandSection = {
    title: "Installation",
    commands: [
      {
        cmd: "go install github.com/0xbbuddha/rpcclient-ng@latest",
        why: "Installe le binaire `rpcclient-ng` depuis la derniere version publiee.",
      },
      {
        cmd: "git clone https://github.com/0xbbuddha/rpcclient-ng\ncd rpcclient-ng\ngo build -o rpcclient-ng .",
        why: "Compile depuis les sources locales (dev, patch ou branche specifique).",
      },
      {
        cmd: "export PATH=\"$PATH:$HOME/go/bin\"",
        why: "Ajoute le repertoire de binaires Go utilisateur pour lancer l'outil globalement.",
      },
    ],
  };

  const basics: CommandSection = {
    title: "Verify + Syntax",
    commands: [
      { cmd: "rpcclient-ng", why: "Affiche l'usage et la liste des flags." },
      {
        cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS $TARGET",
        why: "Ouvre le shell interactif (auto-completion, historique).",
      },
      { cmd: "help", why: "Liste toutes les commandes disponibles dans le shell." },
    ],
  };

  const sections: CommandSection[] = [
    {
      title: "Auth Methods",
      groupId: "auth",
      commands: [
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS $TARGET", why: "Authentification par mot de passe (convention impacket : `-u`/`-p`/`-d`)." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -H $NTHASH $TARGET", why: "Pass-the-hash avec le hash NT (`LM:NT` ou NT seul)." },
        { cmd: "export KRB5CCNAME=$PWD/$USER.ccache\nrpcclient-ng -k $TARGET", why: "Kerberos depuis un ccache (`KRB5CCNAME`) ; la cible doit etre le FQDN." },
        { cmd: "rpcclient-ng -N $TARGET", why: "Session null / anonyme (sans identifiants)." },
        { cmd: "rpcclient-ng -k -dc-ip $IP $TARGET", why: "Se connecte a une IP tout en gardant le FQDN comme nom de SPN Kerberos." },
      ],
    },
    {
      title: "SAMR - Enumeration",
      groupId: "samr",
      commands: [
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c enumdomains $TARGET", why: "Liste les domaines SAM heberges et leurs SID." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c enumdomusers $TARGET", why: "Enumere les utilisateurs ; bascule sur le RID cycling LSAT si SAMR est refuse." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c enumdomgroups $TARGET", why: "Enumere les groupes du domaine actif." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c enumdomaliases $TARGET", why: "Enumere les alias (groupes locaux) du domaine actif." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c querydispinfo $TARGET", why: "Liste les users avec description et flags de compte decodes (marche souvent quand enumdomusers est refuse)." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c 'queryuser Administrator' $TARGET", why: "Detail d'un compte utilisateur, par RID ou par nom." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c 'querygroupmem 512' $TARGET", why: "Liste les membres d'un groupe (RID + nom)." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c getdompwinfo $TARGET", why: "Affiche la politique de mot de passe du domaine." },
      ],
    },
    {
      title: "LSAT - Translation",
      commands: [
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c 'lookupnames administrator krbtgt' $TARGET", why: "Traduit des noms de comptes en SID (LSAT)." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c 'lookupsids $SID-500' $TARGET", why: "Traduit des SID en noms de comptes (LSAT)." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c 'ridcycle 500 2000' $TARGET", why: "Balaye une plage de RID contre le SID de domaine et resout les comptes." },
      ],
    },
    {
      title: "LSA - Policy & Rights",
      commands: [
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c lsaquery $TARGET", why: "Infos de policy LSA : domaine de comptes, SID, nom DNS, foret." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c getusername $TARGET", why: "Affiche le compte et le domaine de l'utilisateur authentifie." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c lsaenumtrustdom $TARGET", why: "Enumere les domaines de confiance (direction, type, attributs decodes)." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c lsaenumprivs $TARGET", why: "Enumere les privileges connus de la LSA cible, avec leurs LUID." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c lsaenumaccounts $TARGET", why: "Enumere les comptes detenant des privileges/droits LSA, resolus en noms." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c 'lsaenumacctrights $USER' $TARGET", why: "Liste les privileges et droits d'acces systeme d'un compte." },
      ],
    },
    {
      title: "Host, Shares & Sessions",
      commands: [
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c netservergetinfo $TARGET", why: "Identite serveur, version d'OS et flags de type serveur decodes." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c wkstagetinfo $TARGET", why: "Identite workstation : nom machine, groupe LAN et version." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c netshareenum $TARGET", why: "Enumere les partages du serveur cible." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c netsessenum $TARGET", why: "Enumere les sessions SMB ouvertes sur la cible (admin requis)." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c netwkstauserenum $TARGET", why: "Enumere les utilisateurs connectes sur la cible (admin requis)." },
      ],
    },
    {
      title: "Recon Report",
      commands: [
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c sweep $TARGET", why: "Recon complet en une commande : domaine, users a risque, groupes privilegies, partages." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -json -c sweep $TARGET", why: "Meme rapport en JSON structure pour le pipeline." },
      ],
    },
    {
      title: "Write Operations",
      groupId: "write",
      commands: [
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c 'createdomuser evil_ng' $TARGET", why: "Cree un compte (desactive et sans mot de passe). Requiert des droits." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c 'deldomuser $RID' $TARGET", why: "Supprime un compte par RID." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c 'addgroupmem 512 $RID' $TARGET", why: "Ajoute un utilisateur (RID) a un groupe (RID) ; ex. 512 = Domain Admins." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c 'delgroupmem 512 $RID' $TARGET", why: "Retire un utilisateur d'un groupe." },
        { cmd: "rpcclient-ng -d $DOMAIN -u $USER -p $PASS -c 'addaliasmem 544 $SID' $TARGET", why: "Ajoute un membre (par SID) a un alias/groupe local, ex. Builtin Administrators." },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          My Tools
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          rpcclient-ng
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Cheatsheet rpcclient-ng : client MS-RPC offensif pour l'Active Directory (recon + abuse) en un binaire statique Go, auth password/hash/Kerberos/null."
            : "rpcclient-ng cheatsheet: offensive MS-RPC client for Active Directory (recon + abuse) as a single static Go binary, with password/hash/Kerberos/null auth."}
        </p>
      </header>

      <section id="install" className="mb-6 rounded-sm border border-border p-5">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">{installMethods.title}</h2>
        <div className="space-y-4">
          {installMethods.commands.map((item) => (
            <CheatsheetCommandCard key={item.cmd} cmd={item.cmd} why={translateWhy(item.why)} lang={lang} />
          ))}
        </div>
      </section>

      <section id="syntax" className="mb-6 rounded-sm border border-border p-5">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">{basics.title}</h2>
        <div className="space-y-4">
          {basics.commands.map((item) => (
            <CheatsheetCommandCard key={item.cmd} cmd={item.cmd} why={translateWhy(item.why)} lang={lang} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {sections.map((section) => (
          <article key={section.title} id={section.groupId} className="rounded-sm border border-border p-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary">{section.title}</h2>
            <div className="mt-3 space-y-4">
              {section.commands.map((item) => (
                <CheatsheetCommandCard key={item.cmd} cmd={item.cmd} why={translateWhy(item.why)} lang={lang} />
              ))}
            </div>
          </article>
        ))}
      </section>

      <div className="mt-6 text-xs text-muted-foreground/80">
        {lang === "fr"
          ? "Base commune : remplace `$TARGET` (FQDN/IP du DC), `$USER`, `$PASS`, `$DOMAIN`, `$NTHASH`, `$IP`, `$SID` et `$RID` selon ton contexte. Les commandes fonctionnent aussi dans le shell interactif (sans le prefixe `-c`)."
          : "Common base: replace `$TARGET` (DC FQDN/IP), `$USER`, `$PASS`, `$DOMAIN`, `$NTHASH`, `$IP`, `$SID` and `$RID` for your context. The commands also work in the interactive shell (without the `-c` prefix)."}
      </div>
    </div>
  );
}
