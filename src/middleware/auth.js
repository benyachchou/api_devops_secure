const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

/**
 * Middleware pour vérifier l'authentification JWT
 */
function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant'
      });
    }

    const token = authHeader.substring(7); // Retirer "Bearer "
    const decoded = verifyToken(token);
    
    // Vérifier que l'utilisateur existe toujours
    const user = User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Ajouter les informations de l'utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    // Laisser les erreurs JWT natives être gérées par le gestionnaire global
    return next(error);
  }
}

/**
 * Middleware pour vérifier le rôle admin
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentification requise'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Rôle administrateur requis.'
    });
  }

  next();
}

module.exports = {
  requireAuth,
  requireAdmin
};

