import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../index';
import utils from './utils';

dotenv.config();

chai.should();

chai.use(chaiHttp);

const googleToken = process.env.GOOGLE_TOKEN;
const facebookToken = process.env.FACEBOOK_TOKEN;
const newUser = { username: 'berra', email: 'checka@tests.com', password: 'testtest4' };
let tokenValue;

before((done) => {
  utils.getUserToken().then((res) => {
    tokenValue = res.body.user.token;
    done();
  }).catch((e) => {
    done();
  });
});

describe('User', () => {
  context('Oauth login', () => {
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
  });


  context('/POST User Signup', () => {
    it('should pass and returns the status:201 as the user provides all required data', (done) => {
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

  context('/POST Signin', () => {
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

    it('should pass and returns the error object and status:400 as password doesn\'t  match', (done) => {
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

  context('Follow another user', () => {
    it('should return a 201 status code and user profile', (done) => {
      chai.request(app)
        .post('/api/v1/profiles/tester2/follow')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(201);
          res.body.profile.should.be.an('object');
          // done();
          // });
          chai.request(app)
            .post('/api/v1/profiles/tester3/follow')
            .set('Authorization', `Bearer ${tokenValue}`)
            .send()
            .end((err, res) => {
              res.should.have.status(201);
              res.body.profile.should.be.an('object');
              done();
            });
        });
    });
  });

  context('Un-follow another user', () => {
    it('should return a 200 status code and user profile', (done) => {
      chai.request(app)
        .delete('/api/v1/profiles/tester2/follow')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.profile.should.be.an('object');
          done();
        });
    });
  });

  context('Reset password', () => {
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
    it('should return 200 as the token is active and can be blacklisted', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should return a 401 status code because the token has been blacklisted', (done) => {
      chai.request(app)
        .post('/api/v1/profiles/tester3/follow')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
