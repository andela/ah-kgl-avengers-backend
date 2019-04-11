import models from '../models/';

const User = models.User;

class Users {
    static async createUser(req, res) {
        const {id, displayName, emails, provider} = req.user;
        try {
            const existingUser = await User.findOne({where: {"provider": `${provider}: ${id}`}});
            if (existingUser) {
                return res.status(200).send({
                    status: res.statusCode,
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
            res.status(201).send({
                status: res.statusCode,
                data: {
                  id: newUser.id,
                  username: newUser.username,
                  email: newUser.email,
                  provider: existingUser.provider
                },
            })
        } catch (e) {
          console.log(e);
          res.status(422).send({
            status: res.statusCode,
            error: `${e}`
          });
        }
    }
}

export default Users;
