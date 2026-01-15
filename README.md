# HabitOS - Production Habit Tracking PWA

A production-grade, offline-first Progressive Web App for tracking daily habits. Built with Next.js 16, TypeScript, Prisma, and PostgreSQL.

## Features

- ✅ Daily habit tracking with checkboxes
- ✅ Streak calculation and tracking
- ✅ GitHub-style calendar heatmap
- ✅ Statistics and discipline score
- ✅ Daily journal with mood tracking
- ✅ Offline-first architecture with IndexedDB
- ✅ Push notifications for habit reminders
- ✅ PWA support (installable on iPhone)
- ✅ Mobile-first responsive design

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: ShadCN UI
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **State Management**: Zustand
- **Charts**: Recharts
- **PWA**: Service Worker, Web Push API

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon, Supabase, or self-hosted)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd habitos
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add:
- `DATABASE_URL` - Your PostgreSQL connection string
- `AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `AUTH_URL` - Your app URL (e.g., `http://localhost:3000`)
- `VAPID_PUBLIC_KEY` - For push notifications (optional)
- `VAPID_PRIVATE_KEY` - For push notifications (optional)
- `VAPID_SUBJECT` - Email for VAPID (e.g., `mailto:admin@habitos.app`)
- `CRON_SECRET` - Secret for cron job authentication

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Generate app icons:
   - Create 192x192 and 512x512 pixel PNG images for your app icons
   - Save them as `public/icon-192.png` and `public/icon-512.png`
   - These are required for PWA installation

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
habitos/
├── app/                    # Next.js App Router
│   ├── actions/           # Server actions
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── habits/            # Habit management pages
│   ├── calendar/          # Calendar heatmap page
│   ├── stats/             # Statistics page
│   └── journal/           # Journal page
├── components/            # React components
│   ├── ui/                # ShadCN UI components
│   ├── dashboard/         # Dashboard components
│   ├── habits/            # Habit components
│   ├── calendar/          # Calendar components
│   ├── stats/             # Stats components
│   └── journal/           # Journal components
├── lib/                   # Utility functions
├── prisma/                # Prisma schema
└── public/                # Static assets
```

## Database Schema

- **User**: User accounts
- **Habit**: User habits
- **HabitLog**: Daily habit completion logs
- **DailyNote**: Daily journal entries
- **NotificationSetting**: Push notification preferences
- **SystemSettings**: User system settings
- **PushSubscription**: Web push subscriptions

## PWA Features

### Installation

On iPhone:
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will install as a standalone app

### Offline Support

- Habits and logs are cached in IndexedDB
- Changes made offline are queued and synced when online
- Service worker caches static assets and API responses

### Push Notifications

1. Generate VAPID keys:
```bash
npx web-push generate-vapid-keys
```

2. Add keys to `.env`

3. Set up a cron job to call `/api/notifications/send` at desired times

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database

Use Neon, Supabase, or any PostgreSQL provider. Update `DATABASE_URL` in your environment variables.

### Cron Jobs

Set up cron jobs for:
- Daily reset: `POST /api/cron/daily-reset` (runs at midnight)
- Notifications: `POST /api/notifications/send` (runs at reminder times)

Use Vercel Cron, GitHub Actions, or a service like cron-job.org.

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## License

MIT

