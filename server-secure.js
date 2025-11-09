require('dotenv').config();
const app = require('./src/app');
const User = require('./src/models/User');
const Resource = require('./src/models/Resource');
const { hashPassword } = require('./src/utils/bcrypt');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const { JWT_SECRET } = require('./src/config/jwt');

// Initialiser les données de test
async function initTestData() {
  try {
    // Initialiser les ressources
    Resource.initTestData();

    // Initialiser les utilisateurs de test
    const existingUsers = User.getAllUsers();
    if (existingUsers.length === 0) {
      const hashedPassword1 = await hashPassword('password123');
      const hashedPassword2 = await hashPassword('secret456');
      const hashedPassword3 = await hashPassword('admin123');

      User.createUser({
        nom: 'Alice Dupont',
        email: 'alice@example.com',
        motDePasse: hashedPassword1,
        role: 'user'
      });

      User.createUser({
        nom: 'Bob Martin',
        email: 'bob@example.com',
        motDePasse: hashedPassword2,
        role: 'user'
      });

      User.createUser({
        nom: 'Admin User',
        email: 'admin@example.com',
        motDePasse: hashedPassword3,
        role: 'admin'
      });

      console.log('✅ Utilisateurs de test créés');
    }

    console.log('✅ Ressources de test créées');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des données de test:', error);
  }
}

// Top-level async IIFE
(async () => {
  try {
    // Vérifications de configuration critiques
    if (NODE_ENV === 'production') {
      if (!process.env.JWT_SECRET || JWT_SECRET === 'default-secret-change-in-production') {
        throw new Error('Configuration JWT secrète manquante ou trop faible en production');
      }
      if (process.env.CORS_ORIGIN === '*') {
        throw new Error('CORS_ORIGIN ne doit pas être "*" en production');
      }
    }

    await initTestData();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Serveur sécurisé démarré sur http://localhost:${PORT}`);
      console.log(`📝 Environnement: ${NODE_ENV}`);
      console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configuré' : '⚠️  Utilisation de la valeur par défaut'}`);
    });

    // Durcissement des timeouts pour fiabilité (évite connexions pendantes)
    server.keepAliveTimeout = 65000; // 65s
    server.headersTimeout = 66000;   // 66s

    // Gestion des arrêts propres
    const shutdown = (signal) => {
      console.log(`\n${signal} reçu, arrêt en cours...`);
      server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        process.exit(0);
      });
      // Forcer l'arrêt si blocage
      setTimeout(() => {
        console.error('⏱️ Arrêt forcé');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    // Gestion des erreurs non interceptées
    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection:', reason);
    });
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
})();

