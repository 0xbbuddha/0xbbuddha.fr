"use client";

export default function GoFenrirPage() {
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
        cmd: "go install github.com/0xbbuddha/GoFenrir/cmd/gf@latest",
        why: "Installe directement le binaire `gf` depuis la derniere version publiee.",
      },
      {
        cmd: "git clone https://github.com/0xbbuddha/GoFenrir\ncd GoFenrir\ngo build -o gf ./cmd/gf/",
        why: "Compile depuis les sources locales (utile pour dev, patch ou branche specifique).",
      },
      {
        cmd: "export PATH=\"$PATH:$HOME/go/bin\"",
        why: "Ajoute le repertoire de binaires Go utilisateur pour lancer `gf` globalement.",
      },
    ],
  };

  const basics: CommandSection = {
    title: "Verify + Syntax",
    commands: [
      { cmd: "gf --help", why: "Verifie que `gf` est disponible et affiche les protocoles supportes." },
      { cmd: "gf ldap --help", why: "Affiche toutes les options LDAP (enum, kerberos, delegation, ADCS, etc.)." },
      { cmd: "gf smb --help", why: "Affiche toutes les options SMB (shares, null-session, GPP passwords)." },
      { cmd: "gf [protocol] [flags]", why: "Syntaxe generale : protocol (`ldap`, `smb`) puis options." },
    ],
  };

  const sections: CommandSection[] = [
    {
      title: "LDAP - Auth Methods",
      groupId: "ldap",
      commands: [
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS",
          why: "Authentification LDAP classique avec user/password.",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -H $NTHASH",
          why: "Authentification LDAP via hash NT (pass-the-hash).",
        },
      ],
    },
    {
      title: "LDAP - Connection",
      commands: [
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS -d $DOMAIN",
          why: "Force le contexte de domaine pour les environnements multi-domaines.",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --port 389",
          why: "Connexion LDAP en clair sur port 389.",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --tls --port 636",
          why: "Connexion LDAPS chiffree (TLS) sur port 636.",
        },
      ],
    },
    {
      title: "LDAP - Enumeration",
      commands: [
        { cmd: "gf ldap -t $TARGET -u $USER -p $PASS --admins", why: "Liste les Domain Admins et comptes admin." },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --computers",
          why: "Enumere les comptes machine et informations d'OS.",
        },
        { cmd: "gf ldap -t $TARGET -u $USER -p $PASS --dcs", why: "Identifie les Domain Controllers du domaine." },
        { cmd: "gf ldap -t $TARGET -u $USER -p $PASS --gpos", why: "Recupere les Group Policy Objects deployes." },
        { cmd: "gf ldap -t $TARGET -u $USER -p $PASS --groups", why: "Recupere tous les groupes AD et membres." },
        { cmd: "gf ldap -t $TARGET -u $USER -p $PASS --ous", why: "Liste les Organizational Units pour cartographie." },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --pwd-policy",
          why: "Affiche la politique de mot de passe du domaine.",
        },
        { cmd: "gf ldap -t $TARGET -u $USER -p $PASS --trusts", why: "Detecte les relations de confiance inter-domaines." },
        { cmd: "gf ldap -t $TARGET -u $USER -p $PASS --users", why: "Enumere tous les comptes utilisateurs AD." },
      ],
    },
    {
      title: "LDAP - Domain",
      commands: [
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --admin-count",
          why: "Trouve les objets proteges AdminSDHolder (`adminCount=1`).",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --domain-info",
          why: "Rassemble les metadonnees du domaine (SID, niveaux, naming contexts).",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --privileged-groups",
          why: "Cible les groupes a fort privilege (DA/EA/etc.) et leurs membres.",
        },
      ],
    },
    {
      title: "LDAP - Kerberos",
      commands: [
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --asreproast",
          why: "Detecte les comptes sans pre-auth Kerberos (AS-REP roastables).",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --kerberoastable",
          why: "Detecte les comptes avec SPN exploitables en kerberoasting.",
        },
      ],
    },
    {
      title: "LDAP - Delegation",
      commands: [
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --constrained",
          why: "Liste les comptes configures en constrained delegation.",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --rbcd",
          why: "Detecte les configurations RBCD (resource-based constrained delegation).",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --unconstrained",
          why: "Identifie les comptes en unconstrained delegation (hors DC).",
        },
      ],
    },
    {
      title: "LDAP - ADCS",
      commands: [
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --adcs",
          why: "Enumere CA/templates et signale les mauvaises configs ESC1/2/3/4/9.",
        },
      ],
    },
    {
      title: "LDAP - Credential Attacks",
      commands: [
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --laps",
          why: "Tente l'acces aux secrets LAPS v1/v2 si les ACL le permettent.",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --shadow-creds",
          why: "Cherche les objets avec `msDS-KeyCredentialLink` (shadow credentials).",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --weak-accounts",
          why: "Repere les comptes avec UAC dangereux (DES, no pwd required, etc.).",
        },
      ],
    },
    {
      title: "LDAP - Global",
      commands: [
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --users --threads 20",
          why: "Augmente la concurrence pour aller plus vite sur de gros scopes.",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --users --timeout 60",
          why: "Allonge le timeout pour reseaux lents ou latence elevee.",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --users --log ldap-users.log",
          why: "Sauvegarde la sortie dans un fichier pour tri/relecture.",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --users --verbose",
          why: "Active des logs plus detailles pendant l'execution.",
        },
        {
          cmd: "gf ldap -t $TARGET -u $USER -p $PASS --users --debug",
          why: "Active le mode debug pour troubleshooting avance.",
        },
      ],
    },
    {
      title: "SMB - Auth Methods",
      groupId: "smb",
      commands: [
        { cmd: "gf smb -t $TARGET -u $USER -p $PASS", why: "Authentification SMB classique avec mot de passe." },
        { cmd: "gf smb -t $TARGET -u $USER -H $NTHASH", why: "Authentification SMB via hash NT (PtH)." },
      ],
    },
    {
      title: "SMB - Connection",
      commands: [
        {
          cmd: "gf smb -t $TARGET -u $USER -p $PASS -d $DOMAIN",
          why: "Precise le domaine pour authentification AD explicite.",
        },
        { cmd: "gf smb -t $TARGET -u $USER -p $PASS --port 445", why: "Fixe le port SMB cible (defaut 445)." },
      ],
    },
    {
      title: "SMB - Enumeration",
      commands: [
        {
          cmd: "gf smb -t $TARGET -u $USER -p $PASS --gpp-passwords",
          why: "Recherche et decrypte les cpassword GPP dans SYSVOL.",
        },
        { cmd: "gf smb -t $TARGET --null-session", why: "Teste si une session anonyme est autorisee." },
        { cmd: "gf smb -t $TARGET -u $USER -p $PASS --shares", why: "Enumere les partages SMB et droits associes." },
      ],
    },
    {
      title: "SMB - Global",
      commands: [
        {
          cmd: "gf smb -t $TARGET -u $USER -p $PASS --shares --threads 20",
          why: "Parallellise les checks de partages sur gros perimetre.",
        },
        {
          cmd: "gf smb -t $TARGET -u $USER -p $PASS --shares --timeout 60",
          why: "Evite les faux echecs sur cibles lentes ou instables.",
        },
        {
          cmd: "gf smb -t $TARGET -u $USER -p $PASS --shares --log smb-shares.log",
          why: "Exporte les resultats SMB dans un fichier dedie.",
        },
        {
          cmd: "gf smb -t $TARGET -u $USER -p $PASS --shares --verbose",
          why: "Affiche des details supplementaires pendant l'execution.",
        },
        {
          cmd: "gf smb -t $TARGET -u $USER -p $PASS --shares --debug",
          why: "Mode debug pour analyser les erreurs bas niveau SMB.",
        },
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
          GoFenrir
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Cheatsheet complete de `gf` avec commandes LDAP/SMB classees par section et expliquees.
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

      <div className="mt-6 text-xs text-muted-foreground/80">
        Base command commune : remplace `$TARGET`, `$USER`, `$PASS`, `$DOMAIN` et `$NTHASH` selon ton contexte.
      </div>
    </div>
  );
}
