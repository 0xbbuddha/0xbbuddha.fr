import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Données d'exemple – à remplacer par un CMS ou des fichiers MDX
const writeups: Record<string, { title: string; date: string; platform: string }> = {
  "machine-htb-exemple": {
    title: "Machine HackTheBox – Exemple",
    date: "2025-01-15",
    platform: "HackTheBox",
  },
  "room-thm-exemple": {
    title: "Room TryHackMe – Exemple",
    date: "2025-01-10",
    platform: "TryHackMe",
  },
  "ctf-writeup": {
    title: "CTF – Challenge Web",
    date: "2024-12-20",
    platform: "CTF",
  },
};

export function generateStaticParams() {
  return Object.keys(writeups).map((slug) => ({ slug }));
}

export default async function WriteupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writeup = writeups[slug];
  if (!writeup) notFound();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Button variant="ghost" size="sm" asChild className="mb-8 gap-2">
        <Link href="/writeups">
          <ArrowLeft className="size-4" />
          Retour aux writeups
        </Link>
      </Button>
      <article>
        <header className="mb-8">
          <p className="font-mono text-sm text-primary">{writeup.platform}</p>
          <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            {writeup.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{writeup.date}</p>
        </header>
        <div className="prose prose-invert max-w-none prose-headings:font-mono prose-a:text-primary">
          <p className="text-muted-foreground">
            Contenu du writeup à rédiger ici (Markdown / MDX recommandé). Tu peux
            utiliser des composants React pour les commandes, captures d&apos;écran, etc.
          </p>
        </div>
      </article>
    </div>
  );
}
