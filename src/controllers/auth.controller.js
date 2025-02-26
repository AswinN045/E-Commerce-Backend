const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  const userData = await userService.createUser(req.body);
  if (userData.statusValue === 0) {
    res.status(500).json(userData)
  } else {
    const { password, ...user } = userData.toJSON();
    const tokens = await tokenService.generateAuthTokens(userData);
    res.status(201).send({ user, tokens });
  }
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const userData = await authService.loginUserWithEmailAndPassword(email, password);
  if (userData.statusValue === 0) {
    res.send(userData)
  } else {
    const { password, ...user } = userData.toJSON();
    const tokens = await tokenService.generateAuthTokens(userData);
    res.send({ user, tokens });
  }
});


module.exports = {
  register,
  login,
};
