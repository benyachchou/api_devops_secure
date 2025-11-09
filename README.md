# API REST DevSecOps

Ce projet contient deux versions de l'API :1

1. **Version non sécurisée** (POC Pédagogique) - `server.js`
2. **Version sécurisée** - `server-secure.js` ✨

⚠️ **ATTENTION** : La version non sécurisée est volontairement non sécurisée pour des fins pédagogiques. Ne pas utiliser en production.

---

## 📚 Documentation12

- **[README.md](./README.md)** - Version non sécurisée (ce fichier)
- **[README-SECURE.md](./README-SECURE.md)** - Version sécurisée avec toutes les bonnes pratiques

---

# Version Non Sécurisée (POC Pédagogique)

⚠️ **ATTENTION** : Cette API est volontairement non sécurisée pour des fins pédagogiques. Ne pas utiliser en production.

## Installation

```bash
npm init -y
npm i express better-sqlite3
```

## Lancement

### Option 1 : Lancement local

```bash
node server.js
# ou
npm start
```

Le serveur démarre sur `http://localhost:3000`

La base de données SQLite sera créée automatiquement dans le dossier `data/` au premier lancement avec des données de test.

### Option 2 : Lancement avec Docker

#### Prérequis
- Docker installé
- Docker Compose installé (optionnel)

#### Construction et lancement avec Docker

```bash
# Construire l'image Docker
docker build -t api-devsecops .

# Lancer le conteneur
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data --name api-devsecops api-devsecops
```

#### Lancement avec Docker Compose (recommandé)

```bash
# Lancer l'application
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter l'application
docker-compose down
```

Le serveur démarre sur `http://localhost:3000`

La base de données SQLite sera persistée dans le dossier `data/` sur votre machine locale.

### Réinitialiser la base de données

**Lancement local :**
```bash
npm run reset-db
# puis redémarrer le serveur
npm start
```

**Avec Docker :**
```bash
# Arrêter le conteneur
docker-compose down

# Supprimer le dossier data
rm -rf data/

# Redémarrer
docker-compose up -d
```

## Données de test

### Utilisateurs pré-enregistrés

Les utilisateurs suivants sont créés automatiquement au premier lancement :

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| alice@example.com | password123 | user |
| bob@example.com | secret456 | user |
| admin@example.com | admin123 | admin |

### Ressources de test

Les ressources suivantes sont créées automatiquement :

- Documentation API
- Guide de sécurité
- Manuel utilisateur
- Rapport technique

## Rôles et contrôles d'accès

L'API utilise deux rôles (sans système de tokens) :
- **Public** : Accès sans authentification
- **Authentifié** : Nécessite email/password dans les headers (rôle `user` ou `admin`)
- **Admin** : Nécessite email/password avec le rôle `admin` dans les headers

| Route | Méthode | Rôle requis |
|-------|---------|-------------|
| `/register` | POST | Public |
| `/login` | POST | Public |
| `/profile` | GET | Authentifié |
| `/resources` | GET | Authentifié |
| `/resources` | POST | Admin |
| `/resources/:id` | DELETE | Admin |

## Routes disponibles

### POST /register - Public
Crée un nouvel utilisateur (rôle par défaut: `user`).

**Requête :**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"John Doe","email":"john@example.com","motDePasse":"password123"}'
```

### POST /login - Public
Vérifie les identifiants de l'utilisateur (pas de token généré).

**Requête :**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","motDePasse":"password123"}'
```

**Réponse :**
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "nom": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### GET /profile - Authentifié
Retourne les informations de l'utilisateur (email/password dans les headers).

**Requête :**
```bash
curl -X GET http://localhost:3000/profile \
  -H "x-email: alice@example.com" \
  -H "x-password: password123"
```

### GET /resources - Authentifié
Liste toutes les ressources disponibles (email/password dans les headers).

**Requête :**
```bash
curl -X GET http://localhost:3000/resources \
  -H "x-email: alice@example.com" \
  -H "x-password: password123"
```

### POST /resources - Admin
Ajoute une nouvelle ressource (rôle admin requis, email/password dans headers ou body).

**Requête :**
```bash
curl -X POST http://localhost:3000/resources \
  -H "Content-Type: application/json" \
  -H "x-email: admin@example.com" \
  -H "x-password: admin123" \
  -d '{"name":"Ma ressource"}'
```

### DELETE /resources/:id - Admin
Supprime une ressource par son ID (rôle admin requis, email/password dans headers).

**Requête :**
```bash
curl -X DELETE http://localhost:3000/resources/1 \
  -H "x-email: admin@example.com" \
  -H "x-password: admin123"
```

## Exemple complet d'utilisation

### Test avec un utilisateur standard (user)

```bash
# 1. Se connecter avec Alice (user)
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","motDePasse":"password123"}'

# 2. Voir le profil (email/password dans headers)
curl -X GET http://localhost:3000/profile \
  -H "x-email: alice@example.com" \
  -H "x-password: password123"

# 3. Lister les ressources (authentifié)
curl -X GET http://localhost:3000/resources \
  -H "x-email: alice@example.com" \
  -H "x-password: password123"

# 4. Essayer de créer une ressource (échouera - admin requis)
curl -X POST http://localhost:3000/resources \
  -H "Content-Type: application/json" \
  -H "x-email: alice@example.com" \
  -H "x-password: password123" \
  -d '{"name":"Ressource 1"}'
# Réponse: {"message":"Accès refusé. Rôle admin requis."}
```

### Test avec un administrateur (admin)

```bash
# 1. Se connecter avec Admin
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","motDePasse":"admin123"}'

# 2. Créer une ressource (admin)
curl -X POST http://localhost:3000/resources \
  -H "Content-Type: application/json" \
  -H "x-email: admin@example.com" \
  -H "x-password: admin123" \
  -d '{"name":"Nouvelle ressource"}'

# 3. Lister les ressources
curl -X GET http://localhost:3000/resources \
  -H "x-email: admin@example.com" \
  -H "x-password: admin123"

# 4. Supprimer une ressource (admin)
curl -X DELETE http://localhost:3000/resources/1 \
  -H "x-email: admin@example.com" \
  -H "x-password: admin123"
```

### Script de test rapide

Un script de test est disponible pour tester rapidement l'API :

```bash
chmod +x test-api.sh
./test-api.sh
```

Ou exécutez directement :

```bash
bash test-api.sh
```

## Tests avec Postman

### Import de la collection

Une collection Postman complète est disponible dans le fichier `API_DEVSECOPS.postman_collection.json`.

**Pour l'importer :**
1. Ouvrez Postman
2. Cliquez sur **Import** (en haut à gauche)
3. Sélectionnez le fichier `API_DEVSECOPS.postman_collection.json`
4. La collection sera importée avec toutes les requêtes pré-configurées

La collection inclut des variables d'environnement que vous pouvez modifier selon vos besoins.

### Configuration de base

**URL de base :** `http://localhost:3000`

### 1. POST /register - Créer un utilisateur

**Méthode :** `POST`  
**URL :** `http://localhost:3000/register`  
**Headers :**
```
Content-Type: application/json
```

**Body (raw JSON) :**
```json
{
  "nom": "John Doe",
  "email": "john@example.com",
  "motDePasse": "password123"
}
```

**Réponse attendue (200) :**
```json
{
  "message": "Utilisateur créé",
  "userId": 4
}
```

---

### 2. POST /login - Vérifier les identifiants

**Méthode :** `POST`  
**URL :** `http://localhost:3000/login`  
**Headers :**
```
Content-Type: application/json
```

**Body (raw JSON) :**
```json
{
  "email": "alice@example.com",
  "motDePasse": "password123"
}
```

**Réponse attendue (200) :**
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "nom": "Alice Dupont",
    "email": "alice@example.com",
    "role": "user"
  }
}
```

**Test avec admin :**
```json
{
  "email": "admin@example.com",
  "motDePasse": "admin123"
}
```

---

### 3. GET /profile - Obtenir le profil utilisateur

**Méthode :** `GET`  
**URL :** `http://localhost:3000/profile`  
**Headers :**
```
x-email: alice@example.com
x-password: password123
```

**Réponse attendue (200) :**
```json
{
  "id": 1,
  "nom": "Alice Dupont",
  "email": "alice@example.com",
  "role": "user"
}
```

**Test avec admin :**
```
x-email: admin@example.com
x-password: admin123
```

**Erreur si identifiants manquants (401) :**
```json
{
  "message": "Email et mot de passe requis"
}
```

---

### 4. GET /resources - Lister toutes les ressources

**Méthode :** `GET`  
**URL :** `http://localhost:3000/resources`  
**Headers :**
```
x-email: alice@example.com
x-password: password123
```

**Réponse attendue (200) :**
```json
[
  {
    "id": 1,
    "name": "Documentation API"
  },
  {
    "id": 2,
    "name": "Guide de sécurité"
  },
  {
    "id": 3,
    "name": "Manuel utilisateur"
  },
  {
    "id": 4,
    "name": "Rapport technique"
  }
]
```

**Erreur si non authentifié (401) :**
```json
{
  "message": "Email et mot de passe requis"
}
```

---

### 5. POST /resources - Créer une ressource (Admin uniquement)

**Méthode :** `POST`  
**URL :** `http://localhost:3000/resources`  
**Headers :**
```
Content-Type: application/json
x-email: admin@example.com
x-password: admin123
```

**Body (raw JSON) :**
```json
{
  "name": "Nouvelle ressource"
}
```

**Réponse attendue (200) :**
```json
{
  "message": "Ressource créée",
  "resource": {
    "id": 5,
    "name": "Nouvelle ressource"
  }
}
```

**Test avec utilisateur standard (doit échouer) :**
```
x-email: alice@example.com
x-password: password123
```

**Erreur si rôle insuffisant (403) :**
```json
{
  "message": "Accès refusé. Rôle admin requis."
}
```

---

### 6. DELETE /resources/:id - Supprimer une ressource (Admin uniquement)

**Méthode :** `DELETE`  
**URL :** `http://localhost:3000/resources/1`  
**Headers :**
```
x-email: admin@example.com
x-password: admin123
```

**Réponse attendue (200) :**
```json
{
  "message": "Ressource supprimée"
}
```

**Erreur si ressource non trouvée (404) :**
```json
{
  "message": "Ressource non trouvée"
}
```

**Erreur si rôle insuffisant (403) :**
```json
{
  "message": "Accès refusé. Rôle admin requis."
}
```

---

## Collection Postman

### Scénario de test complet

1. **Créer un utilisateur**
   - POST `/register` avec un nouvel utilisateur

2. **Se connecter avec un utilisateur standard**
   - POST `/login` avec `alice@example.com` / `password123`
   - Vérifier la réponse

3. **Obtenir le profil**
   - GET `/profile` avec headers `x-email` et `x-password`

4. **Lister les ressources (user)**
   - GET `/resources` avec headers d'authentification
   - Doit réussir

5. **Tenter de créer une ressource (user)**
   - POST `/resources` avec headers d'utilisateur standard
   - Doit échouer avec 403

6. **Se connecter en tant qu'admin**
   - POST `/login` avec `admin@example.com` / `admin123`

7. **Créer une ressource (admin)**
   - POST `/resources` avec headers d'admin
   - Doit réussir

8. **Lister les ressources (admin)**
   - GET `/resources` avec headers d'admin
   - Vérifier que la nouvelle ressource apparaît

9. **Supprimer une ressource (admin)**
   - DELETE `/resources/:id` avec headers d'admin
   - Doit réussir

### Variables d'environnement Postman (optionnel)

Créez un environnement Postman avec ces variables :

```
base_url: http://localhost:3000
user_email: alice@example.com
user_password: password123
admin_email: admin@example.com
admin_password: admin123
```

Puis utilisez-les dans vos requêtes :
- URL : `{{base_url}}/resources`
- Headers : `x-email: {{user_email}}`

## Vulnérabilités intentionnelles

- ❌ Mots de passe stockés en clair dans SQLite
- ❌ Aucune validation des entrées
- ❌ Pas de contraintes de base de données (UNIQUE, NOT NULL, etc.)
- ❌ Pas de protection CORS/Helmet/rate-limit
- ❌ Pas de système de tokens (email/password envoyés à chaque requête)
- ❌ Authentification basique sans chiffrement (email/password en clair dans les headers)
- ❌ Contrôle d'accès basé sur les rôles minimal (pas de gestion fine des permissions)
- ❌ Pas de logs de sécurité
- ❌ Gestion d'erreurs minimale
- ❌ Base de données SQLite sans schéma de sécurité
- ❌ Vérification de rôles basique (pas de protection contre la manipulation)

Vue d’ensemble

- Objectif: durcir le serveur, réduire la surface d’attaque, rendre la configuration plus sûre en production, et éviter les erreurs silencieuses.
- Portée: modifications ciblées sur server-secure.js , src/app.js , src/config/security.js , src/middleware/rateLimiter.js , src/routes/resources.js , docker-compose.yml , et env.example .
Démarrage Durci

- Vérification des secrets et de l’environnement:
  - En production , le serveur refuse de démarrer si JWT_SECRET est manquant ou égal à la valeur par défaut ( 'default-secret-change-in-production' ).
  - En production , le serveur refuse CORS_ORIGIN='*' pour éviter les origines non contrôlées.
- Gestion d’arrêt propre:
  - Capture SIGINT et SIGTERM , fermeture propre du serveur, puis arrêt forcé au bout de 10s si nécessaire.
- Robustesse des connexions:
  - Définit server.keepAliveTimeout=65000 et server.headersTimeout=66000 afin d’éviter les connexions pendantes ou bloquées.
- Résilience aux erreurs:
  - Journalise unhandledRejection et uncaughtException pour ne pas laisser des erreurs critiques passer inaperçues.
Express et En-têtes

- Masque d’empreinte technologique:
  - app.disable('x-powered-by') pour ne pas exposer qu’Express est utilisé.
- Helmet renforcé:
  - Ajout de helmet.hsts() pour forcer HTTPS (utile derrière un proxy/terminateur TLS).
  - helmet.referrerPolicy({ policy: 'no-referrer' }) pour limiter les informations de provenance.
  - helmet.crossOriginResourcePolicy({ policy: 'same-origin' }) pour restreindre les ressources accessibles cross-origin.
  - CSP conservée et restrictive.
- Protection contre payloads volumineux:
  - Limite express.json({ limit: '100kb' }) pour réduire les risques d’abus par gros corps de requêtes.
Validation et Intégrité des Entrées

- Validation unifiée avec Joi:
  - DELETE /resources/:id utilise désormais validate(schemas.resourceId) au lieu d’une validation manuelle, garantissant la cohérence des contrôles d’entrée sur les routes.
Rate Limiting (Tunable, Anti-Bruteforce)

- Paramétrage externalisé pour /auth/login :
  - Ajout dans src/config/security.js et env.example de LOGIN_RATE_LIMIT_WINDOW_MS et LOGIN_RATE_LIMIT_MAX .
  - src/middleware/rateLimiter.js lit ces valeurs au lieu de constantes inline.
- Bénéfices:
  - Meilleure maintenabilité et sécurité opérationnelle (ajustement des seuils sans changer le code).
  - skipSuccessfulRequests:true conservé pour ne pas pénaliser les connexions réussies.
CORS et Politique d’Origine

- En production , interdiction de CORS_ORIGIN='*' via contrôle au démarrage.
- CORS reste configurable via CORS_ORIGIN , et autorise les requêtes sans origine (Postman/cURL) côté code.
Santé et Observabilité

- Healthcheck Docker corrigé:
  - docker-compose.yml pointe vers http://localhost:3000/health (publique), évitant un check qui échoue par manque d’authentification.
- Effets:
  - Liveness plus fiable, déploiements plus stables, moins de faux négatifs.
Maintenabilité et Réduction de Duplications

- Externalisation des limites /auth/login dans la config et .env , au lieu de valeurs codées en dur.
- Validation centralisée avec Joi sur DELETE /resources/:id .
- Suppression de package-secure.json (manifest redondant non utilisé), pour éviter confusion et divergence.
Récapitulatif des Variables .env ajoutées ou vérifiées

- JWT_SECRET (obligatoire et fort en production).
- LOGIN_RATE_LIMIT_WINDOW_MS (exemple: 900000 ).
- LOGIN_RATE_LIMIT_MAX (exemple: 50 ).
- CORS_ORIGIN (doit être une origine spécifique en production).
Impact Sécurité

- Confidentialité: moins d’exposition des infos serveur (en-têtes), CSP renforcée.
- Intégrité: entrées strictement validées, tokens JWT protégés par démarrage bloquant si secret invalide.
- Disponibilité: timeouts corrects, arrêt propre, healthcheck fiable, rate limit tunable.
- OpSec: paramétrage centralisé, erreurs critiques visibles, comportement prévisible en prod.
Si tu veux, je peux aussi:

- Mettre à jour README-SECURE.md pour documenter les nouvelles variables et politiques Helmet.
- Ajouter des logs structurés (type morgan ) avec masquage des données sensibles.
- Proposer une migration vers une base persistante (SQLite/PostgreSQL) avec schémas et migrations sécurisées.
