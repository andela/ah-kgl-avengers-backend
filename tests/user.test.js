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


describe('User', () => {
  // delete all datas in the table of users before doing tests
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

  describe('/POST User Signup', () => {
    it('should pass and returs the status:200 as the user provides all required datas for login', (done) => {
      const newUser = { username: 'berra', email: 'checka@tests.com', password: 'test' };
      chai.request(app)
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
      chai.request(app)
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
      chai.request(app)
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
      chai.request(app)
        .post('/api/v1/auth/login')
        .send(signUser)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/USER object in models', () => {
    it('should pass and returns the User object from the db that was created', async () => {
      await User.create({ username: 'berria', email: 'checky@tests.com', hash: 'test' })
        .then((res) => {
          res.should.be.a('object');
        })
        .catch(err => console.log(err));
    });

    it('should pass and returns the error array', async () => {
      await User.create({ username: 'berria', email: 'checky@tests.com', password: 'test' })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err.errors.should.be.a('array');
        });
    });
  });
});
