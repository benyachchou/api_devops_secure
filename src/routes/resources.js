const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

/**
 * GET /resources - Lister toutes les ressources (Authentifié)
 */
router.get('/',
  requireAuth,
  (req, res, next) => {
    try {
      const resources = Resource.getAll();
      res.json({
        success: true,
        data: resources
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /resources - Créer une ressource (Admin uniquement)
 */
router.post('/',
  requireAuth,
  requireAdmin,
  validate(schemas.createResource),
  (req, res, next) => {
    try {
      const resource = Resource.createResource(req.body);
      res.status(201).json({
        success: true,
        message: 'Ressource créée avec succès',
        data: resource
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /resources/:id - Supprimer une ressource (Admin uniquement)
 */
router.delete('/:id',
  requireAuth,
  requireAdmin,
  validate(schemas.resourceId),
  (req, res, next) => {
    try {
      const { id } = req.params;
      const resourceId = Number.parseInt(id, 10);
      const resource = Resource.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Ressource non trouvée'
        });
      }

      Resource.deleteById(resourceId);
      res.json({
        success: true,
        message: 'Ressource supprimée avec succès'
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

