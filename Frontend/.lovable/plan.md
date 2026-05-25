
# Yogini Planters — Build Plan

Your spec is large (full marketing site + 20 admin modules + 15 customer modules + payments + CMS + inventory + CRM). Building **every** sub-feature with a real backend in one shot would take many hours and produce something brittle. I want to ship something genuinely usable and deploy-ready, then iterate.

Here is what I propose for **this build**:

## Phase 1 — Ship now (this turn)

### Marketing website (public)
- Multi-route, SEO-ready, mobile-responsive, elegant botanical design
- Routes: `/` Home, `/about`, `/services`, `/services/indoor`, `/services/balcony`, `/services/landscaping`, `/services/wellness`, `/maintenance`, `/gallery`, `/testimonials`, `/contact`
- Your uploaded **logo** used in header/footer
- Hero, service cards, process, testimonials, contact form, WhatsApp CTA
- AI-generated lifestyle plant imagery for hero + section visuals
- Palette: sage green / cream / soft blush (matching your logo)
- Typography: Cormorant + Inter (elegant + readable)

### Auth (dummy, client-side)
- `/login` with two demo accounts pre-filled:
  - **Admin:** `admin@yogini.com` / `admin123`
  - **Customer:** `customer@yogini.com` / `customer123`
- Role-based redirect to `/admin` or `/dashboard`
- Session stored in sessionStorage (no backend required for demo)

### Admin Dashboard (functional with seeded mock data, sessionStorage-persisted)
Working CRUD on the **highest-value** modules:
1. Overview (KPIs + charts via Recharts)
2. Customers (list, add, edit, delete)
3. Consultations (approve, reschedule, status)
4. Bookings (status workflow)
5. Maintenance Subscriptions (pause/resume/renew)
6. Plant Wellness Tickets (diagnose, close)
7. Leads / CRM (status pipeline)
8. Testimonials (approve/hide)
9. Gallery (before/after upload — local)
10. Settings (business profile)

Remaining modules (Staff, Inventory, Payments/Billing, Packages, Notifications, Reports, Coupons, Blog, CMS) will appear in the sidebar as **placeholder pages with "Coming soon"** so the structure is in place. Wiring all 20 fully needs a real backend.

### Customer Dashboard (functional, sessionStorage-persisted)
1. Overview
2. Profile
3. Book a Service (form → creates booking)
4. My Bookings (cancel/reschedule)
5. Maintenance plan view
6. Wellness ticket — raise issue with photo upload
7. Payments history (mock)
8. Notifications
9. Plant Care Library (static content)
10. Support / Contact

Wishlist, Refer & Earn, Reviews — placeholder pages.

## Phase 2 — Future (recommend enabling Lovable Cloud)
For real production: real auth, persistent database across devices, payment integration (Razorpay/Stripe), email/WhatsApp notifications, file uploads to storage, GST invoicing. I'll prompt you to enable Lovable Cloud when you're ready.

## Technical notes
- TanStack Start + React 19 + Tailwind v4 + shadcn
- All state via sessionStorage + React Query for now (swappable to Cloud later)
- Logo copied to `src/assets/logo.png`
- Generated hero/section images in `src/assets/`
- Design tokens defined in `src/styles.css` (sage/cream palette, oklch)

## What I will NOT do this turn
- Real payment processing
- Real email/SMS/WhatsApp sending
- Multi-device data sync (needs backend)
- 100% of the 35+ sub-features fully wired — would take several turns and produce lower quality if rushed

**Approve this plan and I'll build it in one go.** If you want a different split (e.g. "skip customer dashboard, go deeper on admin"), tell me now.
