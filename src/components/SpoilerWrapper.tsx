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
  const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
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
