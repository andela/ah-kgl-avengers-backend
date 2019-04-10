import passport from 'passport';
import strategies from 'passport-local';
import models from '../models';

const LocalStrategy = strategies.Strategy;
const { User } = models;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]'
    },
    ((email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user || !user.validPassword(password)) {
            return done(null, false, {
              errors: { 'email or password': 'is invalid' }
            });
          }

          return done(null, user);
        })
        .catch(done);
    })
  )
);

