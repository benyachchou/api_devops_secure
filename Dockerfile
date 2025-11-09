# ===== Builder stage =====
FROM node:20-alpine AS builder

# Installer les dépendances système nécessaires pour les modules natifs (si présents)
RUN apk add --no-cache g++ make python3

WORKDIR /app

# Installer les dépendances en mode production (via lockfile)
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Copier uniquement les artefacts nécessaires à l'exécution
COPY src ./src
COPY server-secure.mjs ./server-secure.mjs

# ===== Runtime stage (non-root) =====
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Copier l'application depuis le builder en définissant un propriétaire non-root
COPY --chown=node:node --from=builder /app /app

# Rendre les ressources copiées en lecture seule, sauf un répertoire temporaire
RUN mkdir -p /app/tmp \
    && chown node:node /app/tmp \
    && chmod 700 /app/tmp \
    && find /app -path /app/tmp -prune -o -type f -exec chmod 444 {} \; \
    && find /app -path /app/tmp -prune -o -type d -exec chmod 555 {} \;

# Utiliser l'utilisateur non-root fourni par l'image officielle
USER node

# Exposer le port 3000
EXPOSE 3000

# Démarrer la version sécurisée
CMD ["npm", "run", "start:secure"]
