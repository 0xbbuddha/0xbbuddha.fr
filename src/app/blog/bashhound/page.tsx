import {
  Terminal,
  Network,
  Shield,
  Database,
  Cpu,
  Layers,
  GitBranch,
  Code2,
  FileJson,
  Heart,
  Zap,
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
  title: "Et si on recodait un collecteur AD en pur Bash ? | 0xbbuddha",
  description:
    "Conception et implémentation de BashHound & BashHound-CE, des collecteurs Active Directory pour BloodHound en Bash pur : protocole LDAP, ASN.1, parsing Security Descriptors, export JSON v5/v6.",
};

export default function ArticleBashHoundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Article · Tools"
        title="Et si on recodait un collecteur AD en pur Bash ?"
        description="BashHound & BashHound-CE : un collecteur Active Directory pour BloodHound en Bash pur. Protocole LDAP, encodage ASN.1, parsing des Security Descriptors et export JSON v5/v6."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "BashHound" },
        ]}
        stats={[
          { label: "Category", value: "Tools" },
          { label: "Tags", value: "Active Directory · BloodHound · Bash" },
          { label: "Date", value: "2026-03-18" },
        ]}
      />

      <article className="mt-8 space-y-12">

        {/* Section personnelle */}
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Heart className="size-5 text-primary" />
            La genèse du projet
          </h2>
          <p className="text-muted-foreground mb-3">
            J&apos;ai toujours eu un attachement particulier pour Bash. Pas
            par obligation, par curiosité. Ce langage qu&apos;on résume souvent
            à quelques <code className="rounded bg-muted px-1">ls</code> et{" "}
            <code className="rounded bg-muted px-1">grep</code> cache en réalité
            une profondeur que peu de gens explorent. Écrire des scripts qui
            font des choses qu&apos;on pense impossibles en shell, c&apos;est
            ce qui me donne envie de coder.
          </p>
          <p className="text-muted-foreground mb-3">
            L&apos;idée de BashHound est née en regardant une vidéo de la chaîne{" "}
            <strong>You Suck at Programming</strong> :{" "}
            <a
              href="https://youtu.be/L967hYylZuc?si=GEXNWdhPmqkJjH_z"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              &quot;Pure bash : No commands, just bash&quot;
            </a>
            . La vidéo montre jusqu&apos;où on peut pousser Bash : implémenter
            des fonctionnalités réseau, manipuler du binaire, encoder des
            données, sans invoquer un seul outil externe. C&apos;était
            exactement le genre de défi technique un peu fou que j&apos;adore.
          </p>
          <p className="text-muted-foreground mb-3">
            Je me suis alors posé la question : est-ce qu&apos;on peut écrire
            un collecteur BloodHound fonctionnel en Bash pur ? Pas avec{" "}
            <code className="rounded bg-muted px-1">ldapsearch</code>, pas avec{" "}
            <code className="rounded bg-muted px-1">python-ldap</code>, pas avec
            un binaire compilé. Juste Bash, les descripteurs de fichiers, et{" "}
            <code className="rounded bg-muted px-1">xxd</code> pour convertir
            du binaire.
          </p>
          <p className="text-muted-foreground mb-3">
            La toute première ligne de code écrite a été celle-ci :
          </p>
          <CodeBlock title="bashhound : commit initial">
{`# Voici la première ligne de code de BashHound mother fuck**`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Et c&apos;est là que le projet s&apos;est arrêté. Parce que comme
            souvent avant de me lancer dans quelque chose, j&apos;avais demandé
            à Claude ce qu&apos;il en pensait : faisabilité, complexité,
            ressources nécessaires. La réponse avait été claire : ce
            n&apos;était pas vraiment possible. Les arguments avancés :
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
            <li>
              <strong>Bash ne sait pas manipuler du binaire</strong> : le
              protocole LDAP repose sur ASN.1 BER, un format binaire que les
              outils shell ne peuvent pas encoder/décoder nativement.
            </li>
            <li>
              <strong>Pas de gestion TLS native</strong> : LDAPS nécessite une
              couche TLS que Bash est incapable de négocier sans appeler
              OpenSSL, rendant l&apos;approche &quot;pure bash&quot; impossible.
            </li>
            <li>
              <strong>Les sockets réseau en Bash sont trop limités</strong> :
              {" "}<code className="rounded bg-muted px-1">/dev/tcp</code> n&apos;est
              pas fiable pour des protocoles aussi complexes qu&apos;LDAP, avec
              ses réponses multi-paquets et ses longueurs variables.
            </li>
            <li>
              <strong>La complexité des Security Descriptors Windows</strong> :
              parser des ACLs binaires en Bash serait ingérable, trop de
              structures imbriquées, trop d&apos;edge cases.
            </li>
            <li>
              <strong>Les performances seraient rédhibitoires</strong> : chaque
              opération de parsing lancerait des dizaines de sous-processus,
              rendant l&apos;outil inutilisable sur un domaine réel.
            </li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Bref, j&apos;ai laissé tomber. Puis la vidéo est passée.
            Et j&apos;ai recommencé. Cette fois sans demander la permission.
          </p>
          <p className="text-muted-foreground">
            Ce n&apos;est pas l&apos;outil le plus rapide ni le plus complet,
            et c&apos;est assumé. C&apos;est avant tout un projet pour
            apprendre, pour comprendre en profondeur le protocole LDAP,
            l&apos;encodage ASN.1 et les structures internes d&apos;Active
            Directory. Et pour prouver, à Claude autant qu&apos;à
            moi-même, que Bash peut aller beaucoup plus loin qu&apos;on ne
            le pense.
          </p>
        </section>

        {/* Sommaire */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-3 font-mono text-sm font-semibold text-primary uppercase tracking-widest">
            Sommaire
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground font-mono">
            <li>Contexte : BloodHound et ses collecteurs</li>
            <li>Les collecteurs existants</li>
            <li>Architecture globale du projet</li>
            <li>Contraintes et choix de design</li>
            <li>lib/asn1.sh : Encodage ASN.1 en Bash</li>
            <li>lib/ldap.sh : Protocole LDAP en Bash pur</li>
            <li>lib/ldap_parser.sh : Parsing des réponses LDAP</li>
            <li>lib/acl_parser.sh : Security Descriptors et ACEs</li>
            <li>lib/collectors.sh : Collecte des objets AD</li>
            <li>lib/export.sh / export_ce.sh : Export BloodHound JSON</li>
            <li>BashHound vs BashHound-CE : Format v5 vs v6, AD CS</li>
            <li>Benchmark : RustHound-CE vs BashHound-CE</li>
            <li>Limites connues</li>
            <li>Ce que ça m&apos;a appris</li>
            <li>Conclusion</li>
          </ol>
        </section>

        {/* 1. Contexte */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Layers className="size-5 text-primary" />
            1. Contexte : BloodHound et ses collecteurs
          </h2>
          <p className="text-muted-foreground mb-3">
            Si t&apos;as déjà fait de la pentest AD, tu connais{" "}
            <strong>BloodHound</strong>. L&apos;outil qui transforme un annuaire
            LDAP en graphe de chemins d&apos;attaque. Tu lui donnes des données,
            il te dit comment passer d&apos;un compte lambda jusqu&apos;aux{" "}
            <code className="rounded bg-muted px-1">Domain Admins</code>. C&apos;est
            devenu un standard dans les audits AD.
          </p>
          <p className="text-muted-foreground mb-3">
            Mais BloodHound ne collecte rien tout seul. Il a besoin
            d&apos;un <strong>collecteur</strong> qui va interroger le LDAP,
            extraire les objets, parser les ACLs, et tout sérialiser dans un
            format JSON précis. C&apos;est ce bout-là qu&apos;on réimplémente ici.
          </p>
          <p className="text-muted-foreground mb-3">
            Petite précision : il existe deux versions de BloodHound, et elles ne parlent pas le même format.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
            <li>
              <strong>BloodHound legacy</strong> (v4/v5) : la version
              originale, basée sur Electron. Son format JSON est dit{" "}
              <em>v5</em>. Maintenu par la communauté mais plus activement
              développé par SpecterOps.
            </li>
            <li>
              <strong>BloodHound Community Edition (CE)</strong> : la
              réécriture complète par SpecterOps, avec une API REST, un backend
              Go et un frontend React. Son format JSON est <em>v6</em>, avec des
              schémas enrichis (nodes, edges, AD CS…).
            </li>
          </ul>
          <p className="text-muted-foreground">
            BashHound cible le format <strong>v5</strong> (BloodHound legacy),
            BashHound-CE cible le format <strong>v6</strong> (BloodHound CE).
          </p>
        </section>

        {/* 2. Les alternatives */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            2. Les collecteurs existants
          </h2>
          <p className="text-muted-foreground mb-4">
            Avant de se lancer, un tour d&apos;horizon de ce qui existe :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-2 pr-6">Outil</th>
                  <th className="py-2 pr-6">Langage</th>
                  <th className="py-2">Auteur(s)</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6 text-primary">SharpHound</td>
                  <td className="py-2 pr-6">C# (.NET)</td>
                  <td className="py-2">SpecterOps</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6 text-primary">RustHound</td>
                  <td className="py-2 pr-6">Rust</td>
                  <td className="py-2">OPENCYBER-FR</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6 text-primary">BloodHound.py</td>
                  <td className="py-2 pr-6">Python 3</td>
                  <td className="py-2">fox-it</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6 text-primary">RustHound-CE</td>
                  <td className="py-2 pr-6">Rust</td>
                  <td className="py-2">g0h4n</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6 text-primary">BloodHound-CE-Python</td>
                  <td className="py-2 pr-6">Python 3</td>
                  <td className="py-2">dirkjanm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Architecture */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Layers className="size-5 text-primary" />
            3. Architecture globale du projet
          </h2>
          <p className="text-muted-foreground mb-3">
            L&apos;architecture est classique pour un projet bash un peu sérieux :
            chaque lib a sa responsabilité, le script principal orchestre le tout.
            Ça ressemble à ça :
          </p>
          <CodeBlock title="Structure BashHound-CE">
{`BashHound-CE/
├── bashhound-ce          # Point d'entrée principal (567 lignes)
└── lib/
    ├── asn1.sh           # Encodage/décodage ASN.1 (330 lignes)
    ├── ldap.sh           # Protocole LDAP en Bash pur (629 lignes)
    ├── ldap_parser.sh    # Parsing des réponses LDAP (938 lignes)
    ├── acl_parser.sh     # Parsing des Security Descriptors (558 lignes)
    ├── collectors.sh     # Collecte des objets AD (1023 lignes)
    └── export_ce.sh      # Export JSON BloodHound CE v6 (2423 lignes)`}
          </CodeBlock>
          <CodeBlock title="Structure BashHound (legacy)">
{`BashHound/
├── bashhound             # Point d'entrée principal (380 lignes)
└── lib/
    ├── asn1.sh           # Encodage/décodage ASN.1 (247 lignes)
    ├── ldap.sh           # Protocole LDAP en Bash pur (521 lignes)
    ├── ldap_parser.sh    # Parsing des réponses LDAP (521 lignes)
    ├── acl_parser.sh     # Parsing des Security Descriptors (388 lignes)
    ├── collectors.sh     # Collecte des objets AD (516 lignes)
    └── export.sh         # Export JSON BloodHound v5 (1207 lignes)`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Le flux de données suit un pipeline précis :
          </p>
          <CodeBlock title="Pipeline de traitement">
{`LDAP Query (ASN.1 encodé)
    ↓
Réponse binaire LDAP (hex via xxd)
    ↓
ldap_parser.sh → Extraction des attributs (DN, SID, UAC, ACLs…)
    ↓
acl_parser.sh → Parsing Security Descriptors → ACEs
    ↓
collectors.sh → Écriture dans fichiers temporaires /tmp/bashhound_*_$$
    ↓
export.sh / export_ce.sh → Génération JSON BloodHound
    ↓
ZIP → Import dans BloodHound`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Les données sont stockées temporairement dans des fichiers{" "}
            <code className="rounded bg-muted px-1">/tmp/bashhound_*_$$</code>{" "}
            (le <code className="rounded bg-muted px-1">$$</code> étant le PID du processus, pour éviter les collisions en cas d&apos;exécutions parallèles).
            La phase d&apos;export lit ces fichiers et génère les JSON finaux.
          </p>
        </section>

        {/* 4. Contraintes */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Code2 className="size-5 text-primary" />
            4. Contraintes et choix de design
          </h2>
          <p className="text-muted-foreground mb-3">
            Avant de plonger dans le code, quelques règles que je me suis fixées
            dès le départ.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Ce qui est autorisé
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
            <li>
              <strong>/dev/tcp</strong> : c&apos;est un built-in Bash, pas une
              commande externe. Ouvrir un socket TCP via{" "}
              <code className="rounded bg-muted px-1">/dev/tcp/host/port</code>{" "}
              ne lance aucun processus fils.
            </li>
            <li>
              <strong>xxd</strong> : une commande externe, mais utilisée
              uniquement pour convertir du binaire brut en hex et inversement.
              Bash ne sait pas manipuler des octets nuls dans des variables,
              donc{" "}
              <code className="rounded bg-muted px-1">xxd -p</code> est le seul
              moyen réaliste de travailler avec des réponses LDAP binaires.
            </li>
            <li>
              <strong>openssl s_client</strong> : nécessaire uniquement pour
              LDAPS. Bash ne peut pas négocier TLS tout seul,{" "}
              <code className="rounded bg-muted px-1">/dev/tcp</code> ne gère
              que du TCP brut. LDAP plain (port 389) reste en{" "}
              <code className="rounded bg-muted px-1">/dev/tcp</code> pur.
            </li>
            <li>
              <strong>jq</strong> : utilisé uniquement en phase d&apos;export
              pour sérialiser proprement le JSON final. Pas dans le parsing
              LDAP.
            </li>
          </ul>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Pourquoi tout en hex
          </h3>
          <p className="text-muted-foreground mb-3">
            Bash traite les variables comme des chaînes de caractères. Un octet
            nul{" "}
            <code className="rounded bg-muted px-1">0x00</code> dans une
            variable Bash la tronque. Les réponses LDAP étant du binaire pur,
            la seule représentation manipulable en Bash c&apos;est la chaîne
            hex. Toute la pipeline interne travaille donc en hex, le binaire
            n&apos;apparaissant qu&apos;au moment d&apos;envoyer sur le socket.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Ce qui est hors périmètre
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Authentification Kerberos (GSSAPI) : non implémentée, uniquement LDAP simple bind</li>
            <li>Paging LDAP (contrôle 1.2.840.113556.1.4.319) : pas de pagination, la limite de taille est désactivée côté serveur</li>
            <li>LDAP referrals : ignorés</li>
            <li>Forêts multi-domaines : collecte d&apos;un seul domaine à la fois</li>
          </ul>
        </section>

        {/* 5. ASN.1 */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Cpu className="size-5 text-primary" />
            5. lib/asn1.sh : Encodage ASN.1 en Bash
          </h2>
          <p className="text-muted-foreground mb-3">
            C&apos;est là que ça commence à être vraiment fun. LDAP parle en
            binaire, et ce binaire c&apos;est de l&apos;<strong>ASN.1 BER</strong>.
            Chaque message LDAP est une structure sérialisée en octets, format
            TLV, spécifié dans la RFC 4511. Pour envoyer quoi que ce soit au DC
            depuis Bash, faut encoder ça à la main, sans lib externe,
            sans aide. Juste des chaînes hex et des opérations arithmétiques.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            L&apos;encodage BER
          </h3>
          <p className="text-muted-foreground mb-3">
            En LDAP, les messages sont encodés en <strong>BER</strong> (Basic
            Encoding Rules) d&apos;ASN.1, sous une forme de type TLV : Tag,
            Length, Value. Chaque valeur est précédée de son type et de sa
            taille. La longueur peut s&apos;encoder sur plusieurs octets dès
            qu&apos;elle dépasse 127. En pratique les tags LDAP courants tiennent
            souvent sur un octet, mais BER permet aussi des tags multi-octets.
            LDAP utilise également des tags <em>context-specific</em> ASN.1,
            dont la signification dépend de la structure du message définie
            par le protocole.
          </p>
          <CodeBlock title="Encodage BER : TLV">
{`[ Tag (souvent 1 octet) ] [ Length (1 à N octets) ] [ Value (N octets) ]

Exemple : INTEGER 3
  02          ← Tag INTEGER
  01          ← Length : 1 octet
  03          ← Value : 3

Exemple : OCTET STRING "CN=admin"
  04          ← Tag OCTET_STRING
  08          ← Length : 8 octets
  434e3d61646d696e  ← Value : "CN=admin" en hex ASCII`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Les tags définis dans asn1.sh
          </h3>
          <p className="text-muted-foreground mb-3">
            On commence par déclarer toutes les constantes : types ASN.1
            universels et tags spécifiques aux messages LDAP. C&apos;est la base
            sur laquelle tout le reste s&apos;appuie.
          </p>
          <CodeBlock title="lib/asn1.sh : Constantes">
{`# Types ASN.1 universels
readonly ASN1_BOOLEAN=0x01
readonly ASN1_INTEGER=0x02
readonly ASN1_OCTET_STRING=0x04
readonly ASN1_NULL=0x05
readonly ASN1_ENUMERATED=0x0a
readonly ASN1_SEQUENCE=0x30      # SEQUENCE (même tag BER que SEQUENCE OF)
readonly ASN1_SET=0x31

# Messages LDAP (Application class, constructed)
readonly LDAP_BIND_REQUEST=0x60
readonly LDAP_BIND_RESPONSE=0x61
readonly LDAP_UNBIND_REQUEST=0x42
readonly LDAP_SEARCH_REQUEST=0x63
readonly LDAP_SEARCH_RESULT_ENTRY=0x64
readonly LDAP_SEARCH_RESULT_DONE=0x65
readonly LDAP_MODIFY_REQUEST=0x66
readonly LDAP_MODIFY_RESPONSE=0x67

# Tags contextuels LDAP (Context-specific)
readonly LDAP_CONTEXT_0=0x80     # simpleAuth (mot de passe en clair)
readonly LDAP_CONTEXT_7=0x87     # present filter (attribut=*)`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Encodage de la longueur
          </h3>
          <p className="text-muted-foreground mb-3">
            L&apos;encodage de la longueur m&apos;a coûté un bon moment. Moins
            de 128 octets ? Un seul byte, direct. Au-delà, on passe en{" "}
            <em>forme longue</em> : un premier octet avec le bit 7 à 1 qui
            indique combien d&apos;octets suivent pour encoder la vraie longueur.
            Simple en théorie, piège en pratique quand on manipule tout en hex.
          </p>
          <CodeBlock title="lib/asn1.sh : asn1_encode_length()">
{`asn1_encode_length() {
    local length=$1

    if [ "$length" -lt 128 ]; then
        # Forme courte : longueur directe sur 1 octet
        printf '%02x' "$length"
    else
        # Forme longue : 0x80|n_octets + n octets de longueur
        local hex_length=$(printf '%x' "$length")
        local num_octets=$((${"$"}{#hex_length} / 2))
        if [ $((${"$"}{#hex_length} % 2)) -ne 0 ]; then
            hex_length="0$hex_length"
            ((num_octets++))
        fi
        printf '%02x%s' $((0x80 | num_octets)) "$hex_length"
    fi
}`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Exemple : pour encoder une longueur de 300 octets (0x12C) :
          </p>
          <CodeBlock title="Exemple longueur 300">
{`300 = 0x12C  → nécessite 2 octets
Résultat : 82 012c
  82  = 0x80 | 0x02  (forme longue, 2 octets suivent)
  01  = octet de poids fort
  2c  = octet de poids faible`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Encodage des types principaux
          </h3>
          <CodeBlock title="lib/asn1.sh : Encodage INTEGER">
{`asn1_encode_integer() {
    local value=$1
    local hex_value=$(printf '%x' "$value")

    # Padding à nombre pair d'octets
    if [ $((${"$"}{#hex_value} % 2)) -ne 0 ]; then
        hex_value="0$hex_value"
    fi

    # Si le bit de poids fort est à 1, ajouter 0x00 (éviter interprétation signed)
    local first_byte=$((0x${"$"}{hex_value:0:2}))
    if [ "$first_byte" -ge 128 ]; then
        hex_value="00$hex_value"
    fi

    local length=$((${"$"}{#hex_value} / 2))
    printf '%02x' "$ASN1_INTEGER"   # Tag 0x02
    asn1_encode_length "$length"
    printf '%s' "$hex_value"
}`}
          </CodeBlock>
          <CodeBlock title="lib/asn1.sh : Encodage OCTET STRING">
{`asn1_encode_octet_string() {
    local string="$1"
    # Conversion ASCII → hex avec xxd
    local hex_string=$(printf '%s' "$string" | xxd -p | tr -d '\n')
    local length=$((${"$"}{#hex_string} / 2))

    printf '%02x' "$ASN1_OCTET_STRING"  # Tag 0x04
    asn1_encode_length "$length"
    printf '%s' "$hex_string"
}`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Toutes les fonctions d&apos;encodage retournent une string hex. C&apos;est
            la représentation interne choisie pour tout BashHound. Le binaire
            brut n&apos;apparaît qu&apos;au dernier moment, quand on envoie sur le
            socket via{" "}
            <code className="rounded bg-muted px-1">{"xxd -r -p >&3"}</code>.
            Ce choix simplifie énormément le debugging : on peut logger
            n&apos;importe quel message LDAP en clair.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Encodage OID (Object Identifier)
          </h3>
          <p className="text-muted-foreground mb-3">
            Les OIDs servent notamment pour les contrôles LDAP, par exemple{" "}
            <code className="rounded bg-muted px-1">1.2.840.113556.1.4.801</code>{" "}
            qui permet de lire les Security Descriptors complets. Leur encodage
            ASN.1 est un peu particulier : les deux premiers arcs sont fusionnés
            en un seul octet (
            <code className="rounded bg-muted px-1">40*arc0 + arc1</code>), et
            les suivants passent en base 128 avec des continuation bits. Ça
            m&apos;a pris un moment à comprendre. La doc RFC est pas franchement
            accueillante.
          </p>
          <CodeBlock title="lib/asn1.sh : Encodage OID">
{`asn1_encode_oid() {
    local oid="$1"
    IFS='.' read -ra parts <<< "$oid"

    # Premier octet = 40 * arc0 + arc1
    local first_byte=$(( 40 * ${"$"}{parts[0]} + ${"$"}{parts[1]} ))
    local hex_result=$(printf '%02x' "$first_byte")

    # Arcs suivants : encodage base-128 (MSB first, bit 7 = continuation)
    for ((i=2; i<${"$"}{#parts[@]}; i++)); do
        local num=${"$"}{parts[i]}
        if [ $num -lt 128 ]; then
            hex_result+=$(printf '%02x' "$num")
        else
            # Encodage multi-octets avec continuation bits
            local bytes=()
            while [ $num -gt 0 ]; do
                bytes=($((num & 0x7f)) "${"$"}{bytes[@]}")
                num=$((num >> 7))
            done
            for ((j=0; j<${"$"}{#bytes[@]}; j++)); do
                local byte=${"$"}{bytes[j]}
                [ $j -lt $((${"$"}{#bytes[@]} - 1)) ] && byte=$((byte | 0x80))
                hex_result+=$(printf '%02x' "$byte")
            done
        fi
    done

    local length=$((${"$"}{#hex_result} / 2))
    printf '06'  # Tag OID
    asn1_encode_length "$length"
    printf '%s' "$hex_result"
}`}
          </CodeBlock>
        </section>

        {/* 5. LDAP en Bash */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Network className="size-5 text-primary" />
            6. lib/ldap.sh : Protocole LDAP en Bash pur
          </h2>
          <p className="text-muted-foreground mb-3">
            Une fois l&apos;encodage ASN.1 en place, il faut mettre les mains
            dans le protocole réseau lui-même. LDAP c&apos;est du TCP, du
            binaire, et des messages structurés selon la RFC 4511. En Bash,
            zéro lib disponible. On réimplémente tout : connexion,
            encodage des requêtes, lecture des réponses octet par octet.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Connexion TCP avec /dev/tcp
          </h3>
          <p className="text-muted-foreground mb-3">
            Bash a une feature que pas grand monde connaît :{" "}
            <code className="rounded bg-muted px-1">/dev/tcp/host/port</code>.
            Ouvrir ce pseudo-fichier crée une connexion TCP vers le serveur,
            et on peut lire/écrire dessus comme n&apos;importe quel fichier. On
            utilise le descripteur 3 comme socket bidirectionnel :
          </p>
          <CodeBlock title="lib/ldap.sh : Connexion LDAP plain TCP">
{`ldap_connect_plain() {
    local host="$1"
    local port="$2"

    # Ouverture du socket TCP via /dev/tcp (Bash built-in)
    exec 3<>"/dev/tcp/$host/$port"

    LDAP_FD=3      # FD de lecture/écriture
    LDAP_USE_TLS=false
    echo "INFO: Connexion LDAP établie à $host:$port" >&2
    return 0
}`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Pour écrire sur le socket :{" "}
            <code className="rounded bg-muted px-1">{"printf '%s' \"$hex\" | xxd -r -p >&3"}</code>{" "}
            convertit la chaîne hex en binaire et l&apos;envoie. Pour lire :{" "}
            <code className="rounded bg-muted px-1">dd bs=1 count=N {"<"}&3</code>{" "}
            lit exactement N octets depuis le socket.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Connexion LDAPS (TLS) avec OpenSSL
          </h3>
          <p className="text-muted-foreground mb-3">
            LDAPS c&apos;est LDAP sur TLS, port 636. Et là, problème : Bash ne
            sait pas négocier du TLS tout seul. La solution que j&apos;ai trouvée
            c&apos;est d&apos;utiliser{" "}
            <code className="rounded bg-muted px-1">openssl s_client</code>{" "}
            comme tunnel TLS, en lui passant les données via deux named pipes
            (FIFOs). C&apos;est un peu tordu, mais ça marche.
          </p>
          <CodeBlock title="lib/ldap.sh : Connexion LDAPS via OpenSSL">
{`ldap_connect_tls() {
    local host="$1"
    local port="$2"

    # Création de deux FIFOs pour le tunnel TLS
    local fifo_in="/tmp/bashhound_ldaps_in_$$"
    local fifo_out="/tmp/bashhound_ldaps_out_$$"
    mkfifo "$fifo_in" "$fifo_out"

    # openssl s_client en arrière-plan : lit fifo_in, écrit fifo_out
    openssl s_client -quiet -connect "$host:$port" -ign_eof \
        < "$fifo_in" > "$fifo_out" 2>/dev/null &
    LDAP_OPENSSL_PID=$!

    sleep 1  # Attendre l'établissement TLS

    # FD 3 → écriture vers fifo_in (→ openssl → serveur)
    # FD 4 → lecture depuis fifo_out (← openssl ← serveur)
    exec 3>"$fifo_in"
    exec 4<"$fifo_out"

    LDAP_FD=3
    LDAP_USE_TLS=true
}`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Le pattern est assez propre une fois qu&apos;on l&apos;a compris :
            openssl s_client gère tout le TLS de façon transparente. On écrit
            dans FD 3 → openssl chiffre → envoie au DC. Le DC répond → openssl
            déchiffre → on lit depuis FD 4. Côté BashHound, on voit même plus
            le TLS.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            LDAP Bind : Authentification
          </h3>
          <p className="text-muted-foreground mb-3">
            Le Bind c&apos;est l&apos;authentification, le premier message
            qu&apos;on envoie au DC pour dire qui on est. En mode simple (mot de
            passe en clair sur LDAP, encodé mais pas chiffré), la structure
            ASN.1 ressemble à ça :
          </p>
          <CodeBlock title="Structure ASN.1 du BindRequest">
{`LDAPMessage ::= SEQUENCE {
    messageID    INTEGER,
    protocolOp   BindRequest
}

BindRequest ::= [APPLICATION 0] SEQUENCE {  -- tag 0x60
    version         INTEGER (3),
    name            OCTET STRING (DN),
    authentication  [0] OCTET STRING (password)  -- tag 0x80
}`}
          </CodeBlock>
          <CodeBlock title="lib/ldap.sh : ldap_bind()">
{`ldap_bind() {
    local dn="$1"
    local password="$2"
    local version="${"$"}{3:-3}"

    # Encodage de chaque champ
    local version_encoded=$(asn1_encode_integer "$version")    # 02 01 03
    local dn_encoded=$(asn1_encode_octet_string "$dn")         # 04 len DN
    local pwd_encoded=$(asn1_encode_octet_string_with_tag 0x80 "$password")  # 80 len pwd

    # BindRequest = APPLICATION 0 SEQUENCE {version, dn, auth}
    local bind_request="${"$"}{version_encoded}${"$"}{dn_encoded}${"$"}{pwd_encoded}"
    local bind_request_msg=$(asn1_encode_sequence_with_tag 0x60 "$bind_request")

    # LDAPMessage = SEQUENCE {messageID, protocolOp}
    local ldap_message=$(ldap_create_message "$LDAP_MESSAGE_ID" "$bind_request_msg")
    ((LDAP_MESSAGE_ID++))

    ldap_send_message "$ldap_message"
    local response=$(ldap_receive_message)

    # Vérification du resultCode (0 = success)
    if [[ "$response" =~ 0a0100 ]]; then
        echo "INFO: Bind réussi (resultCode=0)" >&2
        return 0
    fi
}`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Pour le confort d&apos;utilisation, BashHound accepte plusieurs
            formats : username simple (converti automatiquement en{" "}
            <code className="rounded bg-muted px-1">CN=user,CN=Users,DC=...</code>),
            UPN (<code className="rounded bg-muted px-1">user@domain.local</code>),
            ou DN complet si tu veux être précis.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            LDAP Search
          </h3>
          <p className="text-muted-foreground mb-3">
            La Search c&apos;est le cœur de tout. C&apos;est ce qu&apos;on envoie
            pour récupérer les objets AD. Son format ASN.1 est nettement plus
            complexe que le Bind, notamment à cause du filtre LDAP qui a son
            propre encodage :
          </p>
          <CodeBlock title="Structure SearchRequest ASN.1">
{`SearchRequest ::= [APPLICATION 3] SEQUENCE {  -- tag 0x63
    baseObject     LDAP_DN,
    scope          ENUMERATED { baseObject(0), singleLevel(1), wholeSubtree(2) },
    derefAliases   ENUMERATED,
    sizeLimit      INTEGER (0 = illimité),
    timeLimit      INTEGER (0 = illimité),
    typesOnly      BOOLEAN (false),
    filter         Filter,
    attributes     AttributeDescriptionList
}`}
          </CodeBlock>
          <CodeBlock title="lib/ldap.sh : ldap_search()">
{`ldap_search() {
    local base_dn="$1"
    local scope="${"$"}{2:-2}"          # 2 = wholeSubtree
    local filter="${"$"}{3:-(&(objectClass=*))}"
    local attributes="${"$"}{4:-*}"
    local use_sd_flags="${"$"}{5:-false}"

    # Encodage du SearchRequest
    local base_encoded=$(asn1_encode_octet_string "$base_dn")
    local scope_encoded=$(asn1_encode_enumerated "$scope")
    local deref_encoded=$(asn1_encode_enumerated 0)
    local size_limit_encoded=$(asn1_encode_integer 0)
    local time_limit_encoded=$(asn1_encode_integer 0)
    local types_only_encoded=$(asn1_encode_boolean false)
    local filter_encoded=$(ldap_encode_filter "$filter")
    local attrs_encoded=$(ldap_encode_attributes "$attributes")

    # Contrôle SD_FLAGS si nTSecurityDescriptor demandé
    # OID 1.2.840.113556.1.4.801 avec valeur 7 (OWNER|GROUP|DACL)
    if [[ "$attributes" == *"nTSecurityDescriptor"* ]]; then
        local oid_encoded=$(asn1_encode_octet_string "1.2.840.113556.1.4.801")
        local flags_int=$(asn1_encode_integer 7)
        local value_seq=$(asn1_encode_sequence "$flags_int")
        local value_encoded=$(asn1_encode_octet_string_hex "$value_seq")
        local control=$(asn1_encode_sequence "${"$"}{oid_encoded}${"$"}{value_encoded}")
        controls=$(asn1_encode_sequence_with_tag 0xa0 "$control")
    fi

    local search_request="${"$"}{base_encoded}${"$"}{scope_encoded}${"$"}{deref_encoded}\
${"$"}{size_limit_encoded}${"$"}{time_limit_encoded}${"$"}{types_only_encoded}\
${"$"}{filter_encoded}${"$"}{attrs_encoded}"
    local search_request_msg=$(asn1_encode_sequence_with_tag 0x63 "$search_request")
    local ldap_message=$(ldap_create_message "$LDAP_MESSAGE_ID" \
        "$search_request_msg" "$controls")

    ldap_send_message "$ldap_message"

    # Lecture des résultats jusqu'au SearchResultDone (tag 0x65)
    local results=()
    local done=false
    while [ "$done" = false ]; do
        local response=$(ldap_receive_message)
        if [[ "$response" =~ 64 ]]; then    # SearchResultEntry
            results+=("$response")
        elif [[ "$response" =~ 65 ]]; then  # SearchResultDone
            done=true
        fi
    done
    printf '%s\n' "${"$"}{results[@]}"
}`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Le contrôle SD_FLAGS (OID{" "}
            <code className="rounded bg-muted px-1">1.2.840.113556.1.4.801</code>)
            est indispensable pour récupérer les ACLs. Sans lui, on ne
            récupère généralement pas toutes les composantes utiles du security
            descriptor. Avec la valeur 7 (OWNER + GROUP + DACL), on a ce
            qu&apos;il faut pour le parsing complet.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Lecture des réponses LDAP
          </h3>
          <p className="text-muted-foreground mb-3">
            Lire une réponse LDAP c&apos;est plus délicat que d&apos;en envoyer une.
            On sait pas à l&apos;avance combien d&apos;octets vont arriver. Faut
            lire le header d&apos;abord, déterminer la longueur, puis lire
            exactement le bon nombre d&apos;octets. Rien de plus, rien de moins :
          </p>
          <CodeBlock title="lib/ldap.sh : ldap_receive_message()">
{`ldap_receive_message() {
    local read_fd=3
    [ "$LDAP_USE_TLS" = "true" ] && read_fd=4

    # Lecture du header (tag + premier octet de longueur)
    local header=$(dd bs=1 count=2 <&$read_fd 2>/dev/null | xxd -p | tr -d '\n')

    local length_byte=$((0x${"$"}{header:2:2}))
    local total_length=0

    if [ "$length_byte" -lt 128 ]; then
        # Forme courte : longueur directe
        total_length=$length_byte
    else
        # Forme longue : lire N octets supplémentaires
        local num_octets=$((length_byte & 0x7f))
        local length_hex=$(dd bs=1 count=$num_octets <&$read_fd 2>/dev/null | xxd -p | tr -d '\n')
        total_length=$((16#$length_hex))
    fi

    # Lecture du contenu complet
    local content=$(dd bs=1 count=$total_length <&$read_fd 2>/dev/null | xxd -p | tr -d '\n')
    echo "${"$"}{header}${"$"}{content}"
}`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Tout est manipulé en hex. C&apos;est un choix de design qui tient
            la route. Bash gère pas bien le binaire brut (les octets nuls cassent
            les variables), mais les strings hex c&apos;est juste du texte. On peut
            faire des regex dessus, extraire des substrings avec{" "}
            <code className="rounded bg-muted px-1">${"{"}var:offset:len{"}"}</code>, comparer.
            C&apos;est verbeux mais ça marche.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Auto-détection du DC et reconnexion automatique
          </h3>
          <p className="text-muted-foreground mb-3">
            Si tu passes pas de DC explicitement, BashHound le trouve tout seul
            via le DNS, enregistrement SRV{" "}
            <code className="rounded bg-muted px-1">_ldap._tcp.domain.local</code> :
          </p>
          <CodeBlock title="Auto-détection du DC via DNS SRV">
{`LDAP_SERVER=$(host -t SRV "_ldap._tcp.$DOMAIN" 2>/dev/null \
    | grep "has SRV record" \
    | head -1 \
    | awk '{print $NF}' \
    | sed 's/\.$//')
# Fallback : utiliser le nom de domaine directement
[ -z "$LDAP_SERVER" ] && LDAP_SERVER="$DOMAIN"`}
          </CodeBlock>
          <p className="text-muted-foreground">
            BashHound-CE implémente également une <strong>reconnexion automatique</strong> :
            si la connexion LDAPS est perdue en milieu de collecte (timeout, DC
            qui recoupe la connexion), le client se reconnecte et re-bind
            automatiquement avant de réessayer l&apos;envoi du message.
          </p>
        </section>

        {/* 6. LDAP Parser */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Code2 className="size-5 text-primary" />
            7. lib/ldap_parser.sh : Parsing des réponses LDAP
          </h2>
          <p className="text-muted-foreground mb-3">
            On reçoit les objets AD sous forme d&apos;un gros blob hex. Une
            SearchResultEntry contenant tous les attributs de l&apos;objet
            encodés en ASN.1. Maintenant faut en extraire quelque chose d&apos;utile.
            Le parseur travaille entièrement avec des regex Bash (
            <code className="rounded bg-muted px-1">[[ =~ ]]</code>) et des
            opérations de substring (
            <code className="rounded bg-muted px-1">${"{"}str:offset:len{"}"}</code>).
            Pas de parsing ASN.1 générique. Une fonction par attribut.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Extraction des attributs simples
          </h3>
          <p className="text-muted-foreground mb-3">
            Le principe est toujours le même : on cherche le nom de
            l&apos;attribut encodé en hex (par exemple{" "}
            <code className="rounded bg-muted px-1">sAMAccountName</code> devient{" "}
            <code className="rounded bg-muted px-1">73414d4163636f756e744e616d65</code>)
            dans la réponse, et on lit les octets qui suivent pour récupérer
            la valeur :
          </p>
          <CodeBlock title="lib/ldap_parser.sh : extract_sam_from_response()">
{`extract_sam_from_response() {
    local hex="$1"
    # "sAMAccountName" en hex
    local sam_attr_hex="73414d4163636f756e744e616d65"

    # Pattern : attr_hex + SET (31) + length + OCTET_STRING (04) + len + value
    if [[ "$hex" =~ ${"$"}{sam_attr_hex}3184[0-9a-f]{8}04([0-9a-f]{2})([0-9a-f]+) ]]; then
        local val_len_hex="${"$"}{BASH_REMATCH[1]}"
        local val_len=$((16#$val_len_hex))
        local remaining="${"$"}{BASH_REMATCH[2]}"
        local val_hex="${"$"}{remaining:0:$((val_len * 2))}"
        echo "$val_hex" | xxd -r -p
    fi
}`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Extraction et conversion des SID
          </h3>
          <p className="text-muted-foreground mb-3">
            L&apos;attribut{" "}
            <code className="rounded bg-muted px-1">objectSid</code> c&apos;est
            du binaire Windows pur. Un SID{" "}
            <code className="rounded bg-muted px-1">S-1-5-21-X-Y-Z-RID</code>{" "}
            a un format bien précis qu&apos;il faut parser octet par octet, en
            faisant attention au little-endian pour les sub-authorities :
          </p>
          <CodeBlock title="Structure binaire d'un SID Windows">
{`Offset  Taille  Champ
0       1       Revision (toujours 1)
1       1       SubAuthorityCount (nombre de sub-authorities)
2       6       IdentifierAuthority (big-endian, ex: 000000000005 = NT Authority)
8       4*N     SubAuthorities (little-endian) : domaine + RID

Exemple S-1-5-21-1234-5678-9012-500 :
01       ← Revision 1
05       ← 5 SubAuthorities
000000000005  ← Authority = 5 (NT)
15000000      ← 21 (little-endian) : DOMAIN_IDENTIFIER
d2040000      ← 1234 (little-endian)
2e160000      ← 5678 (little-endian)
34230000      ← 9012 (little-endian)
f4010000      ← 500 (little-endian) = Administrator RID`}
          </CodeBlock>
          <CodeBlock title="lib/ldap_parser.sh : Conversion SID hex → string">
{`extract_sid_from_hex() {
    local hex="$1"

    local revision=$((16#${"$"}{hex:0:2}))
    local sub_count=$((16#${"$"}{hex:2:2}))

    # Authority (6 octets big-endian)
    local auth_hex="${"$"}{hex:4:12}"
    local authority=$((16#${"$"}{auth_hex}))

    local sid="S-${"$"}{revision}-${"$"}{authority}"

    # SubAuthorities (4 octets little-endian chacune)
    for ((i=0; i<sub_count; i++)); do
        local offset=$((16 + i * 8))
        local sub_hex="${"$"}{hex:$offset:8}"
        # Inversion little-endian → big-endian
        local sub_le="${"$"}{sub_hex:6:2}${"$"}{sub_hex:4:2}${"$"}{sub_hex:2:2}${"$"}{sub_hex:0:2}"
        local sub_val=$((16#$sub_le))
        sid+="-${"$"}{sub_val}"
    done

    echo "$sid"
}`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Conversion des timestamps Windows FILETIME
          </h3>
          <p className="text-muted-foreground mb-3">
            Microsoft a eu l&apos;idée géniale de représenter les dates en nombre
            d&apos;intervalles de 100 nanosecondes depuis le 1er janvier 1601.
            Donc{" "}
            <code className="rounded bg-muted px-1">lastLogon</code>,{" "}
            <code className="rounded bg-muted px-1">lastLogonTimestamp</code>{" "}
            et{" "}
            <code className="rounded bg-muted px-1">pwdLastSet</code> sont des
            entiers 64 bits en <strong>Windows FILETIME</strong> à convertir en
            Unix timestamp pour BloodHound.{" "}
            <code className="rounded bg-muted px-1">whenCreated</code> en
            revanche est renvoyé en GeneralizedTime LDAP (ex :{" "}
            <code className="rounded bg-muted px-1">20250318123045.0Z</code>) et
            se parse différemment :
          </p>
          <CodeBlock title="lib/ldap_parser.sh : Conversion FILETIME → Unix timestamp">
{`extract_filetime_timestamp() {
    local hex_response="$1"
    local attr_name="$2"

    local raw_value=$(extract_attribute_value "$hex_response" "$attr_name")
    [ -z "$raw_value" ] && echo "-1" && return

    # Cas spéciaux : 0 = jamais, 9223372036854775807 = jamais (max int64)
    [ "$raw_value" = "0" ] || [ "$raw_value" = "9223372036854775807" ] && echo "-1" && return

    # Conversion : filetime → unix_timestamp
    # Unix epoch = 1970-01-01 = 11644473600 secondes après 1601-01-01
    # FILETIME est en intervalles de 100ns → diviser par 10^7 pour obtenir des secondes
    local unix_timestamp=$(( (raw_value / 10000000) - 11644473600 ))
    echo "$unix_timestamp"
}`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Extraction des flags UserAccountControl (UAC)
          </h3>
          <p className="text-muted-foreground mb-3">
            UAC c&apos;est un bitmask 32 bits qui encode toutes les propriétés
            d&apos;un compte. C&apos;est de là qu&apos;on tire
            &quot;compte désactivé ?&quot;, &quot;Kerberoastable ?&quot;,
            &quot;AS-REP Roasting ?&quot;, &quot;délégation non contrainte ?&quot;…
            Voici les flags que BashHound utilise :
          </p>
          <CodeBlock title="Flags UserAccountControl">
{`0x0001  SCRIPT                    Script de logon actif
0x0002  ACCOUNTDISABLE             Compte désactivé
0x0010  LOCKOUT                    Compte verrouillé
0x0020  PASSWD_NOTREQD             Mot de passe non requis
0x0040  PASSWD_CANT_CHANGE         Historiquement associé, mais en pratique géré via ACLs sur l'objet
0x0200  NORMAL_ACCOUNT             Compte utilisateur normal
0x0800  INTERDOMAIN_TRUST_ACCOUNT  Compte trust inter-domaine
0x1000  WORKSTATION_TRUST_ACCOUNT  Compte machine
0x2000  SERVER_TRUST_ACCOUNT       Compte DC
0x10000 DONT_EXPIRE_PASSWD         Mot de passe n'expire jamais
0x40000 SMARTCARD_REQUIRED         Authentification smartcard requise
0x80000 TRUSTED_FOR_DELEGATION     Kerberos unconstrained delegation
0x100000 NOT_DELEGATED             Compte sensible, pas de délégation
0x200000 USE_DES_KEY_ONLY          DES uniquement (vieux, vulnérable)
0x400000 DONT_REQ_PREAUTH          AS-REP Roasting possible (pas de préauth)`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Le flag{" "}
            <code className="rounded bg-muted px-1">0x1000</code>{" "}
            (WORKSTATION_TRUST_ACCOUNT) est important : il sert à exclure les
            comptes machines de{" "}
            <code className="rounded bg-muted px-1">collect_users()</code>, qui
            ne doit retourner que des comptes humains. Les machines passent par{" "}
            <code className="rounded bg-muted px-1">collect_computers()</code>
            avec leurs propres attributs.
          </p>
        </section>

        {/* 7. ACL Parser */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            8. lib/acl_parser.sh : Security Descriptors et ACEs
          </h2>
          <p className="text-muted-foreground mb-3">
            C&apos;est probablement la partie la plus chiante du projet, et
            celle que Claude avait citée comme &quot;ingérable en Bash&quot;. Le{" "}
            <code className="rounded bg-muted px-1">nTSecurityDescriptor</code>{" "}
            c&apos;est une structure binaire Windows qui contient les ACLs d&apos;un
            objet AD. Il faut parser ça bit par bit pour en extraire les
            permissions offensives utilisables par BloodHound.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Structure d&apos;un Security Descriptor
          </h3>
          <CodeBlock title="Structure SECURITY_DESCRIPTOR Windows">
{`Offset  Taille  Champ
0       1       Revision (1)
1       1       Sbz1 (réservé)
2       2       Control flags (little-endian)
4       4       OffsetOwner  → pointeur vers SID propriétaire
8       4       OffsetGroup  → pointeur vers SID groupe primaire
12      4       OffsetSacl   → pointeur vers SACL (System ACL)
16      4       OffsetDacl   → pointeur vers DACL (Discretionary ACL)
20+     N       Données variables (SIDs + ACLs)

Control flags importants :
0x0004  SE_DACL_PRESENT     Le SD contient un DACL
0x0010  SE_DACL_PROTECTED   DACL protégé de l'héritage
0x8000  SE_SELF_RELATIVE    Offsets relatifs au début du SD`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Structure d&apos;une ACL et d&apos;une ACE
          </h3>
          <CodeBlock title="Structure ACL + ACE">
{`ACL Header:
  Offset  Taille  Champ
  0       1       AclRevision
  1       1       Sbz1
  2       2       AclSize (little-endian)
  4       2       AceCount
  6       2       Sbz2

ACE (Access Control Entry) :
  0       1       AceType
  1       1       AceFlags
  2       2       AceSize
  4       4       AccessMask (les droits accordés/refusés)
  8       N       SID du principal (+ optionnellement un ObjectType GUID)

Types d'ACE :
  0x00  ACCESS_ALLOWED_ACE_TYPE         Autorisation standard
  0x01  ACCESS_DENIED_ACE_TYPE          Refus standard
  0x05  ACCESS_ALLOWED_OBJECT_ACE_TYPE  Autorisation sur objet spécifique (GUID)
  0x06  ACCESS_DENIED_OBJECT_ACE_TYPE   Refus sur objet spécifique (GUID)`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Les Access Masks
          </h3>
          <p className="text-muted-foreground mb-3">
            L&apos;<code className="rounded bg-muted px-1">AccessMask</code> c&apos;est
            32 bits qui définissent ce que le principal peut faire. BashHound
            mappe les valeurs hex vers les noms que BloodHound comprend :
          </p>
          <CodeBlock title="lib/acl_parser.sh : Access Masks">
{`declare -gA ACCESS_MASK_TO_RIGHT=(
    # Droits génériques (32 bits de poids fort)
    [10000000]="GenericAll"
    [20000000]="GenericWrite"
    [40000000]="GenericRead"
    [80000000]="GenericExecute"

    # Droits standard (bits 16-23)
    [00010000]="Delete"
    [00020000]="ReadControl"
    [00040000]="WriteDacl"
    [00080000]="WriteOwner"

    # Droits spécifiques AD (bits 0-7)
    [00000001]="CreateChild"
    [00000002]="DeleteChild"
    [00000004]="ListChildren"
    [00000008]="Self"
    [00000010]="ReadProperty"
    [00000020]="WriteProperty"
    [00000100]="ExtendedRight"   # Extended Right (identifié par un GUID)
)`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Extended Rights et leur importance offensive
          </h3>
          <p className="text-muted-foreground mb-3">
            Les <strong>Extended Rights</strong> sont là où ça devient
            intéressant offensivement. Quand l&apos;AccessMask vaut{" "}
            <code className="rounded bg-muted px-1">0x100</code> (ExtendedRight)
            sur une ACE de type{" "}
            <code className="rounded bg-muted px-1">ACCESS_ALLOWED_OBJECT</code>,
            un GUID dans l&apos;ACE précise de quel droit il s&apos;agit. Et certains
            de ces GUIDs valent de l&apos;or en pentest :
          </p>
          <CodeBlock title="lib/acl_parser.sh : Extended Rights critiques">
{`declare -gA EXTENDED_RIGHTS=(
    # ForceChangePassword : changer le mdp sans connaître l'ancien
    ["00299570-246d-11d0-a768-00aa006e0529"]="ForceChangePassword"

    # DCSync : répliquer les secrets du domaine (récupérer les hashes NTLM)
    # Trois GUIDs car DCSync requiert les 3 droits de réplication
    ["1131f6aa-9c07-11d1-f79f-00c04fc2dcd2"]="DCSync"  # DS-Replication-Get-Changes
    ["1131f6ad-9c07-11d1-f79f-00c04fc2dcd2"]="DCSync"  # DS-Replication-Get-Changes-All
    ["89e95b76-444d-4c62-991a-0facbeda640c"]="DCSync"  # DS-Replication-Get-Changes-In-Filtered-Set

    # ValidatedSPN : écrire des SPNs validés (Kerberoasting ciblé)
    ["f3a64788-5306-11d1-a9c5-0000f80367c1"]="ValidatedSPN"

    # AddAllowedToAct : ajouter msDS-AllowedToActOnBehalfOfOtherIdentity
    #                   (RBCD - Resource-Based Constrained Delegation)
    ["3f78c3e5-f79a-46bd-a0b8-9d18116ddc79"]="AddAllowedToAct"

    # AddMember : ajouter des membres à un groupe
    ["bf9679c0-0de6-11d0-a285-00aa003049e2"]="AddMember"
)`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Ce sont les droits que BloodHound trace pour construire les chemins
            d&apos;attaque. Et pour cause :
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
            <li>
              <strong>ForceChangePassword</strong> sur un compte → peut
              réinitialiser son mot de passe → compromission directe
            </li>
            <li>
              <strong>DCSync</strong> sur le domaine → peut extraire tous les
              hashes NTLM via <code className="rounded bg-muted px-1">secretsdump.py</code>
            </li>
            <li>
              <strong>WriteDacl</strong> / <strong>WriteOwner</strong> sur un
              objet → peut modifier ses ACLs pour s&apos;octroyer d&apos;autres droits
            </li>
            <li>
              <strong>AddMember</strong> sur un groupe admin → peut s&apos;ajouter
              au groupe
            </li>
            <li>
              <strong>AddAllowedToAct</strong> sur une machine → RBCD attack
            </li>
          </ul>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Flags d&apos;héritage des ACEs
          </h3>
          <CodeBlock title="lib/acl_parser.sh : ACE Flags">
{`declare -gA ACE_FLAGS=(
    [01]="OBJECT_INHERIT_ACE"       # Hérité par les objets enfants
    [02]="CONTAINER_INHERIT_ACE"    # Hérité par les conteneurs enfants
    [04]="NO_PROPAGATE_INHERIT_ACE" # Ne se propage pas plus loin
    [08]="INHERIT_ONLY_ACE"         # S'applique uniquement aux héritiers
    [10]="INHERITED_ACE"            # Cette ACE est héritée (pas appliquée directement)
)`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Le flag{" "}
            <code className="rounded bg-muted px-1">INHERITED_ACE (0x10)</code>{" "}
            est particulièrement important : il dit si l&apos;ACE vient directement
            de l&apos;objet ou si elle est héritée d&apos;un conteneur parent. BloodHound
            distingue les deux dans son interface. Un droit hérité c&apos;est souvent
            moins &quot;intentionnel&quot; qu&apos;un droit direct.
          </p>
        </section>

        {/* 8. Collectors */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Database className="size-5 text-primary" />
            9. lib/collectors.sh : Collecte des objets AD
          </h2>
          <p className="text-muted-foreground mb-3">
            <code className="rounded bg-muted px-1">collectors.sh</code> c&apos;est
            le chef d&apos;orchestre. Il fait les requêtes LDAP, appelle le parseur,
            et balance les données dans des fichiers temporaires en format
            pipe-separated. Un fichier par type d&apos;objet, une ligne par entrée.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Collecte des utilisateurs
          </h3>
          <CodeBlock title="lib/collectors.sh : collect_users()">
{`collect_users() {
    local filter="(objectClass=user)"
    local attributes="distinguishedName,sAMAccountName,objectSid,primaryGroupID,
                      userAccountControl,servicePrincipalName,lastLogon,
                      lastLogonTimestamp,pwdLastSet,whenCreated,description,
                      adminCount,nTSecurityDescriptor"

    local results=$(ldap_search "$DOMAIN_DN" 2 "$filter" "$attributes")

    while IFS= read -r line; do
        if [[ "$line" =~ ^308 ]]; then  # SearchResultEntry commence par 30 (SEQUENCE)
            local dn=$(extract_dn_from_response "$line")
            local sam=$(extract_sam_from_response "$line")
            local sid=$(extract_sid_from_response "$line")
            local uac=$(extract_uac_flags "$line")

            # Exclure les comptes machines (UAC bit 0x1000)
            if (( uac & 0x1000 )); then continue; fi
            # Exclure les objets dans OU=Domain Controllers
            if [[ "$dn" =~ OU=Domain\ Controllers, ]]; then continue; fi

            # Collecte des ACLs pour cet utilisateur
            local aces=$(extract_aces_from_ldap_response "$line")
            while IFS='|' read -r principal_sid right_name is_inherited; do
                echo "$sid|User|$principal_sid|$right_name|$is_inherited" \
                    >> "$COLLECTED_ACES"
            done <<< "$aces"

            # Stockage format pipe-separated
            echo "$dn|$sam|$sid|$primary_gid|$description|$when_created|\
$last_logon|$last_logon_ts|$pwd_last_set|$uac|$admin_count|$spns" \
                >> "$COLLECTED_USERS"
        fi
    done <<< "$results"
}`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Collecte des GPOs
          </h3>
          <p className="text-muted-foreground mb-3">
            Les GPOs vivent dans{" "}
            <code className="rounded bg-muted px-1">CN=Policies,CN=System,DC=...</code>.
            Chaque GPO est un objet{" "}
            <code className="rounded bg-muted px-1">groupPolicyContainer</code>{" "}
            avec son GUID dans{" "}
            <code className="rounded bg-muted px-1">name</code>, son chemin
            SYSVOL dans{" "}
            <code className="rounded bg-muted px-1">gPCFileSysPath</code>, et
            un display name lisible :
          </p>
          <CodeBlock title="lib/collectors.sh : collect_gpos()">
{`collect_gpos() {
    local gpo_container="CN=Policies,CN=System,$DOMAIN_DN"
    local filter="(objectClass=groupPolicyContainer)"
    local attributes="distinguishedName,name,displayName,gPCFileSysPath,
                      whenCreated,description,nTSecurityDescriptor"

    local results=$(ldap_search "$gpo_container" 2 "$filter" "$attributes")
    # ...
    # Le name est le GUID : {6AC1786C-016F-11D2-945F-00C04FB984F9}
    # gPCFileSysPath : \\domain.local\SYSVOL\domain.local\Policies\{GUID}
}`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Collecte des Trusts de domaine
          </h3>
          <p className="text-muted-foreground mb-3">
            Les trusts inter-domaines sont des objets{" "}
            <code className="rounded bg-muted px-1">trustedDomain</code> dans{" "}
            <code className="rounded bg-muted px-1">CN=System,DC=...</code>.
            Utiles pour détecter les forêts, les trusts bidirectionnels, et les
            configurations à risque (SID filtering désactivé par exemple) :
          </p>
          <CodeBlock title="lib/collectors.sh : collect_trusts()">
{`collect_trusts() {
    local system_dn="CN=System,$DOMAIN_DN"
    local filter="(objectClass=trustedDomain)"
    local attributes="distinguishedName,name,trustDirection,trustType,
                      trustAttributes,securityIdentifier,flatName"

    # trustDirection :
    #   1 = INBOUND  (le domaine distant fait confiance à nous)
    #   2 = OUTBOUND (nous faisons confiance au domaine distant)
    #   3 = BIDIRECTIONAL

    # trustType :
    #   1 = DOWNLEVEL (NT 4.0)
    #   2 = UPLEVEL   (Active Directory)
    #   3 = MIT (Kerberos realm non-Windows)
    #   4 = DCE

    # trustAttributes (bitmask) :
    #   0x01 NON_TRANSITIVE
    #   0x02 UPLEVEL_ONLY
    #   0x04 QUARANTINED_DOMAIN  (SID Filtering)
    #   0x08 FOREST_TRANSITIVE
    #   0x20 CROSS_ORGANIZATION  (SID Filtering actif)
    #   0x40 WITHIN_FOREST
}`}
          </CodeBlock>
          <InfoBox>
            <strong>Piège rencontré :</strong> pendant le développement,
            BloodHound CE retournait &quot;NO DATA RETURNED FROM QUERY&quot; sur tous les
            trusts. Après investigation, j&apos;avais encodé{" "}
            <code className="rounded bg-muted px-1">TrustDirection</code> et{" "}
            <code className="rounded bg-muted px-1">TrustType</code> comme des
            strings (<code className="rounded bg-muted px-1">&quot;Bidirectional&quot;</code>,{" "}
            <code className="rounded bg-muted px-1">&quot;ParentChild&quot;</code>…)
            en me basant sur la doc de RustHound. Or BloodHound CE attend des
            entiers (<code className="rounded bg-muted px-1">3</code>,{" "}
            <code className="rounded bg-muted px-1">2</code>…), cohérent avec
            bloodhound-python mais pas avec RustHound. J&apos;ai ouvert une{" "}
            <a
              href="https://github.com/SpecterOps/BloodHound/issues/2003"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              issue sur le repo SpecterOps
            </a>{" "}
            qui a permis d&apos;établir officiellement que les entiers sont le
            standard. La réponse de rvazarkar (SpecterOps) :{" "}
            <em>&quot;So using the integers will be the format going forward
            for sure, and we will generally recommend this for opengraph
            integrations as well.&quot;</em> Il a ajouté que la question avait
            déclenché un petit débat interne chez SpecterOps.
          </InfoBox>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Collecte AD CS (BashHound-CE uniquement)
          </h3>
          <p className="text-muted-foreground mb-3">
            C&apos;est ce qui différencie vraiment BashHound-CE du legacy.
            BloodHound CE permet de visualiser les attaques{" "}
            <strong>AD CS</strong> (ESC1 à ESC8). Il faut
            collecter les Certificate Templates, les CAs, et les NTAuth stores.
            BashHound-CE le fait :
          </p>
          <CodeBlock title="lib/collectors.sh (CE) : Composants AD CS collectés">
{`# Certificate Templates
# DN : CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,...
# Attributs : msPKI-Certificate-Name-Flag, msPKI-Enrollment-Flag,
#             msPKI-Private-Key-Flag, pKIExtendedKeyUsage,
#             msPKI-RA-Signature, msPKI-Template-Schema-Version
collect_cert_templates()

# Enterprise Certificate Authorities
# DN : CN=Enrollment Services,CN=Public Key Services,...
# Attributs : dNSHostName, certificateTemplates (templates activés)
collect_enterprise_cas()

# NTAuth Store : certificats de confiance pour auth client
# DN : CN=NTAuthCertificates,CN=Public Key Services,...
collect_ntauthstores()

# AIA (Authority Information Access) CAs
collect_aiacas()

# Root CAs
collect_rootcas()

# Issuance Policies
collect_issuancepolicies()`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Les Certificate Templates c&apos;est là que ça se passe pour AD CS.
            Les mauvaises configurations sont légion dans les domaines réels, et
            elles ouvrent des portes sérieuses :
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>
              <strong>ESC1</strong> : enrollment disponible pour tout le monde,
              SAN arbitraire → demander un certificat au nom d&apos;un admin
            </li>
            <li>
              <strong>ESC3</strong> : Certificate Request Agent → enrollment on
              behalf of another user
            </li>
            <li>
              <strong>ESC4</strong> : droits d&apos;écriture sur le template → modifier
              les flags pour créer ESC1
            </li>
            <li>
              <strong>ESC6/7</strong> : droits sur la CA elle-même
            </li>
          </ul>
        </section>

        {/* 9. Export */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <FileJson className="size-5 text-primary" />
            10. lib/export.sh / export_ce.sh : Export BloodHound JSON
          </h2>
          <p className="text-muted-foreground mb-3">
            Une fois les fichiers temporaires remplis, c&apos;est la phase
            d&apos;export qui transforme tout ça en JSON BloodHound. C&apos;est
            de loin le module le plus volumineux du projet :{" "}
            <strong>1207 lignes</strong> pour BashHound,{" "}
            <strong>2423 lignes</strong> pour BashHound-CE. Beaucoup de code
            répétitif mais inévitable. Chaque type d&apos;objet a son propre
            schéma JSON.
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Format BloodHound v5 (legacy)
          </h3>
          <p className="text-muted-foreground mb-3">
            Le format v5 c&apos;est un fichier JSON par type d&apos;objet, avec
            une clé <code className="rounded bg-muted px-1">meta</code> pour les
            métadonnées et une clé{" "}
            <code className="rounded bg-muted px-1">data</code> avec la liste
            des objets. Simple :
          </p>
          <CodeBlock title="Format JSON BloodHound v5 : Utilisateurs">
{`{
  "meta": {
    "methods": 0,
    "type": "users",
    "count": 42,
    "version": 5
  },
  "data": [
    {
      "Properties": {
        "name": "JOHN.DOE@DOMAIN.LOCAL",
        "domain": "DOMAIN.LOCAL",
        "domainsid": "S-1-5-21-...",
        "distinguishedname": "CN=John Doe,CN=Users,DC=domain,DC=local",
        "samaccountname": "john.doe",
        "enabled": true,
        "admincount": false,
        "passwordnotreqd": false,
        "dontreqpreauth": false,        // AS-REP Roasting
        "sensitive": false,
        "unconstraineddelegation": false,
        "lastlogon": 1704067200,
        "lastlogontimestamp": 1704067200,
        "pwdlastset": 1703980800,
        "whencreated": 1672531200,
        "serviceprincipalnames": [],    // Kerberoasting
        "hasspn": false
      },
      "PrimaryGroupSID": "S-1-5-21-...-513",  // Domain Users
      "Aces": [
        {
          "PrincipalSID": "S-1-5-21-...-512",
          "PrincipalType": "Group",
          "RightName": "GenericAll",
          "IsInherited": false
        }
      ],
      "ObjectIdentifier": "S-1-5-21-...-1105",
      "IsDeleted": false,
      "IsACLProtected": false
    }
  ]
}`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Format BloodHound CE v6 (Community Edition)
          </h3>
          <p className="text-muted-foreground mb-3">
            Le format v6 de BloodHound CE est plus riche : nouveaux champs,
            nouveaux types d&apos;objets, et notamment les liens{" "}
            <code className="rounded bg-muted px-1">ContainedBy</code> qui
            permettent de visualiser la hiérarchie OU/conteneurs :
          </p>
          <CodeBlock title="Format JSON BloodHound CE v6 : Structure">
{`{
  "meta": {
    "methods": 0,
    "type": "users",
    "count": 42,
    "version": 6    // ← v6 pour BloodHound CE
  },
  "data": [
    {
      "Properties": {
        // Mêmes champs que v5 + nouveaux champs CE
        "name": "JOHN.DOE@DOMAIN.LOCAL",
        "objectid": "S-1-5-21-...-1105",
        // ...
      },
      "Aces": [ ... ],
      "ObjectIdentifier": "S-1-5-21-...-1105",
      // Nouveau en v6 :
      "AllowedToDelegate": [],
      "AllowedToAct": [],
      "HasSIDHistory": [],
      "SPNTargets": [],
      "ContainedBy": {             // ← lien vers l'OU/conteneur parent
        "ObjectIdentifier": "...",
        "ObjectType": "OU"
      }
    }
  ]
}`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Export des objets AD CS (CE uniquement)
          </h3>
          <CodeBlock title="Types de fichiers JSON produits par BashHound-CE">
{`bloodhound_users_TIMESTAMP.json         # Utilisateurs
bloodhound_groups_TIMESTAMP.json        # Groupes
bloodhound_computers_TIMESTAMP.json     # Ordinateurs
bloodhound_domains_TIMESTAMP.json       # Domaines + Trusts
bloodhound_gpos_TIMESTAMP.json          # Group Policy Objects
bloodhound_ous_TIMESTAMP.json           # Organizational Units
bloodhound_containers_TIMESTAMP.json    # Containers AD
# AD CS (BashHound-CE uniquement) :
bloodhound_certtemplates_TIMESTAMP.json    # Certificate Templates
bloodhound_enterprisecas_TIMESTAMP.json   # Enterprise CAs
bloodhound_ntauthstores_TIMESTAMP.json    # NTAuth Stores
bloodhound_aiacas_TIMESTAMP.json          # AIA CAs
bloodhound_rootcas_TIMESTAMP.json         # Root CAs
bloodhound_issuancepolicies_TIMESTAMP.json # Issuance Policies`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            À la fin, tous les JSON sont zippés dans une archive horodatée
            prête à importer dans BloodHound :
          </p>
          <CodeBlock title="Nommage du ZIP de sortie">
{`20260318_143022_domain-local_bashhound.zip
# Format : YYYYMMDD_HHMMSS_domain-name_bashhound.zip`}
          </CodeBlock>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Génération des ObjectIdentifiers pour les objets sans SID
          </h3>
          <p className="text-muted-foreground mb-3">
            Petit problème : certains objets AD comme les GPOs ou les Certificate
            Templates n&apos;ont pas de SID. BloodHound CE a besoin d&apos;un
            identifiant unique pour chaque nœud. Solution : générer un UUID-like
            déterministe à partir du DN via MD5 :
          </p>
          <CodeBlock title="lib/export_ce.sh : Génération ObjectIdentifier">
{`# Pour un Certificate Template dont le DN est connu mais pas le SID :
local dn_upper=$(echo "$dn" | tr '[:lower:]' '[:upper:]')
local object_id=$(echo -n "$dn_upper" | md5sum \
    | awk '{print toupper($1)}' \
    | sed 's/\\(........\\)\\(....\\)\\(....\\)\\(....\\)\\(............\\)/\\1-\\2-\\3-\\4-\\5/')
# Exemple : A3F8D2C1-4B7E-11D2-F0A9-00C04FB98422`}
          </CodeBlock>
        </section>

        {/* 10. BashHound vs BashHound-CE */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <GitBranch className="size-5 text-primary" />
            11. BashHound vs BashHound-CE : Format v5 vs v6, AD CS
          </h2>
          <p className="text-muted-foreground mb-3">
            BashHound et BashHound-CE partagent la même architecture et les
            mêmes libs de base, mais BashHound-CE est une réécriture bien plus
            poussée, pas un simple fork avec quelques lignes changées. Voici ce
            qui les distingue :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-2 pr-6">Fonctionnalité</th>
                  <th className="py-2 pr-6">BashHound</th>
                  <th className="py-2">BashHound-CE</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6">Format JSON</td>
                  <td className="py-2 pr-6 text-primary">v5 (legacy)</td>
                  <td className="py-2 text-primary">v6 (CE)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6">Cible</td>
                  <td className="py-2 pr-6">BloodHound legacy</td>
                  <td className="py-2">BloodHound Community Edition</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6">AD CS (ADCS)</td>
                  <td className="py-2 pr-6">Non</td>
                  <td className="py-2">Oui (ESC1-8)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6">Taille du code</td>
                  <td className="py-2 pr-6">~3 800 lignes</td>
                  <td className="py-2">~6 500 lignes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6">Logging</td>
                  <td className="py-2 pr-6">Simple (echo)</td>
                  <td className="py-2">Structuré (log_info/warn/error)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6">Version management</td>
                  <td className="py-2 pr-6">Codée en dur</td>
                  <td className="py-2">Auto-détection via pacman/dpkg/rpm</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6">ldap_parser.sh</td>
                  <td className="py-2 pr-6">521 lignes</td>
                  <td className="py-2">938 lignes (multivalué étendu)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-6">export</td>
                  <td className="py-2 pr-6">export.sh (1 207 lignes)</td>
                  <td className="py-2">export_ce.sh (2 423 lignes)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mb-3">
            Un détail que j&apos;aime bien : le logging de BashHound-CE imite
            volontairement le format de RustHound. Ça donne quelque chose
            d&apos;assez propre pour un script shell :
          </p>
          <CodeBlock title="BashHound-CE : Format de log structuré">
{`[2026-03-18T14:30:22Z INFO  bashhound_ce::ldap] Connected to DOMAIN.LOCAL Active Directory!
[2026-03-18T14:30:22Z INFO  bashhound_ce::ldap] Starting data collection...
[2026-03-18T14:30:23Z INFO  bashhound_ce::export] 42 users parsed!
[2026-03-18T14:30:23Z INFO  bashhound_ce::export] 18 groups parsed!
[2026-03-18T14:30:23Z INFO  bashhound_ce::export] 12 computers parsed!
[2026-03-18T14:30:23Z INFO  bashhound_ce::export] 20260318_143023_domain-local_bashhound.zip created!`}
          </CodeBlock>
        </section>

        {/* 11. Benchmark */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Zap className="size-5 text-primary" />
            12. Benchmark : RustHound-CE vs BashHound-CE
          </h2>
          <p className="text-muted-foreground mb-3">
            Soyons honnêtes : Bash n&apos;est pas Rust. BashHound-CE lance des
            dizaines de sous-processus ({" "}
            <code className="rounded bg-muted px-1">xxd</code>,{" "}
            <code className="rounded bg-muted px-1">dd</code>,{" "}
            <code className="rounded bg-muted px-1">printf</code>…) pour chaque
            attribut LDAP parsé, là où RustHound-CE gère tout nativement en
            mémoire. Le tableau ci-dessous présente une comparaison réaliste
            sur les environnements de test utilisés (machines HTB et labs AD).
          </p>
          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">
            Petit domaine (~100 objets)
          </h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-2 pr-6">Métrique</th>
                  <th className="py-2 pr-6 text-primary">RustHound-CE</th>
                  <th className="py-2 text-primary">BashHound-CE</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6">Temps total (collecte + export)</td>
                  <td className="py-2 pr-6">~3–5 s</td>
                  <td className="py-2">~40–90 s</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6">Utilisateurs parsés</td>
                  <td className="py-2 pr-6">100 %</td>
                  <td className="py-2">100 %</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6">Groupes parsés</td>
                  <td className="py-2 pr-6">100 %</td>
                  <td className="py-2">100 %</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6">ACLs parsées</td>
                  <td className="py-2 pr-6">100 %</td>
                  <td className="py-2">~80–90 %*</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6">AD CS (cert templates)</td>
                  <td className="py-2 pr-6">Oui</td>
                  <td className="py-2">Oui</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-6">Dépendances requises</td>
                  <td className="py-2 pr-6">Binaire compilé</td>
                  <td className="py-2">bash, xxd, jq, zip</td>
                </tr>
                <tr>
                  <td className="py-2 pr-6">Taille du binaire / script</td>
                  <td className="py-2 pr-6">~5 MB (Rust binary)</td>
                  <td className="py-2">~100 KB (scripts)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground italic mb-4">
            * Certaines ACEs sur des objets complexes (attributs multivalués
            imbriqués, security descriptors non standards) peuvent être manquées
            selon la version. Des correctifs sont apportés régulièrement.
          </p>
          <h3 className="mt-4 mb-3 font-mono text-lg font-semibold">
            Pourquoi BashHound-CE est plus lent
          </h3>
          <p className="text-muted-foreground mb-3">
            Le goulot d&apos;étranglement principal est la manipulation du
            binaire LDAP. Chaque réponse est convertie en hexadécimal via{" "}
            <code className="rounded bg-muted px-1">xxd</code> (un fork par
            opération), puis parcourue en Bash pur avec des regex. Pour une
            réponse LDAP contenant 100 utilisateurs avec leurs ACLs, cela
            représente plusieurs centaines de sous-processus.
          </p>
          <CodeBlock title="Profil d'exécution : ce qui prend du temps">
{`# Pour chaque objet LDAP retourné :
# 1. ldap_receive_message() → dd (1 fork pour lire le header, 1+ pour le contenu)
# 2. Conversion hex → xxd -p (1 fork)
# 3. extract_*_from_response() → regex bash (rapide, inline)
# 4. extract_aces_from_ldap_response() → parse Security Descriptor
#    → plusieurs appels parse_sid_from_hex() (inline bash)
# 5. Écriture dans /tmp/bashhound_*_$$ → I/O disque
# 6. Phase export : jq pour sérialiser en JSON

# RustHound-CE fait tout ça en mémoire avec des types natifs Rust,
# sans fork, sans I/O intermédiaire.`}
          </CodeBlock>
          <InfoBox>
            <strong>Conclusion benchmark :</strong> pour un pentest ou un lab
            avec un domaine de moins de 500 objets, BashHound-CE est tout à
            fait utilisable malgré la différence de vitesse. Sur de grands
            domaines (&gt;1 000 objets), préférer RustHound-CE ou
            BloodHound.py. L&apos;intérêt de BashHound-CE reste sa{" "}
            <strong>portabilité absolue</strong> : un simple{" "}
            <code className="rounded bg-muted px-1 text-muted-foreground">scp</code>{" "}
            suffit à le déployer sur n&apos;importe quel Linux.
          </InfoBox>
        </section>

        {/* 13. Limites connues */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            13. Limites connues
          </h2>
          <p className="text-muted-foreground mb-3">
            BashHound(-CE) fonctionne. Mais il y a des cas où tu ferais mieux
            d&apos;utiliser autre chose.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Domaines volumineux (&gt;500 objets)</strong> : chaque
              attribut LDAP parsé lance plusieurs sous-processus. Sur un domaine
              réel avec des milliers d&apos;objets, la collecte peut prendre
              plusieurs minutes là où RustHound-CE met quelques secondes.
            </li>
            <li>
              <strong>Réponses LDAP atypiques</strong> : le parsing repose sur
              des regex et des offsets calculés manuellement. Des attributs
              multivalués imbriqués ou des Security Descriptors non standards
              peuvent être partiellement ratés selon la version.
            </li>
            <li>
              <strong>Dépendance à l&apos;environnement shell</strong> : nécessite
              Bash 4.x minimum (tableaux associatifs), plus{" "}
              <code className="rounded bg-muted px-1">xxd</code>,{" "}
              <code className="rounded bg-muted px-1">dd</code>,{" "}
              <code className="rounded bg-muted px-1">jq</code>. Sur des
              systèmes ultra-minimalistes ces dépendances peuvent manquer.
            </li>
            <li>
              <strong>Pas d&apos;authentification Kerberos</strong> : uniquement
              LDAP simple bind. Sur des environnements qui forcent GSSAPI,
              BashHound ne peut pas s&apos;authentifier.
            </li>
            <li>
              <strong>Pas de paging LDAP</strong> : si le DC impose une limite
              de résultats côté serveur et que tu ne peux pas la désactiver,
              tu n&apos;obtiendras pas tous les objets.
            </li>
            <li>
              <strong>Quand utiliser autre chose</strong> : pentest sur grand
              domaine → RustHound-CE ou BloodHound-CE-Python. Lab rapide avec
              contrainte de déploiement → BashHound-CE.
            </li>
          </ul>
        </section>

        {/* 16. Ce que ça m'a appris */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Heart className="size-5 text-primary" />
            14. Ce que ça m&apos;a appris
          </h2>
          <p className="text-muted-foreground mb-3">
            Partir de zéro sur un collecteur, ça oblige à se confronter à des
            détails qu&apos;une lib t&apos;épargne d&apos;habitude.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>LDAP se sérialise vraiment en ASN.1 BER</strong>. Avant
              ce projet je savais que LDAP était &quot;du binaire&quot;. Maintenant je
              sais exactement comment un BindRequest de 47 octets est construit,
              tag par tag.
            </li>
            <li>
              <strong>Les Security Descriptors sont vraiment pénibles</strong>.
              Pas parce que c&apos;est compliqué conceptuellement, mais parce
              que c&apos;est du binaire little-endian avec des offsets relatifs,
              des GUIDs sur 16 octets, et des flags sur des bits individuels.
              BloodHound.py et SharpHound te cachent ça complètement.
            </li>
            <li>
              <strong>Ce que BloodHound attend réellement</strong>. Lire la
              spec du format JSON v5/v6 en essayant de le reproduire t&apos;oblige
              à comprendre le modèle de données : pourquoi un SID est
              l&apos;identifiant canonique, comment les ACEs sont normalisées,
              ce que signifient{" "}
              <code className="rounded bg-muted px-1">IsInherited</code> ou{" "}
              <code className="rounded bg-muted px-1">IsACLProtected</code>.
            </li>
            <li>
              <strong>Ce que Bash oblige à voir</strong>. En Python tu appelles{" "}
              <code className="rounded bg-muted px-1">ldap3.Connection.search()</code>{" "}
              et tu récupères un dict. En Bash tu reçois des octets, tu les
              convertis en hex, tu cherches un pattern à un offset précis, tu
              recalcules la longueur. C&apos;est verbeux mais ça donne une
              compréhension concrète du protocole qu&apos;on n&apos;a pas
              autrement.
            </li>
          </ul>
        </section>

        {/* 17. Conclusion */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            15. Conclusion
          </h2>
          <p className="text-muted-foreground mb-3">
            Alors, est-ce que c&apos;était faisable en Bash ? Oui. Est-ce que
            c&apos;est l&apos;outil que tu vas utiliser sur un pentest avec 5 000
            objets AD ? Probablement pas. Mais ce projet m&apos;a forcé à aller
            vraiment loin dans la compréhension de chaque couche :
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
            <li>
              Le <strong>protocole LDAP</strong> (RFC 4511) : structure des
              messages, opérations Bind/Search, contrôles étendus
            </li>
            <li>
              L&apos;<strong>encodage ASN.1 BER/DER</strong> : format TLV, longueurs
              variables, types universels et applicatifs
            </li>
            <li>
              Les <strong>Security Descriptors Windows</strong> : structure
              binaire des ACLs, ACEs, access masks, extended rights et leur
              signification offensive
            </li>
            <li>
              Le <strong>format interne d&apos;Active Directory</strong> : SIDs
              binaires, FILETIME, UserAccountControl, attributs multivalués
            </li>
            <li>
              L&apos;<strong>écosystème BloodHound</strong> : format JSON v5/v6,
              structure des nœuds, arêtes, ACLs, AD CS
            </li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Pour de la pentest sérieuse sur de grands domaines, utilise{" "}
            <code className="rounded bg-muted px-1">BloodHound.py</code> ou{" "}
            <code className="rounded bg-muted px-1">RustHound</code>. Ils sont
            plus stables, plus rapides, plus complets. BashHound c&apos;est avant
            tout un projet pour apprendre et pour montrer que Bash peut aller
            là où on ne l&apos;attend pas.
          </p>
          <p className="text-muted-foreground">
            Les deux repos sont sur GitHub si tu veux fouiller le code ou
            contribuer :{" "}
            <code className="rounded bg-muted px-1">0xbbuddha/BashHound</code>{" "}
            et{" "}
            <code className="rounded bg-muted px-1">0xbbuddha/BashHound-CE</code>.
          </p>
        </section>

        {/* Récap */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Récap technique</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>LDAP via <code className="rounded bg-muted px-1">/dev/tcp</code> : socket TCP natif Bash</li>
            <li>LDAPS via <code className="rounded bg-muted px-1">openssl s_client</code> + FIFOs</li>
            <li>ASN.1 BER encodé/décodé en Bash pur (hex string manipulation)</li>
            <li>Security Descriptors Windows parsés bit par bit</li>
            <li>Extended Rights mappés (DCSync, ForceChangePassword, RBCD…)</li>
            <li>AD CS : Certificate Templates, Enterprise CAs, NTAuth Stores</li>
            <li>Export JSON v5 (BloodHound legacy) et v6 (BloodHound CE)</li>
            <li>~3 800 lignes (BashHound) / ~6 500 lignes (BashHound-CE)</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
