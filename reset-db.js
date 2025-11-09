const fs = require('fs');

// Supprimer la base de données existante
if (fs.existsSync('database.db')) {
  fs.unlinkSync('database.db');
  console.log('✅ Base de données supprimée');
}

if (fs.existsSync('database.db-journal')) {
  fs.unlinkSync('database.db-journal');
  console.log('✅ Journal de la base de données supprimé');
}

console.log('✅ La base de données sera recréée au prochain démarrage du serveur avec les données de test');

