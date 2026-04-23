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
    "Portfolio, writeups et blog d'un étudiant en cybersécurité, organisé comme une base de connaissances personnelle.",
  icons: {
    icon: "/avatar_rounded.png",
    apple: "/avatar_rounded.png",
  },
  openGraph: {
    title: "0xbbuddha | Knowledge Base",
    description:
      "Portfolio, writeups et blog d'un étudiant en cybersécurité, organisé comme une base de connaissances personnelle.",
    images: ["/avatar.png"],
  },
  twitter: {
    card: "summary",
    title: "0xbbuddha | Knowledge Base",
    images: ["/avatar.png"],
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
