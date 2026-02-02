import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Données d'exemple – à remplacer par tes articles (MDX ou CMS)
const posts = [
  {
    slug: "introduction-owasp-top-10",
    title: "Introduction au OWASP Top 10",
    date: "2025-01-20",
    excerpt:
      "Vue d'ensemble des vulnérabilités web les plus critiques et comment les aborder en pentest.",
  },
  {
    slug: "outils-reconnaissance",
    title: "Outils de reconnaissance pour un pentest web",
    date: "2025-01-05",
    excerpt:
      "Workflow et outils (nmap, ffuf, nuclei...) pour la phase de reconnaissance.",
  },
  {
    slug: "notes-active-directory",
    title: "Notes sur l'Active Directory et l'AD CS",
    date: "2024-12-01",
    excerpt:
      "Rappels et astuces pour les assessments Windows / AD.",
  },
];

export const metadata = {
  title: "Blog | 0xbbuddha",
  description: "Articles et réflexions sur la cybersécurité.",
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
          Blog
        </h1>
        <p className="mt-2 text-muted-foreground">
          Articles, tutoriels et notes sur la cybersécurité et le pentest.
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.slug} className="overflow-hidden">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-3.5" />
                  {post.date}
                </div>
                <CardTitle className="mt-2">{post.title}</CardTitle>
                <CardDescription className="mt-1">{post.excerpt}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="shrink-0 gap-2">
                <Link href={`/blog/${post.slug}`}>
                  Lire l&apos;article
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
