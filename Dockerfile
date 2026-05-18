# syntax=docker/dockerfile:1.7

# ─── Stage 1: build the Vite bundle ──────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack (ships with Node).
RUN corepack enable

# Install deps first for layer caching. HUSKY=0 disables the `prepare` hook
# (which runs `husky` and fails because .git isn't in the Docker build context).
ENV HUSKY=0
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy the source and build.
COPY . .

# The build needs at least VITE_API_URL at build time because Vite inlines
# import.meta.env.* into the bundle. Pass via --build-arg or compose `args:`.
ARG VITE_API_URL=/api/v1/
ARG VITE_FILE_URL=/
ARG VITE_NODE_ENV=production
ENV VITE_API_URL=${VITE_API_URL} \
    VITE_FILE_URL=${VITE_FILE_URL} \
    VITE_NODE_ENV=${VITE_NODE_ENV}

RUN pnpm build

# ─── Stage 2: serve dist/ with nginx ─────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# SPA-aware nginx config (try_files fallback to index.html for React Router).
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
