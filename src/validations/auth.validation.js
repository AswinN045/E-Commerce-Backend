const { password } = require('./custom.validation');

const register = {
  body: {
    name: {
      notEmpty: true,
      errorMessage: 'Name is required',
    },
    email: {
      notEmpty: true,
      isEmail: true,
      errorMessage: 'Email is required and must be a valid email address',
    },
    password: {
      notEmpty: true,
      custom: {
        options: password,
        errorMessage: 'Password does not meet requirements',
      },
    },
    role: {
      optional: true,
      isString: true,
      errorMessage: 'Role must be a string if provided',
    },
  },
};

const login = {
  body: {
    email: {
      notEmpty: true,
      isEmail: true,
      errorMessage: 'Email is required and must be a valid email address',
    },
    password: {
      notEmpty: true,
      custom: {
        options: password,
        errorMessage: 'Password does not meet requirements',
      },
    },
  }
};



module.exports = {
  register,
  login,
};
