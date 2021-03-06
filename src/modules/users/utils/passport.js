import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

import User from '../model';
import config from '../../../config/config';

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: config.JWT_SECRET,
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});

passport.use(jwtStrategy);
