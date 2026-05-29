import { Lock, Binary, Zap, Shield, Heart, Key } from "lucide-react";
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
  title: "Tremendous 2 - BreizhCTF 2026 | 0xbbuddha",
  description:
    "Writeup Tremendous 2 (BreizhCTF 2026, Crypto) : RSA textbook parity oracle, dichotomie sur 1024 bits pour retrouver le mot de passe admin et obtenir le flag.",
};

export default function WriteupTremendous2Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Writeup"
        title="Tremendous 2 - BreizhCTF 2026"
        description="Une appli Flask avec RSA textbook et une route /api/verify qui répond Bâbord ou Tribord selon la parité du déchiffré. Un oracle de parité classique : 1024 requêtes, une dichotomie, et le mot de passe admin tombe en clair."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Writeups", href: "/writeups" },
          { label: "Tremendous 2" },
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
            Le flavour text du challenge continue la saga des personnages mégalomanes. Bref,
            j&apos;ai ouvert le code Flask et j&apos;ai cherché la route intéressante. En une minute,
            j&apos;avais trouvé <code className="rounded bg-muted px-1">/api/verify</code> qui
            déchiffre n&apos;importe quel ciphertext soumis et répond juste avec la parité du
            résultat. C&apos;est un RSA parity oracle - j&apos;avais déjà vu ce pattern, j&apos;ai
            su immédiatement comment y répondre.
          </p>
          <p className="text-muted-foreground">
            L&apos;objectif était clair : le cookie de session admin est le ciphertext RSA du mot
            de passe. Sans clé privée, j&apos;allais l&apos;inverser bit par bit en exploitant la
            malléabilité multiplicative de RSA.
          </p>
        </section>

        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="size-5 text-primary" />
            <span className="font-mono text-sm font-semibold text-primary">Flag</span>
          </div>
          <RevealFlagBlock title="Flag">
{`BZHCTF{they_stole_my_beautiful_cookie_very_sad}`}
          </RevealFlagBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Lock className="size-5 text-primary" />
            1. La vulnérabilité
          </h2>
          <p className="text-muted-foreground mb-3">
            L&apos;application expose trois routes. Les deux qui m&apos;intéressent :
          </p>
          <CodeBlock title="app.py (routes clés)">
{`# GET /  -> renvoie la clé publique (N, E)
# POST /api/verify -> oracle de parité
# POST /login -> compare le password avec le cookie admin

@app.route('/api/verify', methods=['POST'])
def verify():
    ticket = int(request.json['ticket'], 16)
    m = pow(ticket, D, N)   # déchiffrement RSA
    if m % 2 == 0:
        return jsonify({"side": "Bâbord"})   # pair
    else:
        return jsonify({"side": "Tribord"})  # impair`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Et dans <code className="rounded bg-muted px-1">intercepted_data.json</code>, j&apos;ai
            la clé publique <code className="rounded bg-muted px-1">(N, E)</code> et le cookie de
            session admin, qui est exactement{" "}
            <code className="rounded bg-muted px-1">C_ADMIN = password_admin^E mod N</code>.
          </p>
          <InfoBox>
            La faille est double : RSA textbook (pas de padding) + oracle qui déchiffre des
            ciphertexts arbitraires. Les deux conditions réunies permettent la malléabilité
            multiplicative : si je multiplie un ciphertext par{" "}
            <code className="rounded bg-muted px-1">2^E mod N</code>, son déchiffré est multiplié par 2.
          </InfoBox>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Binary className="size-5 text-primary" />
            2. L&apos;attaque : dichotomie par parité
          </h2>
          <p className="text-muted-foreground mb-3">
            Le principe est simple. Je veux retrouver{" "}
            <code className="rounded bg-muted px-1">m = C_ADMIN^D mod N</code> sans connaître D.
          </p>
          <p className="text-muted-foreground mb-3">
            Je précalcule <code className="rounded bg-muted px-1">f = 2^E mod N</code>, le
            chiffrement de 2. En multipliant le ciphertext par f, son déchiffré est doublé :
          </p>
          <CodeBlock title="Propriété de malléabilité">
{`c' = c * f mod N
   = c * 2^E mod N

=> dec(c') = 2m mod N`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            La parité de <code className="rounded bg-muted px-1">2m mod N</code> me dit
            exactement si une réduction modulo N a eu lieu :
          </p>
          <CodeBlock title="La clé de l'attaque">
{`2m mod N est pair   <=>  2m < N  <=>  m < N/2
2m mod N est impair <=>  2m >= N <=>  m >= N/2`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Un seul appel à l&apos;oracle localise m dans la première ou la seconde moitié de{" "}
            <code className="rounded bg-muted px-1">[0, N)</code>. En itérant - multiplier par
            f, interroger, bissecter l&apos;intervalle - je divise l&apos;incertitude par 2 à
            chaque étape. Après <strong>1024 itérations</strong> (taille de N en bits),
            l&apos;intervalle se réduit à un seul entier.
          </p>
          <CodeBlock title="Dichotomie (pseudo-code)">
{`lo, hi, c = 0, N, C_ADMIN
f = pow(2, E, N)

for i in range(N.bit_length()):
    c = c * f % N          # plaintext sous-jacent devient 2^i * m mod N
    mid = (lo + hi) // 2
    if oracle(c) == "Tribord":  # impair -> réduction -> m dans moitié haute
        lo = mid
    else:                        # pair -> pas de réduction -> moitié basse
        hi = mid

# hi ~= m, à quelques unités près (erreur d'arrondi)`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            La division entière accumule une petite erreur. Je la corrige en cherchant le delta
            dans <code className="rounded bg-muted px-1">[-20, 20]</code> tel que{" "}
            <code className="rounded bg-muted px-1">(hi + delta)^E mod N == C_ADMIN</code>.
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            3. Le script
          </h2>
          <CodeBlock title="solve.py">
{`import requests

N = int("101646000634959031725154661405870010409950962209123707678659882164972350237169"
        "157460692866950983884429112344771015131810052770764800456306492306639149157441"
        "470846099674367755641503480298049066020742710941063942126524254881782107742673"
        "295652252565294818485128043958428858647298411408258740535747623355015124347")
E = 65537
C_ADMIN = int(
    "5e6caa0607af838358f9bb85f60c3caad6fd16733332dfa536860d026d3177e2d"
    "2093d464bae448d297bf70361709c2626a051b62f57af79375ac25ae4e7c18fb1"
    "46445ad53e2ed5eee155cc56f098c9442a1576cdcc592dbd03013031ad4d27a97"
    "9f307266852066e1d7faf760988a6c70c1eb3442ed918ae5379176c7e7b01",
    16,
)
URL = "https://tremendous2-babord-tribord-requins-140.chall.ctf.bzh"

def oracle(c: int) -> int:
    resp = requests.post(f"{URL}/api/verify", json={"ticket": hex(c)}, timeout=15)
    return 0 if resp.json()["side"] == "Bâbord" else 1

f = pow(2, E, N)
lo, hi, c = 0, N, C_ADMIN

for _ in range(N.bit_length()):
    c = c * f % N
    mid = (lo + hi) // 2
    if oracle(c) == 1:
        lo = mid
    else:
        hi = mid

# Correction de l'arrondi
m = hi
for delta in range(-20, 21):
    if pow(m + delta, E, N) == C_ADMIN:
        m = m + delta
        break

password = m.to_bytes((m.bit_length() + 7) // 8, "big").decode()
print(f"Mot de passe : {password}")

resp = requests.post(f"{URL}/login", data={"password": password})
print(resp.text)`}
          </CodeBlock>
          <CodeBlock title="Exécution (~65 secondes, 1024 requêtes)" result>
{`Mot de passe : auF2kxrHYK5VYYKe

BZHCTF{they_stole_my_beautiful_cookie_very_sad}`}
          </CodeBlock>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-3 font-mono font-semibold text-primary">
            <Shield className="size-4 text-primary inline mr-2" />
            Ce que j&apos;en retiens
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>RSA textbook = malléabilité.</strong> Sans padding OAEP, la relation
              multiplicative <code className="rounded bg-muted px-1">enc(a) * enc(b) = enc(a*b)</code>{" "}
              tient. C&apos;est ça qui rend toute la dichotomie possible.
            </li>
            <li>
              <strong>Un seul bit suffit.</strong> La parité du déchiffré semble une information
              minime, mais répété 1024 fois avec les bonnes multiplications, c&apos;est suffisant
              pour retrouver n&apos;importe quel plaintext dans{" "}
              <code className="rounded bg-muted px-1">[0, N)</code>.
            </li>
            <li>
              <strong>La correction du delta est nécessaire.</strong> Les divisions entières
              dans la dichotomie accumulent une erreur. Sans la vérification finale, on tombe
              à quelques unités près de la bonne valeur.
            </li>
          </ul>
        </section>

      </article>
    </div>
  );
}
