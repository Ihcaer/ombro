FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build:prod

RUN npm prune --omit=dev && rm -rf node_modules/.cache

FROM nginx:1.29-alpine AS final

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /usr/share/nginx/html/admin

COPY --from=builder /app/dist/apps/admin-panel/browser /usr/share/nginx/html/admin
COPY --from=builder /app/dist/apps/admin-panel/3rdpartylicenses.txt /usr/share/nginx/html/admin
COPY --from=builder /app/dist/apps/admin-panel/prerendered-routes.json /usr/share/nginx/html/admin

EXPOSE 80