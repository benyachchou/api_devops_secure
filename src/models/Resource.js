// Stockage en mémoire pour les ressources
const resources = [];
let nextId = 1;

/**
 * Crée une nouvelle ressource
 * @param {Object} resourceData - Données de la ressource
 * @returns {Object} Ressource créée
 */
function createResource(resourceData) {
  const resource = {
    id: nextId++,
    name: resourceData.name,
    createdAt: new Date()
  };
  resources.push(resource);
  return resource;
}

/**
 * Trouve une ressource par ID
 * @param {Number} id - ID de la ressource
 * @returns {Object|null} Ressource trouvée ou null
 */
function findById(id) {
  return resources.find(r => r.id === parseInt(id)) || null;
}

/**
 * Retourne toutes les ressources
 * @returns {Array} Liste des ressources
 */
function getAll() {
  return resources;
}

/**
 * Supprime une ressource
 * @param {Number} id - ID de la ressource à supprimer
 * @returns {Boolean} True si la ressource a été supprimée
 */
function deleteById(id) {
  const index = resources.findIndex(r => r.id === parseInt(id));
  if (index !== -1) {
    resources.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Initialise les données de test
 */
function initTestData() {
  if (resources.length === 0) {
    createResource({ name: 'Documentation API' });
    createResource({ name: 'Guide de sécurité' });
    createResource({ name: 'Manuel utilisateur' });
    createResource({ name: 'Rapport technique' });
  }
}

module.exports = {
  createResource,
  findById,
  getAll,
  deleteById,
  initTestData
};

