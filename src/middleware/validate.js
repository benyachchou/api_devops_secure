const Joi = require('joi');

/**
 * Middleware de validation générique
 * @param {Object} schema - Schéma Joi à valider
 * @param {String} property - Propriété de la requête à valider ('body', 'query', 'params')
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors
      });
    }

    // Remplacer les données par les valeurs validées
    req[property] = value;
    next();
  };
}

// Schémas de validation
const schemas = {
  register: Joi.object({
    nom: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 100 caractères',
      'any.required': 'Le nom est requis'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'L\'email doit être une adresse email valide',
      'any.required': 'L\'email est requis'
    }),
    motDePasse: Joi.string().min(6).required().messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le mot de passe est requis'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'L\'email doit être une adresse email valide',
      'any.required': 'L\'email est requis'
    }),
    motDePasse: Joi.string().required().messages({
      'any.required': 'Le mot de passe est requis'
    })
  }),

  createResource: Joi.object({
    name: Joi.string().min(1).max(200).required().messages({
      'string.min': 'Le nom de la ressource doit contenir au moins 1 caractère',
      'string.max': 'Le nom de la ressource ne peut pas dépasser 200 caractères',
      'any.required': 'Le nom de la ressource est requis'
    })
  }),

  resourceId: Joi.object({
    id: Joi.string().pattern(/^\d+$/).required().messages({
      'string.pattern.base': 'L\'ID doit être un nombre',
      'any.required': 'L\'ID est requis'
    })
  }).unknown(true)
};

module.exports = {
  validate,
  schemas
};

