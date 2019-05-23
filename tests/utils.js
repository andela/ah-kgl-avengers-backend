import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../index';
import dataGenerator from './dataGenerator';

dotenv.config();

chai.use(chaiHttp);

const { email: email1 } = dataGenerator.user1;
const { email: email2 } = dataGenerator.user2;
const { email: email3 } = dataGenerator.user3;
const { email: email4 } = dataGenerator.user4;
const { email: email5 } = dataGenerator.user5;
const { email: email7 } = dataGenerator.user7;

const admin = dataGenerator.user5;
const password = 'testuser';

export default {
  getUser1Token: () => chai
    .request(app)
    .post('/api/v1/auth/login')
    .send({ email: email1, password }),
  getUser2Token: () => chai
    .request(app)
    .post('/api/v1/auth/login')
    .send({ email: email2, password }),
  getUser3Token: () => chai
    .request(app)
    .post('/api/v1/auth/login')
    .send({ email: email3, password }),
  getUser4Token: () => chai
    .request(app)
    .post('/api/v1/auth/login')
    .send({ email: email4, password }),

  getUser7Token: () => chai
    .request(app)
    .post('/api/v1/auth/login')
    .send({ email: email7, password }),

  getAdminToken: () => chai
    .request(app)
    .post('/api/v1/auth/login')
    .send({ email: admin.email, password }),

  getActivationToken() {
    const tokenValidate = jwt.sign({
      email: email5
    }, process.env.SECRET, { expiresIn: 3600 });
    return tokenValidate;
  }

};
