import models from '../models';

const { User, BlackList } = models;

export default {
  create: (req, res, next) => {
    const {
      email, username, password: hash
    } = req.body;
    User.create({ email, username, hash }).then((user) => {
      res.status(201).json({
        status: res.statusCode,
        message: 'user created',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    }).catch(err => next(err));
  },

  logout: (req, res, next) => {
    const { exp } = req.user;
    const token = req.headers.authorization.split(' ')[1];
    BlackList.create({ token, expires: new Date(exp * 1000) }).then(() => res.status(200).json({
      status: res.statusCode,
      message: 'user logged out'
    })).catch(err => next(err));
  }
};
