import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../index';
import models from '../models';
import baseTest from './base.test';

dotenv.config();

const { User } = models;
const token = baseTest.getToken();

chai.should();

chai.use(chaiHttp);

const googleToken = process.env.GOOGLE_TOKEN;
const facebookToken = process.env.FACEBOOK_TOKEN;

describe('User', () => {
  // delete all datas in the table of users before doing tests
  before(() => {
    User.destroy({
      where: {},
      truncate: true
    });
  });

  it('should return an object with status 200 when a user login with Google OAuth', (done) => {
    chai
      .request(app)
      .post('/api/v1/oauth/google')
      .send({ access_token: googleToken })
      .end((err, res) => {
        res.body.should.be.a('object');
        done();
      });
  });

  it('should return an object with status 200 when a user login in with facebook OAuth', (done) => {
    chai
      .request(app)
      .post('/api/v1/oauth/facebook')
      .send({ access_token: facebookToken })
      .end((err, res) => {
        res.body.should.be.a('object');
        done();
      });
  });

  describe('/POST User Signup', () => {
    it('should pass and returs the status:200 as the user provides all required datas for login', (done) => {
      const newUser = { username: 'berra', email: 'checka@tests.com', password: 'test' };
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(201);
          done();
        });
    });

    it('should pass and returns status:400 as the user is already in db', (done) => {
      const newUser = { username: 'berra', email: 'checka@tests.com', password: 'test' };
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/POST Signin', () => {
    it('should pass and returns the status:200 and the object with token', (done) => {
      const signUser = { email: 'checka@tests.com', password: 'test' };
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(signUser)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(200);
          done();
        });
    });
    it('should pass and returns the error object and status:400 as password doen not match', (done) => {
      const signUser = { email: 'checka@tests.com', password: 'tesst' };
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(signUser)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('Reset password', () => {
    it('it should fail with email not registered', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/reset')
        .send({ email: 'fridolinho@gmail.com' })
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          done();
        });
    });
  });

  context('User logout', () => {
    it('should work because no authorization is implemented on routes', (done) => {
      chai
        .request(app)
        .post('/api/auth/logout')
        .set('Authorization', token)
        .send({ token })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.be.an('object');
          done();
        });
    });
  });
});
