import passport from "passport";
import dotenv from 'dotenv';
import strategies from "passport-local";
import FacebookToken from 'passport-facebook-token';
import GooglePlusToken from 'passport-google-plus-token';
import models from '../models/';

dotenv.config();

const LocalStrategy = strategies.Strategy;
const User = models.User;

passport.use(
  new LocalStrategy(
    {
      usernameField: "user[email]",
      passwordField: "user[password]"
    },
    function(email, password, done) {
      User.findOne({ email: email })
        .then(function(user) {
          if (!user || !user.validPassword(password)) {
            return done(null, false, {
              errors: { "email or password": "is invalid" }
            });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);

// Facebook strategy
passport.use('facebookOAuth',
    new FacebookToken({
        clientID: process.env.FB_APP_CLIENT_ID,
        clientSecret: process.env.FB_APP_CLIENT_SECRET,
    },
      async (accessToken, refreshToken, profile, done) => {
            done(null, profile);
      }
    )
);

//Google Strategy
passport.use('googleOAuth',
  new GooglePlusToken({
    clientID: process.env.GOOGLE_APP_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  },
  async (accessToken, refreshToken, profile, done) => {
    done(null, profile)
  })
);
