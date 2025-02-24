const passport = require("passport")
const jwttoken = require('../config/config')
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwttoken.jwt.secret

const jwtAuthMiddleware = (req, res, next) => {
  passport.authenticate(
    new JwtStrategy(opts, (jwtPayload, done) => {
      if (jwtPayload) {
        return done(null, jwtPayload);
      } else {
        return done(null, false, { message: 'Unauthorized' });
      }
    }), { session: false }
  )(req, res, next);
};

module.exports = jwtAuthMiddleware;