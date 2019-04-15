import express from 'express';
import passport from 'passport';
import userControllers from '../../controllers/users';

const router = express.Router();

router.post('/auth/signup', userControllers.createUserLocal);
router.post('/auth/login', userControllers.signinLocal);
router.get('/activation/:id', userControllers.activateUserAccount);

// for testing the passport authentication of the JWT token
router.get('/test',
  passport.authenticate('jwt', { session: false }), (req, res) => {
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
  { session: false }), userControllers.createUserSocial);

router.post('/oauth/google', passport.authenticate('googleOAuth',
  { session: false }), userControllers.createUserSocial);

// Reset password
router.post('/users/reset', Users.resetPassword);
router.put('/users/reset/:token', Users.updatePassword);


export default router;
