# VMLC Frontend

> Candidate and staff portal for the **Verboheit Mathematics League Competition**, a free annual mathematics competition for senior secondary school students (SS1–SS3) across Nigeria.

This Next.js application provides the user-facing interface for candidates to register, take exams, view results and leaderboards, and for staff to manage questions, exams, candidates, proctoring, and competition stages.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15, React 19 |
| Styling | Tailwind CSS, PostCSS |
| State / Data | TanStack React Query, React Hook Form |
| HTTP Client | Axios |
| UI Components | Radix UI, motion, react-paginate |
| Charts | Chart.js + react-chartjs-2 |
| Maths | KaTeX, MathLive |
| Face Capture | face-api.js, html5-qrcode |
| Linting | ESLint, Prettier |
| Analytics | Vercel Analytics, Speed Insights |

---

## Project Structure

```
src/
├── app/                 Next.js App Router (pages, layouts, API routes)
│   ├── auth/            Login, password reset, registration
│   ├── dashboard/       Candidate and staff dashboards
│   ├── exams/           Exam-taking, results, history
│   ├── admin/           Staff management views
│   ├── proctoring/      Live proctoring feeds
│   └── helpdesk/        Ticket management
├── components/          Reusable UI components
│   ├── ui/              Atomic design system (Button, Card, Modal, etc.)
│   ├── forms/           Form components and field wrappers
│   ├── layout/          Shell, navigation, sidebar
│   └── charts/          Chart.js wrappers
├── contexts/            React context providers (auth, theme, etc.)
├── hocs/                Higher-order components (withAuth, withRole)
├── hooks/               Custom React hooks (useApi, useDebounce, etc.)
├── services/            API service layer (axios instances, endpoint functions)
├── constants/           App-wide constants and enums
├── types/               TypeScript type definitions
└── utils/               Utility functions (formatting, validation, etc.)
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm
- Docker (recommended)

### Using Docker (recommended)

```bash
cp .env.example .env
docker compose -f compose.dev.yml up --build
```

The application will be available at [http://dev-portal.localhost](http://dev-portal.localhost).

### Local Development

```bash
npm install
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_API_KEY` | Yes | API key for backend requests |
| `NEXT_PUBLIC_BASE_URL` | Yes | Frontend base URL (for redirects) |

See `.env` for local defaults. Contact a project administrator for staging and production values.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack (hot reload) |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the codebase |
| `npm run format` | Format source files with Prettier |

---

## Deployment

CI/CD is managed via GitHub Actions. The application is deployed to Vercel:

| Branch | Environment |
|---|---|
| `main` | Production |
| `dev` | Staging |

---

## Contributing

Branch from `main`, make your changes, then open a pull request against `release`.

```bash
git checkout -b feat/your-feature-name
```

Before submitting:

```bash
npm run lint
npm run build
```

---

Built for Verboheit · [verboheit.org](https://verboheit.org)
