/**
 * Middleware de gestion des erreurs
 */
function errorHandler(err, req, res, next) {
  // Erreur de validation Joi
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré'
    });
  }

  // Erreur par défaut
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Une erreur est survenue' 
      : err.message
  });
}

/**
 * Middleware pour gérer les routes non trouvées
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};

