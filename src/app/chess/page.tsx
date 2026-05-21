"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const CHESS_USER = "EnPassantRoot";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
};
const GAME_COUNT = 60;

async function fetchRapidRatings(): Promise<number[]> {
  const archivesRes = await fetch(
    `https://api.chess.com/pub/player/${CHESS_USER.toLowerCase()}/games/archives`,
    { headers: HEADERS }
  );
  const archivesData = await archivesRes.json();
  const archives: string[] = [...(archivesData.archives ?? [])].reverse();

  const ratings: number[] = [];
  for (const url of archives) {
    if (ratings.length >= GAME_COUNT) break;
    const gamesRes = await fetch(url, { headers: HEADERS });
    const gamesData = await gamesRes.json();
    const games: unknown[] = [...(gamesData.games ?? [])].reverse();
    for (const g of games) {
      if (ratings.length >= GAME_COUNT) break;
      const game = g as Record<string, unknown>;
      if (game.time_class !== "rapid" || game.rules !== "chess") continue;
      const white = game.white as Record<string, unknown>;
      const black = game.black as Record<string, unknown>;
      const color =
        (white.username as string).toLowerCase() === CHESS_USER.toLowerCase()
          ? white
          : black;
      ratings.push(color.rating as number);
    }
  }
  return ratings.reverse();
}

function SparklineChart({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const W = 600;
  const H = 120;
  const pad = { t: 12, r: 8, b: 12, l: 8 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;

  const minR = Math.min(...data);
  const maxR = Math.max(...data);
  const range = maxR - minR || 1;

  const pts = data
    .map((r, i) => {
      const x = pad.l + (i / (data.length - 1)) * iW;
      const y = pad.t + ((maxR - r) / range) * iH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const lastX = pad.l + iW;
  const lastY = pad.t + ((maxR - data[data.length - 1]) / range) * iH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden>
      <polyline
        points={pts}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx={lastX} cy={lastY} r="3.5" fill="hsl(var(--primary))" />
    </svg>
  );
}

export default function ChessPage() {
  const { lang } = useLanguage();
  const [ratings, setRatings] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRapidRatings()
      .then((r) => {
        setRatings(r);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const current = ratings[ratings.length - 1];
  const best = ratings.length > 0 ? Math.max(...ratings) : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          Chess
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Rapid rating
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {lang === "fr" ? "Pas terrible, pas catastrophique." : "Not great, not terrible."}
        </p>
      </header>

      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-muted rounded w-24" />
          <div className="h-32 bg-muted rounded w-full" />
        </div>
      )}

      {error && (
        <p className="py-6 font-mono text-sm text-muted-foreground">
          {lang === "fr" ? "Impossible de charger les données Chess.com." : "Could not load Chess.com data."}
        </p>
      )}

      {!loading && !error && ratings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-4xl font-semibold text-foreground">
              {current}
            </span>
            {best && best > current && (
              <span className="font-mono text-xs text-muted-foreground/50">
                best {best}
              </span>
            )}
          </div>

          <div className="rounded-lg border border-border bg-card/40 p-4">
            <SparklineChart data={ratings} />
            <p className="mt-2 text-right font-mono text-[10px] text-muted-foreground/40">
              {ratings.length} {lang === "fr" ? "parties rapides" : "rapid games"}
            </p>
          </div>
        </div>
      )}

      {!loading && !error && ratings.length === 0 && (
        <p className="py-6 font-mono text-sm text-muted-foreground">
          {lang === "fr" ? "Aucune partie rapide trouvée." : "No rapid games found."}
        </p>
      )}

      <footer className="mt-8 border-t border-border pt-4">
        <p className="font-mono text-[10px] text-muted-foreground/40">
          via Chess.com -{" "}
          <a
            href={`https://www.chess.com/member/${CHESS_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground transition-colors"
          >
            {CHESS_USER}
          </a>
        </p>
      </footer>
    </div>
  );
}
