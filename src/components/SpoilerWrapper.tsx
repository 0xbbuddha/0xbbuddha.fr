"use client";

import { useState } from "react";
import { AlertTriangle, Lock, X, Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpoilerWrapperProps {
  children: React.ReactNode;
  machineName: string;
  unlockCode?: string; // Code secret en clair (pour usage simple)
  unlockCodeHash?: string; // Hash SHA-256 du code secret (pour sécurité, pas dans le repo)
}

async function sha256(message: string): Promise<string> {
  const normalized = message.toLowerCase().trim();
  // crypto.subtle n'existe qu'en contexte sécurisé (HTTPS ou localhost).
  // En HTTP sur une IP LAN il est undefined : on bascule sur une impl pure JS.
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(normalized);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return sha256Fallback(normalized);
}

// SHA-256 pur JS (fallback contexte non sécurisé). Testé contre les vecteurs FIPS.
function sha256Fallback(ascii: string): string {
  const bytes = new TextEncoder().encode(ascii);
  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
  const l = bytes.length;
  const bitLen = l * 8;
  const withOne = l + 1;
  const pad = (56 - (withOne % 64) + 64) % 64;
  const total = withOne + pad + 8;
  const buf = new Uint8Array(total);
  buf.set(bytes);
  buf[l] = 0x80;
  const dv = new DataView(buf.buffer);
  dv.setUint32(total - 4, bitLen >>> 0, false);
  dv.setUint32(total - 8, Math.floor(bitLen / 0x100000000), false);
  const w = new Uint32Array(64);
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));
  for (let i = 0; i < total; i += 64) {
    for (let t = 0; t < 16; t++) w[t] = dv.getUint32(i + t * 4, false);
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
      const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[t] + w[t]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + temp1) >>> 0;
      d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
    }
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
  }
  const toHex = (x: number) => (x >>> 0).toString(16).padStart(8, "0");
  return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4) + toHex(h5) + toHex(h6) + toHex(h7);
}

export function SpoilerWrapper({
  children,
  machineName,
  unlockCode,
  unlockCodeHash,
}: SpoilerWrapperProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleUnlock = async () => {
    if (!code.trim()) return;
    setChecking(true);

    let isValid = false;
    if (unlockCode) {
      // Mode simple : comparaison directe
      isValid = code.trim().toLowerCase() === unlockCode.toLowerCase();
    } else if (unlockCodeHash) {
      // Mode sécurisé : comparaison via hash
      const hash = await sha256(code);
      isValid = hash === unlockCodeHash;
    }

    if (isValid) {
      setRevealed(true);
      setError(false);
    } else {
      setError(true);
      setCode("");
    }
    setChecking(false);
  };

  if (revealed) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-lg border-2 border-dashed border-primary/30 bg-card/50 p-8">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Shield className="size-8 text-primary" />
          <AlertTriangle className="size-8 text-primary" />
        </div>
        <div className="space-y-3">
          <h3 className="font-mono text-xl font-semibold text-primary flex items-center justify-center gap-2">
            <Lock className="size-5" />
            Writeup Protégé
          </h3>
          <p className="text-sm text-muted-foreground">
            Cette machine <strong>{machineName}</strong> n&apos;est pas encore retirée de HackTheBox.
          </p>
          <p className="text-xs text-muted-foreground">
            Le writeup est masqué pour respecter les règles HTB. Pour le déverrouiller, il faut connaître le code secret.
          </p>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUnlock();
                }
              }}
              placeholder="Code secret..."
              className={`w-full pl-10 pr-10 py-2 rounded-md border bg-background font-mono text-sm ${
                error
                  ? "border-destructive focus:border-destructive focus:ring-destructive"
                  : "border-border focus:border-primary focus:ring-primary"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background`}
            />
            {code && (
              <button
                onClick={() => {
                  setCode("");
                  setError(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Effacer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          {error && (
            <p className="text-xs text-destructive font-mono flex items-center justify-center gap-1">
              <X className="size-3.5" />
              Code incorrect. Réessayer.
            </p>
          )}
          <Button
            onClick={handleUnlock}
            disabled={!code.trim() || checking}
            variant="outline"
            className="gap-2 font-mono w-full"
          >
            <Lock className="size-4" />
            {checking ? "Vérification..." : "Déverrouiller"}
          </Button>
        </div>
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md p-3 border border-border">
          <Info className="size-4 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold">Indice :</span> Le code secret correspond au flag root.txt de cette machine. Si tu as déjà résolu la machine, tu connais ce code.
          </p>
        </div>
      </div>
    </div>
  );
}
