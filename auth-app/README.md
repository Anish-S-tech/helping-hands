# Helping Hands

A professional collaboration platform connecting builders with founders.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **Database:** Supabase
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd auth-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production URL)

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in project settings
5. Deploy

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login pages (user/founder)
│   ├── signup/            # Signup pages (user/founder)
│   ├── profile/           # Profile completion flows
│   ├── dashboard/         # User dashboards
│   ├── chat/              # Chat interface
│   ├── explore/           # Project exploration
│   └── projects/          # Project management
├── components/            # Reusable React components
│   └── ui/               # shadcn/ui components
├── contexts/             # React Context providers
├── data/                 # Mock data
└── lib/                  # Utility functions
```

## Features

- **Role-based Authentication:** Separate flows for Builders and Founders
- **Profile Completion:** Multi-step onboarding wizards
- **Dashboard:** Table-based project management
- **Real-time Chat:** Project channels and direct messages
- **Project Management:** Create, explore, and manage projects

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

Private - All rights reserved
