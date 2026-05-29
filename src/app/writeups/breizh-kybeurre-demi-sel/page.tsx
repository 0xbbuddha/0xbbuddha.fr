import { Lock, Binary, Cpu, Zap, Shield, BookOpen, Heart } from "lucide-react";
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

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-primary/30 bg-primary/5 px-5 py-4 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export const metadata = {
  title: "Kybeurre demi-sel - BreizhCTF 2026 | 0xbbuddha",
  description:
    "Writeup Kybeurre demi-sel (BreizhCTF 2026, Crypto) : attaque LWE par embedding de Kannan et réduction LLL sur un secret binaire avec bruit négligeable.",
};

export default function WriteupKybeurreDeselPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Writeup"
        title="Kybeurre demi-sel - BreizhCTF 2026"
        description="Un device IoT qui broadcaste du LWE, un secret binaire, un bruit ridicule, et GPT-Erwann qui se félicite de son architecture Frictionless Security. L'attaque par réseau (Kannan embedding + LLL) fait le reste en quelques secondes."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Writeups", href: "/writeups" },
          { label: "Kybeurre demi-sel" },
        ]}
        stats={[
          { label: "CTF", value: "BreizhCTF 2026" },
          { label: "Catégorie", value: "Crypto" },
          { label: "Date", value: "2026-05-22" },
        ]}
      />

      <article className="mt-8 space-y-12">

        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Heart className="size-5 text-primary" />
            Contexte
          </h2>
          <p className="text-muted-foreground mb-3">
            J&apos;avais déjà fait <strong>Kybeurre doux</strong> un peu avant dans le CTF, donc
            j&apos;étais dans le bain LWE. Mais celui-là c&apos;était différent : pas de service TCP,
            pas d&apos;oracle à interroger. On avait deux fichiers - un firmware IoT et un dump réseau
            de 1000 paquets. Le nom du challenge (<em>demi-sel</em>) était déjà un gros indice sur
            ce qui allait craquer.
          </p>
          <p className="text-muted-foreground">
            En lisant <code className="rounded bg-muted px-1">iot_scanner.py</code>, j&apos;ai
            immédiatement repéré les deux erreurs fatales : un secret dans{" "}
            <code className="rounded bg-muted px-1">{"{0,1}"}</code> et un bruit dans{" "}
            <code className="rounded bg-muted px-1">[-10, 10]</code>. Avec un module de 100 bits,
            le ratio bruit/modulus est tellement ridicule que LWE n&apos;offre plus aucune résistance.
            La réduction de réseau allait s&apos;en charger.
          </p>
        </section>

        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="size-5 text-primary" />
            <span className="font-mono text-sm font-semibold text-primary">Flag</span>
          </div>
          <RevealFlagBlock title="Flag">
{`BZHCTF{adding_too_much_salt_in_the_modulus_cracks_the_algorithm}`}
          </RevealFlagBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <BookOpen className="size-5 text-primary" />
            1. Lecture du code source
          </h2>
          <p className="text-muted-foreground mb-3">
            Le firmware génère un secret aléatoire toutes les 5000 itérations et broadcaste des
            échantillons LWE. La structure est classique :
          </p>
          <CodeBlock title="iot_scanner.py (extrait)">
{`PARAM_N = 50
PARAM_Q = 1017194805530087781866367482651  # ~100 bits

def _refresh_secret():
    sys_ctx['secret_vector'] = [rng.randint(0, 1) for _ in range(PARAM_N)]

def generate_beacon():
    vec_a = [random.randint(0, Q-1) for _ in range(PARAM_N)]
    dot_prod = sum(a * s for a, s in zip(vec_a, sys_ctx['secret_vector']))
    val_b = (dot_prod + _get_noise()) % Q   # bruit dans [-10, 10]`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Chaque paquet broadcaste un échantillon de la forme :
          </p>
          <CodeBlock title="Équation LWE">
{`b_i = <a_i, s> + e_i  (mod Q)

avec :
  s   in {0,1}^50      -- secret BINAIRE
  e_i in [-10, 10]     -- bruit entier très faible
  Q   ~= 10^30         -- module 100 bits`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Toutes les 500 itérations, le device envoie aussi un{" "}
            <code className="rounded bg-muted px-1">sovereign_pulse</code> : le flag chiffré en
            AES-ECB avec comme clé <code className="rounded bg-muted px-1">sha256(str(s))</code>.
            Retrouver <code className="rounded bg-muted px-1">s</code> = déchiffrer le flag.
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Lock className="size-5 text-primary" />
            2. Les deux failles
          </h2>
          <p className="text-muted-foreground mb-3">
            GPT-Erwann se vante d&apos;une architecture <em>Frictionless Security</em>. En pratique,
            deux erreurs cumulées rendent le système trivial à casser.
          </p>

          <h3 className="mb-2 font-mono font-semibold text-foreground">Secret binaire</h3>
          <p className="text-muted-foreground mb-4">
            Le secret est dans <code className="rounded bg-muted px-1">{"{0,1}"}</code>^50,
            soit 50 bits d&apos;entropie maximum. Dans Kyber, les secrets sont tirés d&apos;une
            distribution binomiale centrée sur plusieurs valeurs - jamais du binaire pur. Ça change
            tout pour les attaques par réseau.
          </p>

          <h3 className="mb-2 font-mono font-semibold text-foreground">Bruit négligeable</h3>
          <p className="text-muted-foreground mb-4">
            Le bruit <code className="rounded bg-muted px-1">e_i</code> vaut au plus 10. Le
            module <code className="rounded bg-muted px-1">Q</code> fait ~10^30. Le ratio est de
            l&apos;ordre de 10^-28 - c&apos;est quasi-zéro. Dans LWE, le bruit est ce qui rend le
            problème difficile. Sans bruit significatif, on est ramené à un système linéaire
            presque exact.
          </p>

          <InfoBox>
            La sécurité de LWE dépend d&apos;un équilibre précis entre la taille du bruit et celle
            du module. GPT-Erwann a pris un module énorme (pour faire joli) et un bruit minuscule
            (pour que le déchiffrement &quot;marche bien&quot;). Résultat : le vecteur secret est le
            plus court vecteur du réseau, et LLL va le trouver sans effort.
          </InfoBox>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Cpu className="size-5 text-primary" />
            3. L&apos;attaque - Kannan embedding + LLL
          </h2>
          <p className="text-muted-foreground mb-3">
            L&apos;idée est de transformer le problème LWE en un problème de{" "}
            <strong>vecteur court dans un réseau</strong> (SVP), puis de laisser LLL faire le
            travail. Je prends 50 échantillons{" "}
            <code className="rounded bg-muted px-1">(A, b)</code> du dump et je construis une
            matrice de dimension 101 x 101 :
          </p>
          <CodeBlock title="Construction de la matrice de Kannan">
{`dim = N + m + 1  (= 50 + 50 + 1 = 101)

B =
[ I_50  |  A^T  |  0  ]   <- lignes 0..49
[  0    | Q*I_50|  0  ]   <- lignes 50..99
[  0    |  b^T  |  1  ]   <- ligne 100

avec A = matrice 50x50 des vecteurs a_i
     b = vecteur des b_i`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Le vecteur cible <code className="rounded bg-muted px-1">(s, -e, -1)</code> est dans
            ce réseau. Sa norme vaut au plus sqrt(50 + 50*100 + 1) ~= 72. La norme minimale
            typique d&apos;un vecteur aléatoire dans ce réseau est de l&apos;ordre de 10^15.
            Le vecteur cible est donc 10 milliards de fois plus court que les vecteurs génériques
            - LLL va le trouver immédiatement.
          </p>
          <p className="text-muted-foreground mb-3">
            Après réduction, je cherche une ligne dont le dernier élément est +/-1 et dont les 50
            premiers éléments sont dans {"{0,1}"} :
          </p>
          <CodeBlock title="Extraction du secret">
{`for i in range(dim):
    row = [int(mat[i][j]) for j in range(dim)]
    if abs(row[-1]) != 1:
        continue
    sign = row[-1]
    s_cand = [-sign * x for x in row[:N]]
    if all(x in (0, 1) for x in s_cand):
        # Trouvé !`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Binary className="size-5 text-primary" />
            4. Le script complet
          </h2>
          <p className="text-muted-foreground mb-3">
            J&apos;ai utilisé <code className="rounded bg-muted px-1">fpylll</code> pour la
            réduction LLL avec précision arbitraire (mpfr) pour éviter les erreurs d&apos;arrondi
            sur les grands entiers :
          </p>
          <CodeBlock title="solve.py">
{`import json, hashlib
from fpylll import IntegerMatrix, LLL
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

N, Q, m = 50, 1017194805530087781866367482651, 50

with open("sniffed.json") as f:
    packets = json.load(f)

# Récupérer m échantillons LWE + le flag chiffré
As, bs, encrypted_flag = [], [], None
for pkt in packets:
    if pkt["type"] == "beacon" and len(As) < m:
        As.append(pkt["A"])
        bs.append(pkt["b"])
    elif pkt["type"] == "sovereign_pulse":
        encrypted_flag = pkt["encrypted_token"]

dim = N + m + 1
B = [[0] * dim for _ in range(dim)]

for j in range(N):
    B[j][j] = 1
    for i in range(m):
        B[j][N + i] = As[i][j]

for i in range(m):
    B[N + i][N + i] = Q

for i in range(m):
    B[N + m][N + i] = bs[i]
B[N + m][dim - 1] = 1

mat = IntegerMatrix.from_matrix(B)
LLL.reduction(mat, method='proved', float_type='mpfr', precision=200)

s_cand = None
for i in range(dim):
    row = [int(mat[i][j]) for j in range(dim)]
    if abs(row[-1]) != 1:
        continue
    sign = row[-1]
    cand = [-sign * x for x in row[:N]]
    if all(x in (0, 1) for x in cand):
        s_cand = cand
        break

key = hashlib.sha256("".join(str(x) for x in s_cand).encode()).digest()
flag = unpad(AES.new(key, AES.MODE_ECB).decrypt(bytes.fromhex(encrypted_flag)), 16)
print(flag.decode())`}
          </CodeBlock>
          <CodeBlock title="Exécution" result>
{`Secret : [1,1,1,0,1,0,1,0,1,1,0,0,1,0,0,0,0,0,0,0,1,0,1,1,1,0,1,1,0,0,0,1,0,1,1,0,0,0,0,0,0,0,1,1,0,1,0,1,1,0]

BZHCTF{adding_too_much_salt_in_the_modulus_cracks_the_algorithm}`}
          </CodeBlock>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            Ce que j&apos;en retiens
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Secret binaire + bruit négligeable</strong> : les deux conditions suffisent
              pour que l&apos;embedding de Kannan soit trivial. Chaque condition seule rendrait
              déjà le système fragile.
            </li>
            <li>
              <strong>LLL avec mpfr</strong> : sur des entiers de 100 bits, la précision flottante
              par défaut de fpylll est insuffisante. Le paramètre{" "}
              <code className="rounded bg-muted px-1">float_type=&apos;mpfr&apos;, precision=200</code> est
              nécessaire pour que la réduction converge correctement.
            </li>
            <li>
              <strong>Le nom du challenge dit tout</strong> : &quot;demi-sel&quot; = trop peu de sel
              (bruit) dans le module. GPT-Erwann a littéralement enlevé le bruit pour
              &quot;optimiser les KPIs&quot;, et c&apos;est littéralement ce qui casse tout.
            </li>
          </ul>
        </section>

      </article>
    </div>
  );
}
