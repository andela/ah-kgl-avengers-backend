import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import dataGenerator from './dataGenerator';

chai.use(chaiHttp);

const { email } = dataGenerator.user1;
const admin = dataGenerator.user2;

export default {
  getUserToken: () => chai
    .request(app)
    .post('/api/v1/auth/login')
    .send({ email, password: 'testuser' }),

  getAdminToken: () => chai
    .request(app)
    .post('/api/v1/auth/login')
    .send({ email: admin.email, password: 'testuser' }),
};
