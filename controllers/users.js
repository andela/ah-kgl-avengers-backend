import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';
import mailer from '../config/verificationMail';
import subscribe from '../helpers/subscribe';

dotenv.config();

const { User, BlacklistTokens, subscribers } = models;

/**
 * @description User Controller class
 */
class Users {
  /**
   * Adds two numbers together.
   * @param {Object} req .
   * @param {Object} res The User Object.
   * @returns {Object} created user data
   */
  static async createUserLocal(req, res) {
    const { email, username, password: hash } = req.body;
    const { user } = req;
    // check if there is user who is authenticated and if he is a super-admin and activate a user
    const isAdmin = !!(user && user.role === 'super-admin');

    try {
      const userCreate = await User.create({
        email: email.trim(),
        username: username.trim(),
        hash,
        following: JSON.stringify({ ids: [] }),
        followers: JSON.stringify({ ids: [] }),
        activated: isAdmin ? 1 : 0
      });
      /* check if there is user who is authenticated and if he is a super-admin
       *and send a *reset password email and if not then send activation email
       */
      if (isAdmin) {
        mailer.sentResetMail({
          username: userCreate.username,
          email: userCreate.email
        });
      } else {
        mailer.sentActivationMail({ name: username, email });
      }
      return res.status(201).json({
        status: 201,
        message: 'user created',
        user: {
          email: userCreate.email,
          username: userCreate.username
        }
      });
    } catch (e) {
      return res.status(400).send({
        status: 400,
        error: e.errors[0].message
      });
    }
  }

  /**
   *
   * @param {*} req request object.
   * @param {*} res response object.
   * @returns {Object} returns the User Object
   */
  static async activateUserAccount(req, res) {
    const { token } = req.params;
    const { email } = jwt.verify(token, process.env.SECRET);
    const data = await User.update({ activated: 1 }, { where: { email }, returning: true });
    if (data[0] === 1) res.redirect(`${process.env.FRONT_END_URL}/login`);
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns the User Object
   */
  static async signinLocal(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user.activated === 0) {
      return res.status(400).send({
        error: `The account with email ${email} is not activated`
      });
    }
    if (user.activated !== 1) {
      return res.status(400).send({
        error: 'You account is not valid'
      });
    }
    const {
      salt, hash, id, role, username
    } = user;
    const hashInputPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    if (hash !== hashInputPassword) {
      return res.status(400).send({
        status: 400,
        error: 'The password is not correct'
      });
    }

    if (hash === hashInputPassword) {
      const token = jwt.sign(
        {
          id,
          role,
          email,
          username
        },
        process.env.SECRET,
        { expiresIn: 2592000 }
      );
      return res.status(200).json({
        status: 200,
        user: {
          email: user.email,
          token,
          username: user.username,
          bio: user.bio,
          image: user.image
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
      displayName, emails, provider, name, photos
    } = req.user;
    const { familyName, givenName } = name;
    try {
      const existingUser = await User.findOne({
        where: { username: displayName, provider, activated: 1 }
      });
      if (existingUser) {
        const token = jwt.sign(
          {
            id: existingUser.id,
            role: existingUser.role,
            emails
          },
          process.env.SECRET,
          { expiresIn: 2592000 }
        );
        return res.status(200).send({
          status: res.statusCode,
          token,
          message: `Welcome back ${existingUser.username}`,
          data: {
            username: existingUser.username,
            email: existingUser.email,
            provider: existingUser.provider,
            lastName: existingUser.lastName,
            firstName: existingUser.firstName,
            image: existingUser.image,
            bio: existingUser.bio
          }
        });
      }

      const user = new User({
        provider,
        lastName: givenName,
        firstName: familyName,
        email: emails[0].value,
        username: displayName,
        image: photos[0].value,
        following: JSON.stringify({ ids: [] }),
        followers: JSON.stringify({ ids: [] }),
        activated: 1
      });
      const newUser = await user.save();

      const token = jwt.sign(
        {
          id: newUser.id,
          role: newUser.role,
          emails
        },
        process.env.SECRET,
        { expiresIn: 2592000 }
      );
      return res.status(201).send({
        status: res.statusCode,
        token,
        message: `${newUser.username}, your account has been created successfully`,
        data: {
          username: newUser.username,
          email: newUser.email,
          provider: newUser.provider,
          lastName: newUser.lastName,
          firstName: newUser.firstName,
          image: newUser.image,
          bio: newUser.bio
        }
      });
    } catch (error) {
      const existingUser = await User.findOne({
        where: { username: displayName }
      });
      if (error.errors[0].type) {
        return res.status(422).send({
          status: res.statusCode,
          message: `${error.errors[0].value} your account already exits, please login with ${
            existingUser.provider === 'google-plus' ? 'google' : existingUser.provider
          }`
        });
      }
    }
  }

  /**
   * reset user password
   * @param {object} req
   * @param {object} res
   * @returns {object} res
   */
  static async resetPassword(req, res) {
    // check if email have been sent and exists in the database
    const { email } = req.body;
    if (!email) {
      return res.status(404).send({
        status: res.statusCode,
        message: 'email not found'
      });
    }
    const result = await User.findOne({
      where: {
        email
      }
    });
    if (!result) {
      return res.status(404).send({
        status: res.statusCode,
        message: `User with email ${email} does not exist`
      });
    }

    await mailer.sentResetMail({
      username: result.username,
      email
    });

    return res.status(200).send({
      status: res.statusCode,
      message: 'Reset email sent! check your email'
    });
  }

  /**
   * update user password
   * @param {object} req
   * @param {object} res
   * @returns {object} res
   */
  static async updatePassword(req, res) {
    // verify token
    const { token } = req.params;
    const { password, password2 } = req.body;
    if (password !== password2) {
      return res.status(400).send({
        status: res.statusCode,
        message: 'password not matching'
      });
    }

    try {
      jwt.verify(token, process.env.SECRET);
    } catch (err) {
      return res.status(404).send({
        status: res.statusCode,
        message: `${err.message}, go to reset again`
      });
    }

    const { email } = jwt.verify(token, process.env.SECRET);

    // update password
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    await User.update(
      {
        salt,
        hash
      },
      {
        where: {
          email
        }
      }
    );
    return res.status(200).send({
      status: res.statusCode,
      message: 'Password successfully updated'
    });
  }

  /**
   * user logout
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} res
   */
  static async logout(req, res, next) {
    const { exp } = req.user;
    const token = req.headers.authorization.split(' ')[1];
    BlacklistTokens.create({ token, expires: new Date(exp * 1000) })
      .then(() => res.status(200).json({
        status: res.statusCode,
        message: 'User logged out'
      }))
      .catch(err => next(err));
  }

  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {*} user object
   */
  static async updateProfile(req, res) {
    const { username } = req.params;
    const { body } = req;
    const checkUser = await User.findOne({ where: { username } });
    if (!checkUser) {
      return res.status(404).send({
        status: 404,
        error: 'The User is not registered'
      });
    }

    if (checkUser.id !== req.user.id && req.user.role === 'user') {
      return res.status(401).send({
        status: 401,
        error: 'You are not allowed to update this profile'
      });
    }
    const updated = await User.update(
      {
        username: body.username,
        bio: body.bio,
        image: body.image || null,
        firstName: body.firstName || null,
        lastName: body.lastName || null
      },
      {
        where: { username },
        attributes: ['username', 'bio', 'image', 'firstName', 'lastName', 'email'],
        returning: true
      }
    );
    return res.status(200).send({
      status: 200,
      message: 'The profile has been updated',
      profile: {
        username: updated[1][0].username,
        bio: updated[1][0].bio,
        image: updated[1][0].image,
        email: updated[1][0].email,
        firstName: updated[1][0].firstName,
        lastName: updated[1][0].lastName
      }
    });
  }

  /**
   * A user can follow another user
   * @param {object} req
   * @param {object} res
   * @return {object} res
   * */
  static async follow(req, res) {
    const { username } = req.params;
    const { id } = req.user;
    try {
      const userExists = await User.findOne({
        where: {
          username
        },
        attributes: ['id', 'bio', 'image', 'followers', 'email', 'username']
      });

      if (!userExists) {
        return res.status(404).json({
          status: res.statusCode,
          message: "The user you want to follow doesn't exist"
        });
      }
      if (userExists.id === id) {
        return res.status(400).json({
          status: res.statusCode,
          message: 'Sorry! You can not follow your self'
        });
      }

      const user = await User.findOne({
        where: { id },
        attributes: ['following']
      });

      //  check if the user is already followed
      const followingUsers = JSON.parse(user.dataValues.following).ids;
      const existInFollowing = followingUsers.find(followID => followID === userExists.id);
      if (existInFollowing) {
        return res.status(400).json({
          status: 400,
          message: 'User already followed'
        });
      }

      // add a new user to the list of followed users
      followingUsers.push(userExists.dataValues.id);
      await User.update({ following: JSON.stringify({ ids: followingUsers }) }, { where: { id } });

      // update the followed user's followers list
      const followedUsersFollowers = JSON.parse(userExists.dataValues.followers).ids;
      followedUsersFollowers.push(id);
      await User.update(
        {
          followers: JSON.stringify({ ids: followedUsersFollowers })
        },
        {
          where: { username }
        }
      );

      // send follow notification
      await mailer.sentNotificationMail({
        username: req.user.username,
        followedAuthor: userExists.email,
        followedUsername: userExists.username
      });

      // create subscribers row
      const author = await subscribers.findOne({
        where: { authorId: userExists.id }
      });
      if (!author) {
        await subscribers.create({
          authorId: userExists.id,
          subscribers: []
        });
      }

      subscribe(id, userExists.id);

      return res.status(201).json({
        status: res.statusCode,
        profile: {
          username,
          image: userExists.image,
          bio: userExists.bio,
          following: true
        }
      });
    } catch (e) {
      return res.status(500).json({
        error: e,
        status: res.statusCode,
        message: e.message
      });
    }
  }

  /**
   * A user can un-follow another user he/she was following
   * @param {object} req
   * @param {object} res
   * @return {object} res
   * */
  static async unFollow(req, res) {
    const { username } = req.params;
    const { id } = req.user;
    try {
      const userExists = await User.findOne({
        where: { username },
        attributes: ['id', 'bio', 'image', 'followers']
      });

      if (!userExists) {
        return res.status(404).json({
          status: res.statusCode,
          message: "The user you want to un-follow doesn't exist"
        });
      }

      const user = await User.findOne({
        where: { id },
        attributes: ['following']
      });
      //  check if the user is already followed
      let followingUsers = JSON.parse(user.dataValues.following).ids;
      const existInFollowing = followingUsers.find(followID => followID === userExists.id);

      if (!existInFollowing) {
        return res.status(400).json({
          status: 400,
          message: 'User not followed'
        });
      }

      followingUsers = followingUsers.filter(followedUser => followedUser !== userExists.id);

      // update the un-followed user's followers list
      let unFollowedUserFollowers = JSON.parse(userExists.dataValues.followers).ids;
      unFollowedUserFollowers = unFollowedUserFollowers.filter(followerID => followerID !== id);
      await User.update(
        {
          followers: JSON.stringify({ ids: unFollowedUserFollowers })
        },
        {
          where: { username }
        }
      );

      await User.update({ following: JSON.stringify({ ids: followingUsers }) }, { where: { id } });

      subscribe(id, userExists.id);

      return res.status(200).json({
        status: res.statusCode,
        profile: {
          username,
          image: userExists.image,
          bio: userExists.bio,
          following: false
        }
      });
    } catch (e) {
      return res.status(500).json({
        status: res.statusCode,
        message: 'Something went wrong on the server',
        error: e.message
      });
    }
  }

  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} res with the updated user information
   */
  static async getProfile(req, res) {
    const { username } = req.params;
    const findUser = await User.findOne({ where: { username, activated: 1 } });
    if (!findUser) {
      return res.status(400).send({
        status: 400,
        error: 'The User does not exist'
      });
    }

    return res.status(200).send({
      status: 200,
      profile: {
        username: findUser.username,
        bio: findUser.bio,
        image: findUser.image,
        email: findUser.email,
        firstName: findUser.firstName,
        lastName: findUser.lastName
      }
    });
  }

  /**
   * get a list of authors
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} get all users/authors
   */
  static async getAllUsers(req, res) {
    const { limit = 10, offset = 0 } = req.query;
    const findUsers = await User.findAll({
      where: { activated: 1 },
      attributes: ['firstName', 'lastName', 'role', 'email', 'username', 'image'],
      limit,
      offset
    });

    return res.status(200).send({
      status: 200,
      profile: findUsers
    });
  }

  /**
   * This method implements the functionalities of deleting a user
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} deleted User
   */
  static async deleteUser(req, res) {
    const { username } = req.params;

    const findUser = await User.findOne({ where: { username, activated: 1 } });
    if (!findUser) {
      return res.status(400).send({
        status: 400,
        error: 'The user with that username is not found'
      });
    }

    const deleteUser = await User.update(
      { activated: -1 },
      { where: { username, activated: 1 }, returning: true }
    );
    const deletedUser = deleteUser[1][0].get();

    return res.status(200).send({
      status: 200,
      profile: {
        username: deletedUser.username,
        email: deletedUser.email,
        image: deletedUser.image,
        bio: deletedUser.bio,
        firstName: deletedUser.firstName,
        lastName: deletedUser.lastName,
        deletedAt: deletedUser.updatedAt
      }
    });
  }

  /**
   * This method implements the functionalities of granting access to a user
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} new improved User
   */
  static async changeUserAccess(req, res) {
    try {
      const { username } = req.params;
      const { access } = req.body;

      const findUser = await User.findOne({ where: { username, activated: 1 } });
      if (!findUser) {
        return res.status(400).send({
          status: 400,
          error: 'The user with that username is not found'
        });
      }

      const grantAccess = await User.update(
        { role: access },
        { where: { username, activated: 1 }, returning: true }
      );
      const grantedAccess = grantAccess[1][0].get();

      return res.status(200).send({
        status: 200,
        message: 'The access has been successfully granted',
        improvedUser: {
          username: grantedAccess.username,
          email: grantedAccess.email,
          image: grantedAccess.image,
          firstName: grantedAccess.firstName,
          lastName: grantedAccess.lastName,
          newRole: grantedAccess.role
        }
      });
    } catch (e) {
      if (e.name === 'SequelizeValidationError') {
        return res.status(400).send({
          status: 400,
          error: 'the role has to be between user and admin'
        });
      }
      return res.status(500).json({
        status: res.statusCode,
        message: 'Something went wrong on the server'
      });
    }
  }

  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} get users according to the roles
   */
  static async searchWithRoles(req, res) {
    const { limit = 10, offset = 0 } = req.query;
    const { role } = req.query;

    if (!role || (role !== 'admin' && role !== 'user')) {
      return res.status(400).send({
        status: 400,
        error: 'Please Provide role with values admin or user in queries'
      });
    }

    const findUsers = await User.findAll({
      where: {
        role,
        activated: 1
      },
      attributes: ['username', 'image', 'firstName', 'lastName'],
      limit,
      offset
    });
    return res.status(200).send({
      status: 200,
      profiles: findUsers
    });
  }


  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} get followers array
   */
  static async getFollowers(req, res) {
    const { limit = 10, offset = 0 } = req.query;
    const { username } = req.params;

    try {
      const findFollowers = await User.findOne({
        where: {
          username,
          activated: 1
        },
        attributes: ['followers'],
        limit,
        offset
      });
      const getIds = JSON.parse(findFollowers.followers).ids;
      const arrayFollowers = await Promise.all(
        getIds.map(async (user) => {
          const userProfile = await User.findOne({ where: { id: user }, attributes: ['username', 'image'] });
          return {
            username: userProfile.username,
            image: userProfile.image
          };
        })
      );
      return res.status(200).send({
        status: 200,
        followers: arrayFollowers,
        count: arrayFollowers.length
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        errors: 'Server failed to handle your request',
      });
    }
  }

  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} get following array
   */
  static async getFollowings(req, res) {
    const { limit = 10, offset = 0 } = req.query;
    const { username } = req.params;

    try {
      const findFollowers = await User.findOne({
        where: {
          username,
          activated: 1
        },
        attributes: ['following'],
        limit,
        offset
      });
      const getIds = JSON.parse(findFollowers.following).ids;

      const arrayFollowings = await Promise.all(
        getIds.map(async (user) => {
          const userProfile = await User.findOne({ where: { id: user }, attributes: ['username', 'image'] });
          return {
            username: userProfile.username,
            image: userProfile.image
          };
        })
      );
      return res.status(200).send({
        status: 200,
        followers: arrayFollowings,
        count: arrayFollowings.length
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        errors: 'Server failed to handle your request',
      });
    }
  }
}

export default Users;
