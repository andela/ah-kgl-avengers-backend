import models from '../models';

const BlackList = models.BlacklistTokens;

export default {
  logout: (req, res, next) => {
    const { exp } = req.user;
    const token = req.headers.authorization.split(' ')[1];
    BlackList.create({ token, expires: new Date(exp * 1000) }).then(() => res.status(200).json({
      status: res.statusCode,
      message: 'user logged out'
    })).catch(err => next(err));
  }
};
