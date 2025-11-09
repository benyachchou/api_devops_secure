const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../config/jwt');
const { validate, schemas } = require('../middleware/validate');
const { loginLimiter } = require('../middleware/rateLimiter');
const { requireAuth } = require('../middleware/auth');

/**
 * POST /register - Créer un utilisateur
 */
router.post('/register', 
  validate(schemas.register),
  async (req, res, next) => {
    try {
      const { nom, email, motDePasse } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }

      // Hasher le mot de passe
      const hashedPassword = await hashPassword(motDePasse);

      // Créer l'utilisateur
      const user = User.createUser({
        nom,
        email,
        motDePasse: hashedPassword,
        role: 'user'
      });

      // Retourner la réponse (sans le mot de passe)
      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /login - Authentifier un utilisateur
 */
router.post('/login',
  loginLimiter,
  validate(schemas.login),
  async (req, res, next) => {
    try {
      const { email, motDePasse } = req.body;

      // Trouver l'utilisateur
      const user = User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await comparePassword(motDePasse, user.motDePasse);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Générer le token JWT
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      res.json({
        success: true,
        message: 'Connexion réussie',
        data: {
          token,
          user: {
            id: user.id,
            nom: user.nom,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /profile - Obtenir le profil de l'utilisateur connecté
 */
router.get('/profile',
  requireAuth,
  (req, res, next) => {
    try {
      const user = User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

