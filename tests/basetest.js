// here we create the user and get the token
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

/*
 * login Method
 * Log in the User to get the token that can be used in other files
 * The method will be called where needed the token after login.
 */
const getUserToken = () => {
  const user = {
    username: 'prince',
    email: 'prince@gmail.com',
    password: 'hello12345'
  };
  return chai
    .request(app)
    .post('/api/v1/auth/signup')
    .send(user);
};

const activateAccount = async () => {
  await getUserToken()
    .then(res => chai
      .request(app)
      .get(`/api/v1/activation/${res.body.user.id}`));
};

const logInUser = async () => {
  const user = {
    username: 'prince',
    email: 'prince@gmail.com',
    password: 'hello12345'
  };
  await activateAccount();
  return chai
    .request(app)
    .post('/api/v1/auth/login')
    .send(user);
};

export default logInUser;
