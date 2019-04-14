import express from 'express';
import passport from 'passport';
import models from '../../models';
import userControllers from '../../controllers/users';

const router = express.Router();
const { User } = models;

router.post('/users', (req, res, next) => {
  const {
    email, username, password: hash
  } = req.body;
  User.create({ email, username, hash }).then((user) => {
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
  { session: false }), userControllers.createUser);

router.post('/oauth/google', passport.authenticate('googleOAuth',
  { session: false }), userControllers.createUser);

export default router;
