"use client";

import { useState } from "react";
import {
  ChevronDown,
  Layers,
  Cpu,
  Network,
  Shield,
  Eye,
  Zap,
  Heart,
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

function VariantCard({
  cve,
  path,
  model,
  granularity,
  trigger,
  crypto,
  target,
  module: mod,
}: {
  cve: string;
  path: string;
  model: string;
  granularity: string;
  trigger: string;
  crypto: string;
  target: string;
  module: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 font-mono text-xs space-y-1.5">
      <p className="text-primary font-semibold">{cve}</p>
      <p className="text-muted-foreground"><span className="text-foreground">path</span> :: {path}</p>
      <p className="text-muted-foreground"><span className="text-foreground">modèle</span> :: {model}</p>
      <p className="text-muted-foreground"><span className="text-foreground">granule</span> :: {granularity}</p>
      <p className="text-muted-foreground"><span className="text-foreground">triggers</span> :: {trigger}</p>
      <p className="text-muted-foreground"><span className="text-foreground">crypto</span> :: {crypto}</p>
      <p className="text-muted-foreground"><span className="text-foreground">cible</span> :: {target}</p>
      <p className="text-muted-foreground"><span className="text-foreground">module</span> :: {mod}</p>
    </div>
  );
}

function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-5 py-3 text-left font-mono text-sm font-semibold text-foreground bg-card/50 hover:bg-card transition-colors"
      >
        <ChevronDown className={`size-4 text-primary shrink-0 transition-transform ${open ? "rotate-0" : "-rotate-90"}`} />
        {title}
      </button>
      {open && <div className="px-5 py-4">{children}</div>}
    </div>
  );
}

function MemeCard({
  src,
  alt,
  topText,
  bottomText,
  caption,
}: {
  src: string;
  alt: string;
  topText?: string;
  bottomText?: string;
  caption?: string;
}) {
  const impactStyle: React.CSSProperties = {
    fontFamily: "Impact, 'Arial Narrow Bold', sans-serif",
    textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
    letterSpacing: "0.05em",
    lineHeight: "1.2",
  };
  return (
    <div className="my-8 flex flex-col items-center">
      <div className="relative inline-block max-w-md w-full rounded-lg overflow-hidden border border-border/50">
        {topText && (
          <p className="absolute top-2 left-0 right-0 z-10 px-3 text-center text-white text-xl font-black uppercase"
            style={impactStyle}>
            {topText}
          </p>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full block" loading="lazy" />
        {bottomText && (
          <p className="absolute bottom-2 left-0 right-0 z-10 px-3 text-center text-white text-xl font-black uppercase"
            style={impactStyle}>
            {bottomText}
          </p>
        )}
      </div>
      {caption && (
        <p className="mt-2 text-xs font-mono text-muted-foreground text-center italic max-w-md">{caption}</p>
      )}
    </div>
  );
}


export default function ArticleDirtyFragPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Article - Kernel Security"
        title="Dirty Frag et compagnie : anatomie d'une vague de LPE Linux"
        description="Ce qui m'amuse le plus en ce moment, c'est de réécrire les PoC des dernières vulnérabilités Linux dans d'autres langages que l'original. Cet article est le résultat de ce travail appliqué à cinq bugs du printemps 2026 - copyfail, la famille dirty frag et pintheft."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "Dirty Frag - LPE Linux" },
        ]}
        stats={[
          { label: "Category", value: "Kernel Security" },
          { label: "Tags", value: "Linux · LPE · Kernel · XFRM · RxRPC · io_uring" },
          { label: "Date", value: "2026-06-01" },
        ]}
      />

      <article className="mt-8 space-y-12">

        {/* Note personnelle */}
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Heart className="size-5 text-primary" />
            Pourquoi cet article
          </h2>
          <p className="text-muted-foreground mb-3">
            Ce qui m&apos;amuse le plus en ce moment, c&apos;est de prendre
            les PoC des dernières vulnérabilités Linux et de les réécrire dans un autre langage
            que l&apos;original. Pas pour publier - pour comprendre. Il y a quelque chose
            d&apos;unique dans l&apos;exercice : quand je dois réimplémenter chaque appel
            système, chaque structure de données, chaque contrainte de timing, je ne peux pas
            me contenter de lire le code en diagonale. Je dois comprendre <em>pourquoi</em> chaque
            ligne est là.
          </p>
          <p className="text-muted-foreground mb-3">
            Le printemps 2026 a été particulièrement chargé côté vulnérabilités noyau Linux.
            En l&apos;espace de quelques semaines, cinq bugs distincts ont été publiés, qui
            partagent tous une caractéristique frappante : le noyau écrit dans ses propres fichiers
            en lecture seule, sans toucher au disque, sans race condition, sans corruption mémoire
            au sens classique du terme. Copyfail d&apos;abord, en avril. Puis la famille dirty frag
            en mai - quatre variantes du même primitif. Et pintheft, qui arrive au même résultat
            par un chemin complètement différent.
          </p>
          <p className="text-muted-foreground">
            Cet article est ma synthèse de ce que j&apos;ai appris en plongeant dans chacun
            de ces exploits. Je ne suis pas l&apos;auteur de ces découvertes - le crédit va
            à Theori / Xint Code pour copyfail, à V4bel pour dirty frag, et à Aaron Esau /
            V12 pour dirtydecrypt, fragnesia et pintheft. Mon apport, c&apos;est l&apos;analyse
            unifiée.
          </p>
          <MemeCard
            src="/memes/this-is-fine.jpg"
            alt="This is fine meme"
            bottomText="le noyau en train de déchiffrer dans son propre page cache"
            caption="Vibe général de cette famille de bugs"
          />
        </section>

        {/* Sommaire */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-3 font-mono text-sm font-semibold text-primary uppercase tracking-widest">
            Sommaire
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground font-mono">
            <li>Le page cache Linux - pourquoi c&apos;est intéressant</li>
            <li>splice() et vmsplice() - la plomberie commune</li>
            <li>CVE-2026-31431 - copyfail (AF_ALG / authencesn)</li>
            <li>Le bug commun dirty frag : skb_cow_data() manquant</li>
            <li>CVE-2026-43284 - dirty frag, chemin XFRM / ESP-in-UDP</li>
            <li>CVE-2026-43500 - dirty frag, chemin RxRPC / rxkad</li>
            <li>CVE-2026-46300 - fragnesia, chemin ESP-in-TCP / ULP</li>
            <li>CVE-2026-31635 - dirtydecrypt, chemin RxRPC / rxgk</li>
            <li>Tableau comparatif - la famille page cache</li>
            <li>pintheft - un primitif différent, même résultat</li>
            <li>Détection et mitigation</li>
            <li>Ce que ça apprend</li>
          </ol>
        </section>

        {/* 1 - Page cache */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-xl font-semibold">
            <Layers className="size-5 text-primary" />
            1. Le page cache Linux - pourquoi c&apos;est intéressant
          </h2>
          <p className="text-muted-foreground mb-3">
            Linux maintient en RAM une copie des contenus de fichiers qu&apos;il appelle
            le <strong className="text-foreground">page cache</strong>. Chaque fichier est
            représenté par une <code className="rounded bg-muted px-1">struct address_space</code>{" "}
            qui indexe des <code className="rounded bg-muted px-1">struct page</code> - des blocs
            de 4096 octets correspondant aux pages du fichier sur disque.
          </p>
          <p className="text-muted-foreground mb-3">
            Quand un processus lit un fichier, le noyau charge la page depuis le disque dans
            ce cache, puis sert les lectures depuis la copie mémoire. Lors de la prochaine
            lecture, le noyau sert directement depuis le cache sans toucher le disque.
            C&apos;est ce qui rend les accès fichiers rapides.
          </p>
          <InfoBox>
            <strong className="text-foreground">Le point clé :</strong> modifier le page cache
            ne modifie pas le fichier sur disque. Le chemin d&apos;écriture normal passe par
            le mécanisme de dirty page tracking du noyau, qui finit par appeler les routines
            du filesystem (ext4_writepage, etc.). Écrire directement dans une{" "}
            <code className="rounded bg-muted px-1">struct page</code> du cache contourne
            entièrement ce chemin.
          </InfoBox>
          <p className="text-muted-foreground mb-3">
            Ce détail est crucial pour tous les exploits qui suivent. Quand le noyau modifie
            le page cache de <code className="rounded bg-muted px-1">/usr/bin/su</code>,
            le fichier sur disque reste intact. Un{" "}
            <code className="rounded bg-muted px-1">md5sum</code> ou un scan antivirus
            sur le disque ne verra rien. Mais la prochaine fois qu&apos;un processus exécutera{" "}
            <code className="rounded bg-muted px-1">su</code>, le noyau chargera l&apos;ELF
            depuis le page cache - et exécutera le shellcode.
          </p>
          <p className="text-muted-foreground mb-3">
            Un <code className="rounded bg-muted px-1">echo 1 | tee /proc/sys/vm/drop_caches</code>{" "}
            ou un reboot évince les pages modifiées et restaure l&apos;état propre depuis
            le disque. L&apos;exploitation est entièrement en mémoire, sans persistance.
          </p>
          <CodeBlock title="Vérifier l'état du page cache vs disque">
{`# Sur disque, le fichier est intact
sha256sum /usr/bin/su
# ab12... (hash original)

# Mais la lecture depuis le page cache retourne le shellcode
dd if=/usr/bin/su bs=1 count=8 skip=120 2>/dev/null | xxd
# 00000000: 31ff 31f6 31c0 b06a  1.1.1..j  <- shellcode injecté

# Après drop_caches
echo 1 > /proc/sys/vm/drop_caches
sha256sum /usr/bin/su
# ab12... (identique, le disque n'a pas bougé)`}
          </CodeBlock>
        </section>

        {/* 2 - splice */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-xl font-semibold">
            <Network className="size-5 text-primary" />
            2. splice() et vmsplice() - la plomberie commune
          </h2>
          <p className="text-muted-foreground mb-3">
            <code className="rounded bg-muted px-1">splice(2)</code> est un appel système
            Linux qui transfère des données entre un file descriptor et un pipe{" "}
            <em>sans copie</em>. Quand la source est un fichier ordinaire, le noyau ne copie
            pas les octets - il ajoute simplement une référence à la page cache du fichier
            dans la liste des buffers du pipe.
          </p>
          <p className="text-muted-foreground mb-3">
            Concrètement, un <code className="rounded bg-muted px-1">struct pipe_buffer</code>{" "}
            dans le pipe contient un pointeur{" "}
            <code className="rounded bg-muted px-1">struct page*</code> vers la page cache
            du fichier source. Pas de copie, juste une référence. Plusieurs descripteurs
            peuvent partager la même page simultanément.
          </p>
          <CodeBlock title="splice() - zéro copie vers un pipe">
{`int file_fd = open("/usr/bin/su", O_RDONLY);
int pipe_fds[2];
pipe(pipe_fds);

// La page cache de /usr/bin/su[offset] est maintenant
// référencée dans le pipe, sans copie.
// pipe_buffer[0].page pointe vers la struct page du fichier.
off_t off = 0;
splice(file_fd, &off, pipe_fds[1], NULL, 4096, SPLICE_F_MOVE);`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            <code className="rounded bg-muted px-1">vmsplice(2)</code> fait l&apos;inverse :
            il mappe de la mémoire utilisateur dans un pipe. Dans les exploits dirty frag,
            il sert à injecter l&apos;en-tête du paquet (header ESP ou RxRPC)
            dans le pipe avant la page fichier, de sorte que le noyau voie un paquet réseau
            cohérent suivi du payload qui est en réalité du page cache.
          </p>
          <InfoBox>
            <strong className="text-foreground">La conséquence directe :</strong> quand ce pipe
            est ensuite envoyé dans un socket réseau ou dans une interface crypto (AF_ALG), le
            noyau construit un skb ou un scatterlist dont les fragments pointent vers ces mêmes
            pages cache. Si le sous-système en question chiffre ou déchiffre ces données en place,
            il écrit le résultat directement dans le page cache du fichier source.
          </InfoBox>
          <MemeCard
            src="/memes/spiderman-pointing.png"
            alt="Spider-Man pointing meme"
            caption="Deux références, une seule struct page - c'est le primitif"
          />
        </section>

        {/* 3 - copyfail */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-xl font-semibold">
            <Zap className="size-5 text-primary" />
            3. CVE-2026-31431 - copyfail (AF_ALG / authencesn)
          </h2>
          <p className="text-muted-foreground mb-3">
            Copyfail est chronologiquement le premier de cette vague - publié par Taeyang Lee
            et l&apos;équipe Theori / Xint Code en avril 2026. C&apos;est lui qui m&apos;a
            mis sur la piste de toute la famille.
          </p>
          <p className="text-muted-foreground mb-3">
            Le bug réside dans <code className="rounded bg-muted px-1">algif_aead</code>,
            l&apos;interface socket du sous-système crypto noyau
            (<code className="rounded bg-muted px-1">AF_ALG</code>). En 2017, une
            optimisation a été introduite pour permettre le déchiffrement AEAD en place :
            quand les données source et destination se trouvent dans le même segment mémoire,
            pas besoin de copier. Le problème : quand les données arrivent via un{" "}
            <code className="rounded bg-muted px-1">splice()</code> depuis un fichier,
            ce segment mémoire <em>est</em> une page du page cache. La même page se retrouve
            dans le scatterlist source ET destination de l&apos;opération AEAD. Le
            déchiffrement écrit dans le page cache.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Le mécanisme concret</h3>
          <p className="text-muted-foreground mb-3">
            L&apos;exploit utilise l&apos;algorithme{" "}
            <code className="rounded bg-muted px-1">authencesn(hmac(sha256),cbc(aes))</code>{" "}
            via <code className="rounded bg-muted px-1">AF_ALG</code>. La logique à chaque
            itération est la suivante : configurer une opération de déchiffrement avec des
            données d&apos;association connues (4 octets &quot;AAAA&quot; + 4 octets de payload = 8 octets au total),
            puis splice la page du fichier cible à l&apos;offset voulu dans le socket{" "}
            <code className="rounded bg-muted px-1">op_fd</code>. Le noyau déchiffre en place,
            et les 4 octets contrôlés atterrissent dans le page cache.
          </p>
          <CodeBlock title="copyfail - une itération d'écriture (C inline dans le script bash)">
{`// Ouvrir l'interface AF_ALG AEAD
int alg_fd = socket(AF_ALG, SOCK_SEQPACKET, 0);
struct sockaddr_alg sa = {
    .salg_family = AF_ALG,
    .salg_type   = "aead",
    .salg_name   = "authencesn(hmac(sha256),cbc(aes))",
};
bind(alg_fd, &sa, sizeof(sa));
setsockopt(alg_fd, SOL_ALG, ALG_SET_KEY, key, 40);
setsockopt(alg_fd, SOL_ALG, ALG_SET_AEAD_AUTHSIZE, NULL, 4);

int op_fd = accept4(alg_fd, 0, 0, 0);

// sendmsg : données d'association + 4 octets de payload voulus
sendmsg(op_fd, &mhdr, MSG_MORE);

// splice : page cache du fichier cible à l'offset i
loff_t off = 0;
splice(file_fd, &off,  pipe[1], NULL, i + 4, 0);
splice(pipe[0], NULL, op_fd,   NULL, i + 4, 0);

// Le noyau "déchiffre" en place -> écrit dans le page cache
// Le disque est intact.`}
          </CodeBlock>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Pourquoi authencesn et pas juste aes ou hmac</h3>
          <p className="text-muted-foreground mb-3">
            Un détail qui mérite d&apos;être noté : c&apos;est l&apos;algorithme combiné
            AEAD <code className="rounded bg-muted px-1">authencesn(hmac(sha256),cbc(aes))</code>{" "}
            qui déclenche le chemin de code vulnérable dans algif_aead. Un déchiffrement
            AES-CBC seul ne suffit pas. La raison est que le chemin in-place optimisé
            de 2017 ne s&apos;applique qu&apos;aux opérations AEAD - c&apos;est
            précisément pour éviter la copie du scatterlist source vers destination dans
            ce cas là que l&apos;optimisation a été introduite. C&apos;est aussi pour
            ça que la mitigation module-level (blacklister algif_aead) bloque l&apos;exploit
            sans toucher aux autres sous-systèmes crypto du noyau.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Caractéristiques</h3>
          <ul className="list-none space-y-1 text-sm text-muted-foreground font-mono ml-2">
            <li>- <span className="text-foreground">Déterministe</span> :: 4 octets par trigger, autant de triggers que nécessaire</li>
            <li>- <span className="text-foreground">Cible</span> :: n&apos;importe quel binaire SUID lisible</li>
            <li>- <span className="text-foreground">Architectures</span> :: x86_64, aarch64, i386, arm</li>
            <li>- <span className="text-foreground">Modules requis</span> :: algif_aead, authencesn, hmac, cbc</li>
            <li>- <span className="text-foreground">Noyaux affectés</span> :: 4.14 (août 2017) à mainline avril 2026</li>
            <li>- <span className="text-foreground">Patch</span> :: commit a664bf3d603d (revert de l&apos;optimisation in-place 2017)</li>
          </ul>
          <InfoBox>
            <strong className="text-foreground">Amplitude historique :</strong> copyfail est
            probablement le bug de cette vague avec la plus grande surface d&apos;exposition.
            Neuf ans de noyaux vulnérables, toutes les distributions majeures confirmées à la
            divulgation. Les backports distros ont commencé à arriver vers le 29 avril 2026.
          </InfoBox>
        </section>

        {/* 4 - Bug commun dirty frag */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-xl font-semibold">
            <Cpu className="size-5 text-primary" />
            4. Le bug commun dirty frag : skb_cow_data() manquant
          </h2>
          <MemeCard
            src="/memes/drake.png"
            alt="Drake meme"
            caption="Le raisonnement du noyau Linux version 2017-2026"
          />
          <p className="text-muted-foreground mb-3">
            À partir de là, on entre dans la famille dirty frag - publiée par V4bel et
            l&apos;équipe V12 en mai 2026. Quatre CVE, quatre chemins différents, un bug
            identique : avant de modifier les données d&apos;un skb en place (décryptage,
            suppression d&apos;en-têtes...), le code noyau doit appeler{" "}
            <code className="rounded bg-muted px-1">skb_cow_data()</code>.
          </p>
          <p className="text-muted-foreground mb-3">
            Cette fonction vérifie si les fragments de données du skb sont partagés avec
            d&apos;autres références, et si oui, en fait une copie privée avant modification.
            Quand la page est arrivée via un <code className="rounded bg-muted px-1">splice()</code>{" "}
            depuis un fichier, elle est effectivement partagée : elle appartient simultanément
            au page cache du fichier et au skb réseau. Sans ce check, le déchiffrement
            s&apos;effectue sur la page partagée - et écrit dans le page cache.
          </p>
          <CodeBlock title="Avant le patch (exemple XFRM) - pas de skb_cow_data()">
{`// net/xfrm/xfrm_input.c - AVANT patch CVE-2026-43284
static int xfrm_input(struct sk_buff *skb, ...)
{
    // ICI : skb->data pointe potentiellement vers le page cache
    // Aucun check de partage avant modification
    err = x->type->input(x, skb);  // déchiffrement en place -> écrit le page cache
}`}
          </CodeBlock>
          <CodeBlock title="Après le patch - copie si partagé">
{`static int xfrm_input(struct sk_buff *skb, ...)
{
    // Copie les données si le buffer est partagé
    err = skb_cow_data(skb, 0, &trailer);
    if (err < 0) return err;
    err = x->type->input(x, skb);  // déchiffrement sur la copie
}`}
          </CodeBlock>
          <InfoBox>
            <strong className="text-foreground">Pourquoi quatre sous-systèmes affectés ?</strong>{" "}
            Parce que XFRM, RxRPC et TCP ULP ont chacun leur propre chemin de traitement de
            paquets, écrits par des équipes différentes. Chacun a réimplémenté sa propre logique
            de décryptage in-place. Chacun a oublié le même check. Ce n&apos;est pas un bug
            isolé - c&apos;est un pattern manquant.
          </InfoBox>
        </section>

        {/* 5 - CVE-2026-43284 */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-xl font-semibold">
            <Zap className="size-5 text-primary" />
            5. CVE-2026-43284 - dirty frag, chemin XFRM / ESP-in-UDP
          </h2>
          <p className="text-muted-foreground mb-3">
            Le premier chemin dirty frag utilise le sous-système XFRM (le framework IPsec
            du noyau) en mode transport ESP-in-UDP. L&apos;idée est d&apos;installer des
            Security Associations via <code className="rounded bg-muted px-1">NETLINK_XFRM</code>{" "}
            et de coder le payload voulu directement dans les champs de ces SAs.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">L&apos;astuce seq_hi</h3>
          <p className="text-muted-foreground mb-3">
            Chaque SA stocke un état de rejeu ESN contenant notamment le champ{" "}
            <code className="rounded bg-muted px-1">seq_hi</code>. Pendant le déchiffrement
            ESP d&apos;un paquet, le noyau met à jour cet état en écrivant{" "}
            <code className="rounded bg-muted px-1">seq_hi</code> dans le buffer de données du
            skb - qui est en fait le page cache du fichier. En choisissant soigneusement cette
            valeur pour chaque SA, l&apos;attaquant contrôle exactement quels 4 octets seront écrits, et où.
          </p>
          <CodeBlock title="Installer 48 SAs - chaque seq_hi encode 4 octets du shellcode">
{`// 48 SAs pour écrire 192 octets (4 octets par SA)
for i in range(48):
    spi    = 0xDEADBE10 + i
    seq_hi = (shellcode[i*4+0] << 24 |
              shellcode[i*4+1] << 16 |
              shellcode[i*4+2] <<  8 |
              shellcode[i*4+3])
    install_xfrm_sa(spi=spi, seq_hi=seq_hi)

# Ensuite, pour chaque SA :
# vmsplice(esp_header) + splice(file[offset+i*4]) -> pipe -> UDP socket
# XFRM déchiffre en place -> écrit seq_hi à l'offset i*4 dans le page cache`}
          </CodeBlock>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Le problème des namespaces</h3>
          <p className="text-muted-foreground mb-3">
            L&apos;installation de SAs XFRM requiert{" "}
            <code className="rounded bg-muted px-1">CAP_NET_ADMIN</code>. L&apos;exploit
            contourne ça via{" "}
            <code className="rounded bg-muted px-1">CLONE_NEWUSER | CLONE_NEWNET</code> :
            dans un user+network namespace isolé, l&apos;utilisateur non-privilégié obtient
            automatiquement <code className="rounded bg-muted px-1">CAP_NET_ADMIN</code>{" "}
            sur son propre namespace. C&apos;est un usage parfaitement légitime des
            namespaces - aucun privilege requis côté hôte.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Caractéristiques</h3>
          <ul className="list-none space-y-1 text-sm text-muted-foreground font-mono ml-2">
            <li>- <span className="text-foreground">Déterministe</span> :: 48 triggers, 4 octets chacun, 192 octets total</li>
            <li>- <span className="text-foreground">Cible</span> :: /usr/bin/su (ELF shellcode en page cache)</li>
            <li>- <span className="text-foreground">Modules requis</span> :: esp4, esp6 (autochargés)</li>
            <li>- <span className="text-foreground">Namespaces</span> :: CLONE_NEWUSER + CLONE_NEWNET</li>
            <li>- <span className="text-foreground">Patch upstream</span> :: lists.openwall.net/netdev/2026/05/06/112</li>
          </ul>
        </section>

        {/* 6 - CVE-2026-43500 */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-xl font-semibold">
            <Zap className="size-5 text-primary" />
            6. CVE-2026-43500 - dirty frag, chemin RxRPC / rxkad
          </h2>
          <p className="text-muted-foreground mb-3">
            Le deuxième chemin utilise <code className="rounded bg-muted px-1">AF_RXRPC</code>,
            le sous-système AFS/RxRPC du noyau, avec la couche de sécurité rxkad basée
            sur fcrypt - un vieux chiffrement par blocs de 8 octets issu de Kerberos v4.
            Ce qui m&apos;a le plus frappé dans ce chemin, c&apos;est qu&apos;on ne touche
            pas à /usr/bin/su - on cible /etc/passwd.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">rxkad_verify_packet_1() et le déchiffrement en place</h3>
          <p className="text-muted-foreground mb-3">
            La fonction <code className="rounded bg-muted px-1">rxkad_verify_packet_1()</code>{" "}
            déchiffre le payload d&apos;un paquet RxRPC entrant avec PCBC(fcrypt). Si ce
            payload vient d&apos;un splice() de page cache, elle écrit dans la page cache
            d&apos;/etc/passwd. L&apos;objectif est de transformer{" "}
            <code className="rounded bg-muted px-1">root:x:0:0:...</code> en{" "}
            <code className="rounded bg-muted px-1">root::0:0:GGGGGG:/root:/bin/bash</code>{" "}
            (mot de passe vide). Trois écritures de 8 octets aux offsets 4, 6 et 8,
            avec un chevauchement intentionnel (last-write-wins).
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Le bruteforce hors-ligne des clés fcrypt</h3>
          <p className="text-muted-foreground mb-3">
            fcrypt est un algorithme Feistel de 16 rounds avec 56 bits effectifs. Il n&apos;a
            pas été conçu pour résister aux attaques modernes. Pour chaque bloc de 8 octets
            à écrire, on cherche une clé K telle que{" "}
            <code className="rounded bg-muted px-1">fcrypt_decrypt(C, K) = P</code> - où C
            est le contenu actuel du fichier à cet offset et P est le contenu désiré.
          </p>
          <p className="text-muted-foreground mb-3">
            Le bruteforce est parallélisé sur tous les cœurs via un PRNG (splitmix64) avec
            des graines différentes par worker. Les prédicats sont volontairement permissifs
            - on cherche K_A tel que decrypt(C, K_A)[0:2] == &quot;::&quot; - donc la
            probabilité de succès à chaque essai est 1/65536, pas 1/2^56. En pratique,
            quelques secondes sur du matériel moderne.
          </p>
          <p className="text-muted-foreground mb-3">
            Un détail important : PCBC(fcrypt) avec un IV nul sur un bloc unique se réduit
            à <code className="rounded bg-muted px-1">fcrypt_decrypt(C, K)</code> seul.
            C&apos;est ce que fait exactement{" "}
            <code className="rounded bg-muted px-1">rxkad_verify_packet_1()</code>. Comprendre
            ça en lisant <code className="rounded bg-muted px-1">crypto/fcrypt.c</code> du noyau
            est indispensable pour comprendre pourquoi le bruteforce offline fonctionne
            et pourquoi trois triggers suffisent.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Caractéristiques</h3>
          <ul className="list-none space-y-1 text-sm text-muted-foreground font-mono ml-2">
            <li>- <span className="text-foreground">Déterministe</span> :: 3 triggers fixes après bruteforce offline</li>
            <li>- <span className="text-foreground">Cible</span> :: /etc/passwd (root sans mot de passe)</li>
            <li>- <span className="text-foreground">Prérequis</span> :: bruteforce fcrypt offline (quelques secondes)</li>
            <li>- <span className="text-foreground">Module requis</span> :: rxrpc (autochargé)</li>
            <li>- <span className="text-foreground">Namespaces</span> :: aucun nécessaire</li>
            <li>- <span className="text-foreground">Patch upstream</span> :: lists.openwall.net/netdev/2026/05/06/114</li>
          </ul>
        </section>

        {/* 7 - CVE-2026-46300 */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-xl font-semibold">
            <Zap className="size-5 text-primary" />
            7. CVE-2026-46300 - fragnesia, chemin ESP-in-TCP / ULP
          </h2>
          <p className="text-muted-foreground mb-3">
            Fragnesia, de William Bowling (V12), utilise une surface différente :{" "}
            <code className="rounded bg-muted px-1">TCP_ULP espintcp</code>, une option TCP
            qui installe un handler de couche supérieure pour chiffrer/déchiffrer ESP
            directement dans la couche TCP. Ce qui rend ce chemin élégant, c&apos;est
            le timing de l&apos;installation du ULP.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">L&apos;installation tardive du ULP</h3>
          <p className="text-muted-foreground mb-3">
            Le sender splice les données du fichier cible dans le socket TCP - elles entrent
            dans la file de réception du receiver en tant que page cache. Ensuite seulement,
            le receiver installe{" "}
            <code className="rounded bg-muted px-1">TCP_ULP espintcp</code> via setsockopt.
            Le ULP traite les données déjà en attente en place - et déchiffre in-place le
            page cache déjà mis en file.
          </p>
          <CodeBlock title="Synchronisation sender/receiver">
{`// Thread receiver
conn = accept(srv)
sleep(30ms)   // attendre que le sender ait splicé le fichier dans le recv buffer
setsockopt(conn, IPPROTO_TCP, TCP_ULP, "espintcp")
// -> ULP traite les données déjà en queue, in-place -> XOR keystream dans le page cache

// Thread sender
sock = connect(receiver)
send(sock, esp_header_prefix)  // 18 octets : len(2) + header ESP(16)
sleep(1ms)
splice(file_fd, &offset, pipe_write, NULL, 4096, 0)
splice(pipe_read, NULL, sock,       NULL, 4096, 0)
// données du fichier maintenant dans le recv buffer du receiver`}
          </CodeBlock>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">AES-GCM comme XOR contrôlé</h3>
          <p className="text-muted-foreground mb-3">
            AES-128-GCM génère un keystream en chiffrant un counter block :{" "}
            <code className="rounded bg-muted px-1">salt(4) || IV(8) || counter_be32</code>.
            Le counter block à la position 2 est{" "}
            <code className="rounded bg-muted px-1">salt || IV || 0x00000002</code>.
            En variant l&apos;IV, on contrôle le keystream, et donc ce qui sera XOR-é dans
            la page cache. L&apos;exploit construit une table de correspondance via{" "}
            <code className="rounded bg-muted px-1">AF_ALG</code> : pour chaque valeur de
            keystream possible (0x00 à 0xFF), quelle valeur d&apos;IV la produit ? Les 256
            valeurs sont couvertes dans les 65536 premiers nonces.
          </p>
          <CodeBlock title="Table de keystream AES-GCM">
{`// Construire la table une fois au démarrage
for nonce in range(65536):
    counter_block = salt + nonce_as_iv + b'\x00\x00\x00\x02'
    keystream_byte = AES_ECB_encrypt(key, counter_block)[0]
    if keystream_byte not in table:
        table[keystream_byte] = nonce

// Pour écrire un octet à l'offset i :
current  = read_byte(file, i)
needed   = current ^ desired   // keystream nécessaire
nonce    = table[needed]
// Lancer un trigger avec cet IV :
//   current XOR needed = current XOR (current XOR desired) = desired`}
          </CodeBlock>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Caractéristiques</h3>
          <ul className="list-none space-y-1 text-sm text-muted-foreground font-mono ml-2">
            <li>- <span className="text-foreground">Déterministe</span> :: 1 SA, table de keystream, 1 octet par trigger</li>
            <li>- <span className="text-foreground">Cible</span> :: /usr/bin/su (même shellcode que dirtyfrag)</li>
            <li>- <span className="text-foreground">Module requis</span> :: esp6 (IPv6 loopback)</li>
            <li>- <span className="text-foreground">Namespaces</span> :: aucun nécessaire</li>
            <li>- <span className="text-foreground">Patch upstream</span> :: lists.openwall.net/netdev/2026/05/13/79</li>
          </ul>
        </section>

        {/* 8 - CVE-2026-31635 */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-xl font-semibold">
            <Zap className="size-5 text-primary" />
            8. CVE-2026-31635 - dirtydecrypt, chemin RxRPC / rxgk
          </h2>
          <p className="text-muted-foreground mb-3">
            Dirtydecrypt d&apos;Aaron Esau (V12) est la version probabiliste de la famille.
            Il utilise rxgk (AFS Kerberos 5, en opposition à rxkad qui est Kerberos 4).
            L&apos;algorithme de chiffrement est AES-128-CTS (krb5enc, RFC 3961). C&apos;est
            le plus lent des quatre à s&apos;exécuter, mais le principe est fascinant.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Pourquoi probabiliste</h3>
          <p className="text-muted-foreground mb-3">
            Contrairement aux variantes précédentes, l&apos;exploit ne peut pas choisir exactement ce
            qui sera écrit à chaque trigger. La clé de session rxgk est générée aléatoirement
            à chaque essai via{" "}
            <code className="rounded bg-muted px-1">add_key(&quot;rxrpc&quot;, ...)</code>.
            Le premier octet du bloc AES-128-CTS décrypté vers la page cache est donc
            uniformément aléatoire : probabilité 1/256 que cet octet soit exactement la
            valeur ciblée.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">La technique de la fenêtre glissante</h3>
          <p className="text-muted-foreground mb-3">
            Un seul trigger couvre 16 octets consécutifs : page_cache[i..i+15]. L&apos;astuce
            de la fenêtre glissante exploite ce fait pour réparer les &quot;dégâts
            collatéraux&quot; :
          </p>
          <ul className="list-none space-y-2 text-sm text-muted-foreground font-mono ml-2 mb-3">
            <li>- Tirer sur l&apos;offset i jusqu&apos;à ce que page_cache[i] == target[i] (~256 essais en moyenne)</li>
            <li>- Avancer à i+1. Le prochain trigger écrit page_cache[i+1..i+16]</li>
            <li>- Il corrompt les octets i+1..i+16, mais l&apos;octet i est hors de la fenêtre - il ne sera plus touché</li>
            <li>- Le progrès est uniquement vers l&apos;avant, jamais en arrière</li>
          </ul>
          <CodeBlock title="Fenêtre glissante - logique">
{`for i in range(192):                      # pour chaque octet du shellcode
    while mmap[i] != shellcode[i]:         # tant que l'octet n'est pas bon
        generate_random_aes128_key()       # nouvelle clé rxgk aléatoire
        trigger_rxgk_decrypt(offset=i)     # byte i devient aléatoire -> 1/256 de succès
    // byte i est correct, avancer
    // prochain trigger à offset i+1 n'affecte pas byte i`}
          </CodeBlock>
          <InfoBox>
            <strong className="text-foreground">En pratique :</strong> ~256 essais par octet,
            ~49 152 triggers pour 192 octets. Ça correspond à quelques minutes d&apos;exploitation
            sur un système avec rxrpc chargé. Le PoC borne à 10 000 essais max par octet
            (~1,9M de triggers au pire) pour éviter une boucle infinie.
          </InfoBox>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Caractéristiques</h3>
          <ul className="list-none space-y-1 text-sm text-muted-foreground font-mono ml-2">
            <li>- <span className="text-foreground">Probabiliste</span> :: 1/256 par octet, fenêtre glissante</li>
            <li>- <span className="text-foreground">Espérance</span> :: ~256 triggers/octet, ~49 152 total</li>
            <li>- <span className="text-foreground">Cible</span> :: /usr/bin/su</li>
            <li>- <span className="text-foreground">Module requis</span> :: rxrpc (autochargé)</li>
            <li>- <span className="text-foreground">Namespaces</span> :: aucun nécessaire</li>
          </ul>
        </section>

        {/* 9 - Tableau comparatif */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-xl font-semibold">
            <Layers className="size-5 text-primary" />
            9. Tableau comparatif - la famille page cache
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <VariantCard
              cve="CVE-2026-31431"
              path="AF_ALG / authencesn"
              model="Déterministe"
              granularity="4 octets / trigger"
              trigger="plen/4 (variable)"
              crypto="authencesn(hmac-sha256, cbc-aes)"
              target="tout binaire SUID"
              module="algif_aead"
            />
            <VariantCard
              cve="CVE-2026-43284"
              path="XFRM / ESP-in-UDP"
              model="Déterministe"
              granularity="4 octets / SA"
              trigger="48 SAs"
              crypto="CBC-AES + HMAC-SHA256"
              target="/usr/bin/su"
              module="esp4 / esp6"
            />
            <VariantCard
              cve="CVE-2026-43500"
              path="RxRPC / rxkad"
              model="Déterministe (bruteforce offline)"
              granularity="8 octets / trigger"
              trigger="3 clés fcrypt"
              crypto="PCBC(fcrypt)"
              target="/etc/passwd"
              module="rxrpc"
            />
            <VariantCard
              cve="CVE-2026-46300"
              path="ESP-in-TCP / ULP"
              model="Déterministe (table keystream)"
              granularity="1 octet / trigger"
              trigger="1 SA, 192 triggers max"
              crypto="AES-128-GCM"
              target="/usr/bin/su"
              module="esp6 (IPv6)"
            />
            <VariantCard
              cve="CVE-2026-31635"
              path="RxRPC / rxgk"
              model="Probabiliste (1/256)"
              granularity="1 octet / trigger"
              trigger="~49 152 en moyenne"
              crypto="AES-128-CTS (krb5enc)"
              target="/usr/bin/su"
              module="rxrpc"
            />
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-muted-foreground">CVE</th>
                  <th className="text-left py-2 pr-4 text-muted-foreground">Race</th>
                  <th className="text-left py-2 pr-4 text-muted-foreground">Namespaces</th>
                  <th className="text-left py-2 pr-4 text-muted-foreground">Disque modifié</th>
                  <th className="text-left py-2 text-muted-foreground">Reboot safe</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["CVE-2026-31431", "Non", "Aucun", "Non", "Oui"],
                  ["CVE-2026-43284", "Non", "NEWUSER + NEWNET", "Non", "Oui"],
                  ["CVE-2026-43500", "Non", "Aucun", "Non", "Oui"],
                  ["CVE-2026-46300", "Non", "Aucun", "Non", "Oui"],
                  ["CVE-2026-31635", "Non", "Aucun", "Non", "Oui"],
                ].map(([cve, race, ns, disk, reboot]) => (
                  <tr key={cve} className="border-b border-border/50">
                    <td className="py-2 pr-4 text-primary">{cve}</td>
                    <td className="py-2 pr-4">{race}</td>
                    <td className="py-2 pr-4">{ns}</td>
                    <td className="py-2 pr-4">{disk}</td>
                    <td className="py-2">{reboot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <MemeCard
            src="/memes/wait-its-all.jpeg"
            alt="Wait it's all page cache astronaut meme"
            caption="5 bugs, 5 chemins différents, 1 seul primitif"
          />
        </section>

        {/* 10 - pintheft */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-xl font-semibold">
            <Cpu className="size-5 text-primary" />
            10. pintheft - un primitif différent, même résultat
          </h2>
          <p className="text-muted-foreground mb-3">
            Pintheft, également d&apos;Aaron Esau (V12), arrive au même résultat - écrire
            dans le page cache d&apos;un binaire SUID - mais par un chemin radicalement
            différent. Pas de splice, pas de crypto in-place. C&apos;est un double
            décrément du refcount d&apos;une page, combiné à io_uring qui garde un pointeur
            qui pend dans le vide.
          </p>
          <InfoBox>
            <strong className="text-foreground">Le changement de registre :</strong> les cinq
            bugs précédents sont des erreurs de vérification - on a oublié de copier avant
            de modifier. Pintheft est une erreur de comptage - on décrémente deux fois un
            compteur de références qui devrait l&apos;être une seule fois. Le résultat final
            est similaire (page cache corrompu, root shell), mais le chemin est plus tortueux
            à comprendre.
          </InfoBox>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Le bug RDS zcopy : double-free du refcount</h3>
          <p className="text-muted-foreground mb-3">
            Le bug se trouve dans{" "}
            <code className="rounded bg-muted px-1">rds_message_zcopy_from_user()</code>.
            La fonction pin les pages utilisateur une par une via{" "}
            <code className="rounded bg-muted px-1">FOLL_GET</code>. Si une page faulte
            (par exemple une page guard en PROT_NONE), le chemin d&apos;erreur appelle{" "}
            <code className="rounded bg-muted px-1">put_page()</code> sur les pages déjà
            pinnées, puis{" "}
            <code className="rounded bg-muted px-1">rds_message_purge()</code> appelle{" "}
            <code className="rounded bg-muted px-1">__free_page()</code> sur elles à nouveau -
            parce que <code className="rounded bg-muted px-1">op_mmp_znotifier</code> a été
            NULLé mais <code className="rounded bg-muted px-1">op_nents</code> / les entrées
            sg sont restées intactes. Chaque sendmsg qui échoue vole exactement 1 référence
            à la première page.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Le rôle de io_uring et CONFIG_INIT_ON_ALLOC</h3>
          <p className="text-muted-foreground mb-3">
            Pour contourner <code className="rounded bg-muted px-1">CONFIG_INIT_ON_ALLOC_DEFAULT_ON</code>{" "}
            (qui zeroise les pages à l&apos;allocation et déclenche des checks), la page cible
            est d&apos;abord enregistrée dans io_uring via{" "}
            <code className="rounded bg-muted px-1">IORING_REGISTER_BUFFERS</code>. Cette
            opération ajoute <code className="rounded bg-muted px-1">GUP_PIN_COUNTING_BIAS</code>{" "}
            (= 1024) au refcount via <code className="rounded bg-muted px-1">FOLL_PIN</code>.
            On vole ensuite 1024 fois via des zcopy RDS qui échouent. Le refcount revient à ~1
            (juste le mapping PTE). <code className="rounded bg-muted px-1">munmap</code> passe
            par le chemin normal de libération, sans déclencher bad_page.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">La chaîne complète</h3>
          <CodeBlock title="pintheft - la chaîne de bout en bout">
{`// 1. Pin à CPU 0, drainer le PCP
sched_setaffinity(0, cpu0)
// Drainer 512 pages du PCP (Per-CPU Page list) pour contrôler l'ordre LIFO

// 2. Enregistrer la page dans io_uring (refcount +1024 via FOLL_PIN)
IORING_REGISTER_BUFFERS(ring, &buf, page_size)
// refcount = 1025

// 3. Cloner le ring -> daemon daemon.Close() empêche unpin_user_folio
IORING_REGISTER_CLONE_BUFFERS(ring2, ring)  // imu->refs = 2
// daemon forké garde ring2 ouvert : unpin_user_folio sautera (refs > 1)

// 4. Voler 1024 refs via RDS zcopy échouants (PROT_NONE guard page)
for i in range(1024):
    rds_sendmsg(buf, buf + page_size)  // faulte sur la guard page -> -1 ref
// refcount = ~1

// 5. Évincer le page cache du binaire cible
fadvise(su_fd, 0, page_size, POSIX_FADV_DONTNEED)

// 6. Section critique : munmap + pread en raw syscalls consécutifs
// munmap -> page libérée, atterrit en tête du PCP LIFO
// pread(su_fd) -> page cache allocator prend la tête du PCP -> notre page
munmap(buf, page_size)       // raw syscall, pas d'interruption entre les deux
pread(su_fd, buf2, page_size, 0)

// 7. io_uring a toujours un bvec dangling vers notre page = page cache de su
// READ_FIXED -> lit le shellcode depuis le payload file et l'écrit via bvec dangling
IORING_OP_READ_FIXED(ring, payload_fd, buf, page_size)

// 8. Vérifier et spawn PTY root shell
verify(su_fd, shellELF) && exec_pty(su_path)`}
          </CodeBlock>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">La section critique munmap / pread</h3>
          <p className="text-muted-foreground mb-3">
            La section critique entre <code className="rounded bg-muted px-1">munmap</code> et{" "}
            <code className="rounded bg-muted px-1">pread</code> doit être exécutée avec le
            moins d&apos;instructions possible entre les deux. Si une autre allocation se
            glisse entre les deux syscalls, une autre page prend la tête du PCP avant le
            pread - et c&apos;est cette page qui devient le page cache de{" "}
            <code className="rounded bg-muted px-1">su</code>, pas la nôtre. Le PoC
            original résout ça avec des raw syscalls consécutifs et l&apos;affinité CPU
            pour éviter les préemptions entre les deux appels.
          </p>

          <h3 className="mt-6 mb-3 font-mono text-lg font-semibold">Caractéristiques</h3>
          <ul className="list-none space-y-1 text-sm text-muted-foreground font-mono ml-2">
            <li>- <span className="text-foreground">Primitif</span> :: double-free RDS + dangling bvec io_uring</li>
            <li>- <span className="text-foreground">Cible</span> :: tout binaire SUID lisible</li>
            <li>- <span className="text-foreground">Modules requis</span> :: CONFIG_RDS=m, CONFIG_IO_URING=y</li>
            <li>- <span className="text-foreground">Exposition</span> :: Arch Linux particulièrement exposé (RDS chargé par défaut)</li>
            <li>- <span className="text-foreground">Disque modifié</span> :: Non (page cache uniquement)</li>
            <li>- <span className="text-foreground">Retries</span> :: 5 max (dépend du timing PCP LIFO)</li>
          </ul>
        </section>

        {/* 11 - Détection et mitigation */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            11. Détection et mitigation
          </h2>

          <div className="space-y-4">
            <CollapsibleSection title="Mitigation immédiate - désactiver les modules">
              <p className="text-muted-foreground mb-3">
                La majorité des postes n&apos;ont aucune raison d&apos;avoir rxrpc, algif_aead
                ou esp4/esp6 chargés. Les désactiver coupe net tous les chemins d&apos;exploitation
                de cette famille.
              </p>
              <CodeBlock title="Blacklist des modules vulnérables">
{`# Décharger si présents
rmmod rxrpc algif_aead esp4 esp6 2>/dev/null

# Blacklist permanente
cat > /etc/modprobe.d/no-lpe-2026.conf << 'EOF'
install rxrpc /bin/false
install algif_aead /bin/false
install esp4 /bin/false
install esp6 /bin/false
install rds /bin/false
EOF

# Vérification
lsmod | grep -E 'rxrpc|algif_aead|esp4|esp6|^rds '
# -> aucune sortie = modules non chargés`}
              </CodeBlock>
              <p className="text-sm text-muted-foreground">
                Ubuntu 26.04, Fedora 40+ et CentOS Stream 10 bloquent déjà le chargement
                de ces modules par défaut via AppArmor / SELinux. Les distributions plus
                conservatrices (Arch Linux notamment) ne le font pas.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Détection - signaux observables">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-mono text-foreground mb-1"># Chargement inhabituel de modules réseau</p>
                  <CodeBlock title="auditd - détecter le chargement de modules suspects">
{`-a always,exit -F arch=b64 -S init_module,finit_module \
   -k kernel_module_load

# Chercher dans les logs :
ausearch -k kernel_module_load | grep -E 'rxrpc|algif|esp4|esp6|rds '`}
                  </CodeBlock>
                </div>
                <div>
                  <p className="text-sm font-mono text-foreground mb-1"># Activité NETLINK_XFRM anormale</p>
                  <p className="text-muted-foreground text-sm mb-2">
                    CVE-2026-43284 installe 48 SAs XFRM en rafale depuis un processus
                    non-VPN. Hors contexte IPsec légitime, c&apos;est un signal fort.
                  </p>
                  <CodeBlock title="Lister les SAs actives">
{`ip xfrm state
# Un burst de 48+ SAs avec des SPIs séquentiels (0xDEADBE10, 0xDEADBE11...)
# depuis un processus sans CAP_NET_ADMIN hors namespace est anormal`}
                  </CodeBlock>
                </div>
                <div>
                  <p className="text-sm font-mono text-foreground mb-1"># eBPF - tracer splice() + send() suspects</p>
                  <p className="text-muted-foreground text-sm mb-2">
                    La chaîne splice(file, pipe) suivie de splice(pipe, socket) depuis
                    un processus non-root est caractéristique du primitif d&apos;exploitation.
                  </p>
                  <CodeBlock title="bpftrace - détecter la chaîne splice/send">
{`tracepoint:syscalls:sys_enter_splice
/uid != 0/
{
    printf("splice() par %s (pid %d): fd_in=%d fd_out=%d\\n",
           comm, pid, args->fd_in, args->fd_out);
}`}
                  </CodeBlock>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Mitigation - user namespaces non-privilégiés">
              <p className="text-muted-foreground mb-3">
                CVE-2026-43284 nécessite la création de user namespaces non-privilégiés.
                Les désactiver bloque ce vecteur spécifique (les autres n&apos;en ont pas besoin).
              </p>
              <CodeBlock title="Désactiver les user namespaces non-privilégiés">
{`sysctl -w kernel.unprivileged_userns_clone=0
echo "kernel.unprivileged_userns_clone=0" >> /etc/sysctl.d/99-security.conf`}
              </CodeBlock>
              <p className="text-sm text-muted-foreground">
                Cette mesure casse Podman rootless et certains sandboxes de navigateurs.
                À évaluer selon le contexte avant de l&apos;appliquer en production.
              </p>
            </CollapsibleSection>
          </div>
        </section>

        {/* 12 - Ce que ça apprend */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 font-mono text-xl font-semibold">
            <Eye className="size-5 text-primary" />
            12. Ce que ça apprend
          </h2>
          <p className="text-muted-foreground mb-3">
            La correction est identique dans les quatre cas dirty frag : ajouter{" "}
            <code className="rounded bg-muted px-1">skb_cow_data()</code> avant chaque
            opération de cryptographie en place. Pour copyfail, le fix revient en arrière
            sur l&apos;optimisation in-place de 2017. Pour pintheft, le patch corrige le
            double put_page dans le chemin d&apos;erreur de rds_message_zcopy_from_user().
          </p>
          <p className="text-muted-foreground mb-3">
            Ce qui me frappe dans cette vague, c&apos;est l&apos;absence de corruption
            mémoire traditionnelle. Pas d&apos;overflow, pas d&apos;UAF, pas de type
            confusion. Chaque exploit tire parti de sémantiques correctes utilisées de
            manière non prévue :
          </p>
          <ul className="list-none space-y-1.5 text-sm text-muted-foreground font-mono ml-2 mb-3">
            <li>- splice() est conçu pour le zéro-copie :: c&apos;est son comportement normal</li>
            <li>- le déchiffrement in-place est une optimisation légitime :: c&apos;est son comportement normal</li>
            <li>- la composition des deux crée une écriture arbitraire dans le page cache</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            L&apos;invariant manquant - &quot;avant de modifier un buffer, vérifier qu&apos;il
            nous appartient&quot; - est facile à oublier quand on travaille sur un
            sous-système isolé. XFRM, RxRPC et TCP ULP ont été écrits par des équipes
            différentes, à des époques différentes, et chacun a oublié le même check.
            C&apos;est un argument fort pour centraliser ce type de garde-fou dans la
            primitive elle-même plutôt que de compter sur chaque appelant.
          </p>
          <p className="text-muted-foreground mb-3">
            Pour ce qui me concerne : réécrire ces cinq exploits m&apos;a forcé à lire des
            parties du noyau que je n&apos;aurais jamais touchées autrement - algif_aead,
            xfrm_input, rxkad_verify_packet_1, le code io_uring SQ/CQ... La lecture seule
            ne suffit pas. C&apos;est en réimplémentant chaque structure de données et
            chaque appel système que les détails qui font la différence deviennent évidents.
          </p>
          <MemeCard
            src="/memes/surprised-pikachu.png"
            alt="Surprised Pikachu meme"
            bottomText="execve(/usr/bin/su) après l'exploit"
          />
        </section>

        {/* Crédits */}
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 font-mono text-xl font-semibold">Crédits et références</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="text-foreground font-mono mb-1"># Découvertes originales</p>
              <ul className="list-none space-y-1 ml-2 font-mono">
                <li>
                  - <strong className="text-foreground">Taeyang Lee / Theori · Xint Code</strong> :: CVE-2026-31431 (copyfail) -{" "}
                  <a href="https://copy.fail" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    copy.fail
                  </a>
                </li>
                <li>
                  - <strong className="text-foreground">V4bel</strong> :: CVE-2026-43284 + CVE-2026-43500 (dirtyfrag) -{" "}
                  <a href="https://github.com/V4bel/dirtyfrag" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    github.com/V4bel/dirtyfrag
                  </a>
                </li>
                <li>
                  - <strong className="text-foreground">Aaron Esau / V12</strong> :: CVE-2026-31635 (dirtydecrypt) + pintheft -{" "}
                  <a href="https://github.com/v12-security/pocs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    github.com/v12-security/pocs
                  </a>
                </li>
                <li>
                  - <strong className="text-foreground">William Bowling / V12</strong> :: CVE-2026-46300 (fragnesia) -{" "}
                  <a href="https://github.com/v12-security/pocs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    github.com/v12-security/pocs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-foreground font-mono mb-1"># Patches upstream</p>
              <ul className="list-none space-y-1 ml-2 font-mono">
                <li>- CVE-2026-31431 :: github.com/torvalds/linux/commit/a664bf3d603d</li>
                <li>- CVE-2026-43284 :: lists.openwall.net/netdev/2026/05/06/112</li>
                <li>- CVE-2026-43500 :: lists.openwall.net/netdev/2026/05/06/114</li>
                <li>- CVE-2026-46300 :: lists.openwall.net/netdev/2026/05/13/79</li>
              </ul>
            </div>
          </div>
        </section>

      </article>
    </div>
  );
}
