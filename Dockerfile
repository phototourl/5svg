# ========== 阶段 1：安装依赖（对齐 phototourl 多阶段构建） ==========
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@11.1.0 --activate
WORKDIR /app

FROM base AS deps
# 安装前带上 Svelte 配置，避免 prepare 里 svelte-kit sync 报 Missing config
COPY package.json pnpm-lock.yaml svelte.config.js tsconfig.json vite.config.ts content-collections.ts ./
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

# ========== 阶段 2：构建 ==========
# Dokploy Build-time Arguments（与 phototourl 相同）:
#   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-V4P03XBERL
#
# Icon packs live in git under static/{bootstrap-icons,font-awesome-7,react-icons} (~45MB).
# Run `pnpm build:pack-indexes` before commit so each pack has index.json.
FROM base AS builder
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=$NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
# adapter-node prerender + large static/icon packs can exceed Node’s default ~2GB heap
ENV NODE_OPTIONS=--max-old-space-size=6144
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run check:size
RUN pnpm run build:prod

# ========== 阶段 3：运行（SvelteKit adapter-node → node build） ==========
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 sveltekit

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER sveltekit
EXPOSE 3000

CMD ["node", "build"]
