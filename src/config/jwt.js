const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Génère un token JWT
 * @param {Object} payload - Données à inclure dans le token
 * @returns {String} Token JWT signé
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256'
  });
}

/**
 * Vérifie et décode un token JWT
 * @param {String} token - Token JWT à vérifier
 * @returns {Object} Données décodées du token
 * @throws {Error} Si le token est invalide
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  } catch (error) {
    throw new Error('Token invalide ou expiré');
  }
}

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET,
  JWT_EXPIRES_IN
};

