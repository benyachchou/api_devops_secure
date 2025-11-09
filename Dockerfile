# ===== Builder stage =====
FROM node:20-alpine AS builder

# Installer les dépendances système nécessaires pour les modules natifs (si présents)
RUN apk add --no-cache g++ make python3

WORKDIR /app

# Installer les dépendances en mode production
COPY package*.json ./
RUN npm ci --omit=dev

# Copier le reste des fichiers de l'application
COPY . .

# ===== Runtime stage (non-root) =====
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Copier l'application depuis le builder en définissant un propriétaire non-root
COPY --chown=node:node --from=builder /app /app

# Utiliser l'utilisateur non-root fourni par l'image officielle
USER node

# Exposer le port 3000
EXPOSE 3000

# Démarrer la version sécurisée
CMD ["npm", "run", "start:secure"]

