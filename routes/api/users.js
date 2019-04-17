import express from 'express';
import passport from 'passport';
import userControllers from '../../controllers/users';
import userValidations from '../../middlewares/userValidation';

const router = express.Router();

router.post('/auth/signup', userValidations.signup, userControllers.createUserLocal);
router.post('/auth/login', userValidations.login, userControllers.signinLocal);
router.get('/activation/:id', userControllers.activateUserAccount);

// for testing the passport authentication of the JWT token
router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send({ message: 'hello' });
});

// Facebook Authentication Routes
router.post(
  '/oauth/facebook',
  passport.authenticate('facebookOAuth', { session: false }),
  userControllers.createUserSocial
);

router.post(
  '/oauth/google',
  passport.authenticate('googleOAuth', { session: false }),
  userControllers.createUserSocial
);

// Reset password
router.post('/auth/reset', userControllers.resetPassword);
router.put('/auth/reset/:token', userControllers.updatePassword);

router.post(
  '/auth/logout',
  passport.authenticate('jwt', { session: false }),
  userControllers.logout
);

// User functionality
router.get(
  '/users/authors',
  passport.authenticate('jwt', { session: false }),
  userControllers.getAllAuthors
);
router.get(
  '/profiles/:username',
  passport.authenticate('jwt', { session: false }),
  userValidations.validUser,
  userControllers.getOneAuthor
);

export default router;
