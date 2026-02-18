import Link from "next/link";
import { Calendar, Lock, Eye } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const writeups = [
  {
    slug: "signed",
    title: "Signed",
    platform: "HackTheBox",
    difficulty: "Medium",
    date: "2026-02-18",
    excerpt:
      "Windows, MSSQL. Capture NTLM (xp_dirtree), crack du hash mssqlsvc, Silver Ticket pour devenir sysadmin et lire user.txt / root.txt.",
  },
  {
    slug: "overwatch",
    title: "Overwatch",
    platform: "HackTheBox",
    difficulty: "Medium",
    date: "2026-02-17",
    excerpt:
      "Windows AD. SMB guest, extraction credentials depuis overwatch.exe, MSSQL linked server, capture credentials via DNS, injection PowerShell dans service SOAP.",
    spoiler: true,
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <span className="font-mono text-primary">{w.platform}</span>
                  <span>·</span>
                  <span>{w.difficulty}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {w.date}
                  </span>
                  {w.spoiler && (
                    <>
                      <span>·</span>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary flex items-center gap-1">
                        <Eye className="size-3" />
                        Spoiler
                      </span>
                    </>
                  )}
                </div>
                <CardTitle className="mt-2">{w.title}</CardTitle>
                <CardDescription className="mt-1">{w.excerpt}</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0">
                <Link href={`/writeups/${w.slug}`} className="gap-2">
                  {w.spoiler ? (
                    <>
                      <Eye className="size-3.5" />
                      Voir le writeup
                    </>
                  ) : (
                    <>
                      <Lock className="size-3.5" />
                      Lire le writeup
                    </>
                  )}
                </Link>
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
