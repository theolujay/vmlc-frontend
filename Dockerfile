FROM node:24-alpine AS base
# =========================================================
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci
# =========================================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
# =========================================================
FROM base AS development
WORKDIR /app
ENV NODE_ENV=development \
    WATCHPACK_POLLING=false \
    CHOKIDAR_USEPOLLING=false

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY package*.json ./
RUN npm ci

COPY --chown=nextjs:nodejs . .
USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "run", "dev"]
# =========================================================
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    WATCHPACK_POLLING=false \
    CHOKIDAR_USEPOLLING=false

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]