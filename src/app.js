const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { CORS_ORIGIN } = require('./config/security');
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');

const app = express();

// Masquer Express pour limiter informations d'implémentation
app.disable('x-powered-by');

// Middlewares de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
// Politiques de sécurité additionnelles
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(helmet.crossOriginResourcePolicy({ policy: 'same-origin' }));
app.use(helmet.hsts());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Permettre les requêtes sans origine (Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Si CORS_ORIGIN est '*', permettre toutes les origines
    if (CORS_ORIGIN === '*') {
      return callback(null, true);
    }
    
    // Vérifier si l'origine est autorisée
    if (origin === CORS_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Parser JSON avec limite pour éviter payloads volumineux
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting général
app.use(generalLimiter);

// Routes
app.use('/auth', authRoutes);
app.use('/resources', resourceRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running'
  });
});

// Gestion des erreurs 404
app.use(notFoundHandler);

// Gestionnaire d'erreurs global
app.use(errorHandler);

module.exports = app;

