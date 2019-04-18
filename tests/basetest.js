// here we create the user and get the token
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';

dotenv.config();

const { User } = models;
/*
 * login Method
 * Log in the User to get the token that can be used in other files
 * The method will be called where needed the token after login.
 */

const info = {
  user: async () => {
    const newUser = {
      username: 'Bobooooo',
      email: 'testinguu@tests.com',
      hash: 'testinguser',
      activated: 1,
    };
    try {
      const user = await User.findOne({ where: { email: newUser.email } });
      if (user === null) {
        const { id, email } = await User.create(newUser);
        const token = jwt.sign({ id, email, exp: Date.now() / 1000 + 60 * 60 }, process.env.SECRET);
        return { user: { id, token } };
      }
      return { user };
    } catch (error) {
      return error;
    }
  }
};

export default info;
