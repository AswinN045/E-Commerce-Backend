;const bcrypt = require('bcryptjs');
const {faker} =require('@faker-js/faker')
const User = require('../../src/models/user.model');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'Customer',
};

const userTwo = {
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'Customer',
};

const admin = {
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'Admin',
};

const insertUsers = async (users) => {
  await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
