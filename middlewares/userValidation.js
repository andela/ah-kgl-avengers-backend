import models from '../models';

const { User } = models;
/**
 * Custom error validator middleware
 * */
export default {
  /**
   * Validate the request body object
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {Array} errors
   * */
  signup: async (req, res, next) => {
    const { email, username, password } = req.body;

    // Array to hold all errors
    const errors = [];

    // username is required
    if (username) {
      if (!username.trim()) {
        errors.push('username can not be empty');
      }
      // username is unique
      try {
        if (username.trim()) {
          const userWithUserName = await User.findOne({ where: { username } });
          if (userWithUserName) {
            errors.push('user with this username already exists');
          }
        }
      } catch (e) {
        next(e);
      }
    } else {
      errors.push('username is required');
    }

    // email is required, must be a valid email and unique
    if (email) {
      if (!email.trim()) {
        errors.push('email can not be empty');
      }

      const emailRegex = /^([a-zA-Z0-9+.-]{2,})@([a-zA-Z0-9-]{2,})\.([a-zA-Z0-9]{2,6})/g;
      if (!emailRegex.test(email.trim())) {
        errors.push('email not valid');
      }

      // email is unique
      try {
        if (email.trim()) {
          const userWithEmail = await User.findOne({ where: { email } });
          if (userWithEmail) {
            errors.push('user with this email already exists');
          }
        }
      } catch (e) {
        next(e);
      }
    } else {
      errors.push('email is required');
    }

    // password is required and must more than or equal to 8 alphanumeric characters
    if (password) {
      if (!password.trim()) {
        errors.push('password can not be empty');
      }
      if (!(password.trim().length >= 8)) {
        errors.push('password length can not be lower than 8');
      }

      if (password.trim().length > 0 && !/^[a-zA-Z0-9]{1,}$/g.test(password.trim())) {
        errors.push('password must be alphanumeric');
      }
    } else {
      errors.push('password is required');
    }

    return errors.length > 0
      ? res.status(400).json({
        status: res.statusCode,
        errors
      })
      : next();
  },

  login: async (req, res, next) => {
    const { email, password } = req.body;

    // Array to hold all errors
    const errors = [];

    // email is required, must be a valid email and unique
    if (email) {
      if (!email.trim()) {
        errors.push('email can not be empty');
      }

      const emailRegex = /^([a-zA-Z0-9+.-]{2,})@([a-zA-Z0-9-]{2,})\.([a-zA-Z0-9]{2,6})/g;
      if (!emailRegex.test(email.trim())) {
        errors.push('email not valid');
      }

      // email is unique
      try {
        if (email.trim()) {
          const userWithEmail = await User.findOne({ where: { email } });
          if (!userWithEmail) {
            errors.push("user with this email doesn't exists");
          }
        }
      } catch (e) {
        next(e);
      }
    } else {
      errors.push('email is required');
    }

    // password is required and must more than or equal to 8 alphanumeric characters
    if (password) {
      if (!password.trim()) {
        errors.push('password can not be empty');
      }
      if (!(password.trim().length >= 8)) {
        errors.push('password length can not be lower than 8');
      }

      if (password.trim().length > 0 && !/^[a-zA-Z0-9]{1,}$/g.test(password.trim())) {
        errors.push('password must be alphanumeric');
      }
    } else {
      errors.push('password is required');
    }
    return errors.length > 0
      ? res.status(400).json({
        status: res.statusCode,
        errors
      })
      : next();
  },

  validUser: async (req, res, next) => {
    const { username } = req.params;

    // Array to hold all errors
    const errors = [];

    if (!username.trim()) {
      errors.push('username can not be empty');
    }

    // username exists
    try {
      if (username.trim()) {
        const user = await User.findOne({ where: { username } });
        if (!user) {
          errors.push('user not found');
        }
      }
    } catch (e) {
      next(e);
    }

    return errors.length > 0
      ? res.status(400).json({
        status: res.statusCode,
        errors
      })
      : next();
  },
};
