import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import FacebookToken from 'passport-facebook-token';
import GooglePlusToken from 'passport-google-plus-token';
import models from '../models';

dotenv.config();

const { User, BlacklistTokens } = models;

/*
 * The passport strategy to authorize and authenticate the user using JWT token
 *  Them middleware will check first the token in headers
 * Check if the user with id in the payloads exists in db.
 */
passport.use(
  'jwt',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
      secretOrKey: process.env.SECRET,
      passReqToCallback: true
    },
    async (req, jwtPayload, done) => {
      try {
        const user = await User.findOne({
          where: { id: jwtPayload.id },
          attributes: { exclude: ['password'] }
        });
        if (user.activated === 0) {
          return done(null, false, {
            error: 'Please first activate your account'
          });
        }
        if (!user) {
          return done(null, false, { message: 'user does not exist' });
        }

        const tokenCheck = await BlacklistTokens.findOne({
          where: { token: req.headers.authorization.split(' ')[1] }
        });

        if (tokenCheck) {
          done(null, false, { message: 'user logged out' });
        }

        return done(null, jwtPayload);
      } catch (err) {
        return done(null, false, { message: 'user does not exist' });
      }
    }
  )
);

// Facebook strategy
passport.use(
  'facebookOAuth',
  new FacebookToken(
    {
      clientID: process.env.FB_APP_CLIENT_ID,
      clientSecret: process.env.FB_APP_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// Google Strategy
passport.use(
  'googleOAuth',
  new GooglePlusToken(
    {
      clientID: process.env.GOOGLE_APP_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

export default passport;
