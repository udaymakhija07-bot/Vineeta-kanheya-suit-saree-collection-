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
