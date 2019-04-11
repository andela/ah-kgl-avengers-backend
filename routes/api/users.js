import express from 'express';
import passport from 'passport';
import Users from '../../controllers';
import models from '../../models';
import userControllers from '../../controllers/users';
import mailer from '../../config/verificationMail';

const router = express.Router();

router.post('/auth/signup', Users.createUserLocal);
router.post('/auth/login', Users.signinLocal);

// for testing the passport authentication of the JWT token
router.get('/test', 
passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send({ message: 'hello' });
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
      const url = `http://localhost:3000/api/activation/${user.id}`;
      mailer.sentActivationMail({
        username, url, email, subject: 'Account activation'
      });
    }
  }).catch(next);
});

router.get('/activation/:id', (req, res, next) => {
  const { id } = req.params;
  User.update({ activated: 1 }, { where: { id } })
    .then(() => res.status(201).send({
      status: res.statusCode,
      message: 'Your account updated successfuly',
      data: user,
    })).catch(next);
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
