# 0xbbuddha.fr

Portfolio personnel orienté cybersécurité : portfolio, writeups et blog. Construit avec **Next.js 15**, **Tailwind CSS** et **shadcn/ui**.

## Fonctionnalités

- **Accueil** : présentation et liens vers portfolio, writeups et blog
- **Portfolio** : projets et réalisations (pentest, outils, labs)
- **Writeups** : résolutions de machines HTB, THM, Root-Me, CTF
- **Blog** : articles et notes sur la cybersécurité

## Démarrage

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Stack

- [Next.js 15](https://nextjs.org/) (App Router).  
  Si tu vois le warning « Mismatching @next/swc version » au build : c’est un décalage connu entre Next.js 15.5.11 et les paquets @next/swc (15.5.7). Tu peux l’ignorer en attendant une future release Next qui alignera les versions.
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Button, Card, etc.)
- Polices : [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), [JetBrains Mono](https://www.jetbrains.com/lp/mono/)

## Personnalisation

- **Contenu** : éditer les tableaux dans `src/app/portfolio/page.tsx`, `src/app/writeups/page.tsx` et `src/app/blog/page.tsx`, ou brancher un CMS / MDX.
- **Liens sociaux** : modifier les URLs dans `src/components/Footer.tsx`.
- **Thème** : variables CSS dans `src/app/globals.css`, palette sombre orientée cybersécurité (vert accent).

## Ajouter des composants shadcn

```bash
npx shadcn@latest add [nom-du-composant]
```

Le fichier `components.json` est déjà configuré pour ce projet.

## Déploiement sur GitHub Pages

1. **Activer GitHub Pages**  
   Dans le dépôt : **Settings** → **Pages** → **Build and deployment** → **Source** : choisir **GitHub Actions**.

2. **Pousser sur `main`**  
   À chaque push sur la branche `main`, le workflow construit le site (export statique) et le déploie sur GitHub Pages.

3. **URL du site**  
   - **Domaine perso** (ex. `0xbbuddha.fr`) : le workflow utilise déjà `BASE_PATH: ""` pour que le CSS/JS se chargent à la racine. Configure **Settings** → **Pages** → **Custom domain** avec ton domaine.  
   - **Sans domaine perso** (projet uniquement) : `https://<username>.github.io/0xbbuddha.fr/` — retire ou commente la ligne `BASE_PATH: ""` dans `.github/workflows/deploy.yml` et laisse Next.js utiliser le nom du repo comme basePath.
