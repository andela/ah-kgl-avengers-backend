import express from 'express';
import passport from 'passport';
import userControllers from '../../controllers/users';
import userValidations from '../../middlewares/userValidation';

const router = express.Router({});

router.post('/auth/signup', userValidations.signup, userControllers.createUserLocal);
router.post('/auth/login', userValidations.login, userControllers.signinLocal);
router.get('/activation/:id', userControllers.activateUserAccount);

// for testing the passport authentication of the JWT token
router.get('/test', passport.authenticate('jwt', { session: false }, null), (req, res) => {
  res.send({ message: 'hello' });
});

// Facebook Authentication Routes
router.post(
  '/oauth/facebook',
  passport.authenticate('facebookOAuth', { session: false }, null),
  userControllers.createUserSocial
);

router.post(
  '/oauth/google',
  passport.authenticate('googleOAuth', { session: false }, null),
  userControllers.createUserSocial
);

// Reset password
router.post('/auth/reset', userControllers.resetPassword);
router.put('/auth/reset/:token', userControllers.updatePassword);

// User logout
router.post(
  '/auth/logout',
  passport.authenticate('jwt', { session: false }, null),
  userControllers.logout
);

// Follow
router.post(
  '/profiles/:username/follow',
  passport.authenticate('jwt', { session: false }, null),
  userControllers.follow
);

// Un-follow
router.delete(
  '/profiles/:username/follow',
  passport.authenticate('jwt', { session: false }, null),
  userControllers.unfollow
);

export default router;
