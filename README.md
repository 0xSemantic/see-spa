# 🌿 Serene Spa Booking System

Full-stack-free spa booking app with Firebase, EmailJS, dummy payments & admin portal.

## Quick Start
1. npm install
2. Fill in .env with Firebase + EmailJS credentials (see below)
3. npm run dev → http://localhost:5173

## .env Setup
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_EMAILJS_SERVICE_ID=service_xxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxx
VITE_EMAILJS_PUBLIC_KEY=user_xxxx

VITE_ADMIN_EMAIL=admin@spa.com
VITE_ADMIN_PASSWORD=spa123

VITE_DUMMY_CARD_1=4111111111111111
VITE_DUMMY_CARD_2=5555555555554444
VITE_DUMMY_CARD_3=378282246310005

## Firebase Setup
1. console.firebase.google.com → New project
2. Add web app → copy config to .env
3. Firestore → Create database (test mode)
4. Rules: allow read, write: if true;

## EmailJS Setup
1. emailjs.com → free account
2. Add email service (Gmail/Outlook)
3. Create template with: {{customer_name}} {{receipt_code}} {{service}} {{date}} {{time}} {{to_email}}
4. Copy Service ID, Template ID, Public Key to .env

## Test Cards
4111 1111 1111 1111 (Visa)
5555 5555 5555 4444 (Mastercard)
3782 822463 10005 (Amex)

## Admin
Visit /admin → password: spa123
- View all bookings
- Verify receipts to check guests in
