# @TEAM Full-Stack Services Website

This package upgrades the static website into a working full-stack app.

## What is now functional

- Direct website-project booking from `Start a Project`.
- Every booking is saved in MongoDB with a unique booking ID such as `TEAM-20261001-ABC123`.
- Contact-page messages are saved in MongoDB with their own ticket ID.
- Private admin dashboard at `/admin.html`.
- Admin can view bookings/messages, change status, add internal notes, and delete records.
- Optional SMTP notifications can email @TEAM and the client when an order is booked.
- WhatsApp and email remain available as fallback copies of the booking brief.
- Basic server hardening: Helmet, request-size limit, validation, rate limiting, JWT admin sessions.

## Run locally

1. Install Node.js 18 or newer.
2. Create a MongoDB Atlas database.
3. Copy `.env.example` to `.env`.
4. Put your actual MongoDB connection string in `MONGODB_URI`.
5. Set a strong `ADMIN_PASSWORD` and a long random `JWT_SECRET`.
6. In this project folder run:

```bash
npm install
npm start
```

Open:

- Website: `http://localhost:5000`
- Project booking: `http://localhost:5000/start-project.html`
- Admin: `http://localhost:5000/admin.html`

Do not open the HTML files directly with `file://` when testing the backend. Run the Node server and use `http://localhost:5000`.

## Required `.env` values

```env
MONGODB_URI=your_mongodb_atlas_connection_string
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=a_strong_password
JWT_SECRET=a_long_random_secret
TEAM_EMAIL=teamfordeveloper@gmail.com
```

SMTP is optional. Without SMTP, orders/messages are still stored in MongoDB and visible in Admin.

## Direct order flow

Client completes all 8 steps -> Review -> **Book Order Now** -> `POST /api/orders` -> MongoDB saves the booking -> client receives a Booking ID -> Admin sees the booking instantly.

## API

Public:
- `GET /api/health`
- `POST /api/orders`
- `GET /api/orders/:bookingId/status`
- `POST /api/contact`

Admin:
- `POST /api/admin/login`
- `GET /api/admin/stats`
- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `PATCH /api/admin/orders/:id`
- `DELETE /api/admin/orders/:id`
- `GET /api/admin/messages`
- `PATCH /api/admin/messages/:id`
- `DELETE /api/admin/messages/:id`

## Deployment

The app can run as a normal Node app on a host that supports Node/Express. A `vercel.json` and `api/index.js` are also included for a Vercel-style serverless deployment. Add all environment variables in the hosting dashboard before deploying.

For persistent production orders, use MongoDB Atlas. Do not replace it with a local JSON/SQLite file on serverless hosting.


## Admin access inside the website

The public website now includes a discreet **Admin Login** link in the footer of every public page.

- Public site: `http://localhost:5000`
- Admin entry: click **Admin Login** in the footer
- Direct admin URL: `http://localhost:5000/admin.html`

The admin area still requires `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` from `.env`. The footer link only makes the login page discoverable; it does not bypass authentication.

## Brand icon, favicon and future app support

This build includes a complete @TEAM identity package using a bold black **@** on white:

- Browser favicon: `client/favicon.ico` and `client/favicon.svg`
- Chrome / browser PNG icons: `client/assets/brand/favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`
- iPhone / iPad home-screen icon: `client/apple-touch-icon.png`
- Android / installable web-app icons: `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`
- Windows tile icon: `mstile-150x150.png` + `browserconfig.xml`
- PWA manifest: `client/manifest.webmanifest`
- Service worker / offline shell: `client/service-worker.js`, `client/offline.html`

The app can therefore be installed from supported browsers after deployment over HTTPS. The project is also prepared for a later PWA-to-mobile-app wrapper if required.

## Responsive coverage

The CSS includes additional responsive hardening for wide desktop, laptop/tablet, 760px mobile, 480px small mobile and 360px narrow mobile layouts. Mobile navigation, forms, booking steps, cards, project previews, admin screens and horizontal category/step navigation have specific small-screen behavior.

## Mobile responsive polish (2026-10-03)

This build adds a dedicated `client/assets/mobile-polish.css` layer and improved mobile navigation behavior. It fixes the sticky menu after scrolling, adds consistent side gutters, turns long card lists into swipeable compact rails, makes the home process a 2×2 mobile grid, compacts detailed process phases, rebuilds the footer for phones, and makes service/category sliders full-width and touch-friendly.


## Mobile nav + Process page fix

- Mobile header/navigation is now viewport-fixed, so the menu opens from any scroll position on every page.
- Added a real backdrop and scroll-safe drawer behavior.
- Updated the PWA service worker to fetch fresh JS/CSS so older cached menu code does not keep reappearing.
- Rebuilt Process as a compact six-stage workflow. On mobile the detailed stages are accordions, avoiding very tall vertical cards.


## Mobile carousel removal update

- Home service/category strip is now a compact 2-column grid instead of a horizontal carousel.
- Services category navigation uses the full phone width with five fixed tabs and no sideways scrolling.
- Services pricing cards are full-width compact cards; no card is partially hidden off-screen.
- Automatic horizontal tab centering was removed because the category navigation is no longer a carousel.
