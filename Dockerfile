# ===== Builder stage =====
FROM node:20-alpine AS builder

# Installer les dépendances système nécessaires pour les modules natifs (si présents)
RUN apk add --no-cache g++ make python3

WORKDIR /app

# Éviter l'exécution de scripts npm en root; travailler en utilisateur non-root
RUN chown -R node:node /app
USER node

# Installer les dépendances en mode production (via lockfile)
# Note: --ignore-scripts est volontairement omis car des modules natifs (ex: bcrypt)
# nécessitent une compilation. L'exécution des scripts est isolée dans le stage builder.
COPY package*.json ./
# Sécurise l'installation: ignore les scripts globaux, puis ne reconstruit que les modules nécessaires
RUN npm ci --omit=dev --no-audit --no-fund --ignore-scripts \
    && npm rebuild bcrypt --build-from-source

# Copier uniquement les artefacts nécessaires à l'exécution
# Évite la copie récursive de fichiers potentiellement sensibles dans l'image
COPY src ./src
COPY server-secure.mjs ./server-secure.mjs

# ===== Runtime stage (non-root) =====
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Copier l'application depuis le builder en définissant un propriétaire non-root
# Les ressources copiées sont rendues en lecture seule ci-dessous pour éviter les écritures
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

# Déclarer le répertoire writable explicitement; recommandation: exécuter le conteneur avec --read-only
VOLUME ["/app/tmp"]

# Démarrer la version sécurisée
CMD ["npm", "run", "start:secure"]
