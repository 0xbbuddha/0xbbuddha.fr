import Link from "next/link";
import { Calendar } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const articles = [
  {
    slug: "bashhound",
    title: "Et si on recodait un collecteur AD en pur Bash ?",
    category: "Tools",
    tags: ["Active Directory", "BloodHound", "Bash"],
    date: "2026-03-18",
    excerpt:
      "Conception et implémentation d'un collecteur Active Directory pour BloodHound en Bash pur : protocole LDAP, ASN.1, parsing Security Descriptors, export JSON v5/v6.",
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
        {articles.map((a) => (
          <Card key={a.slug} className="overflow-hidden">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <span className="font-mono text-primary">{a.category}</span>
                  {a.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs">
                      {tag}
                    </span>
                  ))}
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {a.date}
                  </span>
                </div>
                <CardTitle className="mt-2">{a.title}</CardTitle>
                <CardDescription className="mt-1">{a.excerpt}</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0">
                <Link href={`/blog/${a.slug}`}>
                  Lire l&apos;article
                </Link>
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
