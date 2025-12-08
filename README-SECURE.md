# API REST Sécurisée salut

Version sécurisée de l'API avec toutes les bonnes pratiques de sécurité implémentées.

## 🔒 Fonctionnalités de sécurité

- ✅ **Hash des mots de passe** avec bcrypt (10 rounds)
- ✅ **JWT signé** (HS256) avec expiration configurable
- ✅ **Contrôle d'accès par rôles** (user, admin)
- ✅ **Validation d'entrée** avec Joi sur toutes les routes
- ✅ **Headers de sécurité** avec Helmet
- ✅ **CORS configurable** avec origine spécifique
- ✅ **Rate limiting** (100 req/15 min par IP, spécial sur /login)
- ✅ **Gestion d'erreurs** propre sans exposition des détails internes
- ✅ **Stockage modulaire** en mémoire (facilement remplaçable par une DB)

## 📁 Structure du projet
#hello
```
src/
  config/
    jwt.js          # Configuration JWT
    security.js     # Configuration sécurité (CORS, rate limit)
  middleware/
    auth.js         # Middleware d'authentification et autorisation
    errorHandler.js # Gestion des erreurs
    rateLimiter.js  # Rate limiting
    validate.js     # Validation avec Joi
  models/
    User.js         # Modèle User (stockage en mémoire)
    Resource.js     # Modèle Resource (stockage en mémoire)
  routes/
    auth.js         # Routes d'authentification
    resources.js    # Routes des ressources
  utils/
    bcrypt.js       # Utilitaires bcrypt
  app.js            # Configuration Express
server-secure.js    # Point d'entrée
```

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration de l'environnement

Copier le fichier d'exemple et le configurer :

```bash
cp env.example .env
```

Modifier le fichier `.env` :

```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

⚠️ **IMPORTANT** : Changez `JWT_SECRET` avec une clé secrète forte en production !

### 3. Lancer l'application

```bash
# Version sécurisée
npm run start:secure

# Ou en mode développement
npm run dev:secure
```

Le serveur démarre sur `http://localhost:3000`

## 📡 Routes disponibles

### Authentification

#### POST /auth/register
Créer un nouvel utilisateur (rôle par défaut: `user`)

**Requête :**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "John Doe",
    "email": "john@example.com",
    "motDePasse": "password123"
  }'
```
#Mster TRC2026
**Réponse :**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": 1,
    "nom": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /auth/login
Authentifier un utilisateur et obtenir un token JWT

**Requête :**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "motDePasse": "password123"
  }'
```

**Réponse :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nom": "Alice Dupont",
      "email": "alice@example.com",
      "role": "user"
    }
  }
}
```

#### GET /auth/profile
Obtenir le profil de l'utilisateur connecté

**Requête :**
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Ressources

#### GET /resources
Lister toutes les ressources (Authentifié)

**Requête :**
```bash
curl -X GET http://localhost:3000/resources \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### POST /resources
Créer une ressource (Admin uniquement)

**Requête :**
```bash
curl -X POST http://localhost:3000/resources \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nouvelle ressource"
  }'
```

#### DELETE /resources/:id
Supprimer une ressource (Admin uniquement)

**Requête :**
```bash
curl -X DELETE http://localhost:3000/resources/1 \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 🔐 Données de test

Les utilisateurs suivants sont créés automatiquement au démarrage :

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| alice@example.com | password123 | user |
| bob@example.com | secret456 | user |
| admin@example.com | admin123 | admin |

## 🛡️ Sécurité implémentée

### 1. Hash des mots de passe
- Utilisation de bcrypt avec 10 rounds de salage
- Les mots de passe ne sont jamais stockés en clair

### 2. JWT (JSON Web Tokens)
- Algorithme HS256
- Expiration configurable via `JWT_EXPIRES_IN`
- Secret stocké dans les variables d'environnement
- Vérification du token sur chaque requête authentifiée

### 3. Contrôle d'accès par rôles
- Middleware `requireAuth` : vérifie l'authentification
- Middleware `requireAdmin` : vérifie le rôle admin
- Routes protégées selon les rôles

### 4. Validation d'entrée
- Validation avec Joi sur toutes les routes
- Messages d'erreur clairs et détaillés
- Rejet des données invalides

### 5. Headers de sécurité (Helmet)
- Protection contre les attaques XSS
- Protection contre le clickjacking
- Désactivation de la mise en cache pour les réponses sensibles
- Headers de sécurité HTTP

### 6. CORS
- Configuration de l'origine autorisée
- Support des credentials
- Protection contre les attaques CSRF

### 7. Rate Limiting
- Limite générale : 100 requêtes / 15 minutes par IP
- Limite spéciale sur `/auth/login` : 100 tentatives / 15 minutes
- Protection contre les attaques par force brute

### 8. Gestion d'erreurs
- Messages d'erreur propres sans exposition des détails internes
- Codes de statut HTTP appropriés
- Réponses JSON structurées

## 📝 Tests avec Postman

### Configuration

1. Créer une nouvelle collection Postman
2. Créer une variable d'environnement `token`
3. Dans la route `/auth/login`, ajouter un test pour sauvegarder le token :

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
}
```

4. Utiliser `{{token}}` dans les autres requêtes avec le header :
```
Authorization: Bearer {{token}}
```

## 🐳 Docker

Pour déployer la version sécurisée avec Docker, créer un `Dockerfile.secure` :

```dockerfile
FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:secure"]
```

## 🔄 Migration depuis la version non sécurisée

Les deux versions peuvent coexister :
- Version non sécurisée : `npm start` (port 3000)
- Version sécurisée : `npm run start:secure` (port 3000, nécessite .env)

⚠️ **Note** : Les deux versions utilisent des routes différentes :
- Non sécurisée : `/register`, `/login`, `/profile`, `/resources`
- Sécurisée : `/auth/register`, `/auth/login`, `/auth/profile`, `/resources`

## 📚 Documentation

Pour plus d'informations sur la version non sécurisée (POC pédagogique), voir [README.md](./README.md).

