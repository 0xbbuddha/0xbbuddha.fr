"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  BookText,
  Cable,
  ChevronRight,
  Compass,
  Crosshair,
  Droplet,
  FileKey,
  FileText,
  Flag,
  GitFork,
  Github,
  Globe,
  Linkedin,
  Menu,
  Monitor,
  Network,
  PawPrint,
  ScrollText,
  Shield,
  Target,
  Terminal,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getRailContext, navigationGroups, siteProfile, socialLinks } from "@/lib/site-data";
import type { NavigationItem } from "@/lib/site-data";
import { useLanguage } from "@/components/LanguageProvider";
import type { Tr } from "@/lib/i18n";

function iconForHref(href: string) {
  // depth 0 - sections parentes
  if (href === "/") return Compass;
  if (href === "/red-team") return Target;
  if (href === "/cheatsheets") return FileText;
  if (href === "/my-tools") return Wrench;
  if (href === "/writeups/htb") return Shield;
  if (href === "/writeups/ctf") return Flag;
  if (href === "/blog") return BookText;
  // depth 1 - Red Team Notes
  if (href === "/red-team/ad-exploit") return Network;
  if (href === "/red-team/privesc-windows") return Monitor;
  if (href === "/red-team/privesc-linux") return Terminal;
  if (href === "/red-team/esc") return ScrollText;
  if (href === "/red-team/pivoting") return GitFork;
  // depth 1 - Cheatsheets
  if (href === "/cheatsheets/netexec") return Globe;
  if (href === "/cheatsheets/bloodyad") return Droplet;
  if (href === "/cheatsheets/certipy") return FileKey;
  // depth 1 - My Tools
  if (href === "/my-tools/gofenrir") return Crosshair;
  if (href === "/my-tools/bashhound-ce") return PawPrint;
  // depth 2 - Pivoting sub-pages
  if (href === "/red-team/pivoting/ligolo") return Cable;
  return null;
}

function navLabel(href: string, label: string, t: Tr): string {
  const map: Record<string, string> = {
    "/": t.nav.items.readme,
    "/red-team": t.nav.items.redTeam,
    "/cheatsheets": t.nav.items.cheatsheets,
    "/my-tools": t.nav.items.myTools,
    "/writeups/htb": t.nav.items.htb,
    "/writeups/ctf": t.nav.items.ctf,
    "/blog": t.nav.items.blog,
  };
  return map[href] ?? label;
}

function groupTitle(key: string, t: Tr): string {
  return t.nav.groups[key as keyof typeof t.nav.groups] ?? key;
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function hasActiveDescendant(item: NavigationItem, pathname: string): boolean {
  if (item.href && isActivePath(pathname, item.href)) return true;
  return item.children?.some((c) => hasActiveDescendant(c, pathname)) ?? false;
}

const DEPTH_PAD = [
  "px-2",
  "pl-5 pr-2",
  "pl-8 pr-2",
  "pl-11 pr-2",
] as const;

function NavTreeItem({
  item,
  pathname,
  depth = 0,
  onNavigate,
  t,
}: {
  item: NavigationItem;
  pathname: string;
  depth?: number;
  onNavigate?: () => void;
  t: Tr;
}) {
  const hasChildren = !!(item.children?.length);
  const isActive = !!(item.href && isActivePath(pathname, item.href));
  const isAncestor = hasChildren && hasActiveDescendant(item, pathname);
  const [open, setOpen] = useState(() => isActive || isAncestor);

  useEffect(() => {
    if (isActive || isAncestor) setOpen(true);
  }, [isActive, isAncestor]);

  const Icon = depth <= 2 ? iconForHref(item.href ?? "") : null;
  const displayLabel = depth === 0 ? navLabel(item.href ?? "", item.label, t) : item.label;
  const pad = DEPTH_PAD[Math.min(depth, 3)];

  const rowClass = cn(
    "flex w-full items-center gap-2 rounded-sm py-1.5 text-sm transition-colors",
    pad,
    isActive
      ? "bg-primary/10 text-primary"
      : isAncestor
      ? "text-foreground"
      : depth === 0
      ? "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      : "text-muted-foreground/70 hover:text-foreground"
  );

  const labelNode = (
    <>
      {Icon && <Icon className={cn("shrink-0", depth === 0 ? "size-3.5" : "size-3")} />}
      <span className="flex-1 truncate text-left">{displayLabel}</span>
      {!hasChildren && item.badge && (
        <span className="font-mono text-[10px] text-muted-foreground/60">{item.badge}</span>
      )}
    </>
  );

  return (
    <div>
      {item.href ? (
        <div className="flex items-center">
          <Link
            href={item.href}
            onClick={onNavigate}
            className={cn(rowClass, "flex-1")}
          >
            {labelNode}
          </Link>
          {hasChildren && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mr-1 rounded-sm p-1 text-muted-foreground/30 transition-colors hover:text-muted-foreground"
            >
              <ChevronRight
                className={cn("size-3 transition-transform", open && "rotate-90")}
              />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(rowClass, "cursor-pointer")}
        >
          {labelNode}
          <ChevronRight
            className={cn(
              "size-3 shrink-0 text-muted-foreground/30 transition-transform",
              open && "rotate-90"
            )}
          />
        </button>
      )}

      {hasChildren && open && (
        <div className="ml-4 border-l border-border/30">
          {item.children!.map((child) => (
            <NavTreeItem
              key={child.href ?? child.label}
              item={child}
              pathname={pathname}
              depth={depth + 1}
              onNavigate={onNavigate}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavigationContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        onClick={onNavigate}
        className="mb-6 flex items-center gap-2.5"
      >
        <Image
          src="/avatar_rounded.png"
          alt="0xbbuddha"
          width={28}
          height={28}
          className="rounded-md"
          priority
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {siteProfile.handle}
          </p>
          <p className="text-[11px] text-muted-foreground">{t.shell.knowledgeBase}</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto">
        {navigationGroups.map((group) => (
          <div key={group.titleKey}>
            <p className="mb-1 px-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
              {groupTitle(group.titleKey, t)}
            </p>
            <div className="space-y-px">
              {group.items.map((item) => (
                <NavTreeItem
                  key={item.href ?? item.label}
                  item={item}
                  pathname={pathname}
                  depth={0}
                  onNavigate={onNavigate}
                  t={t}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border pt-4">
        <div className="mb-3 flex items-center gap-3">
          {socialLinks.map((link) => {
            const Icon = link.kind === "github" ? Github : Linkedin;

            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="size-3.5" />
                {link.label}
              </a>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setLang(lang === "fr" ? "en" : "fr")}
          className="flex items-center gap-1.5 rounded-sm border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          {t.common.langToggle}
        </button>
      </div>
    </div>
  );
}

function RightRail({ pathname }: { pathname: string }) {
  const { t } = useLanguage();
  const rail = getRailContext(pathname);

  if (!rail.anchors.length && !rail.related.length) return null;

  return (
    <div className="space-y-6 text-sm">
      {rail.anchors.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
            {t.shell.onThisPage}
          </p>
          <div className="space-y-0.5">
            {rail.anchors.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronRight className="size-3 shrink-0 text-muted-foreground/40" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {rail.related.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
            {t.shell.related}
          </p>
          <div className="space-y-2">
            {rail.related.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="block truncate text-xs">{item.label}</span>
                <span className="text-[11px] text-muted-foreground/50">{item.meta}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border px-5 py-6 lg:flex lg:flex-col">
          <NavigationContent pathname={pathname} />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur-sm lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/avatar_rounded.png"
                alt="0xbbuddha"
                width={26}
                height={26}
                className="rounded-md"
                priority
              />
              <span className="text-sm font-semibold text-foreground">
                {siteProfile.handle}
              </span>
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? t.shell.closeMenu : t.shell.openMenu}
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          <main className="min-w-0">{children}</main>
        </div>

        <aside className="sticky top-0 hidden h-screen w-48 shrink-0 border-l border-border px-5 py-8 xl:block">
          <RightRail pathname={pathname} />
        </aside>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 border-r border-border bg-background px-5 py-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{t.shell.navigation}</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <NavigationContent
              pathname={pathname}
              onNavigate={() => setMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
