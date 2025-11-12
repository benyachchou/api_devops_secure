# ===== Builder stage =====
FROM node:20-alpine AS builder

# Installer les dépendances système nécessaires pour les modules natifs (si présents)
RUN apk add --no-cache g++ make python3

WORKDIR /app

# Préparer/assurer les permissions non-root pour l'utilisateur node
RUN chown -R node:node /app
USER node

# Copier les manifestes de dépendances au préalable (caching Docker)
COPY package*.json ./

# Installer uniquement les dépendances de production, puis recompiler bcrypt si nécessaire
RUN npm ci --omit=dev --no-audit --no-fund --ignore-scripts \
    && npm rebuild bcrypt --build-from-source

# Copier le code source de l'application (cible précise)
COPY src ./src
COPY server-secure.mjs ./server-secure.mjs

# ===== Runtime stage (non-root) =====
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Copier l’application compilée depuis le builder :
COPY --from=builder /app /app

# Si tu veux inclure un .env dans l'image (exemple pour dev/staging)
COPY --chown=node:node env env

# Fixer l'ownership et les permissions (lecture seule partout sauf /app/tmp)
RUN mkdir -p /app/tmp \
    && chown node:node /app/tmp \
    && chmod 700 /app/tmp \
    && find /app -path /app/tmp -prune -o -type f -exec chmod 444 {} \; \
    && find /app -path /app/tmp -prune -o -type d -exec chmod 555 {} \;

# Utiliser l'utilisateur non-root fourni par l'image officielle
USER node

# Exposer le port usuel de l’API
EXPOSE 3000

# Déclarer le répertoire writable explicitement
VOLUME ["/app/tmp"]

# Commande de démarrage : npm script "start:secure"
CMD ["npm", "run", "start:secure"]
