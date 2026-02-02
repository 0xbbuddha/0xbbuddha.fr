import Link from "next/link";
import { ArrowRight, Briefcase, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-4 font-mono text-sm text-primary">
          Cybersécurité · Pentest · Red Team
        </p>
        <h1 className="mb-6 font-mono text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          0xbbuddha
        </h1>
        <p className="mb-10 text-lg text-muted-foreground">
          Passionné par la cybersécurité offensive, l&apos;administration
          système et réseau. Je partage ici mon portfolio, mes writeups et des
          articles sur la sécurité informatique.
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
        <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
          <p className="leading-relaxed">
            Je me forme en autodidacte via des plateformes comme HackTheBox,
            PortSwigger, Root-Me et TryHackMe. Ce site regroupe mes projets,
            writeups de machines CTF et réflexions sur la cybersécurité.
          </p>
        </div>
      </section>
    </div>
  );
}
