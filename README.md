# VMLC Frontend

This is the frontend for the VMLC platform, built with Next.js.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v20+)
*   [NPM](https://www.npmjs.com/)
*   [Docker](https://www.docker.com/) (recommended)

### Environment Variables

This project uses different `.env` files for each environment:

*   **.env**: For local development
*   **staging.env**: For the staging environment
*   **prod.env**: For the production environment

Create the necessary files and populate them with the required variables. The `NEXT_PUBLIC_API_URL` is required in all environments.

```env
NEXT_PUBLIC_BASE_URL=<base_url>
NEXT_PUBLIC_API_KEY=<api_key>
```

Contact a project administrator for the correct values for each environment.

### Installation

Install the project dependencies:

```bash
npm install
```

## Development

You can run the application in different environments using Docker Compose.

### Local Development

This command starts the development server with hot-reloading enabled.

```bash
docker compose -f compose.dev.yml up -d --build
```

The application will be available at [http://dev-portal.localhost](http://dev-portal.localhost).

### Staging

This command deploys the application to the staging environment.

```bash
docker compose -f compose.staging.yml up -d
```

### Production

This command deploys the application to the production environment.

```bash
docker compose -f compose.prod.yml up -d
```

### Without Docker

To run the application directly on your host machine for development:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script        | Description                                             |
| ------------- | ------------------------------------------------------- |
| `npm run dev`   | Starts the development server with Turbopack.           |
| `npm run build` | Builds the application for production.                  |
| `npm run start` | Starts a production server.                             |
| `npm run lint`  | Runs ESLint to check for code quality and style issues. |
