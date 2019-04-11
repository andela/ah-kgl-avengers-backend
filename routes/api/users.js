import express from 'express';
import passport from 'passport';
import Users from '../../controllers';

const router = express.Router();

router.post('/auth/signup', Users.createUserLocal);
router.post('/auth/login', Users.signinLocal);

// for testing the passport authentication of the JWT token
router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send({ message: 'hello' });
});

router.post('/users', (req, res, next) => {
  const {
    email, username, password: hash
  } = req.body;
  Users.create({ email, username, hash }).then((user) => {
    if (user) {
      res.status(201).json({
        status: res.statusCode,
        message: 'user created',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    }
  }).catch(next);
});

// Facebook Authentication Routes
router.post('/oauth/facebook', passport.authenticate('facebookOAuth',
  { session: false }), Users.createUserSocial);

router.post('/oauth/google', passport.authenticate('googleOAuth',
  { session: false }), Users.createUserSocial);

// Reset password
router.post('/users/reset', Users.resetPassword);
router.put('/users/reset/:token', Users.updatePassword);


export default router;
