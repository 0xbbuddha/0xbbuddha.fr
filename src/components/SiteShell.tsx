"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowLeftRight,
  BadgeCheck,
  Ban,
  BookText,
  Bot,
  Bug,
  Cable,
  ChevronRight,
  ClipboardList,
  Clock,
  Code2,
  Cog,
  Compass,
  Cpu,
  Crosshair,
  Crown,
  Database,
  Download,
  Droplet,
  Eye,
  FileKey,
  FileText,
  Flag,
  Flame,
  Ghost,
  GitFork,
  Github,
  Globe,
  HardDrive,
  Key,
  KeyRound,
  LayoutGrid,
  Linkedin,
  Lock,
  Magnet,
  Mail,
  Menu,
  Monitor,
  Network,
  Package,
  PawPrint,
  Printer,
  Radio,
  Route,
  Scan,
  Scroll,
  ScrollText,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldOff,
  Signal,
  Layers,
  Sparkles,
  Target,
  Terminal,
  Timer,
  Trash2,
  Trophy,
  Unlock,
  Users,
  Wifi,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getRailContext, navigationGroups, siteProfile, socialLinks } from "@/lib/site-data";
import type { NavigationItem } from "@/lib/site-data";
import { useLanguage } from "@/components/LanguageProvider";
import type { Tr } from "@/lib/i18n";

function AphroditeIcon({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/aphrodite.svg" alt="Aphrodite" className={className} />
  );
}

function ArchLinuxIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M11.39.605C10.376 3.092 9.764 4.72 8.635 7.132c.693.734 1.543 1.589 2.923 2.554-1.484-.61-2.496-1.224-3.252-1.86C6.86 10.842 4.596 15.138 0 23.395c3.612-2.085 6.412-3.37 9.021-3.862a6.61 6.61 0 01-.171-1.547l.003-.115c.058-2.315 1.261-4.095 2.687-3.973 1.426.12 2.534 2.096 2.478 4.409a6.52 6.52 0 01-.146 1.243c2.58.505 5.352 1.787 8.914 3.844-.702-1.293-1.33-2.459-1.929-3.57-.943-.73-1.926-1.682-3.933-2.713 1.38.359 2.367.772 3.137 1.234-6.09-11.334-6.582-12.84-8.67-17.74z" />
    </svg>
  );
}

function iconForHref(href: string) {
  // depth 0 - sections parentes
  if (href === "/") return Compass;
  if (href === "/search") return Search;
  if (href === "/red-team") return Target;
  if (href === "/cheatsheets") return FileText;
  if (href === "/my-tools") return Wrench;
  if (href === "/writeups/htb") return Shield;
  if (href === "/writeups/ctf") return Flag;
  if (href === "/blog") return BookText;
  // depth 1 - Red Team Notes
  if (href === "/red-team/ad-exploit") return LayoutGrid;
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
  // depth 2 - AD Exploit categories
  if (href === "/red-team/ad-exploit/information-gathering") return Eye;
  if (href === "/red-team/ad-exploit/pre-exploitation") return Zap;
  if (href === "/red-team/ad-exploit/exploitation") return Bug;
  if (href === "/red-team/ad-exploit/post-exploitation") return Trophy;
  // depth 3 - Information Gathering
  if (href === "/red-team/ad-exploit/information-gathering/netexec") return Globe;
  if (href === "/red-team/ad-exploit/information-gathering/bloodyad") return Droplet;
  if (href === "/red-team/ad-exploit/information-gathering/bloodhound") return PawPrint;
  if (href === "/red-team/ad-exploit/information-gathering/password-misconfigs") return Key;
  if (href === "/red-team/ad-exploit/information-gathering/laps-enum") return Lock;
  if (href === "/red-team/ad-exploit/information-gathering/kerberos-auth") return Clock;
  if (href === "/red-team/ad-exploit/information-gathering/pre-win2000") return Archive;
  if (href === "/red-team/ad-exploit/information-gathering/maq-abuse") return Cpu;
  if (href === "/red-team/ad-exploit/information-gathering/linux-ad") return Terminal;
  // depth 3 - Pré-accès
  if (href === "/red-team/ad-exploit/pre-exploitation/relay-attacks") return Radio;
  if (href === "/red-team/ad-exploit/pre-exploitation/phishing") return Mail;
  if (href === "/red-team/ad-exploit/pre-exploitation/network-attacks") return Wifi;
  if (href === "/red-team/ad-exploit/pre-exploitation/wsus") return Download;
  if (href === "/red-team/ad-exploit/pre-exploitation/exchange") return Server;
  if (href === "/red-team/ad-exploit/pre-exploitation/password-misconfigs") return Key;
  if (href === "/red-team/ad-exploit/pre-exploitation/coercion") return Magnet;
  // depth 3 - Exploitation
  if (href === "/red-team/ad-exploit/exploitation/credential-attacks") return Lock;
  if (href === "/red-team/ad-exploit/exploitation/kerberos-attacks") return Key;
  if (href === "/red-team/ad-exploit/exploitation/delegation-attacks") return ArrowLeftRight;
  if (href === "/red-team/ad-exploit/exploitation/domain-privesc") return Crown;
  if (href === "/red-team/ad-exploit/exploitation/bloodyad-attacks") return Droplet;
  if (href === "/red-team/ad-exploit/exploitation/acl-gpo") return Shield;
  if (href === "/red-team/ad-exploit/exploitation/acl-gpo/acl-abuse") return ShieldAlert;
  if (href === "/red-team/ad-exploit/exploitation/acl-gpo/adcs-attacks") return FileKey;
  if (href === "/red-team/ad-exploit/exploitation/backup-operator") return Archive;
  if (href === "/red-team/ad-exploit/exploitation/mssql-attacks") return Database;
  if (href === "/red-team/ad-exploit/exploitation/applocker-wdac") return Ban;
  if (href === "/red-team/ad-exploit/exploitation/laps-abuse") return Unlock;
  if (href === "/red-team/ad-exploit/exploitation/process-injection") return Activity;
  if (href === "/red-team/ad-exploit/exploitation/maq-abuse") return Cpu;
  if (href === "/red-team/ad-exploit/exploitation/account-operators") return Users;
  if (href === "/red-team/ad-exploit/exploitation/print-server-operators") return Printer;
  if (href === "/red-team/ad-exploit/exploitation/ad-recycle-bin") return Trash2;
  if (href === "/red-team/ad-exploit/exploitation/dns-admins") return Network;
  if (href === "/red-team/ad-exploit/exploitation/gpo-abuse") return Settings;
  if (href === "/red-team/ad-exploit/exploitation/misc-cves") return AlertTriangle;
  // depth 3 - Post-accès
  if (href === "/red-team/ad-exploit/post-exploitation/lateral-movement") return ArrowLeftRight;
  if (href === "/red-team/ad-exploit/post-exploitation/procedures") return ClipboardList;
  if (href === "/red-team/ad-exploit/post-exploitation/win-privesc") return Zap;
  // depth 4 - PrivEsc Windows
  if (href === "/red-team/ad-exploit/post-exploitation/win-privesc/potato-attacks") return Flame;
  if (href === "/red-team/ad-exploit/post-exploitation/win-privesc/credential-dumping") return Database;
  if (href === "/red-team/ad-exploit/post-exploitation/win-privesc/local-privesc") return Crown;
  if (href === "/red-team/ad-exploit/post-exploitation/win-privesc/server-operators") return Server;
  if (href === "/red-team/ad-exploit/post-exploitation/win-privesc/dns-admins") return Globe;
  if (href === "/red-team/ad-exploit/post-exploitation/win-privesc/ad-recycle-bin") return Trash2;
  // depth 2 - Privesc Windows
  if (href === "/red-team/privesc-windows/local-enum") return Scan;
  if (href === "/red-team/privesc-windows/credential-access") return KeyRound;
  if (href === "/red-team/privesc-windows/credential-dumping") return HardDrive;
  if (href === "/red-team/privesc-windows/privilege-abuse") return ShieldOff;
  if (href === "/red-team/privesc-windows/service-abuse") return Cog;
  // depth 2 - Privesc Linux
  if (href === "/red-team/privesc-linux/privilege-paths") return Route;
  if (href === "/red-team/privesc-linux/sudo-suid") return Terminal;
  if (href === "/red-team/privesc-linux/capabilities-cron") return Timer;
  if (href === "/red-team/privesc-linux/docker-privesc") return Package;
  // depth 2 - ESC
  if (href === "/red-team/esc/abuse-paths") return ShieldOff;
  if (href === "/red-team/esc/esc1-esc2") return BadgeCheck;
  if (href === "/red-team/esc/shadow-credentials") return Ghost;
  // depth 2 - Pivoting sub-pages
  if (href === "/red-team/pivoting/ligolo") return Cable;
  // C2
  if (href === "/red-team/c2") return Signal;
  if (href === "/red-team/c2/mythic") return Bot;
  if (href === "/red-team/c2/mythic/agents") return Layers;
  if (href === "/red-team/c2/mythic/agents/aphrodite") return AphroditeIcon;
  // Pentest Web
  if (href === "/red-team/pentest-web") return Code2;
  // Arch Linux
  if (href === "/arch-linux") return ArchLinuxIcon;
  if (href === "/arch-linux/pacman") return Package;
  if (href === "/arch-linux/zram") return HardDrive;
  if (href === "/arch-linux/grub-rescue") return Wrench;
  if (href === "/arch-linux/kernel-recovery") return AlertTriangle;
  if (href === "/arch-linux/hp-printer") return Printer;
  // writeup leaf pages
  if (href.startsWith("/writeups/")) return Scroll;
  return null;
}

function navLabel(href: string, label: string, t: Tr): string {
  const map: Record<string, string> = {
    "/": t.nav.items.readme,
    "/search": t.nav.items.search,
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

  const Icon = iconForHref(item.href ?? "");
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
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border px-5 py-6 lg:flex lg:flex-col">
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

          <main key={pathname} className="min-w-0 animate-page-in">{children}</main>
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
          <div className="absolute left-0 top-0 h-full w-72 border-r border-border bg-background px-5 py-6 shadow-2xl">
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
