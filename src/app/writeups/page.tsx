import Link from "next/link";
import { Calendar, Lock } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Données d'exemple – à remplacer par tes writeups (HTB, THM, etc.)
const writeups = [
  {
    slug: "machine-htb-exemple",
    title: "Machine HackTheBox – Exemple",
    platform: "HackTheBox",
    difficulty: "Medium",
    date: "2025-01-15",
    excerpt:
      "Résolution pas à pas : énumération, exploitation et élévation de privilèges.",
  },
  {
    slug: "room-thm-exemple",
    title: "Room TryHackMe – Exemple",
    platform: "TryHackMe",
    difficulty: "Easy",
    date: "2025-01-10",
    excerpt:
      "Walkthrough d'une room orientée web et Linux.",
  },
  {
    slug: "ctf-writeup",
    title: "CTF – Challenge Web",
    platform: "CTF",
    difficulty: "Hard",
    date: "2024-12-20",
    excerpt:
      "Exploitation d'une vulnérabilité XXE et bypass de filtres.",
  },
];

export const metadata = {
  title: "Writeups | 0xbbuddha",
  description: "Writeups de machines HackTheBox, TryHackMe et CTF.",
};

export default function WriteupsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
          Writeups
        </h1>
        <p className="mt-2 text-muted-foreground">
          Résolutions détaillées de machines et challenges (HTB, THM, Root-Me, CTF).
        </p>
      </div>

      <div className="space-y-6">
        {writeups.map((w) => (
          <Card key={w.slug} className="overflow-hidden">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-mono text-primary">{w.platform}</span>
                  <span>·</span>
                  <span>{w.difficulty}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {w.date}
                  </span>
                </div>
                <CardTitle className="mt-2">{w.title}</CardTitle>
                <CardDescription className="mt-1">{w.excerpt}</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0">
                <Link href={`/writeups/${w.slug}`} className="gap-2">
                  <Lock className="size-3.5" />
                  Lire le writeup
                </Link>
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
