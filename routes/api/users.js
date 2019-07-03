import express from 'express';
import passport from 'passport';
import userControllers from '../../controllers/users';
import userValidations from '../../middlewares/userValidation';
import tokenChecker from '../../middlewares/passportCustom';

const router = express.Router({});
const {
  checkToken, verifyToken, verifyAdmin, verifySuperAdmin
} = tokenChecker;


router.post('/auth/signup', userValidations.signup, verifyToken, userControllers.createUserLocal);
router.post('/auth/login', userValidations.login, userControllers.signinLocal);
router.get('/activation/:token', userControllers.activateUserAccount);

// for testing the passport authentication of the JWT token
router.get('/test', checkToken, (req, res) => {
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
router.post('/auth/logout', checkToken, userControllers.logout);

// Follow
router.post('/profiles/:username/follow', checkToken, userControllers.follow);

// Un-follow
router.delete('/profiles/:username/follow', checkToken, userControllers.unFollow);

router.get('/profile/:username/followers', verifyToken, userControllers.getFollowers);

router.get('/profile/:username/following', verifyToken, userControllers.getFollowings);
// The Routes for the user Updating the account
router.put(
  '/users/profile/:username/update',
  checkToken,
  userControllers.updateProfile
);

// The Route to get the user profile
router.get('/users/profile/:username', userControllers.getProfile);

// super-admin and admin get all users
router.get('/users', verifyAdmin, userControllers.getAllUsers);

// super-admin and admin delete users
router.delete('/users/:username', verifySuperAdmin, userControllers.deleteUser);
// super-admin and admin delete users
router.put('/users/grant/:username', verifySuperAdmin, userControllers.changeUserAccess);

// super-admin can get users regarding of roles
router.get('/users/search', verifySuperAdmin, userControllers.searchWithRoles);
export default router;
