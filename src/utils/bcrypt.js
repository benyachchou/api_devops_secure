const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * Hash un mot de passe
 * @param {String} password - Mot de passe en clair
 * @returns {Promise<String>} Mot de passe hashé
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare un mot de passe en clair avec un hash
 * @param {String} password - Mot de passe en clair
 * @param {String} hash - Mot de passe hashé
 * @returns {Promise<Boolean>} True si les mots de passe correspondent
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword
};

