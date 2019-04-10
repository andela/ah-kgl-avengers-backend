import express from 'express';
import passport from 'passport';
import userControllers from '../../controllers/users';
import userValidations from '../../middlewares/userValidation';
import multerConfig from '../../config/multerConfig';
import checkToken from '../../middlewares/passportCustom';

const router = express.Router({});

router.post('/auth/signup', userValidations.signup, userControllers.createUserLocal);
router.post('/auth/login', userValidations.login, userControllers.signinLocal);
router.get('/activation/:token', userControllers.activateUserAccount);

// for testing the passport authentication of the JWT token
router.get('/test', checkToken(), (req, res) => {
  res.send({ message: 'hello' });
});

// Facebook Authentication Routes
router.post(
  '/oauth/facebook',
  passport.authenticate('facebookOAuth', { session: false }, null),
  userControllers.createUserSocial
);

// Google Authentication Routes
router.post(
  '/oauth/google',
  passport.authenticate('googleOAuth', { session: false }, null),
  userControllers.createUserSocial
);

// Reset password
router.post('/auth/reset', userControllers.resetPassword);
router.put('/auth/reset/:token', userControllers.updatePassword);

// User logout
router.post('/auth/logout', checkToken(), userControllers.logout);

// User functionality
router.get('/users/authors', checkToken(), userControllers.getAllAuthors);
router.get(
  '/profiles/:username',
  checkToken(),
  userValidations.validUser,
  userControllers.getOneAuthor
);

// Follow
router.post('/profiles/:username/follow', checkToken(), userControllers.follow);

// Un-follow
router.delete('/profiles/:username/follow', checkToken(), userControllers.unFollow);
// The Routes for the user Updating the account
router.put(
  '/users/profile/:username/update',
  checkToken(),
  multerConfig,
  userControllers.updateProfile
);

// The Route to get the user profile
router.get('/users/profile/:username', userControllers.getProfile);

router.post('/v1/oauth/google', passport.authenticate('googleOAuth',
  { session: false }), userControllers.createUser);

export default router;
