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

const getUser = async () => {
  const newUser = {
    username: 'boy',
    email: 'boy@tests.com',
    hash: 'boys123456',
    activated: 1,
  };
  try {
    const { id, email, username } = await User.create(newUser);
    const token = jwt.sign({ id, email, exp: Date.now() / 1000 + 60 * 60 }, process.env.SECRET);
    return { user: { id, token, username } };
  } catch (error) {
    return error;
  }
};

export default getUser;
