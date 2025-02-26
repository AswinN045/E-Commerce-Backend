const httpStatus = require('http-status');
const { Users } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
  try {
    const emailExist = await Users.findOne({ where: { email: userBody.email } });
    if (emailExist !== null) {
      return { statusVale: 0, statusText: "Email already exist" }
    }
    const users = await Users.create(userBody);
    return users;
  } catch (error) {
    return error
  }
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return Users.findOne({ where: { email: email } });
};


module.exports = {
  createUser,
  getUserByEmail,
};
