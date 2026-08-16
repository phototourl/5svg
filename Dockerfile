# ========== 阶段 1：安装依赖 ==========
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@11.1.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml svelte.config.js tsconfig.json vite.config.ts content-collections.ts ./
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

# ========== 阶段 2：构建 ==========
FROM base AS builder
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
ARG PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=$NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL
ENV NODE_OPTIONS=--max-old-space-size=6144
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run check:size
RUN pnpm build:og-icons \
  && pnpm build:sitemaps \
  && pnpm build:registry
RUN pnpm vite build

# ========== 阶段 3：运行 ==========
# Dokploy Build-time Arguments → runner ENV（Creem / DB / Resend）.
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ARG PUBLIC_SITE_URL
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG RESEND_API_KEY
ARG RESEND_FROM_EMAIL
ARG CREEM_API_KEY
ARG CREEM_WEBHOOK_SECRET
ARG CREEM_SERVER_IDX
ARG CREEM_PRICE_ID_SINGLE
ARG CREEM_PRICE_ID_WHOLE

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV RESEND_FROM_EMAIL=$RESEND_FROM_EMAIL
ENV CREEM_API_KEY=$CREEM_API_KEY
ENV CREEM_WEBHOOK_SECRET=$CREEM_WEBHOOK_SECRET
ENV CREEM_SERVER_IDX=$CREEM_SERVER_IDX
ENV CREEM_PRICE_ID_SINGLE=$CREEM_PRICE_ID_SINGLE
ENV CREEM_PRICE_ID_WHOLE=$CREEM_PRICE_ID_WHOLE

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 sveltekit

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER sveltekit
EXPOSE 3000

CMD ["node", "build"]
