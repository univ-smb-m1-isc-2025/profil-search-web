FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run buildProd

FROM nginx:alpine
# Créer un utilisateur non privilégié
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Ajuster les permissions pour l'utilisateur non privilégié
RUN mkdir -p /var/cache/nginx /var/run/nginx && \
  touch /var/run/nginx.pid && \
  chown -R appuser:appgroup /var/cache/nginx /var/run/nginx /var/run/nginx.pid && \
  chmod -R 770 /var/cache/nginx /var/run/nginx

# Copier la configuration et les fichiers de build
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/profil-search/browser /usr/share/nginx/html

# Changer l'utilisateur par défaut
USER appuser

EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
