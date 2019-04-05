 import express from  "express";
import models from '../../models';

const router = express.Router();
const User = models.User;

router.post("/users", (req, res, next) => {
    const {
        email,username,password: hash
    } = req.body;
    User.create({email,username,hash}).then((user) => {
        if (user) {
            res.status(201).json({
                status: res.statusCode,
                message: 'user created',
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                },
            });
        }
    }).catch(next);
});

module.exports = router;
