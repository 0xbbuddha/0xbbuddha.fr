"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function PivotingPage() {
  const { lang } = useLanguage();
  const sections = [
    {
      href: "/red-team/pivoting/ligolo",
      name: "Ligolo-NG",
      description:
        lang === "fr"
          ? "Tunnel TUN kernel-space, routing de subnets internes et double pivot."
          : "Kernel-space TUN tunnel, internal subnet routing and double pivot.",
    },
    {
      href: "/red-team/pivoting/multi-hop",
      name: "Multi-Hop",
      description:
        lang === "fr"
          ? "Double/triple pivot Ligolo-ng, Sliver et SSH, et filtrage par IP source."
          : "Double/triple pivot with Ligolo-ng, Sliver and SSH, and source-IP filtering.",
    },
    {
      href: "/red-team/pivoting/chisel",
      name: "Chisel",
      description:
        lang === "fr"
          ? "Tunnel HTTP/SOCKS quand ligolo n'est pas une option (pas de TUN, environnement restreint)."
          : "HTTP/SOCKS tunnel when ligolo isn't an option (no TUN, restricted environment).",
    },
    {
      href: "/red-team/pivoting/sliver",
      name: "Sliver C2",
      description:
        lang === "fr"
          ? "Pivoting via les implants Sliver : portfwd, SOCKS et mesh entre agents."
          : "Pivoting via Sliver implants: portfwd, SOCKS and mesh between agents.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          Red Team Notes
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Pivoting
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr"
            ? "Techniques de pivot réseau : tunnels, routing de subnets internes, double pivot."
            : "Network pivoting techniques: tunnels, internal subnet routing and double pivoting."}
        </p>
      </header>

      <div className="divide-y divide-border">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex items-start gap-4 py-5"
          >
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 font-mono text-xs text-primary">{section.name}</p>
              <p className="text-xs leading-6 text-muted-foreground">{section.description}</p>
            </div>
            <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
