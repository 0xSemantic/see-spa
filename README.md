# 🌿 Glamour Spa Booking System

A complete, production-ready spa booking web application built entirely on the frontend — no backend server required. Customers browse services, pick a date and time, pay with a test card, and receive an email receipt with a unique code. Staff use the admin portal to view all bookings and check guests in by scanning their receipt code.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Live Features](#2-live-features)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Folder Structure](#5-folder-structure)
6. [Pages & Routes](#6-pages--routes)
7. [Components Reference](#7-components-reference)
8. [Services & Utilities](#8-services--utilities)
9. [Data Model (Firestore)](#9-data-model-firestore)
10. [Environment Variables](#10-environment-variables)
11. [Setting Up Firebase](#11-setting-up-firebase)
12. [Setting Up EmailJS](#12-setting-up-emailjs)
13. [Installing & Running Locally](#13-installing--running-locally)
14. [Test Payment Cards](#14-test-payment-cards)
15. [Full Booking Flow (Customer)](#15-full-booking-flow-customer)
16. [Admin Portal Flow](#16-admin-portal-flow)
17. [Color System & Design Tokens](#17-color-system--design-tokens)
18. [Typography](#18-typography)
19. [Animations](#19-animations)
20. [Error Handling & Edge Cases](#20-error-handling--edge-cases)
21. [Deploying to Production](#21-deploying-to-production)
22. [Firestore Security Rules](#22-firestore-security-rules)
23. [EmailJS Template Setup](#23-emailjs-template-setup)
24. [Frequently Asked Questions](#24-frequently-asked-questions)
25. [Future Enhancements](#25-future-enhancements)

---

## 1. Project Overview

Glamour Spa Booking System is a **100% frontend React application** that simulates a full spa booking experience from service selection all the way to staff check-in. It uses:

- **Firebase Firestore** as a real-time cloud database — all bookings are persisted and queryable without a server.
- **EmailJS** to send actual emails to customers and the admin without any backend email server.
- **Simulated payment** using three hardcoded test card numbers stored in environment variables — no real money moves.

The system was designed with a Nigerian audience in mind (prices in ₦, services common to Nigerian beauty culture) but is easily adapted to any market.

### What makes this unique

- **Zero backend** — no Node.js server, no REST API, no database server to manage. Deploy as a static site.
- **Real emails** — EmailJS sends actual emails to real inboxes using your connected Gmail or Outlook account.
- **Real-time availability** — Firestore queries check whether a time slot is already booked before confirming any new booking, handling race conditions.
- **Receipt-based check-in** — every booking gets a unique `SP-XXXX` code. Staff enter this code at the front desk to mark the guest as checked in.
- **Dual-layout architecture** — the landing page (`/`) is a full-bleed marketing page with its own nav and footer. All other pages share a consistent lightweight header and footer.

---

## 2. Live Features

### Customer-Facing

- **Marketing landing page** with animated hero, service showcase tabs, step-by-step process section, social proof/testimonials carousel, trust strip, and a full dark footer with links.
- **3-step booking wizard**: Step 1 — choose service, date, and time slot; Step 2 — enter personal details; Step 3 — enter payment card.
- **Real-time slot availability** — when a date is selected, all 9 time slots are checked against Firestore simultaneously. Booked slots appear greyed out with strikethrough text and cannot be selected.
- **Dummy payment processing** — card number is validated against three allowed test card numbers stored in `.env`. Any matching number is accepted regardless of expiry or CVV (which are still required for UX realism).
- **Automatic emails** — on successful booking, two emails are sent simultaneously: one to the customer's inbox with full booking details and receipt code, and one to the admin email as a notification.
- **Receipt confirmation page** — after payment, the customer is taken to a page showing their unique `SP-XXXX` code with instructions to show it at arrival.

### Admin-Facing

- **Password-protected admin portal** at `/admin` — credentials stored in `.env`.
- **Session-based authentication** using `sessionStorage` — the admin stays logged in for the browser session only. Closing the tab logs them out.
- **Live bookings dashboard** powered by Firestore `onSnapshot` — new bookings appear in the table in real time without refreshing the page.
- **Stat cards** showing total bookings, confirmed count, and checked-in count — all updating live.
- **Searchable and filterable bookings table** — search by guest name, email, or receipt code; filter by status (All / Confirmed / Checked In).
- **Receipt verifier panel** — admin types a receipt code and clicks Verify. If found and not yet checked in, the booking status is updated to `checked_in` instantly in Firestore. If already checked in, the admin sees the guest's details and a notice.

---

## 3. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Core framework | React | 19.2.6 | UI rendering and component system |
| Build tool | Vite | 8.0.12 | Dev server, hot module replacement, production build |
| Styling | Tailwind CSS | 4.3.0 | Utility-first CSS, responsive layout |
| Tailwind integration | @tailwindcss/vite | 4.3.0 | Vite plugin for Tailwind v4 (no PostCSS config needed) |
| Animations | Framer Motion | 12.40.0 | Page transitions, hover effects, scroll animations |
| Routing | React Router DOM | 7.16.0 | Client-side routing, protected routes |
| Forms | React Hook Form | 7.77.0 | Uncontrolled form management with validation |
| Schema validation | Zod | 4.4.3 | Type-safe form schema definitions |
| Form-Zod bridge | @hookform/resolvers | 5.4.0 | Connects Zod schemas to React Hook Form |
| Database | Firebase Firestore | 12.14.0 | Real-time cloud NoSQL database |
| Email | @emailjs/browser | 4.4.1 | Send emails directly from the browser |
| Toast notifications | React Hot Toast | 2.6.0 | User feedback notifications |
| Date utilities | date-fns | 4.4.0 | Date formatting, comparison, manipulation |
| Unique IDs | uuid | 14.0.0 | Available in project (receipt codes use a custom generator) |
| Fonts | Google Fonts | — | Cormorant Garamond + DM Sans + DM Mono |

### Why no backend?

Firestore is a client-accessible database with its own security rules system — no server needed to read or write data. EmailJS communicates directly from the browser to its API using a public key. This means the entire system can be hosted on Netlify, Vercel, or GitHub Pages as a plain static bundle.

---

## 4. System Architecture

```
Browser (React SPA)
│
├── Firebase Firestore (cloud database)
│   ├── READ  ─ check slot availability before booking
│   ├── WRITE ─ create new booking document on confirmation
│   ├── READ  ─ admin fetches all bookings via real-time listener
│   └── WRITE ─ update booking status to "checked_in" on verification
│
└── EmailJS (email delivery — browser to inbox)
    ├── Send receipt email ─────→ customer's inbox
    └── Send notification email ─→ admin inbox
```

### Data flow on a new booking

1. Customer completes Step 1 (service + date + time). Before proceeding, the app queries Firestore to confirm the slot is still available.
2. Customer fills in personal details (Step 2). This data is held in React Context — nothing is written to Firestore yet.
3. Customer enters a test card number (Step 3). The app checks the card number against the three allowed numbers in `.env`.
4. On valid card: a unique `SP-XXXX` receipt code is generated, a Firestore document is created with status `confirmed`, and two EmailJS requests are fired (customer + admin). The customer is redirected to `/receipt/:code`.

### Data flow on admin check-in

1. Admin navigates to `/admin`, enters password. On match, `admin_auth = "true"` is written to `sessionStorage` and the admin is redirected to `/admin/dashboard`.
2. The dashboard mounts a Firestore `onSnapshot` listener — booking changes anywhere in the world update the table live.
3. Admin enters a receipt code in the verifier and clicks Verify. The app queries Firestore for a document with that exact `receiptCode` field. If found and status is `confirmed`, it updates the document to `checked_in`.

---

## 5. Folder Structure

```
glamour-spa-booking/
├── public/                             # Static assets served as-is
├── src/
│   ├── App.jsx                         # Root component — router + Toaster
│   ├── main.jsx                        # React DOM entry point
│   ├── index.css                       # Global styles, Google Fonts import, CSS variables
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx             # Full marketing landing page (route: /)
│   │   ├── BookingPage.jsx             # 3-step booking wizard wrapper (route: /book)
│   │   ├── ReceiptPage.jsx             # Post-booking confirmation (route: /receipt/:code)
│   │   ├── AdminLogin.jsx              # Staff login form (route: /admin)
│   │   └── AdminDashboard.jsx          # Full admin panel (route: /admin/dashboard)
│   │
│   ├── components/
│   │   ├── BookingForm/
│   │   │   ├── ServiceStep.jsx         # Step 1: service + date + time selection
│   │   │   ├── CustomerStep.jsx        # Step 2: name, email, phone form
│   │   │   └── PaymentStep.jsx         # Step 3: card input + booking creation
│   │   ├── Admin/
│   │   │   ├── AdminGuard.jsx          # Route protection — redirects if not authenticated
│   │   │   ├── BookingTable.jsx        # Searchable/filterable bookings table
│   │   │   └── ReceiptVerifier.jsx     # Code input + check-in logic
│   │   ├── Layout/
│   │   │   ├── Header.jsx              # Shared nav bar (all pages except landing)
│   │   │   └── Footer.jsx              # Shared footer
│   │   └── UI/
│   │       ├── Loader.jsx              # Animated spinner component
│   │       └── StepIndicator.jsx       # 3-step progress bar for booking wizard
│   │
│   ├── contexts/
│   │   └── BookingContext.jsx          # Global state for multi-step booking form
│   │
│   ├── firebase/
│   │   └── firebase.js                 # Firebase app + Firestore initialization
│   │
│   ├── hooks/
│   │   └── useAvailability.js          # Hook wrapping checkSlotAvailability service
│   │
│   ├── services/
│   │   ├── bookingService.js           # createBooking, getAllBookings, verifyReceipt, checkSlotAvailability
│   │   └── emailService.js             # sendReceiptEmail (wraps EmailJS)
│   │
│   └── utils/
│       ├── receiptGenerator.js         # generateReceiptCode — produces SP-XXXX format
│       ├── dummyCardValidator.js       # validateDummyCard, getLastFour, formatCardDisplay
│       └── dateHelpers.js             # TIME_SLOTS array, formatTime, formatDisplayDate, getMinDate
│
├── .env                                # All environment variables (never commit this file)
├── vite.config.js                      # Vite config with React + Tailwind plugins
├── tailwind.config.js                  # Custom color tokens, fonts, keyframe animations
├── package.json                        # Dependencies and npm scripts
└── index.html                          # HTML shell with root div and page title
```

---

## 6. Pages & Routes

| Route | Component | Auth Required | Layout |
|---|---|---|---|
| `/` | `LandingPage` | No | Self-contained (own nav + footer inside the component) |
| `/book` | `BookingPage` | No | Shared Header + Footer |
| `/receipt/:code` | `ReceiptPage` | No | Shared Header + Footer |
| `/admin` | `AdminLogin` | No | Shared Header + Footer |
| `/admin/dashboard` | `AdminDashboard` | Yes — `sessionStorage` | Shared Header + Footer |

The landing page (`/`) intentionally uses its own navigation and footer built directly into the component because it uses full-bleed sections, a fixed glass-morphism nav bar, and a dark-background footer — none of which suit the lightweight shared header used on other pages.

### AdminGuard

`AdminGuard` is a wrapper component placed around the `/admin/dashboard` route in `App.jsx`. On render, it reads `sessionStorage.getItem('admin_auth')`. If the value is not `"true"`, it immediately renders a React Router `<Navigate to="/admin" replace />`, sending the user to the login page without rendering any dashboard content.

---

## 7. Components Reference

### `LandingPage.jsx`

The marketing homepage — entirely self-contained with no shared Header or Footer. It is the first thing visitors see and is designed to communicate the brand, services, process, and social proof before inviting the visitor to book.

**Sections (in order from top to bottom):**

**Fixed glass nav** — `position: fixed` with `backdrop-filter: blur(16px)` and a semi-transparent background. Contains logo, five nav links (Services, How It Works, Reviews, Staff, Book Now CTA button). Animates down from above on mount.

**Hero section** — Two-column layout (left: copy; right: floating card visual).
- Left: Eyebrow label, large serif headline ("Where Every Visit Becomes A Ritual"), supporting paragraph, two CTAs (Reserve Your Session + Explore Services), animated stat counters (2,400+ guests, 4 treatments, 98% satisfaction rate).
- Right: A stack of three cards floating with different animation cycles — back card (green), middle card (yellow), front card (white with mock booking details). Two floating badges: "Next available: Tomorrow 10:00 AM" and a receipt code "SP-7K4M".
- The entire hero content has a scroll-driven parallax — as the user scrolls down, the content moves upward and fades out using `useScroll` + `useTransform` from Framer Motion.
- A "Discover more" scroll indicator pulses at the bottom of the viewport.

**Services section** — Four tab buttons (one per service). Clicking a tab smoothly transitions to a two-panel detail card for that service:
- Left panel (coloured background unique to each service): large icon, tagline, service name, full description, duration, and price.
- Right panel (white): "What's included" checklist (5 items) with animated entrance, and a direct "Book [Service] →" button linking to `/book`.

**How It Works section** — Four numbered step cards explaining: Choose Treatment → Pick Moment → Confirm & Pay → Arrive & Unwind. Each card has a large decorative step number, an emoji, a title, and a short description.

**Trust strip** — A full-width dark green (`#3d5a3e`) band containing four trust pillars: Secure Booking, Instant Receipt, Easy Check-In, Real Support.

**Testimonials section** — Auto-rotating carousel (5-second interval) of 3 guest quotes. Large serif italic quote text, guest name, and city. Dot navigation below allows manual selection. Uses `AnimatePresence mode="wait"` for smooth cross-fade transitions.

**CTA section** — Soft pastel gradient card with decorative leaf SVGs, headline, supporting text, and two buttons (Book Your Treatment + View All Services).

**Footer** — Dark green full-width footer with logo, brand description, and three link columns (Services, Visit, Support). Fine print at the bottom with demo card info.

---

### `BookingPage.jsx`

Wraps the entire booking wizard in `<BookingProvider>` context and renders the correct step component based on the `step` value from context. Uses `AnimatePresence` with `mode="wait"` so each step animates fully out before the next animates in.

Also renders the `<StepIndicator>` progress bar above the active step.

---

#### `ServiceStep.jsx` (Step 1)

- Renders 4 service cards in a 2×2 grid. Each card shows the service icon, name, description, duration badge, and price.
- Selecting a service card OR changing the date triggers a `Promise.all` that checks all 9 time slots against Firestore simultaneously. This pre-populates the `unavailableSlots` array so greyed-out slots appear immediately.
- Unavailable slots render with `cursor: not-allowed`, greyed colours, and `text-decoration: line-through`.
- On clicking "Continue to Details", the selected slot is checked one final time (race condition protection) before advancing to Step 2.
- Time slots only appear after both a service and a date have been selected.

---

#### `CustomerStep.jsx` (Step 2)

- Uses React Hook Form with a Zod schema defining three fields:
  - `customerName` — string, minimum 2 characters
  - `customerEmail` — string, must pass email format validation
  - `customerPhone` — string, minimum 7 characters
- Shows a summary card at the top with the service, formatted date, and formatted time chosen in Step 1 (pulled from BookingContext).
- Validation errors appear below each field in red.
- On valid submit, `updateBooking()` merges the personal details into context and `setStep(3)` advances the wizard.

---

#### `PaymentStep.jsx` (Step 3)

- Shows a yellow hint box with the three valid test card numbers.
- Shows a green booking summary card with service, date, time, guest name, and price.
- Card number field uses `formatCardDisplay()` to auto-insert spaces every 4 digits as the user types (e.g. typing `4111...` shows `4111 1111 ...`).
- Expiry field auto-inserts a `/` after the 2-digit month.
- CVV field strips non-digits and caps at 4 characters.
- On submit: `validateDummyCard()` checks the stripped card number. If invalid, a toast error fires. If valid, `createBooking()` is called.
- `createBooking()` writes to Firestore, fires two emails asynchronously, and returns `{ id, receiptCode }`. The customer is navigated to `/receipt/:code`.
- While processing, the Confirm button shows a spinning "Processing..." state and is disabled.

---

### `ReceiptPage.jsx`

Reads the `code` parameter from the URL using React Router's `useParams`. Displays:
- A spring-animated checkmark circle (pulses twice on mount)
- The receipt code in DM Mono font at large size
- Instruction text: "Show this code at the reception desk when you arrive"
- A "Book Another Treatment" button navigating back to `/book`

---

### `AdminLogin.jsx`

Simple password form. The email field is read-only, pre-filled from `VITE_ADMIN_EMAIL`. On form submit, the entered password is compared (after a 600ms simulated delay for UX realism) against `VITE_ADMIN_PASSWORD`. On match: `sessionStorage.setItem('admin_auth', 'true')` is set and the admin is redirected to `/admin/dashboard` with a success toast. On mismatch: error toast, form stays open.

---

### `AdminDashboard.jsx`

On mount, establishes a Firestore `onSnapshot` listener via `getAllBookings()`. The listener is automatically cleaned up when the component unmounts (via the `useEffect` return value).

**Stat cards (3):** Total Bookings, Confirmed, Checked In — all derived from the live `bookings` array on every update.

**Two tabs:**
- "All Bookings" — renders `<BookingTable bookings={bookings} />`
- "Verify Receipt" — renders `<ReceiptVerifier />`

Sign Out button removes `admin_auth` from `sessionStorage` and navigates to `/admin`.

---

### `BookingTable.jsx`

Receives the live `bookings` array as a prop. All filtering is client-side (no extra Firestore queries — `onSnapshot` already holds all documents).

- **Search input** filters by `customerName`, `customerEmail`, and `receiptCode` using case-insensitive `.includes()`.
- **Status filter buttons** toggle between `all`, `confirmed`, and `checked_in`.
- **Table columns:** Receipt (styled pill badge in DM Mono), Guest (name + email), Service, Date & Time, Payment (masked: `**** 1111`), Status (coloured badge).
- Table rows animate in with a staggered delay (`transition={{ delay: i * 0.04 }}`).
- Footer shows "Showing X of Y bookings".

---

### `ReceiptVerifier.jsx`

- Input field converts all input to uppercase via `onChange`.
- Pressing Enter also triggers verification (keyboard accessible).
- Calls `verifyReceipt(code)` from `bookingService`.
- Result panel animates in/out with `AnimatePresence`. Shows guest name, service, date, and time on both success and "already checked in" scenarios with appropriate icons (✅ / 🔄 / ❌).

---

### `StepIndicator.jsx`

Renders the 3-step progress indicator above the booking wizard form. Each circle:
- **Pending** — white background, green border, muted number text
- **Active** — dark green fill, white text, slightly scaled up via `animate={{ scale: 1.1 }}`
- **Completed** — light green fill, dark green checkmark

The connecting line between steps transitions from grey to green as steps are completed.

---

### `Header.jsx`

The shared header used on `/book`, `/receipt/*`, `/admin`, and `/admin/dashboard`. Uses `position: sticky` with `backdrop-filter: blur(12px)` and a semi-transparent white/green background. Detects whether the current route starts with `/admin` using `useLocation()` and swaps the right-hand CTA between "Staff Portal" (dark green pill → goes to `/admin`) and "← Guest View" (yellow pill → goes to `/`).

---

### `AdminGuard.jsx`

A minimal component that reads `sessionStorage.getItem('admin_auth')`. Returns `<Navigate to="/admin" replace />` if not authenticated, otherwise renders `{children}`.

---

### `Loader.jsx`

A centred spinner component. Uses a `motion.div` with `animate={{ rotate: 360 }}` and `transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}`. Accepts a `text` prop for the label below the spinner.

---

## 8. Services & Utilities

### `bookingService.js`

All Firestore interactions live here.

| Function | Parameters | Returns | Description |
|---|---|---|---|
| `createBooking` | `bookingData` (object), `cardLast4` (string) | `{ id, receiptCode }` | Generates receipt code, writes Firestore document, fires emails |
| `getAllBookings` | `callback` (function) | Unsubscribe function | Sets up a real-time Firestore listener, calls callback with updated array on every change |
| `verifyReceipt` | `receiptCode` (string) | `{ success, message, booking }` | Queries Firestore by code, updates status to `checked_in` if found and not already checked in |
| `checkSlotAvailability` | `service`, `date`, `timeSlot` (strings) | `boolean` — `true` means available | Queries Firestore for any booking with matching service+date+timeSlot that has status `confirmed` or `checked_in` |

---

### `emailService.js`

| Function | Parameters | Description |
|---|---|---|
| `sendReceiptEmail` | `booking` (object), `isAdminCopy` (boolean) | Sends via EmailJS. If `isAdminCopy` is `true`, `to_email` is set to `VITE_ADMIN_EMAIL`. Otherwise it is the customer's email address. |

Template variables sent to EmailJS: `to_email`, `customer_name`, `receipt_code`, `service`, `date`, `time`, `status`, `phone`.

Email failures are caught with `console.error` only — the booking is already saved in Firestore, so an email failure does not block the customer experience.

---

### `receiptGenerator.js`

```js
generateReceiptCode()
// Returns: "SP-" + 4 random characters
// Character set: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
// Deliberately excludes: I (looks like 1), O (looks like 0), 0 and 1 — avoids confusion at reception
// Example outputs: "SP-7K4M", "SP-2NVA", "SP-Q8XB"
```

---

### `dummyCardValidator.js`

| Function | Parameters | Returns | Description |
|---|---|---|---|
| `validateDummyCard` | `cardNumber` (string) | `boolean` | Strips spaces and dashes, checks against `VITE_DUMMY_CARD_1/2/3` |
| `getLastFour` | `cardNumber` (string) | `string` | Returns last 4 digits of cleaned card number |
| `formatCardDisplay` | `value` (string) | `string` | Strips non-digits, groups into blocks of 4 with spaces, max 19 characters |
| `getDummyCards` | — | `string[]` | Returns array of the three valid card numbers (for reference) |

---

### `dateHelpers.js`

| Export | Type | Description |
|---|---|---|
| `TIME_SLOTS` | `string[]` | `['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00']` |
| `formatTime` | function | Converts 24h to 12h: `"14:00"` → `"2:00 PM"` |
| `formatDisplayDate` | function | `"2025-08-15"` → `"Friday, August 15, 2025"` |
| `getMinDate` | function | Returns tomorrow's date as `YYYY-MM-DD` (prevents past date selection) |
| `getTodayString` | function | Today's date as `YYYY-MM-DD` |
| `isFutureDate` | function | Returns `true` if the given date is today or later |

---

### `BookingContext.jsx`

Provides global state for the multi-step booking form using `React.createContext` + `useState`. Wrap the wizard in `<BookingProvider>` to access the context via `useBooking()`.

| Property | Type | Description |
|---|---|---|
| `step` | number (1–3) | Currently active step |
| `setStep` | function | Jump to a specific step directly |
| `bookingData` | object | All collected booking fields (see shape below) |
| `updateBooking` | function | Merges a partial object into `bookingData` |
| `confirmedReceipt` | string or null | Set to the receipt code after a successful booking |
| `setConfirmedReceipt` | function | Manually set the confirmed receipt code |
| `resetBooking` | function | Resets step to 1 and clears all bookingData |

`bookingData` shape:
```js
{
  service: '',        // "Medicure" | "Manicure" | "Pedicure" | "Facial"
  date: '',           // "YYYY-MM-DD"
  timeSlot: '',       // "09:00" | "10:00" | ... | "17:00"
  customerName: '',
  customerEmail: '',
  customerPhone: '',
}
```

---

### `useAvailability.js`

A thin custom hook that wraps `checkSlotAvailability` from `bookingService`. Exposes a `checkSlot(service, date, timeSlot)` function and a `loading` boolean. Used in `ServiceStep.jsx` to show a "Checking availability..." state on the Continue button.

---

## 9. Data Model (Firestore)

**Collection name:** `bookings`

Each document is auto-ID'd by Firestore.

| Field | Firestore Type | Example Value | Description |
|---|---|---|---|
| `receiptCode` | string | `"SP-7K4M"` | Unique code generated at booking time |
| `customerName` | string | `"Jane Doe"` | Guest's full name |
| `customerEmail` | string | `"jane@example.com"` | For receipt email delivery |
| `customerPhone` | string | `"+234 800 000 0000"` | Guest contact number |
| `service` | string | `"Facial"` | One of: Medicure, Manicure, Pedicure, Facial |
| `date` | string | `"2025-08-15"` | Booking date — stored as YYYY-MM-DD string |
| `timeSlot` | string | `"14:00"` | 24-hour time string from the TIME_SLOTS array |
| `status` | string | `"confirmed"` | Either `"confirmed"` or `"checked_in"` |
| `paymentLast4` | string | `"1111"` | Last 4 digits of the test card used |
| `createdAt` | Firestore Timestamp | server timestamp | Written by `serverTimestamp()` — used for ordering |
| `emailSentToAdmin` | boolean | `false` | Flag field — set at creation (not mutated post-creation in current version) |

### Firestore Indexes

The availability check query uses compound `where` clauses on `service`, `date`, `timeSlot`, and `status`. Firestore may prompt you to create a composite index the first time this query runs in production. The browser console error will include a direct URL. Click it, confirm in the Firebase console, wait ~60 seconds for the index to build, and all future queries will work.

---

## 10. Environment Variables

Create a file called `.env` in the root of the project (same directory as `package.json`). All Vite environment variables must be prefixed with `VITE_` to be accessible in browser code via `import.meta.env.VITE_*`.

```ini
# ─── Firebase Configuration ────────────────────────────────────────
# Get all of these from: Firebase Console → Project Settings → Your Apps → Web App
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# ─── EmailJS Configuration ──────────────────────────────────────────
# Get these from: emailjs.com → Dashboard → Email Services / Templates / Account
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=XXXXXXXXXXXXXXXXXXXX

# ─── Admin Credentials ──────────────────────────────────────────────
# Displayed (read-only) on the admin login page
VITE_ADMIN_EMAIL=admin@glamourspa.com
# The password the admin must enter to access the dashboard
VITE_ADMIN_PASSWORD=spa123

# ─── Dummy Payment Cards ────────────────────────────────────────────
# Only these exact numbers (no spaces) will be accepted at checkout
VITE_DUMMY_CARD_1=4111111111111111
VITE_DUMMY_CARD_2=5555555555554444
VITE_DUMMY_CARD_3=378282246310005
```

> **Security note:** The `.env` file must never be committed to Git. Vite projects include `.env` in `.gitignore` by default. On hosting platforms (Netlify, Vercel), add each variable in the platform's Environment Variables UI.

> **Important:** Vite embeds all `VITE_*` variables into the compiled JavaScript bundle at build time. Anyone inspecting the built JS can read these values. This is acceptable for demo test credentials but never place real payment secrets or sensitive API keys here.

---

## 11. Setting Up Firebase

### Step 1 — Create a Firebase project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project**
3. Enter a project name (e.g. `glamour-spa`)
4. Choose whether to enable Google Analytics (optional for this project)
5. Click through the wizard until the project is created

### Step 2 — Register a web app

1. On the project overview page, click the **`</>`** (web) icon
2. Give the app a nickname (e.g. `glamour-spa-web`)
3. Do **not** enable Firebase Hosting — you'll deploy elsewhere
4. Click **Register app**
5. Copy each value from the `firebaseConfig` object shown on screen into your `.env` file

### Step 3 — Create the Firestore database

1. In the left sidebar, go to **Build → Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** — this allows all reads and writes (fine for development and testing)
4. Choose a Cloud Firestore location close to your users:
   - Nigeria / West Africa: `europe-west1` (Belgium) or `europe-west3` (Frankfurt) are closest
   - You can also use `us-central` if your user base is mixed
5. Click **Enable** — the database is ready within a few seconds

### Step 4 — Security rules (for development)

In test mode, the rules that are created allow all reads and writes:
```
allow read, write: if request.time < timestamp.date(2025, 12, 31);
```
This has an expiry date. For a permanent demo deployment, replace with the rules in [Section 22](#22-firestore-security-rules).

### Step 5 — Composite index (only if Firestore prompts you)

The first time a user runs a slot availability check, Firestore may log a console error about a missing index. The error message contains a direct URL to create the index — click it, click **Create index** in the Firebase console, and wait about 60 seconds for it to build. This only needs to happen once per deployment.

---

## 12. Setting Up EmailJS

EmailJS lets you send emails directly from the browser using your own email account as the sender. No email server or backend needed.

### Step 1 — Create an account

Go to [https://www.emailjs.com](https://www.emailjs.com) and sign up. The free tier allows **200 emails per month** — sufficient for a small spa.

### Step 2 — Connect an email service

1. In the dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (recommended) or another provider (Outlook, Yahoo, etc.)
4. Click **Connect Account** and sign in with the email account you want to send from
5. Name the service (e.g. `glamour-spa-mailer`)
6. Copy the **Service ID** (format: `service_xxxxxxx`) → `VITE_EMAILJS_SERVICE_ID`

### Step 3 — Create an email template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Set the **To Email** field to `{{to_email}}` — this is the variable the code swaps between customer and admin
4. Set **Subject** to: `✨ Glamour Spa — Booking Confirmed ({{receipt_code}})`
5. In the body, use any of these template variables the code sends:
   - `{{customer_name}}` — guest's full name
   - `{{receipt_code}}` — the unique SP-XXXX code
   - `{{service}}` — treatment name
   - `{{date}}` — date of appointment
   - `{{time}}` — time of appointment
   - `{{status}}` — booking status (always "confirmed" at send time)
   - `{{phone}}` — guest phone number
   - `{{to_email}}` — recipient's email (in the To field, not the body)
6. Click **Save**
7. Copy the **Template ID** (format: `template_xxxxxxx`) → `VITE_EMAILJS_TEMPLATE_ID`

See [Section 23](#23-emailjs-template-setup) for a complete HTML template you can paste directly.

### Step 4 — Copy your Public Key

1. Go to **Account → General** in the EmailJS dashboard
2. Copy the **Public Key** (a random alphanumeric string)
3. Add it to `.env` as `VITE_EMAILJS_PUBLIC_KEY`

---

## 13. Installing & Running Locally

### Prerequisites

- **Node.js 18 or higher** — download from [nodejs.org](https://nodejs.org)
- **npm 9 or higher** — included with Node 18+. Verify with `node -v` and `npm -v`

### Installation steps

```bash
# Step 1: Navigate into the project folder
cd glamour-spa-booking

# Step 2: Install all dependencies from package.json
npm install

# Step 3: Create and fill in your .env file
# Copy the template from Section 10 and replace placeholder values

# Step 4: Start the development server
npm run dev
```

The app will be available at **http://localhost:5173** with hot module replacement enabled — any file save instantly updates the browser.

### Available npm scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server with hot reload |
| `npm run build` | Compile and bundle for production → output goes to the `/dist` folder |
| `npm run preview` | Serve the production `/dist` build locally for testing |
| `npm run lint` | Run ESLint across all `.js` and `.jsx` files |

### What works without Firebase/EmailJS?

- The landing page renders and all animations work
- The booking wizard Steps 1 and 2 render
- Step 1 will fail (console error) when trying to check slot availability without valid Firebase credentials
- Step 3 will fail when trying to write a booking without valid Firebase credentials
- No emails will send without valid EmailJS credentials

Set up Firebase and EmailJS before testing the full flow.

---

## 14. Test Payment Cards

Only these card numbers are accepted. They correspond to `VITE_DUMMY_CARD_1`, `VITE_DUMMY_CARD_2`, and `VITE_DUMMY_CARD_3` in your `.env`.

| Card Network | Card Number | Formatted Display |
|---|---|---|
| Visa | `4111111111111111` | `4111 1111 1111 1111` |
| Mastercard | `5555555555554444` | `5555 5555 5555 4444` |
| American Express | `378282246310005` | `3782 822463 10005` |

- **Expiry date:** Any value accepted (e.g. `12/27`). Not validated against real logic.
- **CVV:** Any 3 or 4 digit number accepted (e.g. `123`). Not validated.
- **Invalid card:** A toast notification appears naming all 3 valid cards. No Firestore write occurs.

These card numbers are the industry-standard dummy cards also used by Stripe, Paystack, and other payment providers for testing. They follow real card number formats but are not linked to any real account.

---

## 15. Full Booking Flow (Customer)

Step-by-step walkthrough from landing to receipt:

**1. Land on the homepage** — `http://localhost:5173` or your deployed domain. The marketing page loads with hero animation.

**2. Explore the page** — scroll through services, read the process, see testimonials. Alternatively, click "Book Now" in the nav immediately.

**3. Navigate to `/book`** — via "Reserve Your Session", "Book Now" in the nav, or any service-specific "Book [Service] →" button on the landing page.

**4. Step 1 — Service & Time:**
- Click a service card. Selected card highlights with a dark green border and green background.
- Select a future date. The date picker blocks today and past dates (they are not selectable).
- Time slots appear below the date picker. The app queries Firestore for all 9 slots at once — booked ones render greyed out with strikethrough.
- Click an available time slot. It highlights dark green.
- Click "Continue to Details →"
- If the slot became booked by someone else between your selection and clicking Continue, a toast error appears.

**5. Step 2 — Customer Details:**
- See a summary of your chosen service, date, and time at the top.
- Enter your Full Name, Email Address, and Phone Number.
- Zod validates on submit — errors appear in red below each field.
- Click "Continue to Payment →"

**6. Step 3 — Payment:**
- See the test card hint box showing all 3 valid numbers.
- See the booking summary with service, date, time, name, and price.
- Type a test card number — spaces auto-insert as you type.
- Enter any expiry (e.g. `12/27`) and any CVV (e.g. `123`).
- Click "🔒 Confirm Booking"
- Button shows "Processing..." spinner while working.
- On success: Firestore document created, emails fired, redirect to receipt page.

**7. Receipt page** — `/receipt/SP-XXXX`
- Success animation plays.
- Receipt code displayed in large monospace font.
- Instruction to show the code at the front desk.
- "Book Another Treatment" button returns to `/book`.

**8. Emails arrive:**
- Customer receives a receipt email at the address they entered.
- Admin receives a notification email at `VITE_ADMIN_EMAIL`.

---

## 16. Admin Portal Flow

**1. Navigate to `/admin`** — via the "Staff Portal" link in the shared header or directly in the browser.

**2. Login page:**
- Email field is pre-filled and read-only (shows `VITE_ADMIN_EMAIL`).
- Enter the admin password (default: `spa123`).
- Click "Sign In". A 600ms simulated delay gives a realistic feel.
- On success: `sessionStorage.setItem('admin_auth', 'true')` is called, then navigate to `/admin/dashboard`.
- On failure: toast error, form stays open.

**3. Dashboard loads:**
- Three stat cards animate in: Total Bookings, Confirmed, Checked In.
- The bookings table populates — sorted newest first.
- All data updates in real time as new bookings come in.

**4. Search and filter bookings:**
- Type in the search input to filter rows by name, email, or receipt code.
- Click "Confirmed" to see only pending guests. Click "Checked In" to see guests already admitted. Click "All" to clear the filter.

**5. Verify a receipt (check a guest in):**
- Click the "🎫 Verify Receipt" tab.
- Type the guest's `SP-XXXX` code (input auto-uppercases).
- Press Enter or click Verify.
- **Found, not checked in** → green result panel: "Guest checked in successfully!" with guest details. The booking's status in Firestore updates to `checked_in` and the table reflects this immediately.
- **Already checked in** → amber warning with the guest's details: "Guest already checked in". No second update is made.
- **Not found** → red error: "Receipt not found". Nothing changes.

**6. Sign out:**
- Click "Sign Out" (top right of dashboard).
- `sessionStorage.removeItem('admin_auth')` is called.
- Redirect to `/admin` with a "Logged out" toast.

---

## 17. Color System & Design Tokens

All colors are defined as CSS custom properties in `src/index.css` and mirrored as Tailwind theme extensions in `tailwind.config.js`.

| Token name | CSS variable | Hex value | Typical usage |
|---|---|---|---|
| spa-yellow | `--spa-yellow` | `#fef7d2` | Test card hint box, receipt code pill badges |
| spa-green | `--spa-green` | `#e6f3e6` | Booking summary cards, table header row, admin stat backgrounds |
| spa-primary | `--spa-primary` | `#c7e9c0` | Completed step indicators, checklist ticks, trust badges |
| spa-accent | `--spa-accent` | `#fae67c` | Decorative card stack element, warm accents |
| spa-dark | `--spa-dark` | `#3d5a3e` | Primary buttons, headings, logo icon, active states, footer |
| spa-text | `--spa-text` | `#2c3e2d` | Main body text, table content |
| spa-muted | `--spa-muted` | `#7a9e7b` | Labels, secondary text, placeholder text, inactive nav links |

### Background system

The global page background color is `#fafdf8` (an almost-white tinted green). Three radial gradient overlays are applied via a `body::before` pseudo-element — creating soft atmospheric color pools (green at left-center, yellow at top-right, green at bottom-center) that give the impression of a natural living environment without any image assets.

---

## 18. Typography

Three Google Fonts are loaded at the top of `src/index.css` via a single `@import url(...)` call:

| Font family | Classification | Weights loaded | Tailwind class | Usage |
|---|---|---|---|---|
| Cormorant Garamond | Serif | 300, 400, 500, 600 (regular + italic) | `font-display` | Page headlines, service names, prices, quote text |
| DM Sans | Sans-serif | 300, 400, 500, 600 | `font-body` | All body text, labels, buttons, inputs, nav |
| DM Mono | Monospace | 400, 500 | `font-mono` | Receipt codes, card numbers, timestamps |

The CSS class `receipt-code` (defined in `index.css`) applies `font-family: 'DM Mono'` and `letter-spacing: 0.15em` — used anywhere a receipt code is displayed (confirmation page, admin table, verifier result).

---

## 19. Animations

| Animation | Where | Trigger | Implementation |
|---|---|---|---|
| Hero parallax + fade | Landing page hero | Scroll | `useScroll` + `useTransform` from Framer Motion |
| Stat counters | Landing page hero | Scroll into view | `IntersectionObserver` + `setInterval` counting at ~60fps |
| Step transitions in booking wizard | `/book` | Step change | `AnimatePresence mode="wait"` — current step fades+slides left, next enters from right |
| Service tab content switch | Landing services section | Tab click | `AnimatePresence mode="wait"` — cross-fade with y-translate |
| Testimonial rotation | Landing testimonials | Auto (5s) + dot click | `AnimatePresence mode="wait"` |
| Card stack floating | Landing hero (right column) | Continuous | Three separate `motion.div` loops with different `animate` y/rotate targets, different durations and delays |
| Floating badges | Landing hero | Continuous | Separate `motion.div` loops with phase offsets |
| Page entrances | All pages | Mount | `initial={{ opacity:0, y:-10 }}` → `animate={{ opacity:1, y:0 }}` |
| Button interactions | All buttons | Hover + tap | `whileHover={{ scale: 1.02-1.04 }}` + `whileTap={{ scale: 0.97-0.98 }}` |
| Table row stagger | Admin BookingTable | Mount | `transition={{ delay: i * 0.04 }}` on each `motion.tr` |
| Receipt success icon | `/receipt/:code` | Mount | `animate={{ scale: [1, 1.1, 1] }}` — pulses twice |
| Stat card entrance | Admin dashboard | Mount | `initial={{ opacity:0, y:10 }}` with delay offsets |
| Receipt verifier result | Admin ReceiptVerifier | Verify click | `AnimatePresence` → scale+y spring animation |
| Shimmer skeleton | CSS only | Loading states | `.shimmer` class using gradient animation (available for use) |
| Custom scrollbar | CSS only | Scroll | `::webkit-scrollbar` styled in `index.css` |

---

## 20. Error Handling & Edge Cases

| Scenario | Behaviour |
|---|---|
| Double-booking same slot | Availability is pre-checked when service or date changes (greyed slots). Checked again on "Continue". If taken in the gap, toast: "This slot was just taken. Please choose another time." |
| Invalid dummy card entered | Toast error naming all 3 valid cards. Form stays open. No Firestore write happens. |
| Firebase quota exceeded or network error | `createBooking` rejects. PaymentStep catch block shows: "Something went wrong. Please try again." No partial data written. |
| EmailJS failure | Caught silently with `console.error`. The booking IS saved in Firestore — the customer may not receive an email but the booking exists and the admin can look it up. |
| Admin accesses `/admin/dashboard` without login | `AdminGuard` renders `<Navigate to="/admin" replace />` before any dashboard content is shown. |
| Admin enters code that doesn't exist | Result panel shows ❌ "Receipt not found". No Firestore update. |
| Admin enters code already checked in | Result panel shows 🔄 "Guest already checked in" with guest details. No duplicate update to Firestore. |
| Selecting a past date | The `<input type="date" min={getMinDate()}>` blocks past dates in the browser's native picker. |
| Navigating to `/receipt/INVALID-CODE` | The page renders with whatever code is in the URL — no Firestore lookup happens on the receipt page (the code was just generated moments before). |
| Refreshing the page mid-booking | React state is cleared. The user returns to Step 1. Booking data in React Context is not persisted to localStorage. |
| Admin tab refresh | `sessionStorage` persists through a refresh but is cleared when the browser tab is closed. Refreshing `/admin/dashboard` re-checks `sessionStorage` via `AdminGuard`. |

---

## 21. Deploying to Production

### Netlify (recommended)

1. Push the project to GitHub (ensure `.env` is in `.gitignore` and not committed)
2. Go to [https://netlify.com](https://netlify.com) → **Add new site → Import an existing project → GitHub**
3. Select your repository
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Show advanced** → add each `.env` variable as a separate environment variable
6. Click **Deploy site**
7. Add a `_redirects` file inside the `public/` folder to prevent 404 errors on direct URL access (e.g. refreshing `/book`):
   ```
   /*    /index.html    200
   ```
8. Re-deploy after adding the `_redirects` file

### Vercel

1. Push to GitHub
2. Go to [https://vercel.com](https://vercel.com) → **New Project → Import** from GitHub
3. Framework preset: select **Vite** (Vercel detects it automatically)
4. Under **Environment Variables**, add each variable from your `.env`
5. Click **Deploy**
6. Vercel automatically handles SPA routing — no `_redirects` file needed

### Post-deployment checklist

- [ ] All 15 environment variables are set in the hosting platform
- [ ] Firestore security rules updated to production rules (Section 22)
- [ ] EmailJS template tested by making a real booking
- [ ] Composite Firestore index created (if prompted in browser console)
- [ ] Admin login tested on the deployed URL
- [ ] `_redirects` file present (Netlify only)

---

## 22. Firestore Security Rules

The default test mode rules have an expiry date and eventually stop working. Replace them with these more intentional rules for a permanent deployment.

Go to: Firebase Console → Firestore Database → Rules tab.

### Minimum rules for this system

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{bookingId} {

      // Anyone can read (needed for availability checks and admin dashboard)
      allow read: if true;

      // Anyone can create a booking — but only with the expected fields
      // and only with status "confirmed"
      allow create: if
        request.resource.data.keys().hasAll([
          'receiptCode', 'customerName', 'customerEmail',
          'customerPhone', 'service', 'date', 'timeSlot',
          'status', 'paymentLast4', 'createdAt', 'emailSentToAdmin'
        ])
        && request.resource.data.status == 'confirmed';

      // Only allow updating the status field to "checked_in"
      allow update: if
        request.resource.data.diff(resource.data)
          .affectedKeys().hasOnly(['status'])
        && request.resource.data.status == 'checked_in';

      // Nobody can delete bookings (protect audit trail)
      allow delete: if false;
    }
  }
}
```

> **Note:** These rules still allow any internet user to read all bookings (required for the public availability check without user authentication). For a fully private admin dashboard, you would add Firebase Authentication for admin users and add `request.auth != null` conditions to the read rules. This is marked as a future enhancement.

---

## 23. EmailJS Template Setup

Here is a complete, styled HTML email template you can paste directly into the EmailJS template editor (switch to HTML mode):

**Subject field:**
```
✨ Glamour Spa — Booking Confirmed ({{receipt_code}})
```

**Body (HTML):**
```html
<div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; padding: 48px 24px; color: #2c3e2d; background: #fafdf8;">

  <div style="margin-bottom: 32px;">
    <span style="font-size: 24px;">🌿</span>
    <strong style="font-size: 18px; color: #3d5a3e; margin-left: 8px;">Glamour Spa</strong>
  </div>

  <h1 style="font-size: 30px; font-weight: 400; margin-bottom: 8px; line-height: 1.2;">
    Your booking is confirmed ✨
  </h1>
  <p style="color: #7a9e7b; margin-bottom: 40px; font-size: 15px;">
    Thank you for choosing Glamour Spa, {{customer_name}}.
  </p>

  <div style="background: #e6f3e6; border-radius: 16px; padding: 28px; margin-bottom: 32px; text-align: center;">
    <p style="margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #7a9e7b;">
      Your Receipt Code
    </p>
    <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; letter-spacing: 0.2em; color: #3d5a3e;">
      {{receipt_code}}
    </p>
    <p style="margin: 12px 0 0; font-size: 13px; color: #7a9e7b;">
      Show this code at the front desk when you arrive
    </p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e6f3e6; color: #7a9e7b; font-size: 13px; width: 40%;">Service</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e6f3e6; font-weight: 600; font-size: 15px;">{{service}}</td>
    </tr>
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e6f3e6; color: #7a9e7b; font-size: 13px;">Date</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e6f3e6; font-weight: 600; font-size: 15px;">{{date}}</td>
    </tr>
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e6f3e6; color: #7a9e7b; font-size: 13px;">Time</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e6f3e6; font-weight: 600; font-size: 15px;">{{time}}</td>
    </tr>
    <tr>
      <td style="padding: 12px 0; color: #7a9e7b; font-size: 13px;">Status</td>
      <td style="padding: 12px 0; font-weight: 600; font-size: 15px; color: #3d5a3e; text-transform: capitalize;">{{status}}</td>
    </tr>
  </table>

  <p style="font-size: 14px; color: #7a9e7b; line-height: 1.9; margin-bottom: 40px;">
    If you need to reschedule or have any questions before your appointment,
    please contact us as early as possible. We look forward to welcoming you.
  </p>

  <div style="border-top: 1px solid #e6f3e6; padding-top: 28px;">
    <p style="margin: 0; color: #3d5a3e; font-size: 15px;">
      With warmth,<br/>
      <strong>The Glamour Spa Team</strong>
    </p>
  </div>
</div>
```

Make sure the **To Email** field in the EmailJS template settings panel (not in the body) is set to `{{to_email}}`.

---

## 24. Frequently Asked Questions

**Q: Can I add more than 4 services?**

Yes. In `src/components/BookingForm/ServiceStep.jsx`, find the `SERVICES` array at the top of the file and add a new object. Do the same in `src/pages/LandingPage.jsx` in the `SERVICES` array at the top. Both arrays must stay in sync. No other changes are needed — the grid and tab UI adapt automatically.

---

**Q: Can I change the time slots?**

Yes. Edit the `TIME_SLOTS` array in `src/utils/dateHelpers.js`. You can add, remove, or reorder time strings. They must be in `"HH:MM"` 24-hour format. The time slot grid in `ServiceStep.jsx` renders whatever is in that array.

---

**Q: Can I change the prices?**

Prices are hardcoded in two places: `ServiceStep.jsx` (booking wizard) and `LandingPage.jsx` (services showcase). Update them in both files. Since this is a demo with simulated payment, the price displayed is purely cosmetic — no real amount is processed.

---

**Q: What happens if two customers book the same slot simultaneously?**

The slot is checked immediately before the Firestore write, but there is a narrow race window where two users could both pass the check before either booking is written. Firestore writes are atomic so both documents would be created, resulting in a double-booking for that slot. For production use, this should be handled with a Firestore transaction or a Cloud Function that performs an atomic check-and-write. This is listed as a future enhancement.

---

**Q: Can I use real payments instead of dummy cards?**

Yes. Replace the `validateDummyCard()` check in `PaymentStep.jsx` with a call to your payment provider's frontend SDK. For Nigeria, Paystack is the most common choice. Initialize Paystack inline with the booking amount, collect the payment reference, then call `createBooking()` with the reference stored in the booking document. The Firestore write should only happen after the payment provider confirms payment success.

---

**Q: Why is the admin password in `.env` and not in a database?**

This is a deliberate simplification for a demo system. The password comparison happens client-side in JavaScript, which means technically a determined person could find it in the JS bundle. For a production admin portal, use Firebase Authentication to create a real admin user with server-enforced credentials, proper session tokens, and the ability to revoke access without redeploying.

---

**Q: Can multiple staff members use the admin dashboard at the same time?**

Yes. Because the dashboard uses Firestore's `onSnapshot`, all open admin browser windows receive the same live data. If one staff member checks a guest in, all other admin views update in real time. The last write wins — there is no conflict resolution needed since `checked_in` is a final state.

---

**Q: The app works locally but emails are not sending. What should I check?**

1. Verify all three `VITE_EMAILJS_*` variables are correctly set in your `.env` file.
2. Open the browser DevTools console — look for any EmailJS-related error messages.
3. Check your EmailJS dashboard under **Logs** → **Sent** for failed entries with error details.
4. Verify your EmailJS free tier quota (200/month) has not been used up.
5. Confirm that the Gmail/Outlook account connected to your EmailJS service still has the authorization active (sometimes OAuth tokens expire).
6. Make sure your email template's **To Email** field is set to `{{to_email}}` and not a hardcoded address.

---

**Q: I see a Firestore error about a missing index. What do I do?**

This is expected the first time the availability query runs in a new Firebase project. The browser console error contains a clickable URL that takes you directly to the Firebase console to create the composite index. Click the URL, click **Create index**, and wait about 60 seconds for the index to build. You will only need to do this once.

---

**Q: Can I rebrand this for a different kind of booking business?**

Yes — the system is generic enough to adapt. Change the service names, prices, and time slots. Replace spa-specific language in the landing page copy. Update the color tokens in `tailwind.config.js` and `index.css`. The Firestore structure, booking flow, email system, and admin portal all work for any appointment-based business.

---

## 25. Future Enhancements

The following features are architectural next steps that were not implemented in this version:

| Enhancement | What it would add |
|---|---|
| Firebase Authentication for admin | Replace the `sessionStorage` password check with real Firebase Auth — multiple admin accounts, proper password hashing, revocable access |
| Firestore transactions for booking | Atomic check-and-write to fully eliminate the double-booking race condition |
| QR code receipts | Generate a QR code from the `SP-XXXX` code and embed it in the confirmation page and email — staff scan instead of typing |
| Paystack payment integration | Replace dummy card validation with real Paystack inline payment for Nigerian card processing |
| Customer booking cancellation | Allow guests to cancel by entering their receipt code — updates status to `cancelled`, sends a cancellation email |
| Admin statistics and charts | Daily/weekly booking volumes, most popular services, peak hour heatmap, simulated revenue totals |
| SMS receipts via Termii or Africa's Talking | Send the receipt code as an SMS to the guest's phone number at booking time |
| 24-hour reminder emails | A Firebase Cloud Function scheduled to run hourly, querying tomorrow's bookings and sending reminder emails |
| Repeat customer memory | Save customer name, email, and phone to `localStorage` so returning customers don't re-enter their details |
| Multi-location support | Add a `location` field to bookings and a location selector in the booking wizard — filter the admin dashboard by location |
| Staff scheduling | Add therapist records and link each booking to a specific therapist — prevent double-booking a staff member |
| Dark mode | System-preference-aware dark theme using Tailwind's `dark:` variant throughout |
| Multi-language support | Add i18n support for Yoruba, Hausa, and Igbo alongside English |
| Gift vouchers | Generate purchasable gift codes that apply a credit toward any service booking |

---

## Built With

This system was designed and developed as a complete, zero-backend spa management solution. Every component, utility, service, and page was written from scratch — no third-party component library (Material UI, Chakra, shadcn, etc.) was used. All UI elements including buttons, cards, tables, forms, modals, and step indicators are custom-built with Tailwind CSS and Framer Motion.

The aesthetic direction is **organic luxury** — natural greens, warm yellows, serif display typography paired with a clean sans-serif body font, and motion design that feels alive and intentional without being distracting or heavy.

---

*Glamour Spa Booking System — crafted with care for the modern beauty industry.*