import {
  Heart,
  Search,
  Code2,
  Shield,
  Zap,
  Terminal,
  Package,
  Layers,
  Music,
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
  title: "Reverse engineering du protocole BLE Marshall | 0xbbuddha",
  description:
    "Comment j'ai reverse engineeré le protocole BLE propriétaire de Marshall/Zound Industries depuis l'APK Android jusqu'à une appli Linux fonctionnelle avec GUI.",
};

export default function ArticleMarshallBLEPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Article · Reverse Engineering"
        title="Reverse engineering du protocole BLE Marshall"
        description="Comment j'ai reverse engineeré le protocole BLE propriétaire de Zound Industries depuis l'APK Android jusqu'à une appli Linux fonctionnelle - décompilation de code Kotlin, authentification BLE, encodage EQ, et gestion multi-appareils."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "Marshall BLE RE" },
        ]}
        stats={[
          { label: "Category", value: "Reverse Engineering" },
          { label: "Tags", value: "BLE · Go · Wails · BlueZ" },
          { label: "Date", value: "2026-06-07" },
        ]}
      />

      <article className="mt-8 space-y-12">

        {/* Intro */}
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Heart className="size-5 text-primary" />
            Le point de départ
          </h2>
          <p className="text-muted-foreground mb-3">
            J&apos;ai des écouteurs Marshall Motif II ANC et une enceinte Marshall
            WILLEN. Marshall ne fournit pas d&apos;application Linux. L&apos;appli
            Android officielle permet de contrôler le mode ANC, l&apos;égaliseur,
            de voir la batterie - des trucs basiques, mais utiles. Sur Linux :
            rien. L&apos;audio Bluetooth fonctionne, mais le confort
            d&apos;utilisation s&apos;arrête là.
          </p>
          <p className="text-muted-foreground mb-3">
            La solution évidente : reverse engineer le protocole que l&apos;appli
            officielle utilise, et le réimplémenter. Les appareils Marshall sont
            tous fabriqués par <strong>Zound Industries</strong>, une boîte
            suédoise qui produit aussi les marques Urbanears et Adidas headphones.
            Ça voulait dire qu&apos;un seul protocole BLE couvre toute la gamme -
            une bonne nouvelle pour la portée du projet.
          </p>
          <p className="text-muted-foreground">
            Ce que je ne savais pas encore : le chemin entre &quot;j&apos;ouvre
            jadx&quot; et &quot;l&apos;appli fonctionne&quot; allait passer par
            plusieurs heures de debug sur des erreurs BlueZ cryptiques, une
            découverte sur l&apos;encodage de l&apos;EQ qui vient directement du
            bytecode Kotlin, et une question d&apos;authentification BLE que
            j&apos;avais complètement ratée au départ.
          </p>
        </section>

        {/* Sommaire */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-3 font-mono text-sm font-semibold text-primary uppercase tracking-widest">
            Sommaire
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground font-mono">
            <li>Anatomie Bluetooth du Marshall</li>
            <li>Reverse engineering de l&apos;APK Android</li>
            <li>L&apos;authentification BLE - le bug qui fait perdre 2h</li>
            <li>Les caractéristiques GATT importantes</li>
            <li>L&apos;encodage de l&apos;EQ</li>
            <li>L&apos;application Linux - CLI et GUI</li>
            <li>Gestion multi-appareils</li>
            <li>La documentation du protocole</li>
          </ol>
        </section>

        {/* 1. Anatomie BT */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Music className="size-5 text-primary" />
            1. Anatomie Bluetooth du Marshall
          </h2>
          <p className="text-muted-foreground mb-3">
            Ce qui n&apos;est pas évident au premier abord : des écouteurs Bluetooth
            comme le Motif II ANC exposent <strong>deux transports distincts</strong>,
            pas un seul.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
            <li>
              <strong>BR/EDR</strong> (Bluetooth Classic) avec une adresse publique -
              c&apos;est ce qui transporte l&apos;audio via A2DP/HFP. C&apos;est
              ce que le gestionnaire audio du système voit.
            </li>
            <li>
              <strong>BLE</strong> avec une adresse séparée (publique ou aléatoire
              selon le modèle) - c&apos;est là où vit le canal de contrôle GATT.
              ANC, EQ, batterie, firmware : tout passe par là.
            </li>
          </ul>
          <p className="text-muted-foreground mb-3">
            BlueZ crée deux entrées séparées dans sa liste d&apos;objets D-Bus pour
            le même appareil physique. La première pour le transport classique, la
            seconde pour le BLE. Quand on cherche l&apos;appareil par nom, les deux
            matchent - mais seule l&apos;entrée BLE a des caractéristiques GATT.
            Ça m&apos;a coûté quelques recherches avant de comprendre pourquoi la
            connexion audio marchait mais les commandes ne passaient pas.
          </p>
          <div className="my-6 flex justify-center">
            <img
              src="/memes/db-gatt-ble.png"
              alt="Distracted Boyfriend - moi qui regarde le canal GATT BLE pendant que l'audio A2DP fonctionne"
              className="rounded-lg max-w-xs sm:max-w-sm w-full"
            />
          </div>
          <InfoBox>
            BlueZ affiche parfois l&apos;entrée BLE avec le suffixe{" "}
            <code className="rounded bg-muted px-1">[LE]</code> dans son Alias
            quand les deux transports coexistent, mais ce n&apos;est pas
            systématique. Le plus fiable pour distinguer les deux : chercher
            l&apos;entrée qui a des caractéristiques GATT enregistrées après
            connexion.
          </InfoBox>
          <p className="text-muted-foreground mb-3">
            Les UUID des services et caractéristiques Zound Industries suivent un
            schéma très spécifique :
          </p>
          <CodeBlock title="Format UUID Zound Industries">
{`0000{CODE}-1337-1dea-feed-c0ffee70c0de

Exemples :
  00000013-1337-1dea-feed-c0ffee70c0de  -> ANC configuration
  00000017-1337-1dea-feed-c0ffee70c0de  -> Equalizer settings
  0000001c-1337-1dea-feed-c0ffee70c0de  -> Party mode`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Le <code className="rounded bg-muted px-1">0xC0FFEE</code> dans le
            suffixe est intentionnel. Le suffixe{" "}
            <code className="rounded bg-muted px-1">1337-1dea</code> l&apos;est
            aussi. Zound Industries s&apos;est clairement amusé avec ses UUIDs.
          </p>
        </section>

        {/* 2. RE APK */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Search className="size-5 text-primary" />
            2. Reverse engineering de l&apos;APK Android
          </h2>
          <p className="text-muted-foreground mb-3">
            L&apos;appli Android de Marshall s&apos;appelle{" "}
            <code className="rounded bg-muted px-1">com.zoundindustries.marshallbt</code>.
            Je télécharge le dernier APK (v3.7.1 au moment du RE), je l&apos;ouvre
            avec <strong>jadx</strong>, et je commence à explorer.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Trouver les UUIDs
          </h3>
          <p className="text-muted-foreground mb-3">
            Première étape : un simple grep sur le suffixe Zound dans le code
            décompilé.
          </p>
          <CodeBlock title="Recherche dans le code décompilé">
{`grep -r "c0ffee70c0de" .`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Ça remonte directement une classe de constantes qui mappe chaque
            code UUID à un nom lisible. C&apos;est de là, par exemple, que vient
            la liste complète des caractéristiques :
            ANCConfiguration (0x0013), EqualizerSettings (0x0017),
            VolumeLimit (0x0008), TouchLock (0x0014), et une trentaine d&apos;autres.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Le FeatureManager : quels appareils supportent quoi
          </h3>
          <p className="text-muted-foreground mb-3">
            La partie la plus utile de la décompilation : une classe{" "}
            <code className="rounded bg-muted px-1">FeatureManager</code> qui
            définit par type de device quelles fonctionnalités sont supportées.
            Les appareils y sont identifiés par des constantes internes - SAXON
            pour le Motif II ANC, par exemple. On y voit clairement que le SAXON
            a du CTKD (Cross-Transport Key Derivation) mais pas d&apos;IMPLICIT_BOND,
            ce qui aura son importance pour l&apos;authentification.
          </p>
          <p className="text-muted-foreground mb-3">
            La structure du code Kotlin décompilé est lisible, même si jadx
            produit parfois des noms de variables génériques. L&apos;essentiel
            est là : les flags de features par modèle, les valeurs des enums,
            et surtout les méthodes d&apos;encodage des commandes.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Les valeurs des enums EQ
          </h3>
          <p className="text-muted-foreground mb-3">
            Dans le code décompilé, les presets EQ sont définis dans une enum.
            L&apos;ordre compte : FLAT = 0, CUSTOM = 1, ROCK = 2, METAL = 3,
            POP = 4, HIP_HOP = 5, ELECTRONIC = 6, JAZZ = 7, BASS_BOOST = 8,
            MID_BOOST = 9, TREBLE_BOOST = 10, LOUD_PUSH_WORKOUT = 11.
          </p>
          <InfoBox>
            J&apos;avais d&apos;abord inversé FLAT et CUSTOM dans mon
            implémentation - CUSTOM = 0, FLAT = 1. L&apos;appli marchait, mais
            les presets étaient décalés d&apos;un cran. C&apos;est exactement le
            genre d&apos;erreur qui ne se voit pas au premier test si on ne compare
            pas avec l&apos;appli officielle.
          </InfoBox>
        </section>

        {/* 3. Auth BLE */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            3. L&apos;authentification BLE - le bug qui fait perdre 2h
          </h2>
          <p className="text-muted-foreground mb-3">
            Premier essai de connexion aux écouteurs depuis Go via D-Bus/BlueZ.
            J&apos;arrive à trouver l&apos;appareil, je lance{" "}
            <code className="rounded bg-muted px-1">Device1.Connect()</code>, ça
            passe. Mais dès que j&apos;essaie d&apos;écrire sur une caractéristique
            GATT, j&apos;ai cette erreur :
          </p>
          <CodeBlock result>
{`org.bluez.Error.Failed: No agent available for request type 2`}
          </CodeBlock>
          <div className="my-6 flex justify-center">
            <img
              src="/memes/drake-agent-dbus.png"
              alt="Drake - non à lire la doc BlueZ sur l'auth, oui à 2h de debug pour trouver l'agent D-Bus"
              className="rounded-lg max-w-xs sm:max-w-sm w-full"
            />
          </div>
          <p className="text-muted-foreground mb-3">
            Pas très explicite. Après quelques recherches, j&apos;ai compris ce qui
            se passe : les écouteurs demandent un appariement BLE avant
            d&apos;autoriser l&apos;accès aux caractéristiques protégées. Et BlueZ,
            pour gérer cet appariement, a besoin qu&apos;un{" "}
            <strong>agent d&apos;authentification</strong> soit enregistré sur le
            bus D-Bus.
          </p>
          <p className="text-muted-foreground mb-3">
            Le &quot;request type 2&quot; correspond à{" "}
            <strong>NoInputNoOutput</strong> - le mode Just Works de BLE.
            L&apos;appareil n&apos;a ni écran ni clavier, donc il accepte
            n&apos;importe quelle connexion sans confirmation PIN. Mais BlueZ
            ne fait pas ça automatiquement : il cherche un agent enregistré pour
            valider la procédure, et si aucun n&apos;est là, il rejette.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            La solution : enregistrer un agent NoInputNoOutput
          </h3>
          <p className="text-muted-foreground mb-3">
            Il faut exporter un objet D-Bus qui implémente l&apos;interface{" "}
            <code className="rounded bg-muted px-1">org.bluez.Agent1</code>,
            l&apos;enregistrer auprès de{" "}
            <code className="rounded bg-muted px-1">AgentManager1</code> avec
            la capacité{" "}
            <code className="rounded bg-muted px-1">NoInputNoOutput</code>,
            et le passer en tant qu&apos;agent par défaut. Après ça, quand BlueZ
            a besoin de valider le Just Works, il appelle l&apos;agent, qui accepte
            silencieusement.
          </p>
          <CodeBlock title="Enregistrement de l'agent BlueZ (Go)">
{`// L'agent implémente org.bluez.Agent1 avec des méthodes vides
type agent struct{}

func (a *agent) RequestConfirmation(_ dbus.ObjectPath, _ uint32) *dbus.Error {
    return nil  // Just Works : on accepte sans confirmation
}
// ... autres méthodes de l'interface

func registerAgent(conn *dbus.Conn) error {
    conn.Export(agentInstance, agentPath, "org.bluez.Agent1")
    conn.Export(introspect.NewIntrospectable(agentInstance), agentPath,
        "org.freedesktop.DBus.Introspectable")

    mgr := conn.Object("org.bluez", "/org/bluez")
    mgr.Call("org.bluez.AgentManager1.RegisterAgent", 0, agentPath, "NoInputNoOutput")
    mgr.Call("org.bluez.AgentManager1.RequestDefaultAgent", 0, agentPath)
    return nil
}`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Ensuite, appeler{" "}
            <code className="rounded bg-muted px-1">Device1.Pair()</code> avec
            un timeout de 15 secondes. Si les écouteurs ne sont pas déjà appairés,
            BlueZ contacte l&apos;agent, qui confirme automatiquement. Après ça,
            le bond est stocké et les connexions suivantes n&apos;ont plus besoin
            de repasser par là.
          </p>
          <InfoBox>
            Il faut aussi s&apos;assurer que{" "}
            <code className="rounded bg-muted px-1">SecureConnections = on</code>{" "}
            est dans{" "}
            <code className="rounded bg-muted px-1">/etc/bluetooth/main.conf</code>.
            Sans ça, certains firmwares Marshall refusent le pairing avec une
            erreur de sécurité différente. C&apos;est la valeur par défaut sur
            la plupart des distros récentes, mais mieux vaut vérifier.
          </InfoBox>
        </section>

        {/* 4. Caractéristiques */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Code2 className="size-5 text-primary" />
            4. Les caractéristiques GATT importantes
          </h2>
          <p className="text-muted-foreground mb-3">
            Une fois la connexion établie et le pairing fait, les caractéristiques
            GATT sont accessibles. Voici les principales que j&apos;ai implémentées :
          </p>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">UUID (code)</th>
                  <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Nom</th>
                  <th className="text-left py-2 text-muted-foreground font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">0x0013</code></td>
                  <td className="py-2 pr-4">ANCConfiguration</td>
                  <td className="py-2">1 octet : 0x00 = Off, 0x01 = ANC, 0x02 = Transparency</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">0x0017</code></td>
                  <td className="py-2 pr-4">EqualizerSettings</td>
                  <td className="py-2">3 octets pour assigner, 2 pour activer (voir section 5)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">0x2a19</code></td>
                  <td className="py-2 pr-4">BatteryLevel</td>
                  <td className="py-2">Standard BT : 1 octet, pourcentage 0-100</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">0x2a24</code></td>
                  <td className="py-2 pr-4">ModelName</td>
                  <td className="py-2">Standard BT : chaîne UTF-8</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><code className="rounded bg-muted px-1">0x2a26</code></td>
                  <td className="py-2 pr-4">FirmwareRevision</td>
                  <td className="py-2">Standard BT : chaîne UTF-8</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mb-3">
            Les caractéristiques standard BT (batterie, modèle, firmware) suivent
            le format GATT classique et fonctionnent avec n&apos;importe quel
            appareil BLE - pas besoin de les déduire de l&apos;APK. Les
            caractéristiques Zound propriétaires en revanche nécessitent du RE.
          </p>
          <p className="text-muted-foreground">
            Le chipset utilisé par le Motif II ANC est un{" "}
            <strong>Airoha AB1565</strong>, un SoC audio BT haut de gamme qu&apos;on
            retrouve dans beaucoup d&apos;écouteurs sans fil premium. Le Zound SDK
            s&apos;abstrait complètement du chipset, donc le protocole est
            indépendant du hardware.
          </p>
        </section>

        {/* 5. EQ encoding */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Zap className="size-5 text-primary" />
            5. L&apos;encodage de l&apos;EQ
          </h2>
          <p className="text-muted-foreground mb-3">
            L&apos;ANC était trivial - un seul octet, trois valeurs. L&apos;EQ
            m&apos;a donné plus de fil à retordre.
          </p>
          <p className="text-muted-foreground mb-3">
            Mon premier essai logique : écrire directement l&apos;index du preset
            sur la caractéristique 0x0017. Un seul octet, valeur = index du preset.
            Les écouteurs répondent{" "}
            <code className="rounded bg-muted px-1">Invalid Length</code>.
          </p>
          <div className="my-6 flex justify-center">
            <img
              src="/memes/fine-invalid-length.png"
              alt="This is fine - après avoir reçu Invalid Length"
              className="rounded-lg max-w-xs sm:max-w-sm w-full"
            />
          </div>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Ce que le code Kotlin dit vraiment
          </h3>
          <p className="text-muted-foreground mb-3">
            En creusant dans le code décompilé, je trouve deux opérations
            distinctes pour changer l&apos;EQ. Le protocole Zound appelle ça{" "}
            <strong>ASSIGN_STEP_PRESET</strong> puis{" "}
            <strong>CHANGE_ACTIVE_STEP</strong>.
          </p>
          <p className="text-muted-foreground mb-3">
            Le concept de &quot;step&quot; est une abstraction qui vient du fait
            que l&apos;appareil peut stocker plusieurs configurations EQ et
            switcher entre elles. L&apos;index de step est toujours 0 dans
            l&apos;usage normal.
          </p>
          <CodeBlock title="Encodage EQ - deux écritures successives">
{`// Opération 1 : ASSIGN_STEP_PRESET
// [0x01, stepIndex, presetId]
func EncodeEQAssign(preset EQPreset) []byte {
    return []byte{0x01, 0x00, byte(preset)}
}

// Opération 2 : CHANGE_ACTIVE_STEP
// [0x00, stepIndex]
func EncodeEQActivate() []byte {
    return []byte{0x00, 0x00}
}

// Usage
client.Write(CharEqualizerSettings, EncodeEQAssign(EQRock))
client.Write(CharEqualizerSettings, EncodeEQActivate())`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Les deux écritures vont sur la même caractéristique. Le premier octet
            discrimine l&apos;opération :{" "}
            <code className="rounded bg-muted px-1">0x01</code>{" "}
            pour assigner un preset à un step,{" "}
            <code className="rounded bg-muted px-1">0x00</code> pour activer un
            step. Sans la deuxième écriture, l&apos;appareil stocke le preset
            mais ne l&apos;active pas.
          </p>
          <InfoBox>
            Ce pattern de deux écritures sur la même caractéristique est un
            design courant dans les SDK audio BLE. Ça permet des transitions
            atomiques côté firmware : on prépare le preset, on l&apos;active.
            Sans ça, un changement de preset pourrait s&apos;entendre à mi-chemin
            si l&apos;application est lente.
          </InfoBox>
        </section>

        {/* 6. Application Linux */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            6. L&apos;application Linux - CLI et GUI
          </h2>
          <p className="text-muted-foreground mb-3">
            Une fois le protocole compris, j&apos;ai codé l&apos;implémentation
            en Go. Deux interfaces : un CLI et une GUI. Le CLI d&apos;abord,
            pour valider que toutes les commandes fonctionnent sans friction UI.
            La GUI ensuite, parce que lancer un terminal pour changer le mode ANC
            c&apos;est bien, mais pas très pratique au quotidien.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Architecture du projet
          </h3>
          <CodeBlock title="Structure du projet marshall-linux">
{`marshall-linux/
  cmd/marshall/         -> CLI
  internal/
    ble/bluez.go        -> connexion D-Bus, scan, pairing, GATT
    protocol/uuids.go   -> toutes les constantes UUID
    protocol/commands.go -> encodage des commandes
    device/device.go    -> abstraction haut niveau
  frontend/src/         -> UI Svelte
  app.go                -> bindings Wails
  main.go               -> entrée Wails`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            La couche <code className="rounded bg-muted px-1">ble/bluez.go</code>{" "}
            gère tout ce qui touche à D-Bus : connexion au daemon BlueZ,
            scan des appareils, enregistrement de l&apos;agent, pairing, et
            lecture/écriture des caractéristiques GATT. Le reste du code ne
            touche jamais D-Bus directement.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Le CLI
          </h3>
          <CodeBlock title="CLI usage">
{`marshall <nom|adresse> <commande> [args]

Commandes :
  info                          Modèle, firmware, batterie, mode ANC
  anc [off|anc|transparency]    Lire ou écrire le mode ANC
  eq <preset>                   Changer le preset EQ
  battery                       Niveau de batterie
  scan                          Lister les caractéristiques GATT

Exemples :
  marshall "MOTIF II A.N.C." info
  marshall "MOTIF II A.N.C." anc transparency
  marshall "MOTIF II A.N.C." eq rock`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            La GUI avec Wails
          </h3>
          <p className="text-muted-foreground mb-3">
            Pour la GUI, j&apos;ai utilisé <strong>Wails v2</strong> -
            l&apos;équivalent de Tauri pour Go. Le backend est du Go pur, le
            frontend est du Svelte. Wails expose les méthodes Go au frontend via
            des bindings générés automatiquement, et le tout se compile en un
            seul binaire.
          </p>
          <p className="text-muted-foreground mb-3">
            L&apos;UI est volontairement minimale : thème sombre, pas
            d&apos;emojis, icônes SVG. La connexion se fait par scan Bluetooth -
            l&apos;appli liste les appareils détectés, on clique sur le sien,
            c&apos;est tout.
          </p>
        </section>

        {/* 7. Capabilities */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Package className="size-5 text-primary" />
            7. Gestion multi-appareils
          </h2>
          <p className="text-muted-foreground mb-3">
            Le deuxième appareil sur lequel j&apos;ai testé c&apos;est mon
            enceinte Marshall WILLEN. Et là, première surprise : l&apos;appli
            plante avec{" "}
            <code className="rounded bg-muted px-1">characteristic 00000017-... not found</code>.
          </p>
          <p className="text-muted-foreground mb-3">
            Logique : le WILLEN est une enceinte Bluetooth. Pas de mode ANC,
            pas le même EQ que des écouteurs. Les caractéristiques disponibles
            varient selon le modèle.
          </p>
          <p className="text-muted-foreground mb-3">
            La solution : après connexion, interroger les caractéristiques
            réellement présentes sur l&apos;appareil, et n&apos;afficher que les
            sections UI correspondantes. Plus de crash, et l&apos;interface
            s&apos;adapte au device.
          </p>
          <CodeBlock title="Détection des capacités post-connexion (Go)">
{`func (a *App) GetCapabilities() *Capabilities {
    if a.dev == nil {
        return &Capabilities{}
    }
    set := map[string]bool{}
    for _, uuid := range a.dev.ListCharacteristics() {
        set[uuid] = true
    }
    return &Capabilities{
        HasANC:     set[protocol.CharANCConfiguration],
        HasEQ:      set[protocol.CharEqualizerSettings],
        HasBattery: set[protocol.CharBatteryLevel],
        // ...
    }
}`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Côté Svelte, les sections ANC et EQ sont dans des blocs{" "}
            <code className="rounded bg-muted px-1">{"{#if caps.hasANC}"}</code>{" "}
            et{" "}
            <code className="rounded bg-muted px-1">{"{#if caps.hasEQ}"}</code>.
            Si ni l&apos;un ni l&apos;autre n&apos;est disponible, un message
            discret indique que l&apos;appareil ne supporte pas de contrôles
            avancés.
          </p>
          <InfoBox>
            Cette approche par détection de caractéristiques est plus robuste
            que le hardcode par modèle. Si un nouveau Marshall sort avec une
            caractéristique supplémentaire, l&apos;appli l&apos;exposera
            automatiquement dès que la logique de lecture/écriture est
            implémentée - sans avoir à maintenir une liste de modèles connus.
          </InfoBox>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Le scan BLE et le cache BlueZ
          </h3>
          <p className="text-muted-foreground mb-3">
            Un détail pratique sur la découverte des appareils : quand des
            écouteurs ou une enceinte sont connectés en Bluetooth classique pour
            l&apos;audio, leur interface BLE n&apos;advertise pas forcément en
            continu. BlueZ garde cependant les appareils connus en cache.
          </p>
          <p className="text-muted-foreground mb-3">
            L&apos;appli fait donc deux choses en parallèle au lancement : lire
            le cache BlueZ immédiatement (instantané, affiche les appareils déjà
            connus), et lancer un scan BLE de 8 secondes en arrière-plan pour
            découvrir de nouveaux appareils. Le WILLEN apparaît dans le cache
            même quand il ne diffuse pas activement.
          </p>
        </section>

        {/* 8. Doc protocole */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Layers className="size-5 text-primary" />
            8. La documentation du protocole
          </h2>
          <p className="text-muted-foreground mb-3">
            En parallèle de l&apos;implémentation, j&apos;ai documenté tout ce
            que j&apos;ai trouvé dans un repo séparé :{" "}
            <a
              href="https://github.com/c0ffee-audio/marshall-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              marshall-protocol
            </a>
            . UUIDs complets, encodage des commandes, valeurs des enums, table
            des firmwares par modèle, mécanisme d&apos;authentification - tout
            ce qui a été reversé.
          </p>
          <p className="text-muted-foreground mb-3">
            L&apos;idée c&apos;est que quelqu&apos;un qui veut implémenter le
            protocole dans un autre langage n&apos;ait pas à reprendre le RE
            depuis zéro. Le repo est séparé de l&apos;appli pour être
            réutilisable indépendamment.
          </p>
        </section>

        {/* Conclusion */}
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 font-mono text-xl font-semibold">
            Ce que j&apos;en retire
          </h2>
          <p className="text-muted-foreground mb-3">
            Le RE de l&apos;APK en lui-même n&apos;était pas la partie difficile.
            jadx décompile bien le Kotlin, le code Zound est structuré, les noms
            de constantes sont expressifs. Ce qui a pris du temps c&apos;est
            comprendre la couche BlueZ/D-Bus - et notamment l&apos;histoire de
            l&apos;agent NoInputNoOutput que je ne connaissais pas.
          </p>
          <p className="text-muted-foreground mb-3">
            Ce que j&apos;ai appris sur BLE en faisant ce projet : les appareils
            BLE ne sont pas des pipes passifs. Ils ont leur propre logique
            d&apos;authentification, leurs propres contraintes sur l&apos;ordre
            des opérations, et le OS/stack BT interprète beaucoup de choses en
            dessous de ce qu&apos;on voit. La documentation de BlueZ sur ce
            sujet est sparse - le plus efficace reste de lire les logs D-Bus
            et de grep le code source de bluez.
          </p>
          <p className="text-muted-foreground mb-3">
            Sur le fond du projet : l&apos;appli fonctionne, les écouteurs
            répondent, l&apos;enceinte aussi, l&apos;ANC et l&apos;EQ se
            contrôlent depuis Linux. C&apos;est ce que je voulais au départ.
          </p>
          <p className="text-muted-foreground">
            Les deux repos :{" "}
            <a
              href="https://github.com/c0ffee-audio/marshall-linux"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              marshall-linux
            </a>{" "}
            (l&apos;appli) et{" "}
            <a
              href="https://github.com/c0ffee-audio/marshall-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              marshall-protocol
            </a>{" "}
            (la doc du protocole).
          </p>
        </section>
      </article>
    </div>
  );
}
