import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Briefcase, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <section className="mx-auto max-w-3xl text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="/avatar.png"
            alt="Photo de profil - Killian 0xbbuddha Prin-Abeil"
            width={160}
            height={160}
            className="rounded-full border-2 border-primary/30 object-cover shadow-lg"
            priority
          />
        </div>
        <p className="mb-4 font-mono text-sm text-primary">
          SOC · Pentest · Red Team
        </p>
        <h1 className="mb-6 font-mono text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Killian &apos;0xbbuddha&apos; Prin-Abeil
        </h1>
        <p className="mb-10 text-lg text-muted-foreground">
          Étudiant en 1ère année de Mastère à Oteria et Alternant en SOC
          Engineer chez Aukfood.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/portfolio">
              <Briefcase className="size-4" />
              Voir le portfolio
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/writeups">
              <FileText className="size-4" />
              Writeups
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="gap-2">
            <Link href="/blog">
              <BookOpen className="size-4" />
              Blog
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-3xl">
        <h2 className="mb-6 font-mono text-2xl font-semibold">
          Profil
        </h2>
        <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground space-y-4">
          <p className="leading-relaxed">
            Passionné de cybersécurité, notamment de sécurité offensive ainsi
            que l&apos;administration système.
          </p>
          <p className="leading-relaxed">
            Contributeur open-source, notamment sur des projets comme Wazuh,
            CrowdSec, BlackArch, etc.
          </p>
          <p className="leading-relaxed">
            Formation en continu sur des plateformes de pentest et CTF
            (HackTheBox, TryHackMe, PortSwigger, Root-Me).
          </p>
        </div>
      </section>
    </div>
  );
}
