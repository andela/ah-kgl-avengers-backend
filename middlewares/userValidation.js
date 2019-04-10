import models from '../models';

const { User } = models;

export default {
  signup: async (req, res, next) => {
    const { email, username, password } = req.body;

    if (!username.trim()) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'username can not be empty',
      });
    }

    if (!email.trim()) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'email can not be empty',
      });
    }

    const emailRegex = /^([a-zA-Z0-9+.-]{2,})@([a-zA-Z0-9-]{2,})\.([a-zA-Z0-9]{2,6})/g;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'email not valid',
      });
    }

    if (!password.trim()) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'password can not be empty',
      });
    }

    if (!(/^[a-zA-Z0-9]{1,}$/g.test(password.trim()))) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'password must be alphanumeric',
      });
    }

    if (!(password.trim().length > 8)) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'password length can not be lower than 8',
      });
    }

    try {
      const userWithUserName = await User.findOne({where:{username}});
      if (userWithUserName){
        return res.status(400).json({
          status: res.statusCode,
          error: 'user with this username already exists',
        });
      }
    } catch (e) {
      next(e);
    }

    try {
      const userWithEmail = await User.findOne({where:{email}});
      if (userWithEmail){
        return res.status(400).json({
          status: res.statusCode,
          error: 'user with this email already exists',
        });
      }
    }
    catch (e) {
      next(e);
    }

    return next();
  }
};
