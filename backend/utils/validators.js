const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required(),
  role: Joi.string().valid('user', 'facility_owner', 'admin').default('user')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(100),
  phone: Joi.string().allow(''),
  avatar: Joi.string().uri().allow(''),
  preferences: Joi.object({
    notifications: Joi.boolean(),
    favoritesSports: Joi.array().items(Joi.string())
  })
});

const createFacilitySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  address: Joi.object({
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    zipCode: Joi.string().allow(''),
    country: Joi.string().allow(''),
    coordinates: Joi.object({ lat: Joi.number(), lng: Joi.number() })
  }),
  photos: Joi.array().items(Joi.string().uri()),
  courts: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    sportType: Joi.string().required(),
    pricePerHour: Joi.number().positive().required(),
    isActive: Joi.boolean(),
    amenities: Joi.array().items(Joi.string())
  })),
  amenities: Joi.array().items(Joi.string()),
  sportTypes: Joi.array().items(Joi.string())
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createFacilitySchema
};


