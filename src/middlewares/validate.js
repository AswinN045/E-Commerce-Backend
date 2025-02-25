const { validationResult, checkSchema } = require('express-validator');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {  
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const validations = [];

  Object.entries(validSchema).forEach(([location, locationSchema]) => {
    const schemaForLocation = {};
    
    Object.entries(locationSchema).forEach(([field, fieldRules]) => {
      schemaForLocation[field] = {
        ...fieldRules,
        in: [location]
      };
    });
    
    if (Object.keys(schemaForLocation).length > 0) {
      validations.push(checkSchema(schemaForLocation));
    }
  });

  const flattenedValidations = validations.flat();
  
  Promise.all(flattenedValidations.map((validation) => validation.run(req)))
    .then(() => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map((err) => err.msg).join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      }
      return next();
    })
    .catch((err) => next(err));
};

module.exports = validate;