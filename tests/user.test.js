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

let tokenValue;

before((done) => {
  utils
    .getUserToken()
    .then((res) => {
      tokenValue = res.body.user.token;
      done();
    })
    .catch(() => {
      done();
    });
});

describe('User', () => {
  context('Oauth login', () => {
    it('should return an object with status 200 when a user login with Google OAuth', (done) => {
      chai
        .request(app)
        .post('/api/v1/oauth/google')
        .send({
          access_token: googleToken
        })
        .end((err, res) => {
          res.body.should.be.a('object');
          done();
        });
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
    const signupUser = { username: 'professional', email: 'prof@gmail.com', password: '123456789' };
    it('should create a new user', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(signupUser)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(201);
          done();
        });
    });

    it('should not create a new user', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send()
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(400);
          done();
        });
    });

    it('should fail and returns status:400 as registering with the user who is already in db', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(signupUser)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/POST Signin', () => {
    it('should pass as the user activated', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'tester2@test.com', password: 'testuser' })
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.a('object');
          res.should.have.status(200);
          done();
        });
    });
    it('should fail and returns the error object and status:400 as password does not match', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'tester2@test.com', password: 'testuser111' })
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.a('object');
          res.should.have.status(400);
          done();
        });
    });
  });

  it('should not login a user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send()
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(400);
        done();
      });
  });

  context('Follow another user', () => {
    it('should return a 201 status code and user profile', (done) => {
      chai
        .request(app)
        .post('/api/v1/profiles/tester2/follow')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(201);
          res.body.profile.should.be.an('object');
          done();
        });
    });
  });

  context('Un-follow another user', () => {
    it('should return a 200 status code and user profile', (done) => {
      chai
        .request(app)
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
        .send({
          email: 'fridolinho@gmail.com'
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(404);
          res.should.be.a('object');
          done();
        });
    });
  });

  describe('/UPDATE User Profile', () => {
    it('should pass as the user is updating his/her profile', (done) => {
      const newProfile = { bio: 'I work at statefarm', image: 'hellothisistheimage' };
      chai
        .request(app)
        .put('/api/v1/users/profile/tester1/update')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send(newProfile)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should fail to update the profile as the user is not authenticated', (done) => {
      const newProfile = { bio: 'I work at statefarm', image: 'hellothisistheimage' };
      chai
        .request(app)
        .put('/api/v1/users/profile/tester2/update')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send(newProfile)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(401);
          done();
        });
    });
    it("should pass as the user is viewing other's profile", (done) => {
      chai
        .request(app)
        .get('/api/v1/users/profile/tester1')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    context('User logout', () => {
      it('should blacklist the token to log out the the user', (done) => {
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
    });
  });
});
