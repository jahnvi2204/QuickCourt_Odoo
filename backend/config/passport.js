const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

module.exports = (passport) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'fallback_secret'
  };

  passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.userId).select('-password');
      if (user && user.isActive) return done(null, user);
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }));
};


