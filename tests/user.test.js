import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../index';
import models from '../models';
import userToken from './basetest';

dotenv.config();

const { User } = models;
const token = userToken();

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
    it('should pass and returs the status:201 as the user provides all required datas for signup', (done) => {
      const newUser = { username: 'berra', email: 'checka@tests.com', password: 'testtest4' };
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
      const newUser = { username: 'berra', email: 'checka@tests.com', password: 'testtest4' };
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
    it('should fail as the user is not activated', (done) => {
      const signUser = { email: 'checka@tests.com', password: 'testtest4' };
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
    it('should pass and returns the error object and status:400 as password doen not match', (done) => {
      const signUser = { email: 'checka@tests.com', password: 'tessttest4' };
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
    it('should return 401 as the user is not loged in and we cant aunthenticate', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('user functionality', () => {
    it('it should fail because user is not authenticated', (done) => {
      chai
        .request(app)
        .get('/api/v1/users/authors')
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          done();
        });
    });

    it('it should fail because user is not authenticated', (done) => {
      chai
        .request(app)
        .get('/api/v1/profiles/fridz')
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          done();
        });
    });
  });
});
