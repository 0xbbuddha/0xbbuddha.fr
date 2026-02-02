import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Données d'exemple – à remplacer par tes projets réels
const projects = [
  {
    title: "Projet CTF / Pentest",
    description:
      "Description courte du projet : outils, méthodologie, résultats.",
    tags: ["Pentest", "Web", "Linux"],
    href: "#",
    external: false,
  },
  {
    title: "Script d'automatisation",
    description: "Outil ou script développé pour la reconnaissance ou l'exploitation.",
    tags: ["Python", "Recon", "Automation"],
    href: "#",
    external: false,
  },
  {
    title: "Lab / Environnement",
    description: "Laboratoire ou environnement de test pour pratiquer la cybersécurité.",
    tags: ["Docker", "VulnLab", "AD"],
    href: "#",
    external: false,
  },
];

export const metadata = {
  title: "Portfolio | 0xbbuddha",
  description: "Projets et réalisations en cybersécurité.",
};

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
          Portfolio
        </h1>
        <p className="mt-2 text-muted-foreground">
          Projets, outils et réalisations en cybersécurité.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.title} className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="mt-1">
                  {project.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardContent className="pt-0">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={project.href}
                  target={project.external ? "_blank" : undefined}
                  rel={project.external ? "noopener noreferrer" : undefined}
                  className="gap-2"
                >
                  Voir le projet
                  {project.external && <ExternalLink className="size-3" />}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
