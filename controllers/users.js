import models from '../models/';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
const User = models.User;

dotenv.config();

class Users {
    static async createUser(req, res) {
        const {id, displayName, emails, provider} = req.user;
        try {
            const existingUser = await User.findOne({where: {"provider": `${provider}: ${id}`}});
            if (existingUser) {
              const token = jwt.sign({ id, emails,
                exp: ((Date.now() / 1000) + (60 * 60)) },
                process.env.SECRET
              );
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
                provider: `${provider}: ${id}`,
                email: emails[0].value,
                username: displayName
            });
            const newUser = await user.save();
          const token = jwt.sign({ id, emails,
            exp: ((Date.now() / 1000) + (60 * 60)) },
            process.env.SECRET
          );
            res.status(201).send({
                status: res.statusCode,
                token,
                data: {
                  id: newUser.id,
                  username: newUser.username,
                  email: newUser.email,
                  provider: existingUser.provider
                },
            })
        } catch (error) {
          res.status(422).send({
            status: res.statusCode,
            error: error
          });
        }
    }
}

export default Users;
