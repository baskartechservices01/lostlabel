# LOST LABEL — Premium Streetwear E-Commerce Platform
**ESTD. 2026 • Undergound Luxury Fashion & Digital Art**

> A complete, production-ready e-commerce web application featuring a cinematic 3D WebGL hero experience, Firebase Firestore database, Cloudinary media pipeline, dynamic UPI QR payment with UTR verification, order tracking, and an administrative atelier management suite.

---

## Table of Contents
1. [Project Overview & Architecture](#1-project-overview--architecture)
2. [Local Installation & Setup](#2-local-installation--setup)
3. [Firebase Configuration](#3-firebase-configuration)
   - Authentication Setup
   - Cloud Firestore Setup
   - Security Rules Deployment
   - Bootstrapping the First Admin User
4. [Cloudinary Setup (Product & Payment Proof Storage)](#4-cloudinary-setup)
   - Creating an Unsigned Upload Preset
   - Configuring Folder Paths
5. [Environment Variables](#5-environment-variables)
6. [UPI Payment Architecture & Verification](#6-upi-payment-architecture--verification)
7. [Product Management & Catalog Seeding](#7-product-management--catalog-seeding)
8. [Netlify Deployment](#8-netlify-deployment)
9. [Customizing Brand Assets & 3D Objects](#9-customizing-brand-assets--3d-objects)
10. [Security & Performance Checklist](#10-security--performance-checklist)

---

## 1. Project Overview & Architecture

LOST LABEL is engineered as a serverless high-performance e-commerce ecosystem designed to look and feel like an editorial digital fashion campaign.

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons.
- **3D WebGL**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`).
- **Database & Auth**: Cloud Firestore, Firebase Authentication.
- **Media CDN**: Cloudinary with on-the-fly responsive transformations and WebP/AVIF auto-delivery.
- **Payments**: Direct UPI deep-linking & dynamic QR code generation with UTR verification.
- **Deployment**: Netlify SPA with security headers and asset caching.

---

## 2. Local Installation & Setup

### Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- npm `v9+` or `v11+`

### Step-by-Step Installation
1. Clone or navigate into the project directory:
   ```bash
   cd lost-label
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

> [!NOTE]
> The application is equipped with an automatic zero-config development fallback. If Firebase or Cloudinary keys are not yet configured in `.env`, the website automatically runs with local mock data and demo catalog products so you can test the full customer journey immediately!

---

## 3. Firebase Configuration

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project**, enter `lost-label-store` (or your preferred name), and complete setup.
3. Click the **Web** icon (`</>`) under "Get started by adding Firebase to your app" to register a web application.
4. Copy the `firebaseConfig` keys provided.

### Step 2: Enable Authentication
1. In the Firebase Console sidebar, go to **Build > Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab:
   - Enable **Email/Password**.
   - Enable **Google** (set your support email).
4. Under **Authorized domains**, ensure `localhost` and your Netlify domain (e.g., `lostlabel.netlify.app`) are listed.

### Step 3: Create Cloud Firestore
1. In the sidebar, navigate to **Build > Firestore Database**.
2. Click **Create Database**.
3. Select **Production mode** and choose your preferred geographic location (e.g. `asia-south1` for Mumbai/India).
4. Click **Enable**.

### Step 4: Configure Firestore Security Rules
Copy the audited rules from `firestore.rules` into your Firebase Console under **Firestore Database > Rules**, or deploy using the Firebase CLI:
```bash
npx -y firebase-tools@latest deploy --only firestore:rules
```

Key security guarantees in `firestore.rules`:
- **Products**: Public read for active products (`isActive == true`). Only admin can create, modify, or delete.
- **Orders**: Customers can create orders and update *only* UTR/payment proofs in pending status. Customers cannot elevate their payment status to `verified`. Only admins can verify payments or update fulfillment states.
- **Role Escalation Prevention**: Customers cannot self-assign `role = "admin"` in `users/{uid}`.

### Step 5: Creating the First Admin User
1. Register a user in the app at `/admin/login` or via Firebase Console Authentication.
2. Go to **Firestore Database > users** collection.
3. Locate the document matching your user's `uid` (or create it if needed):
   ```json
   {
     "email": "admin@lostlabel.com",
     "role": "admin",
     "createdAt": "TIMESTAMP"
   }
   ```
4. Setting `"role": "admin"` instantly unlocks the full administrative portal at `/admin`.

---

## 4. Cloudinary Setup

Cloudinary is the exclusive media storage and CDN provider for all product photos and payment screenshots.

### Step 1: Create Cloudinary Account & Cloud Name
1. Sign up at [Cloudinary](https://cloudinary.com/).
2. On your Cloudinary Dashboard, copy your **Cloud Name**.

### Step 2: Create an Unsigned Upload Preset
1. In Cloudinary, go to **Settings (Gear Icon) > Upload**.
2. Scroll down to **Upload presets** and click **Add upload preset**.
3. Configure the preset:
   - **Preset Name**: e.g., `lost_label_preset`
   - **Signing Mode**: Select **Unsigned**
   - **Folder**: `lost-label/products`
   - **Allowed formats**: `jpg, png, webp, avif`
   - **Max file size**: `10 MB`
4. Click **Save**.

### Dedicated Folders
- Product Images: `lost-label/products/`
- Payment Proof Screenshots: `lost-label/payment-proofs/`

> [!CAUTION]
> **Zero API Secret Exposure**:
> NEVER expose your `CLOUDINARY_API_SECRET` in the frontend or inside `VITE_` environment variables. The application uses client-safe unsigned upload presets.

---

## 5. Environment Variables

Create a `.env` file in the root of `lost-label/` based on `.env.example`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=lost-label.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lost-label-XXXX
VITE_FIREBASE_STORAGE_BUCKET=lost-label-XXXX.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=lost_label_preset

# Store Default UPI Fallback
VITE_DEFAULT_UPI_ID=lostlabel@upi
VITE_DEFAULT_UPI_NAME=Lost Label Streetwear
```

---

## 6. UPI Payment Architecture & Verification

The UPI payment flow operates with complete transparency and zero gateway fees:
1. Customer initiates checkout at `/checkout`.
2. Total amount and order number (`LL-2026-XXXX`) are calculated.
3. Dynamic UPI URL is constructed:
   ```
   upi://pay?pa=lostlabel@upi&pn=LOST%20LABEL&am=1899.00&cu=INR&tn=LL-2026-1042
   ```
4. A high-contrast dynamic QR code is generated via `qrcode` library on SVG/Canvas.
5. On mobile, the customer can tap **Open in UPI App** to launch GPay, PhonePe, or Paytm directly.
6. After paying, customer enters the **12-digit UTR Reference** and optionally uploads a payment screenshot.
7. Order status becomes `paymentStatus: "submitted"`.
8. The store owner/admin inspects the UTR and bank credit in `/admin/orders` and clicks **Verify Payment**.
9. Order status updates to `confirmed` and customer tracking shows **Payment Verified**.

---

## 7. Product Management & Catalog Seeding

### 1-Click Catalog Seeder
To instantly populate your Firestore database with the official Lost Label drop collection:
1. Log in to the Admin Dashboard at `/admin`.
2. At the top of the Overview screen, click **Seed Products**.
3. All sample garments (Oversized Heavyweight Black Tee, Signature Cream Acid Tee, Monogram Hoodie, Tactical Jacket, Cargo Pants, Beanie) and default store settings will be written to Firestore.

### Managing Garments
- Add drops at `/admin/products`.
- Set title, price, compare-at price, sizing (S/M/L/XL/etc.), colors, and stock.
- Upload multiple high-res product photos directly to Cloudinary.
- Toggle visibility (`Active` / `Archived`) to control display on the storefront.

---

## 8. Netlify Deployment

The project is pre-configured with `netlify.toml` for seamless Single Page Application routing and caching.

### Deploying via Netlify Git Integration
1. Push the `lost-label` repository to GitHub or GitLab.
2. In Netlify, click **Add new site > Import an existing project**.
3. Select your repository.
4. Netlify will automatically detect settings from `netlify.toml`:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Go to **Site Configuration > Environment Variables** and add all `VITE_` variables from `.env`.
6. Click **Deploy Site**.

---

## 9. Customizing Brand Assets & 3D Objects

### Official Logo
The official Lost Label emblem and editorial wordmark are stored in:
- `src/assets/logo.jpg`
- `public/logo.jpg`

This file is automatically utilized across the 3D medallion, navbar, loading screen, order invoices, and footer. To update the logo, replace `src/assets/logo.jpg` and `public/logo.jpg` while preserving square proportions.

### Replacing 3D Objects
The 3D scene is modularly organized in `src/components/3d/`:
- `LostLabelScene.jsx`: WebGL canvas wrapper with mobile fallback detection.
- `HeroScene.jsx`: Camera lighting, fog, star particles, and monolith layout.
- `LogoObject.jsx`: The 3D rotating medallion mapped with the brand emblem and orbiting titanium rings.
- To insert an external 3D garment model (GLB/GLTF), import `useGLTF` from `@react-three/drei` and add `<primitive object={gltf.scene} />` inside `HeroScene.jsx`.

---

## 10. Security & Performance Checklist

- [x] Zero exposure of private Cloudinary API secrets in client code.
- [x] Firestore security rules prevent price/stock tampering by customers.
- [x] Customer cannot elevate payment status to `verified` from the browser.
- [x] Order tracking requires matching Order Number + Phone number to prevent unauthorized access.
- [x] Admin routes protected with Firebase Auth and Firestore role validation.
- [x] WebGL capability detector gracefully falls back to a 2D particle canvas on low-spec devices.
- [x] Route-level code splitting with `React.lazy` and `Suspense`.
- [x] Netlify SPA rewrite rules prevent 404s on browser refresh.

---

**LOST LABEL STREETWEAR • ESTD. 2026**
