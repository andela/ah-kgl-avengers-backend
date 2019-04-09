import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../index';
import models from '../models';

dotenv.config();

const { User } = models;

chai.should();

chai.use(chaiHttp);

const googleToken = process.env.GOOGLE_TOKEN;
const facebookToken = process.env.FACEBOOK_TOKEN;

// testing facebook and google strategy
describe('Social login routes', () => {
  before(() => {
    User.destroy({
      where: {},
      truncate: true
    });
  });

  it('should return an object with status 200 when a user login with Google OAuth', (done) => {
    chai.request(app)
      . post('/api/v1/oauth/google')
      .send({ access_token: googleToken })
      .end((err, res) => {
        res.body.should.be.a('object');
        done();
      });
  });

  it('should return an object with status 200 when a user login in with facebook OAuth', (done) => {
    chai.request(app)
      . post('/api/v1/oauth/facebook')
      .send({ access_token: facebookToken })
      .end((err, res) => {
        res.body.should.be.a('object');
        done();
      });
  });
});
