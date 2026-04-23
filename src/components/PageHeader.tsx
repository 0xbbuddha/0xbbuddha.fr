import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type PageStat = {
  label: string;
  value: string;
};

interface PageHeaderProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  stats?: PageStat[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  id,
  eyebrow,
  title,
  description,
  breadcrumbs,
  stats,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      id={id}
      className={`mb-8 border-b border-border pb-6 ${className ?? ""}`}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground/70">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="size-3 text-muted-foreground/40" />
              )}
            </span>
          ))}
        </nav>
      )}

      {eyebrow && (
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
      )}

      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>

      <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>

      {stats && stats.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
          {stats.map((stat) => (
            <div key={stat.label} className="text-xs text-muted-foreground">
              <span className="text-muted-foreground/60">{stat.label}: </span>
              <span>{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
