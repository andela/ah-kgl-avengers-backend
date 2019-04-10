import models from '../models/';

const User = models.User;

class Users {
    static async createUser(req, res) {
        const {id, displayName, emails, provider} = req.user;
        try {
            const existingUser = await User.findOne({where: {"provider": id}});
            if (existingUser) {
                return res.status(200).send({
                    status: res.statusCode,
                    data: existingUser,
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
                data: newUser,
            })
        } catch (e) {
            return e.message;
        }
    }
}

export default Users;
