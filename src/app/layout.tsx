import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://0xbbuddha.fr"),
  title: "Home | 0xbbuddha",
  description:
    "Portfolio, writeups et blog d'un étudiant en cybersécurité et alternant en SOC Engineer chez Aukfood.",
  icons: {
    icon: "/avatar_rounded.png",
    apple: "/avatar_rounded.png",
  },
  openGraph: {
    title: "Home | 0xbbuddha",
    description:
      "Portfolio, writeups et blog d'un étudiant en cybersécurité et alternant en SOC Engineer chez Aukfood.",
    images: ["/avatar.png"],
  },
  twitter: {
    card: "summary",
    title: "Home | 0xbbuddha",
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans flex flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
