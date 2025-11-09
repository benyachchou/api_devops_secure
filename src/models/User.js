// Stockage en mémoire pour les utilisateurs
const users = [];
let nextId = 1;

/**
 * Crée un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur
 * @returns {Object} Utilisateur créé
 */
function createUser(userData) {
  const user = {
    id: nextId++,
    nom: userData.nom,
    email: userData.email,
    motDePasse: userData.motDePasse, // Déjà hashé
    role: userData.role || 'user',
    createdAt: new Date()
  };
  users.push(user);
  return user;
}

/**
 * Trouve un utilisateur par email
 * @param {String} email - Email de l'utilisateur
 * @returns {Object|null} Utilisateur trouvé ou null
 */
function findByEmail(email) {
  return users.find(u => u.email === email) || null;
}

/**
 * Trouve un utilisateur par ID
 * @param {Number} id - ID de l'utilisateur
 * @returns {Object|null} Utilisateur trouvé ou null
 */
function findById(id) {
  return users.find(u => u.id === id) || null;
}

/**
 * Initialise les données de test
 */
function initTestData() {
  if (users.length === 0) {
    // Les mots de passe seront hashés lors de la création
    // On initialisera avec des utilisateurs de test dans le serveur
  }
}

/**
 * Retourne tous les utilisateurs (pour debug uniquement)
 * @returns {Array} Liste des utilisateurs
 */
function getAllUsers() {
  return users;
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  initTestData,
  getAllUsers
};

