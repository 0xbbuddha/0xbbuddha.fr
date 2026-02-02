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
      <p className="text-muted-foreground">
        Aucun writeup pour le moment. À venir.
      </p>
    </div>
  );
}
