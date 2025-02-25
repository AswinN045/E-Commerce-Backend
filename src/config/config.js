const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(8081),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    DB_PORT: Joi.number().required(),
    DB_HOST: Joi.string().required().description('host'),
    DB_USER: Joi.string().required().description('database user'),
    DATABASE: Joi.string().required().description('database '),
    DB_PASSWORD: Joi.string().required().description('password'),
    CLOUDINARY_CLOUD_NAME: Joi.string().required().description('valid cloudinary name'),
    CLOUDINARY_API_KEY: Joi.string().required().description('valid cloudinary api key'),
    CLOUDINARY_API_SECRET: Joi.string().required().description('valid cloudinary secret key'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS
  },
  database: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    database: envVars.DATABASE,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD
  },
  cloud: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    cloudKey: envVars.CLOUDINARY_API_KEY,
    cloudSecret: envVars.CLOUDINARY_API_SECRET
  }
};

