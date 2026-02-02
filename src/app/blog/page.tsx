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
      <p className="text-muted-foreground">
        Aucun article pour le moment. À venir.
      </p>
    </div>
  );
}
