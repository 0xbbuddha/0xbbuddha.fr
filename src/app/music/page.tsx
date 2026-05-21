"use client";

import { useEffect, useState } from "react";
import { Music } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const LASTFM_USER = "kikilahess";
const LASTFM_KEY = "7d89c93e907e5e5a5d03ceaef313168f";
const BASE = `https://ws.audioscrobbler.com/2.0/?user=${LASTFM_USER}&period=1month&api_key=${LASTFM_KEY}&format=json`;
const TRACKS_URL = `${BASE}&method=user.getTopTracks&limit=4`;
const ARTISTS_URL = `${BASE}&method=user.getTopArtists&limit=3`;
const LASTFM_PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f";

interface Track {
  name: string;
  artist: { name: string };
  playcount: string;
  url: string;
  image: Array<{ "#text": string; size: string }>;
}

interface Artist {
  name: string;
  playcount: string;
  url: string;
}

interface EnrichedArtist extends Artist {
  art: string;
}

interface EnrichedTrack extends Track {
  albumArt: string;
}

type LastfmImage = { "#text": string; size: string };

function artUrl(raw: string): string {
  return raw.replace(/\d+x\d+bb/, "400x400bb");
}

function artistMatch(a: string, b: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return norm(a).includes(norm(b)) || norm(b).includes(norm(a));
}

function bestLastfmImage(images: LastfmImage[]): string {
  const img =
    images.find((i) => i.size === "extralarge")?.["#text"] ||
    images.find((i) => i.size === "large")?.["#text"] ||
    "";
  return img && !img.includes(LASTFM_PLACEHOLDER) ? img : "";
}

async function fetchLastfmTrackArt(artist: string, track: string): Promise<string> {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`;
  const data = await fetch(url).then((r) => r.json());
  return bestLastfmImage(data.track?.album?.image ?? []);
}

async function fetchLastfmArtistArt(artist: string): Promise<string> {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${encodeURIComponent(artist)}&api_key=${LASTFM_KEY}&format=json`;
  const data = await fetch(url).then((r) => r.json());
  return bestLastfmImage(data.artist?.image ?? []);
}

async function fetchAudioDBArtistArt(artist: string): Promise<string> {
  const data = await fetch(
    `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artist)}`
  ).then((r) => r.json());
  return data.artists?.[0]?.strArtistThumb ?? "";
}

async function fetchItunesArt(artist: string, track: string): Promise<string> {
  const query = encodeURIComponent(`${artist} ${track}`);
  const data = await fetch(
    `https://itunes.apple.com/search?term=${query}&entity=song&limit=10&media=music`
  ).then((r) => r.json());
  const results: Array<{ artistName: string; artworkUrl100: string }> = data.results ?? [];
  const match = results.find((r) => artistMatch(r.artistName, artist)) ?? results[0];
  return match?.artworkUrl100 ? artUrl(match.artworkUrl100) : "";
}

async function fetchItunesArtistArt(artist: string): Promise<string> {
  const data = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=song&limit=10&media=music`
  ).then((r) => r.json());
  const results: Array<{ artistName: string; artworkUrl100: string }> = data.results ?? [];
  const match = results.find((r) => artistMatch(r.artistName, artist)) ?? results[0];
  return match?.artworkUrl100 ? artUrl(match.artworkUrl100) : "";
}

function TrackSkeleton() {
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

function ArtistSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border animate-pulse">
      <div className="w-5 shrink-0" />
      <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="ml-auto h-3 bg-muted rounded w-12" />
    </div>
  );
}

export default function MusicPage() {
  const { lang } = useLanguage();
  const [tracks, setTracks] = useState<EnrichedTrack[]>([]);
  const [artists, setArtists] = useState<EnrichedArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([fetch(TRACKS_URL).then((r) => r.json()), fetch(ARTISTS_URL).then((r) => r.json())])
      .then(async ([tracksData, artistsData]) => {
        const rawTracks: Track[] = tracksData.toptracks?.track ?? [];
        const enriched = await Promise.all(
          rawTracks.map(async (track) => {
            const toplistImg = bestLastfmImage(track.image);
            const albumArt =
              toplistImg ||
              (await fetchLastfmTrackArt(track.artist.name, track.name).catch(() => "")) ||
              (await fetchItunesArt(track.artist.name, track.name).catch(() => ""));
            return { ...track, albumArt };
          })
        );
        const rawArtists: Artist[] = artistsData.topartists?.artist ?? [];
        const enrichedArtists = await Promise.all(
          rawArtists.map(async (artist) => {
            const art =
              (await fetchLastfmArtistArt(artist.name).catch(() => "")) ||
              (await fetchAudioDBArtistArt(artist.name).catch(() => "")) ||
              (await fetchItunesArtistArt(artist.name).catch(() => ""));
            return { ...artist, art };
          })
        );
        setTracks(enriched);
        setArtists(enrichedArtists);
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
          {lang === "fr" ? "Ce que je tourne en boucle en ce moment." : "What I have on repeat right now."}
        </p>
      </header>

      {error && (
        <p className="py-6 font-mono text-sm text-muted-foreground">
          {lang === "fr" ? "Impossible de charger les données Last.fm." : "Could not load Last.fm data."}
        </p>
      )}

      {/* Tracks */}
      <div className="divide-y divide-border">
        {loading && [1, 2, 3, 4].map((i) => <TrackSkeleton key={i} />)}

        {!loading && !error && tracks.length === 0 && (
          <p className="py-6 font-mono text-sm text-muted-foreground">
            {lang === "fr" ? "Aucun scrobble ce mois-ci." : "No scrobbles this month."}
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

      {/* Artists */}
      <div className="mt-10">
        <p className="mb-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground/50">
          {lang === "fr" ? "Top artistes" : "Top artists"}
        </p>
        <div className="divide-y divide-border">
          {loading && [1, 2, 3].map((i) => <ArtistSkeleton key={i} />)}

          {!loading &&
            !error &&
            artists.map((artist, i) => (
              <a
                key={`${artist.name}-${i}`}
                href={artist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 py-3 -mx-2 px-2 rounded transition-colors hover:bg-muted/20"
              >
                <span className="w-5 shrink-0 text-right font-mono text-xs text-muted-foreground/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {artist.art ? (
                  <img
                    src={artist.art}
                    alt={artist.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                    <Music className="size-4 text-muted-foreground/40" />
                  </div>
                )}
                <span className="flex-1 truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  {artist.name}
                </span>
                <span className="shrink-0 font-mono text-xs text-primary">
                  {artist.playcount}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground/40">
                  plays
                </span>
              </a>
            ))}
        </div>
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
          - {lang === "fr" ? "periode : 1 mois" : "period: 1 month"}
        </p>
      </footer>
    </div>
  );
}
