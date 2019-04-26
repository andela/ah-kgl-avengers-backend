import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import dataGenerator from './dataGenerator';

chai.use(chaiHttp);

const { email } = dataGenerator.user1;

export default {
  getUserToken: () => chai
    .request(app)
    .post('/api/v1/auth/login')
    .send({ email, password: 'testuser' })
};
