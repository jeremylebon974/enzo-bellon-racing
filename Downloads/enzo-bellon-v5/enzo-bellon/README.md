# ENZO BELLON — Site Officiel Racing
## N°33 — Fasty Foxy — FIM JuniorGP Moto3

Site officiel premium pour Enzo Bellon, pilote professionnel FIM JuniorGP Moto3 World Championship.

---

## Stack Technique
- **Next.js 14** (App Router, Static Export)
- **React 18**
- **TailwindCSS 3**
- **TypeScript**
- Fonts Google : Bebas Neue + Barlow Condensed + Barlow

---

## Installation & Lancement

```bash
# 1. Se placer dans le dossier
cd enzo-bellon

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev
# → http://localhost:3000

# 4. Build production
npm run build
# → génère le dossier /out (static export)
```

---

## Structure du projet

```
enzo-bellon/
├── public/
│   └── images/
│       ├── pilot/          ← Photos Enzo (enzo-1.jpg … enzo-19.jpg)
│       ├── helmets/        ← Photos casques (helmet-1.jpg … helmet-3.jpg)
│       ├── merch/          ← Produits merchandising (merch-1.png … merch-14.png)
│       └── track/          ← Affiche Barcelona (barcelona-round1.jpg)
├── src/
│   ├── app/
│   │   ├── layout.tsx      ← Layout racine + metadata SEO
│   │   ├── page.tsx        ← Page principale (assemblage sections)
│   │   └── globals.css     ← Styles globaux + variables CSS
│   ├── components/
│   │   ├── Navbar.tsx      ← Navigation fixe responsive
│   │   ├── Hero.tsx        ← Section hero plein écran
│   │   ├── PiloteSection.tsx     ← Présentation pilote
│   │   ├── CollectionSection.tsx ← Fasty Foxy brand
│   │   ├── BoutiqueSection.tsx   ← E-commerce produits
│   │   ├── GalerieSection.tsx    ← Galerie photos
│   │   ├── SaisonSection.tsx     ← Calendrier saison
│   │   ├── PartenairesSection.tsx ← Supporters & partenaires
│   │   └── Footer.tsx      ← Footer complet
│   └── data/
│       └── data.ts         ← Produits, saison, données
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Ajouter des photos

Placer les images dans le bon sous-dossier de `public/images/` :

| Dossier | Contenu |
|---------|---------|
| `pilot/` | Photos Enzo (enzo-1.jpg … enzo-19.jpg) |
| `helmets/` | Photos casques (helmet-1.jpg … helmet-3.jpg) |
| `merch/` | Visuels produits (merch-1.png … merch-14.png) |
| `track/` | Photos circuit (barcelona-round1.jpg) |

---

## Déploiement sur Vercel

```bash
# Option 1 : Via CLI
npm install -g vercel
vercel

# Option 2 : Via GitHub
# 1. Push le projet sur GitHub
# 2. Connecter le repo sur vercel.com
# 3. Deploy automatique à chaque push

# Variables d'environnement (si e-commerce connecté) :
# NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
# NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=
# STRIPE_PUBLIC_KEY=
```

### Settings Vercel recommandés :
- **Framework** : Next.js
- **Build Command** : `npm run build`
- **Output Directory** : `out`
- **Node.js** : 18.x

---

## Connecter un e-commerce

Le site est architecturé pour s'intégrer avec :

### Shopify Storefront API
```bash
npm install @shopify/storefront-api-client
```
Modifier `src/components/BoutiqueSection.tsx` → remplacer les données statiques par les appels API Shopify.

### WooCommerce
Utiliser WooCommerce REST API + fetch dans les composants.

### Stripe
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

---

## Mise à jour des données saison

Modifier `src/data/data.ts` :
- `season2025[]` → ajouter résultats, modifier statuts
- `products[]` → ajouter/modifier produits

---

## Réseaux sociaux

Mettre à jour les liens dans :
- `src/components/PartenairesSection.tsx`
- `src/components/Footer.tsx`

---

## Contact & Support

contact@enzobellon.fr
partenaires@enzobellon.fr
