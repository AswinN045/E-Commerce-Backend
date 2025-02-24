const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const authorizeRole = (allowedRoles) => (req, res, next) => {
  try {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!req.user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate first'));
    }
    
    const userRole = req.user.role;
    if (!userRole) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Role information missing from token'));
    }
    if (roles.length === 0 || roles.includes(userRole)) {
      return next();
    }
    return next(
      new ApiError(
        httpStatus.FORBIDDEN,
        'You do not have permission to access this resource'
      )
    );
  } catch (error) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Authorization check failed'));
  }
};

module.exports = authorizeRole;