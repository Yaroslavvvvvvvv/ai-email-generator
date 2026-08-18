# Build and run without baking credentials into the image: the Supabase values
# are read at runtime through Nuxt's NUXT_-prefixed overrides, so the same image
# is safe to push anywhere and can be pointed at a different project.

FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts && npx nuxt prepare

COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

COPY --from=builder /app/.output ./.output

EXPOSE 3000
USER node

CMD ["node", ".output/server/index.mjs"]
