import models from '../models';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

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

          const user = await User.create( { email, username, hash } );
          if(!user) {
              return res.status(400).send({
                  status: 400,
                  errorMessage: 'You have to provide all datas'
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
   * @returns {Object} Returns the User Object
   */

   static async signin(req, res) {
    const { email, password } = req.body;
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
        errorMessage: 'The password is wrong',
      })
    }

    if (hash === hashInputpwd) {
      const token = jwt.sign({ id, email }, 'finallytoken');
      return res.status(200).json({
        status: 200,
        token,
        user,
      });
    }
   }
}

export default Users;
