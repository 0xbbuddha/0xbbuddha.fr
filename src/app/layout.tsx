import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";
import { LanguageProvider } from "@/components/LanguageProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://0xbbuddha.fr"),
  title: "0xbbuddha | Knowledge Base",
  description:
    "Portfolio, writeups et blog d'un étudiant en cybersécurité - Red Team tooling, SOC & détection, Active Directory.",
  icons: {
    icon: "/avatar_rounded.png",
    apple: "/avatar_rounded.png",
  },
  openGraph: {
    type: "website",
    siteName: "0xbbuddha",
    title: "0xbbuddha | Knowledge Base",
    description:
      "Portfolio, writeups et blog d'un étudiant en cybersécurité - Red Team tooling, SOC & détection, Active Directory.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "0xbbuddha" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "0xbbuddha | Knowledge Base",
    description:
      "Portfolio, writeups et blog d'un étudiant en cybersécurité - Red Team tooling, SOC & détection, Active Directory.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans" suppressHydrationWarning>
        <LanguageProvider>
          <SiteShell>{children}</SiteShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
