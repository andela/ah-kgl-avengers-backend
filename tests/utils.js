import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../index';

chai.use(chaihttp);

const user = {
  email: 'tester1@test.com',
  password: 'testuser',
};

export default {
  getUserToken: () => chai
    .request(app)
    .post('/api/v1/auth/login')
    .send(user)
};
