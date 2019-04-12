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

// Facebook Authentication Routes
router.post('/oauth/facebook', passport.authenticate('facebookOAuth',
  { session: false }), Users.createUserSocial);

router.post('/oauth/google', passport.authenticate('googleOAuth',
  { session: false }), Users.createUserSocial);

export default router;
