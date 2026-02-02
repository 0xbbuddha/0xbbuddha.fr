"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Briefcase, FileText, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Accueil", icon: Shield },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/writeups", label: "Writeups", icon: FileText },
  { href: "/blog", label: "Blog", icon: BookOpen },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="font-mono text-lg font-semibold tracking-tight text-primary"
        >
          0xbbuddha
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {nav.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
