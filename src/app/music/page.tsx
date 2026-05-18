"use client";

import { useEffect, useState } from "react";
import { Music } from "lucide-react";

const LASTFM_USER = "kikilahess";
const LASTFM_KEY = "7d89c93e907e5e5a5d03ceaef313168f";
const API_URL = `https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${LASTFM_USER}&period=1month&limit=4&api_key=${LASTFM_KEY}&format=json`;
const LASTFM_PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f";

interface Track {
  name: string;
  artist: { name: string };
  playcount: string;
  url: string;
  image: Array<{ "#text": string; size: string }>;
}

interface EnrichedTrack extends Track {
  albumArt: string;
}

async function fetchItunesArt(artist: string, track: string): Promise<string> {
  const query = encodeURIComponent(`${artist} ${track}`);
  const res = await fetch(
    `https://itunes.apple.com/search?term=${query}&entity=song&limit=1&media=music`
  );
  const data = await res.json();
  const raw: string = data.results?.[0]?.artworkUrl100 ?? "";
  return raw ? raw.replace("100x100bb", "174x174bb") : "";
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-5 border-b border-border animate-pulse">
      <div className="w-5 shrink-0" />
      <div className="w-12 h-12 rounded bg-muted shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-2/5" />
        <div className="h-3 bg-muted rounded w-1/4" />
      </div>
      <div className="space-y-1 text-right">
        <div className="h-3 bg-muted rounded w-8 ml-auto" />
        <div className="h-2 bg-muted rounded w-6 ml-auto" />
      </div>
    </div>
  );
}

export default function MusicPage() {
  const [tracks, setTracks] = useState<EnrichedTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then(async (data) => {
        const raw: Track[] = data.toptracks?.track ?? [];
        const enriched = await Promise.all(
          raw.map(async (track) => {
            const lastfmImg =
              track.image.find((img) => img.size === "large")?.["#text"] ?? "";
            const hasRealArt = lastfmImg && !lastfmImg.includes(LASTFM_PLACEHOLDER);
            const albumArt = hasRealArt
              ? lastfmImg
              : await fetchItunesArt(track.artist.name, track.name).catch(() => "");
            return { ...track, albumArt };
          })
        );
        setTracks(enriched);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-mono uppercase tracking-widest text-primary">
          Music
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Top tracks
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Ce que je tourne en boucle en ce moment.
        </p>
      </header>

      <div className="divide-y divide-border">
        {loading && [1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}

        {error && (
          <p className="py-6 font-mono text-sm text-muted-foreground">
            Impossible de charger les donnees Last.fm.
          </p>
        )}

        {!loading && !error && tracks.length === 0 && (
          <p className="py-6 font-mono text-sm text-muted-foreground">
            Aucun scrobble ce mois-ci.
          </p>
        )}

        {!loading &&
          !error &&
          tracks.map((track, i) => (
            <a
              key={`${track.name}-${i}`}
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 py-5 -mx-2 px-2 rounded transition-colors hover:bg-muted/20"
            >
              <span className="w-5 shrink-0 text-right font-mono text-xs text-muted-foreground/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              {track.albumArt ? (
                <img
                  src={track.albumArt}
                  alt={track.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded border border-border object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-border bg-muted">
                  <Music className="size-5 text-muted-foreground/40" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  {track.name}
                </p>
                <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                  {track.artist.name}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-xs text-primary">{track.playcount}</p>
                <p className="font-mono text-[10px] text-muted-foreground/40">plays</p>
              </div>
            </a>
          ))}
      </div>

      <footer className="mt-8 border-t border-border pt-4">
        <p className="font-mono text-[10px] text-muted-foreground/40">
          via Last.fm -{" "}
          <a
            href={`https://www.last.fm/user/${LASTFM_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground transition-colors"
          >
            {LASTFM_USER}
          </a>{" "}
          - periode : 1 mois
        </p>
      </footer>
    </div>
  );
}
