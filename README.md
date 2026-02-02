# 0xbbuddha.fr

Portfolio personnel orienté cybersécurité : portfolio, writeups et blog. Construit avec **Next.js 15**, **Tailwind CSS** et **shadcn/ui**.

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
