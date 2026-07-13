FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Dummy variable for build (prisma client generation)
ENV POSTGRES_URL=postgresql://user:pass@localhost:5432/tempdb

COPY . .

RUN npm run build

RUN npm prune --omit=dev && rm -rf node_modules/.cache

FROM node:24-alpine AS final

WORKDIR /app

COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/prisma.config.ts ./

USER node

EXPOSE 3000

CMD ["sh", "-c", "npm run start:prod"]