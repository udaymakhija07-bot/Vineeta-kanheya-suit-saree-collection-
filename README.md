# Vineeta Suit Collection & Kanheya Saree Centre

A modern ecommerce storefront built with **React**, **Vite**, **Tailwind CSS**, and **Firebase**.

## Features

- Dual-brand shopping (Vineeta Suits + Kanheya Sarees)
- Product catalog with filters and search
- Shopping cart (localStorage persistence)
- Firebase Authentication (login/register)
- Firestore orders and user profiles
- Responsive, ethnic-wear themed UI

## Project Structure

```
├── public/                  # Static assets
├── firebase/                # Firestore & Storage rules
├── src/
│   ├── components/          # UI, layout, product, cart, brand
│   ├── context/             # Auth & cart providers
│   ├── data/                # Mock products (dev/demo)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Firebase initialization
│   ├── pages/               # Route pages
│   ├── services/            # Auth, products, orders, cart
│   ├── types/               # TypeScript interfaces
│   └── utils/               # Constants & helpers
├── .env.example
├── firebase.json
└── package.json
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

Copy `.env.example` to `.env` and add your Firebase project credentials:

```bash
cp .env.example .env
```

Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com), enable **Authentication** (Email/Password), **Firestore**, and **Storage**.

Deploy security rules:

```bash
firebase deploy --only firestore:rules,storage
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deploy live (Vercel + Firebase)

**GitHub repo:** https://github.com/udaymakhija07-bot/Vineeta-kanheya-suit-saree-collection-

### Step 1 — Vercel (live website URL)

1. Open [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import **Vineeta-kanheya-suit-saree-collection-**.
3. Vercel auto-detects Vite. Keep:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variables** (Production + Preview):

| Name | Value |
|------|--------|
| `VITE_FIREBASE_API_KEY` | from Firebase Console |
| `VITE_FIREBASE_AUTH_DOMAIN` | `vineeta-kanheya.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `vineeta-kanheya` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `vineeta-kanheya.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | from Firebase Console |
| `VITE_FIREBASE_APP_ID` | from Firebase Console |
| `VITE_ADMIN_EMAIL` | `udaymakhija07@gmail.com` |

5. Click **Deploy**. You will get a URL like `https://vineeta-kanheya-suit-saree-collection.vercel.app`.

### Step 2 — Firebase (auth + database)

1. [Firebase Console](https://console.firebase.google.com) → project **vineeta-kanheya**
2. **Authentication → Settings → Authorized domains** → add your Vercel URL (e.g. `*.vercel.app`).
3. Enable **Email/Password** sign-in if not already enabled.
4. Deploy Firestore rules (one time, in terminal):

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,firestore:indexes
```

5. Create admin user (one time):

```bash
npm run seed:admin
```

### Step 3 — Share the URL

After Vercel deploy finishes, share the **Production URL** with customers. All routes (`/shop`, `/orders`, `/admin`) work on that URL.

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start dev server         |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`  | Run ESLint               |

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 3
- React Router 7
- Firebase 11 (Auth, Firestore, Storage)

## Notes

- Pages currently use `src/data/mockProducts.ts` for the catalog UI. Connect Firestore by swapping mock data with `productService` calls once Firebase is configured.
- Cart is stored in `localStorage` for guest checkout support.
