import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Données d'exemple – à remplacer par un CMS ou des fichiers MDX
const posts: Record<string, { title: string; date: string }> = {
  "introduction-owasp-top-10": {
    title: "Introduction au OWASP Top 10",
    date: "2025-01-20",
  },
  "outils-reconnaissance": {
    title: "Outils de reconnaissance pour un pentest web",
    date: "2025-01-05",
  },
  "notes-active-directory": {
    title: "Notes sur l'Active Directory et l'AD CS",
    date: "2024-12-01",
  },
};

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Button variant="ghost" size="sm" asChild className="mb-8 gap-2">
        <Link href="/blog">
          <ArrowLeft className="size-4" />
          Retour au blog
        </Link>
      </Button>
      <article>
        <header className="mb-8">
          <h1 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{post.date}</p>
        </header>
        <div className="prose prose-invert max-w-none prose-headings:font-mono prose-a:text-primary">
          <p className="text-muted-foreground">
            Contenu de l&apos;article à rédiger ici (Markdown / MDX recommandé).
          </p>
        </div>
      </article>
    </div>
  );
}
