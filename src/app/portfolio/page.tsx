import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PortfolioProjects } from "@/components/PortfolioProjects";

const projects = [
  {
    title: "ArchimedeaOS",
    description:
      "Distribution Arch Linux dédiée au Purple Team. Environnement de sécurité unifié pour exercices red/blue.",
    tags: ["Purple Team", "Arch Linux", "Distribution"],
    href: "https://github.com/ArchimedeaOS-Development",
    external: true,
  },
  {
    title: "Nihil",
    description:
      "Environnement de pentest complet (TheNullPigeons). Images Docker et stack pour tests d’intrusion.",
    tags: ["Pentest", "Docker", "Python"],
    href: "https://github.com/TheNullPigeons",
    external: true,
  },
  {
    title: "BashHound-CE",
    description:
      "Collecteur de données Active Directory pour BloodHound Community Edition, écrit en Bash.",
    tags: ["BloodHound", "AD", "Bash", "Red Team"],
    href: "https://github.com/0xbbuddha/BashHound-CE",
    external: true,
  },
  {
    title: "Hermes",
    description:
      "Agent Mythic C2 ciblant Linux, écrit en Python. Check-in, tasking et commandes (shell, upload, download…).",
    tags: ["Mythic C2", "Python", "Red Team"],
    href: "https://github.com/0xbbuddha/hermes",
    external: true,
  },
  {
    title: "PantheonLab",
    description:
      "Lab immersif AD + Linux sur le thème de la mythologie grecque. Documentation, writeups et déploiement Ansible/Vagrant.",
    tags: ["Lab", "Active Directory", "Vagrant", "Ansible"],
    href: "https://0xbbuddha.github.io/pantheon-lab.github.io/index.html",
    external: true,
  },
  {
    title: "FreeMalwares",
    description:
      "Projet en C : outil de génération de binaires malveillants pour étudier obfuscation et techniques d'évasion en conditions contrôlées. Usage strictement pédagogique.",
    tags: ["C", "Maldev", "Éducatif"],
    href: "https://github.com/FreeMalwares",
    external: true,
  },
];

const skillCategories = [
  {
    title: "SOC & Détection",
    items: ["Wazuh", "CrowdSec", "SIEM", "Alerting", "Incident Response"],
  },
  {
    title: "Pentest & Offensive Web",
    items: ["Reconnaissance", "Énumération", "Exploitation", "Post-exploitation"],
  },
  {
    title: "Pentest & Offensive AD",
    items: ["Reconnaissance", "Énumération AD", "Accès initial", "Privesc", "Persistance"],
  },
  {
    title: "Système & Réseau",
    items: ["Linux", "Shell", "Docker", "Vagrant", "Ansible", "Réseau"],
  },
  {
    title: "Langages & Outils",
    items: ["Python", "C", "Bash", "Go", "CMake","Git"],
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

      <section className="mb-16">
        <Suspense
          fallback={
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
          }
        >
          <PortfolioProjects projects={projects} />
        </Suspense>
      </section>

      <section>
        <h2 className="mb-6 font-mono text-2xl font-semibold">
          Compétences
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader className="pb-2">
                <CardTitle className="font-mono text-base">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
