import { Cpu, Binary, Eye, Zap, Shield, Heart, Terminal } from "lucide-react";
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
  title: "KVMillésime - Mise en fût - BreizhCTF 2026 | 0xbbuddha",
  description:
    "Writeup KVMillésime (BreizhCTF 2026, Crypto) : side-channel via oracle borrow dans un hyperviseur KVM modifié, reconstruction d'une clé 128 bits en 75 requêtes.",
};

export default function WriteupKVMillesimePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Writeup"
        title="KVMillésime - Mise en fût - BreizhCTF 2026"
        description="Un binaire derrière une licence protégée par un vmmcall custom. L'hyperviseur modifié compte les borrows pendant une soustraction bit à bit et renvoie ce compteur en télémétrie. Un side-channel discret, mais suffisant pour reconstruire la clé 128 bits en une soixantaine de requêtes."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Writeups", href: "/writeups" },
          { label: "KVMillésime" },
        ]}
        stats={[
          { label: "CTF", value: "BreizhCTF 2026" },
          { label: "Catégorie", value: "Crypto / Hardware" },
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
            Celui-là m&apos;a bien pris par surprise. D&apos;habitude en CTF crypto, on a un service
            TCP avec un oracle clair. Ici, on avait un binaire ELF pour un service de trading, un
            diff de module noyau Linux (<code className="rounded bg-muted px-1">diff_svm.c</code>),
            et le tout tournait dans une VM KVM avec un hyperviseur modifié.
          </p>
          <p className="text-muted-foreground mb-3">
            J&apos;ai commencé par lire le binaire. La commande{" "}
            <code className="rounded bg-muted px-1">admin_token</code> est verrouillée derrière une
            licence. Cette licence passe par un{" "}
            <code className="rounded bg-muted px-1">vmmcall</code> avec le magic{" "}
            <code className="rounded bg-muted px-1">0x1337</code> - c&apos;est donc l&apos;hyperviseur
            qui valide. Et le binaire loggue ensuite une{" "}
            <code className="rounded bg-muted px-1">TRADING_LATENCY_PROFILE</code>...
          </p>
          <p className="text-muted-foreground">
            C&apos;est en lisant attentivement le diff SVM que tout s&apos;est éclairé. L&apos;hyperviseur
            ne fait pas juste comparer la licence - il <em>compte</em> quelque chose pendant la
            comparaison et le renvoie au guest. Ce compteur, c&apos;est notre oracle.
          </p>
        </section>

        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="size-5 text-primary" />
            <span className="font-mono text-sm font-semibold text-primary">Flag</span>
          </div>
          <RevealFlagBlock title="Flag">
{`BZHCTF{N4m4st3_V1nc3_H0p3_M4r14_3nj0y3d_Th3_H0t_Y0g4}`}
          </RevealFlagBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            1. Architecture du service
          </h2>
          <p className="text-muted-foreground mb-3">
            Le binaire expose trois commandes utiles :
          </p>
          <CodeBlock title="Commandes disponibles">
{`license     -> envoie 32 hex chars (16 bytes) comme tentative de licence
admin_token -> accessible seulement si la licence est valide
logs 3      -> affiche les 3 derniers logs (incluant la télémétrie)`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Chaque tentative de licence produit trois lignes de log :
          </p>
          <CodeBlock title="Logs après une tentative">
{`License check begin
License check failed
TRADING_LATENCY_PROFILE: Inserted hardware wait state: N`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Ce <code className="rounded bg-muted px-1">N</code> dans la dernière ligne, c&apos;est ce
            que l&apos;hyperviseur renvoie via <code className="rounded bg-muted px-1">rdx</code>
            après le vmmcall. La question est : qu&apos;est-ce qu&apos;il calcule vraiment ?
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Eye className="size-5 text-primary" />
            2. La fuite : ce que fait vraiment l&apos;hyperviseur
          </h2>
          <p className="text-muted-foreground mb-3">
            La fonction <code className="rounded bg-muted px-1">constant_time_compare_128</code>
            dans le diff est la clé de tout :
          </p>
          <CodeBlock title="diff_svm.c - constant_time_compare_128 (extrait)">
{`for (int i = 0; i < 128; i++) {
    bit_i = (input >> i) & 1;
    bit_s = (secret >> i) & 1;

    if (borrow) {
        ndelay(50);
        (*p_wait_state)++;   // <- on compte les borrows
    }

    int val = bit_i - bit_s - borrow;
    if (val < 0) borrow = 1;
    else         borrow = 0;
}
*p_wait_state = ((u32)(*p_wait_state/5))*5;  // <- arrondi au multiple de 5`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            C&apos;est une soustraction bit à bit de notre input par le secret. À chaque bit où
            le borrow est actif, le compteur s&apos;incrémente. À la fin, la valeur est arrondie
            au multiple de 5 inférieur et renvoyée comme télémétrie.
          </p>
          <InfoBox>
            Ce n&apos;est pas &quot;constant time&quot; malgré son nom : le compteur divulgue exactement
            combien de borrows ont été actifs pendant la soustraction. C&apos;est un
            side-channel direct sur le secret.
          </InfoBox>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Binary className="size-5 text-primary" />
            3. Modèle de l&apos;oracle
          </h2>
          <p className="text-muted-foreground mb-3">
            En notant <code className="rounded bg-muted px-1">q_i</code> le bit i de ma
            requête, <code className="rounded bg-muted px-1">s_i</code> le bit i du secret, et{" "}
            <code className="rounded bg-muted px-1">b_i</code> le borrow entrant au bit i
            (avec <code className="rounded bg-muted px-1">b_0 = 0</code>) :
          </p>
          <CodeBlock title="Propagation du borrow">
{`Si q_i = 0 : b_{i+1} = s_i OR  b_i
Si q_i = 1 : b_{i+1} = s_i AND b_i`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Le second cas est la propriété clé : si je fixe tous les bits bas à 1, le borrow
            reste à 0 quel que soit le secret. Ça me permet d&apos;isoler un segment de bits et
            de reconstruire le secret de haut en bas, bloc par bloc.
          </p>
          <p className="text-muted-foreground mb-3">
            L&apos;arrondi par 5 complique un peu les choses : l&apos;oracle ne me donne pas le
            nombre exact de borrows, mais une approximation à 5 près. Ça laisse quelques
            ambiguïtés en fin de reconstruction que je dois résoudre par test direct.
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Cpu className="size-5 text-primary" />
            4. Stratégie de reconstruction
          </h2>
          <p className="text-muted-foreground mb-3">
            J&apos;ai reconstruit le secret par blocs de 5 bits, du bit le plus haut vers le
            plus bas. À chaque itération :
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
            <li>
              Je maintiens un ensemble de <strong>candidats partiels</strong> pour les bits
              déjà déterminés.
            </li>
            <li>
              J&apos;étends chaque candidat avec toutes les 32 combinaisons du prochain bloc
              de 5 bits.
            </li>
            <li>
              Je choisis une requête qui <strong>partitionne le mieux</strong> les candidats
              selon la métrique simulée localement.
            </li>
            <li>
              J&apos;interroge le service, je lis <code className="rounded bg-muted px-1">logs 3</code>,
              et je filtre les candidats incompatibles avec la réponse.
            </li>
          </ol>
          <InfoBox>
            La simulation locale de <code className="rounded bg-muted px-1">oracle_metric()</code>{" "}
            est indispensable : elle me permet de choisir la requête optimale sans tâtonner
            à l&apos;aveugle. Ça divise drastiquement le nombre de connexions nécessaires.
          </InfoBox>
          <p className="text-muted-foreground mt-3">
            À cause de l&apos;arrondi par 5, je termine avec quelques candidats ambigus. Je les
            teste alors directement sur le service en essayant chaque clé candidate avec{" "}
            <code className="rounded bg-muted px-1">license</code>.
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            5. Le script
          </h2>
          <p className="text-muted-foreground mb-3">
            Les fonctions importantes du solver :
          </p>
          <CodeBlock title="solve.py (fonctions clés)">
{`def oracle_metric(input_val, secret_val):
    """Simule localement la métrique de l'hyperviseur."""
    borrow, count = 0, 0
    for i in range(128):
        if borrow:
            count += 1
        val = ((input_val >> i) & 1) - ((secret_val >> i) & 1) - borrow
        borrow = 1 if val < 0 else 0
    return (count // 5) * 5

def choose_query(candidates):
    """Choisit la requête qui partitionne le mieux les candidats."""
    best_q, best_score = None, -1
    for q in sample_queries(candidates):
        metrics = Counter(oracle_metric(q, c) for c in candidates)
        score = max(metrics.values())  # on veut minimiser le max
        if best_q is None or score < best_score:
            best_q, best_score = q, score
    return best_q

def query_metric(conn, input_val):
    """Envoie une tentative au service et lit la télémétrie."""
    send(conn, f"license\\n{input_val:032x}\\n")
    send(conn, "logs 3\\n")
    log = recv_until(conn, "TRADING_LATENCY_PROFILE:")
    return int(re.search(r"wait state: (\\d+)", log).group(1))`}
          </CodeBlock>
          <CodeBlock title="Exécution" result>
{`[*] Phase oracle...
[bloc  1/26] 3 candidats restants
[bloc  2/26] 1 candidat
...
[*] Oracle terminé en 75 requêtes
[*] 4 candidats finaux, test direct...
[+] Clé valide : ef73fe05edf268100da19addf35a0345
[+] admin_token : BZHCTF{N4m4st3_V1nc3_H0p3_M4r14_3nj0y3d_Th3_H0t_Y0g4}`}
          </CodeBlock>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-3 font-mono font-semibold text-primary">Ce que j&apos;en retiens</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Le diff, c&apos;est le challenge.</strong> Tout est dans{" "}
              <code className="rounded bg-muted px-1">diff_svm.c</code>. Le binaire guest est
              presque un prétexte - le vrai puzzle c&apos;est de comprendre ce que fait
              l&apos;hyperviseur modifié.
            </li>
            <li>
              <strong>Simuler l&apos;oracle en local</strong> pour choisir les requêtes est
              essentiel. Sans ça, il faudrait des centaines de connexions au lieu de 75.
            </li>
            <li>
              <strong>L&apos;arrondi par 5</strong> est une protection partielle : il force à
              lever les ambiguïtés par test direct en fin de reconstruction, mais ça n&apos;empêche
              pas l&apos;attaque - ça l&apos;allonge juste un peu.
            </li>
          </ul>
        </section>

      </article>
    </div>
  );
}
