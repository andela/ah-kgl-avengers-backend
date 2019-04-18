// here we create the user and get the token
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import models from '../models';

chai.use(chaiHttp);

const { User } = models;

/*
 * login Method
 * Log in the User to get the token that can be used in other files
 * The method will be called where needed the token after login.
 */

const getUserToken = async () => {
  const user = {
    username: 'prince',
    email: 'princes@gmail.com',
    password: 'hello12345'
  };
  return User.destroy({ truncate: { cascade: true } })
    .then(() => chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user));
};

const activateAccount = async () => {
  await getUserToken()
    .then((res) => {
      chai
        .request(app)
        .get(`/api/v1/activation/${res.body.user.id}`);
    })
    .catch((err) => {
      throw err;
    });
};

const loginInUser = async () => {
  const user = {
    username: 'shema',
    email: 'princes@gmail.com',
    password: 'hello12345'
  };
  try {
    await activateAccount();
    return chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(user);
  } catch (error) {
    throw error;
  }
};

export default loginInUser;
