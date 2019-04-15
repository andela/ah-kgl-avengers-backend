import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';

dotenv.config();

const { User } = models;

/**
 * @description User Controller class
 */
class Users {
  /**
   * Adds two numbers together.
   * @param {Object} req .
   * @param {Object} res The User Object.
   * @returns {Object} The informations of User created.
   */
  static async createUserLocal(req, res) {
    const {
      email, username, password: hash
    } = req.body;


    const userFind = await User.findOne({ where: { email } });
    if (userFind) {
      res.status(400).send({
        status: 400,
        errorMessage: 'the user with that email exists'
      });
    }

    const user = await User.create({ email, username, hash });
    if (!user) {
      return res.status(500).send({
        status: 500,
        errorMessage: 'some Error occured'
      });
    }
    return res.status(201).json({
      status: 201,
      message: 'user created',
      user: {
        email: user.email,
        username: user.username,
      }
    });
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns the User Object
   */
  static async signinLocal(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send({
        errorMessage: `The User with email ${email} is not registered`
      });
    }
    const {
      salt, hash, id
    } = user;
    const hashInputpwd = crypto.pbkdf2Sync(
      password,
      salt,
      1000,
      64,
      'sha512',
    ).toString('hex');

    if (hash !== hashInputpwd) {
      return res.status(400).send({
        status: 400,
        errorMessage: 'The password is not correct',
      });
    }

    if (hash === hashInputpwd) {
      const token = jwt.sign(
        { id, email, exp: ((Date.now() / 1000) + (60 * 60)) }, process.env.SECRET
      );
      return res.status(200).json({
        status: 200,
        user: {
          email: user.email,
          token,
          username: user.username,
          bio: user.bio,
          image: user.image,
        }

      });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Returns the User Object or the error Object
   */
  static async createUserSocial(req, res) {
    const {
      id, displayName, emails, provider
    } = req.user;
    try {
      const existingUser = await User.findOne({ where: { username: displayName } && { provider } });
      if (existingUser) {
        const token = jwt.sign({
          id,
          emails,
          exp: ((Date.now() / 1000) + (60 * 60))
        },
        process.env.SECRET);
        return res.status(200).send({
          status: res.statusCode,
          token,
          data: {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
            provider: existingUser.provider
          },
        });
      }
      const user = new User({
        provider,
        email: emails[0].value,
        username: displayName
      });
      const newUser = await user.save();
      const token = jwt.sign({
        id,
        emails,
        exp: ((Date.now() / 1000) + (60 * 60))
      },
      process.env.SECRET);
      res.status(201).send({
        status: res.statusCode,
        token,
        data: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          provider: newUser.provider
        },
      });
    } catch (error) {
      const existingUser = await User.findOne({ where: { username: displayName } });
      if (error.errors[0].type) {
        res.status(422).send({
          status: res.statusCode,
          message: `${error.errors[0].value} already exits, please login with ${existingUser.provider} `
        });
      }
    }
  }
}

export default Users;
