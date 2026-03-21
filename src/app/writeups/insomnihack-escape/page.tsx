import Link from "next/link";
import {
  ArrowLeft,
  Terminal,
  Shield,
  Cpu,
  Zap,
  Bug,
  Eye,
  Lock,
  Binary,
  Heart,
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
  title: "Insomni'hack 2026 - Escape (pwn) | 0xbbuddha",
  description:
    "Writeup du challenge Escape à Insomni'hack 2026 : exploitation d'un binaire avec seccomp, fuite mémoire, ROP ret2csu et oracle aveugle sans write.",
};

export default function ArticleEscapePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Button variant="ghost" size="sm" asChild className="mb-8 gap-2">
        <Link href="/writeups">
          <ArrowLeft className="size-4" />
          Retour aux writeups
        </Link>
      </Button>

      <article className="space-y-12">
        {/* Header */}
        <header>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="font-mono text-primary">CTF Writeup</span>
            <span>·</span>
            <span>Pwn</span>
            <span>·</span>
            <span>Insomni&apos;hack 2026</span>
            <span>·</span>
            <span>2026-03-21</span>
          </div>
          <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            Escape - Insomni&apos;hack 2026
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Challenge par <strong>drp3ab0dy</strong>. Un binaire qui te donne
            une fuite mémoire, un overflow, et absolument aucun moyen
            d&apos;afficher quoi que ce soit. Le genre de situation où il faut
            devenir créatif.
          </p>
        </header>

        {/* Intro personnelle */}
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Heart className="size-5 text-primary" />
            Contexte
          </h2>
          <p className="text-muted-foreground mb-3">
            Premier Insomni&apos;hack pour moi. En arrivant sur ce challenge,
            j&apos;ai tout de suite vu que le seccomp bloquait{" "}
            <code className="rounded bg-muted px-1">write</code>. Du coup
            impossible d&apos;exfiltrer le flag de manière classique. Pendant un
            moment j&apos;ai tourné en rond en cherchant un bypass seccomp, avant
            de réaliser que la vraie question n&apos;était pas{" "}
            <em>&quot;comment afficher le flag ?&quot;</em> mais{" "}
            <em>&quot;comment savoir si j&apos;ai le bon caractère sans rien
            afficher ?&quot;</em>.
          </p>
          <p className="text-muted-foreground">
            C&apos;est là que l&apos;idée de l&apos;oracle aveugle est apparue :
            transformer un{" "}
            <code className="rounded bg-muted px-1">timeout</code> en{" "}
            <em>&quot;oui&quot;</em> et un{" "}
            <code className="rounded bg-muted px-1">crash</code> en{" "}
            <em>&quot;non&quot;</em>. Le reste, c&apos;est de la plomberie ROP.
          </p>
        </section>

        {/* Flag */}
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="size-5 text-primary" />
            <span className="font-mono text-sm font-semibold text-primary">
              Flag
            </span>
          </div>
          <CodeBlock>
{`INS{No_wr1te!?_n0_Str3ss_g4dGet_3verywh3re!}`}
          </CodeBlock>
        </section>

        {/* Sommaire */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-3 font-mono text-sm font-semibold text-primary uppercase tracking-widest">
            Sommaire
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground font-mono">
            <li>Recon</li>
            <li>Seccomp, le mur</li>
            <li>Le plan d&apos;attaque</li>
            <li>Leak libc</li>
            <li>Les gadgets qui font tout</li>
            <li>Pourquoi __strverscmp et pas strcmp</li>
            <li>La chaîne ROP complète</li>
            <li>Le cauchemar du bruit réseau</li>
            <li>Conclusion</li>
          </ol>
        </section>

        {/* 1. Recon */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Bug className="size-5 text-primary" />
            1. Recon
          </h2>
          <p className="text-muted-foreground mb-3">
            On commence par les classiques. Le binaire est assez permissif côté
            protections :
          </p>
          <CodeBlock title="checksec">
{`Arch:     amd64
NX:       enabled
PIE:      disabled (non-PIE)
Canary:   disabled
RELRO:    partial`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Pas de PIE, pas de canary, RELRO partiel : on va pouvoir écrire dans
            la GOT et utiliser des adresses fixes. Bon début.
          </p>
          <p className="text-muted-foreground mb-3">
            Le programme se décompose en deux phases bien distinctes :
          </p>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground mb-4">
            <li>
              <strong>Avant le seccomp</strong> : il lit un entier avec{" "}
              <code className="rounded bg-muted px-1">{"scanf(\"%lld\", &ptr)"}</code>{" "}
              puis affiche la valeur à cette adresse. Autrement dit, on a une{" "}
              <strong>lecture arbitraire de 8 octets</strong>. Un seul tir, mais
              c&apos;est suffisant.
            </li>
            <li>
              <strong>Après le seccomp</strong> : il appelle{" "}
              <code className="rounded bg-muted px-1">{"read(0, buf, 0x1000)"}</code>{" "}
              sur un buffer de pile ridiculement petit. L&apos;offset
              jusqu&apos;au RIP sauvegardé est de <strong>40 octets</strong>.
              Overflow trivial.
            </li>
          </ol>
          <InfoBox>
            En résumé : on a <strong>un leak</strong> avant le filtre et{" "}
            <strong>un overflow</strong> après. Deux primitives simples, mais
            le seccomp va sérieusement compliquer les choses.
          </InfoBox>
        </section>

        {/* 2. Seccomp */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Lock className="size-5 text-primary" />
            2. Seccomp, le mur
          </h2>
          <p className="text-muted-foreground mb-3">
            Le filtre est brutal. Voici la liste complète de ce qu&apos;on a le
            droit de faire :
          </p>
          <CodeBlock title="syscalls autorisés">
{`read     (0)
open     (2)
openat   (257)
exit     (60)`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Vous avez bien lu : pas de{" "}
            <code className="rounded bg-muted px-1">write</code>, pas de{" "}
            <code className="rounded bg-muted px-1">sendto</code>, pas de{" "}
            <code className="rounded bg-muted px-1">mmap</code>. On peut ouvrir
            le fichier flag, on peut le lire en mémoire, mais on n&apos;a
            strictement aucun moyen de renvoyer son contenu.
          </p>
          <InfoBox>
            C&apos;est la contrainte centrale du challenge : il faut trouver un
            canal de communication <strong>sans écriture</strong>. Un side-channel.
          </InfoBox>
        </section>

        {/* 3. Plan d'attaque */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Eye className="size-5 text-primary" />
            3. Le plan d&apos;attaque
          </h2>
          <p className="text-muted-foreground mb-3">
            L&apos;idée est de ne jamais essayer d&apos;afficher le flag, mais de
            le <strong>deviner caractère par caractère</strong> en observant le
            comportement du programme :
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
            <li>
              Fuiter l&apos;adresse de{" "}
              <code className="rounded bg-muted px-1">puts</code> via la GOT
              pour calculer la base libc
            </li>
            <li>
              Construire une ROP chain avec{" "}
              <code className="rounded bg-muted px-1">ret2csu</code>
            </li>
            <li>
              Ouvrir le flag avec{" "}
              <code className="rounded bg-muted px-1">{"syscall(SYS_open, ...)"}</code>
            </li>
            <li>Lire le flag en mémoire</li>
            <li>
              Comparer un octet du flag avec un caractère deviné en utilisant{" "}
              <code className="rounded bg-muted px-1">__strverscmp</code>
            </li>
            <li>
              Si <strong>égal</strong> : le programme reste en vie (timeout).
              Si <strong>différent</strong> : le programme crash.
            </li>
          </ol>
          <InfoBox>
            Un oracle aveugle, caractère par caractère. C&apos;est lent, c&apos;est
            bruyant, mais ça marche.
          </InfoBox>
        </section>

        {/* 4. Leak libc */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Binary className="size-5 text-primary" />
            4. Leak libc
          </h2>
          <p className="text-muted-foreground mb-3">
            La primitive de lecture avant le seccomp nous donne un seul coup. On
            le dépense sur{" "}
            <code className="rounded bg-muted px-1">puts@got</code> :
          </p>
          <CodeBlock title="adresses">
{`PUTS_GOT = 0x404028
puts offset dans la libc : 0x84420`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Le programme nous crache la valeur pointée, et on en déduit
            directement la base :
          </p>
          <CodeBlock title="calcul">
{`libc_base = leak_puts - 0x84420`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            À partir de là, on peut calculer toutes les adresses dont on a
            besoin :
          </p>
          <CodeBlock title="offsets libc (remote)">
{`puts         : 0x84420
syscall      : 0x118940
__strverscmp : 0x9f260`}
          </CodeBlock>
        </section>

        {/* 5. Gadgets */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Cpu className="size-5 text-primary" />
            5. Les gadgets qui font tout
          </h2>
          <p className="text-muted-foreground mb-3">
            Comme le binaire n&apos;est pas PIE, on peut utiliser les gadgets
            directement par adresse. Le classique{" "}
            <code className="rounded bg-muted px-1">ret2csu</code> est
            présent et exploitable :
          </p>
          <CodeBlock title="ret2csu - setup">
{`0x40147a : pop rbx ; pop rbp ; pop r12 ; pop r13 ; pop r14 ; pop r15 ; ret`}
          </CodeBlock>
          <CodeBlock title="ret2csu - call">
{`0x401460 : call [r15 + rbx*8]
            rdi = r12d
            rsi = r13
            rdx = r14`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Avec ça, on peut appeler n&apos;importe quelle fonction dont on a
            l&apos;adresse en mémoire, en contrôlant les trois premiers
            arguments. C&apos;est suffisant pour{" "}
            <code className="rounded bg-muted px-1">read</code>,{" "}
            <code className="rounded bg-muted px-1">open</code> et{" "}
            <code className="rounded bg-muted px-1">__strverscmp</code>.
          </p>
          <p className="text-muted-foreground mb-3">
            Mais le vrai bijou, c&apos;est celui-ci :
          </p>
          <CodeBlock title="gadget oracle @ 0x4011c3">
{`eax == 0  →  exécution continue → tombe sur un read → timeout
eax != 0  →  saut invalide → crash / EOF`}
          </CodeBlock>
          <InfoBox>
            Ce gadget est le coeur de l&apos;oracle. Après l&apos;appel à{" "}
            <code className="rounded bg-muted px-1">__strverscmp</code>,{" "}
            <code className="rounded bg-muted px-1">eax</code> vaut 0 si les
            chaînes sont identiques. Le gadget traduit ça en un comportement
            observable de l&apos;extérieur : <strong>le programme reste
            vivant</strong> ou <strong>il meurt</strong>.
          </InfoBox>
        </section>

        {/* 6. Pourquoi __strverscmp */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            6. Pourquoi __strverscmp et pas strcmp
          </h2>
          <p className="text-muted-foreground mb-3">
            Premier réflexe : utiliser{" "}
            <code className="rounded bg-muted px-1">strcmp</code> ou{" "}
            <code className="rounded bg-muted px-1">memcmp</code>. Sauf que dans
            cette version de la libc, ces fonctions sont optimisées avec des
            instructions vectorielles qui compliquent l&apos;exploitation (la
            valeur de retour n&apos;est pas un simple 0 / non-zero dans{" "}
            <code className="rounded bg-muted px-1">eax</code> comme on le
            voudrait).
          </p>
          <p className="text-muted-foreground mb-3">
            <code className="rounded bg-muted px-1">__strverscmp</code> est
            beaucoup plus coopérative :
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
            <li>
              Retourne <strong>0</strong> si les chaînes sont égales
            </li>
            <li>
              Retourne <strong>non-zero</strong> sinon
            </li>
            <li>
              Résultat proprement dans{" "}
              <code className="rounded bg-muted px-1">eax</code>, sans
              optimisations exotiques
            </li>
          </ul>
          <p className="text-muted-foreground">
            Exactement ce qu&apos;il faut pour alimenter le gadget conditionnel.
          </p>
        </section>

        {/* 7. Chaîne ROP */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            7. La chaîne ROP complète
          </h2>
          <p className="text-muted-foreground mb-3">
            Chaque tentative de caractère envoie un payload complet qui fait
            tout ça d&apos;un coup. C&apos;est une seule ROP chain assez longue,
            mais chaque étape est logique :
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
            <li>
              <strong>Préparer la GOT</strong> : écrire l&apos;adresse de{" "}
              <code className="rounded bg-muted px-1">{"syscall()"}</code>{" "}
              dans{" "}
              <code className="rounded bg-muted px-1">EXIT_GOT</code> et celle
              de{" "}
              <code className="rounded bg-muted px-1">{"__strverscmp()"}</code>{" "}
              dans{" "}
              <code className="rounded bg-muted px-1">PRINTF_GOT</code>.
              On détourne des entrées GOT existantes pour y stocker nos pointeurs.
            </li>
            <li>
              <strong>Écrire le chemin</strong> :{" "}
              <code className="rounded bg-muted px-1">/home/pwn/flag</code>{" "}
              dans la section{" "}
              <code className="rounded bg-muted px-1">.data</code> du binaire.
            </li>
            <li>
              <strong>Ouvrir le flag</strong> :{" "}
              <code className="rounded bg-muted px-1">
                {"syscall(SYS_open, path, 0)"}
              </code>
              . Le fd retourné sera 3.
            </li>
            <li>
              <strong>Avancer dans le fichier</strong> : consommer{" "}
              <code className="rounded bg-muted px-1">index</code> octets avec{" "}
              <code className="rounded bg-muted px-1">{"read(3, ...)"}</code>{" "}
              pour se positionner sur le caractère qu&apos;on veut tester.
            </li>
            <li>
              <strong>Lire le caractère cible</strong> : lire 1 octet du flag
              dans{" "}
              <code className="rounded bg-muted px-1">EXIT_GOT</code>{" "}
              (préalablement remis à zéro).
            </li>
            <li>
              <strong>Écrire le candidat</strong> : lire l&apos;octet deviné
              depuis stdin dans{" "}
              <code className="rounded bg-muted px-1">DUMMY</code>.
            </li>
            <li>
              <strong>Comparer</strong> :{" "}
              <code className="rounded bg-muted px-1">
                {"__strverscmp(EXIT_GOT, DUMMY)"}
              </code>
            </li>
            <li>
              <strong>Oracle</strong> : le gadget conditionnel fait le reste.
            </li>
          </ol>
          <InfoBox>
            <strong>timeout</strong> = le caractère deviné est le bon.{" "}
            <strong>crash / EOF</strong> = mauvais caractère, on passe au
            suivant.
          </InfoBox>
        </section>

        {/* 8. Bruit réseau */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Zap className="size-5 text-primary" />
            8. Le cauchemar du bruit réseau
          </h2>
          <p className="text-muted-foreground mb-3">
            En théorie, l&apos;oracle est binaire : timeout ou crash. En
            pratique, le remote était instable, surtout vers la fin du CTF.
            Des connexions qui timeout alors qu&apos;elles n&apos;auraient pas
            dû, des crashs aléatoires sur le bon caractère... bref, du bruit.
          </p>
          <p className="text-muted-foreground mb-3">
            Pour stabiliser l&apos;extraction, j&apos;ai dû ajouter pas mal de
            logique autour de l&apos;oracle brut :
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
            <li>
              Un <strong>prefilter</strong> pour éliminer rapidement les
              caractères impossibles
            </li>
            <li>
              Plusieurs <strong>tours de vérification</strong> par caractère
            </li>
            <li>
              Des <strong>seuils de majorité</strong> : un caractère n&apos;est
              accepté que s&apos;il passe une majorité des tentatives
            </li>
            <li>
              Des <strong>tests de suffixe</strong> pour les derniers octets,
              plus sujets aux erreurs
            </li>
            <li>
              Un <strong>test d&apos;EOF</strong> pour détecter la fin du flag
            </li>
          </ul>
          <InfoBox>
            Un détail qui m&apos;a fait perdre du temps : le fichier flag se
            termine par un{" "}
            <code className="rounded bg-muted px-1">{`\\n`}</code>. Le vrai
            flag s&apos;arrête juste avant. Si on ne le sait pas, on cherche un
            caractère fantôme.
          </InfoBox>
        </section>

        {/* 9. Conclusion */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Terminal className="size-5 text-primary" />
            9. Conclusion
          </h2>
          <p className="text-muted-foreground mb-3">
            Ce challenge m&apos;a beaucoup plu parce qu&apos;il force à sortir
            des sentiers battus. On a toutes les primitives classiques (leak,
            overflow, ROP) mais l&apos;absence de{" "}
            <code className="rounded bg-muted px-1">write</code> rend la
            dernière étape non triviale.
          </p>
          <p className="text-muted-foreground mb-3">
            La solution repose sur une idée simple : si tu ne peux pas parler,
            fais du bruit. En l&apos;occurrence, la différence entre un
            programme qui vit et un programme qui meurt suffit à transmettre
            de l&apos;information, un bit à la fois.
          </p>
          <p className="text-muted-foreground mb-4">
            Les briques techniques ({" "}
            <code className="rounded bg-muted px-1">open</code>,{" "}
            <code className="rounded bg-muted px-1">read</code>,{" "}
            <code className="rounded bg-muted px-1">__strverscmp</code>,{" "}
            <code className="rounded bg-muted px-1">ret2csu</code>) ne sont
            que de la plomberie. Le vrai saut, c&apos;est le passage mental
            de &quot;je dois afficher le flag&quot; à &quot;je dois{" "}
            <em>deviner</em> le flag&quot;.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
            <p className="font-mono text-sm text-primary font-semibold mb-2">
              Flag final
            </p>
            <CodeBlock>
{`INS{No_wr1te!?_n0_Str3ss_g4dGet_3verywh3re!}`}
            </CodeBlock>
          </div>
        </section>
      </article>
    </div>
  );
}
