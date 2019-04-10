import models from '../models';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const { User } = models;
class Users {

    /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Returns the User Object
   */
    static async createUser(req, res) {
        const {
            email, username, password: hash
          } = req.body;

          // check if the email exists
          const userFind = await User.findOne({ where: { email: email } });
          if(userFind) {
            res.status(400).send({
              status: 400,
              errorMessage: 'the user with that email exists'
            })
          }

          // if there is the server error that the user can not be saved
          const user = await User.create( { email, username, hash } );
          if(!user) {
              return res.status(500).send({
                  status: 500,
                  errorMessage: 'some Error occured'
              })
          } 
          return res.status(201).json({
              status: 201,
              message: 'user created',
              user: {
                id: user.id,
                email: user.email,
                username: user.username,
              }
          })
    }

    /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Returns the User Object and Token used for the authentication
   */

   static async signin(req, res) {
    const { email, password } = req.body;
    // check first if the email exists in the db
     const user = await User.findOne({ where: { email: email } })
     if(!user) {
       return res.status(400).send({
         errorMessage: `The User with email ${email} is not registered`
       })
     }
     const {
      salt, hash, id,
    } = user;
    const hashInputpwd = crypto.pbkdf2Sync(
      password,
      salt,
      1000,
      64,
      'sha512',
    ).toString('hex');

    if(hash !== hashInputpwd) {
      return res.status(400).send({
        status: 400,
        errorMessage: 'The password is not correct',
      })
    }

    if (hash === hashInputpwd) {
      const token = jwt.sign({ id, email, exp: ((Date.now() / 1000) + (60 * 60)) }, process.env.SECRET);
      return res.status(200).json({
        status: 200,
        token,
        user,
      });
    }
   }
}

export default Users;
