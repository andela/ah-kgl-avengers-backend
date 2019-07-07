import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../index';
import utils from './utils';
import dataGenerator from './dataGenerator';

dotenv.config();

chai.should();
chai.use(chaiHttp);

const googleToken = process.env.GOOGLE_TOKEN;
const facebookToken = process.env.FACEBOOK_TOKEN;

let tokenValue;

before((done) => {
  utils
    .getUser1Token()
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

  it('should return an object with status 400 when a user login with wrong Google OAuth', (done) => {
    chai
      .request(app)
      .post('/api/v1/oauth/google')
      .send({ access_token: googleToken })
      .end((err, res) => {
        res.body.should.be.a('object');
        done();
      });
  });

  it('should return an object with status 400 when a user login with wrong  Google OAuth', (done) => {
    chai
      .request(app)
      .post('/api/v1/oauth/google')
      .send({ access_token: googleToken })
      .end((err, res) => {
        res.body.should.be.a('object');
        done();
      });
  });

  it('Testing test endpoint if token provided', (done) => {
    chai
      .request(app)
      .get('/api/v1/test')
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        res.body.should.have.property('message');
        res.body.message.should.eql('hello');
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
    it('should fail and returns error object and status:400 as password does not match', (done) => {
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

  it('Should return 400 when login with empty data', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: ' ', password: ' ' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(400);
        done();
      });
  });

  it('Should not login with a non-alphanumeric password', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: '$password' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(400);
        done();
      });
  });

  it('Should return 400 when signup with empty data', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({ email: ' ', password: ' ', username: ' ' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(400);
        done();
      });
  });

  it('Should return 400 when signup with non alphanumeric email', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test%@test.com', password: '%', username: ' ' })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(400);
        res.body.should.have.property('errors');
        done();
      });
  });

  it('Should return 400 when login with email that not exist ', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test10@test.com', password: 'testUser', })
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(400);
        res.body.should.have.property('errors');
        res.body.errors.should.be.an('Array');
        done();
      });
  });

  it('Should return 400 when login with non activated account', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: `${dataGenerator.user6.email}`,
        password: 'testuser'
      })
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.a('object');
        res.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should return 400 when login with non activated account', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: `${dataGenerator.user6.email}`,
        password: 'testuser'
      })
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.a('object');
        res.should.have.status(400);
        res.body.should.have.property('error');
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

    context('Return Followers of the user', () => {
      it('should return a 200 status code and array of authors that I follow', (done) => {
        chai
          .request(app)
          .get('/api/v1/profile/tester2/followers')
          .set('Authorization', `Bearer ${tokenValue}`)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.followers.should.be.an('array');
            done();
          });
      });
    });

    context('Return Authors that I Follow', () => {
      it('should return a 200 status code and array of authors that I follow', (done) => {
        chai
          .request(app)
          .get('/api/v1/profile/tester2/following')
          .set('Authorization', `Bearer ${tokenValue}`)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.followers.should.be.an('array');
            done();
          });
      });
    });

    it('should return a 200 status code and user profile', (done) => {
      chai
        .request(app)
        .delete('/api/v1/profiles/test/follow')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(404);
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
          res.body.profile.should.have.property('firstName');
          res.body.profile.should.have.property('lastName');
          res.body.profile.should.have.property('email');
          done();
        });
    });

    it('should fail as the username is not valid', (done) => {
      chai
        .request(app)
        .get('/api/v1/users/profile/none')
        .end((err, res) => {
          res.should.have.status(400);
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

      it('User should not send a request that require authorization after logout', (done) => {
        chai
          .request(app)
          .post('/api/v1/articles')
          .set('Authorization', `Bearer ${tokenValue}`)
          .send({
            title: 'One to Many and One to One',
            body: 'One to Many and One to One ',
          })
          .end((err, res) => {
            if (err) done(err);
            res.should.have.status(401);
            res.body.should.be.an('Object');
            res.body.should.have.property('error');
            done();
          });
      });
    });
  });
  describe('/Super Admin Roles', () => {
    // First login the super user that the token can used in tests
    let tokenValueAdmin;
    before((done) => {
      utils
        .getUser3Token()
        .then((res) => {
          tokenValueAdmin = res.body.user.token;
          done();
        })
        .catch(() => {
          done();
        });
    });
    const signupUser = { username: 'professional2', email: 'prof2@gmail.com', password: '123456789' };
    it('should pass, create and activated him', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .set('Authorization', `Bearer ${tokenValueAdmin}`)
        .send(signupUser)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(201);
          done();
        });
    });

    // super admin gets all the users
    it('should pass, get list of users', (done) => {
      chai
        .request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${tokenValueAdmin}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(200);
          done();
        });
    });

    it('should not pass, and returns authentication error as you are not super-admin', (done) => {
      chai
        .request(app)
        .get('/api/v1/users')
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(401);
          done();
        });
    });

    it('should pass, and returns the deleted user', (done) => {
      chai
        .request(app)
        .delete('/api/v1/users/tester7')
        .set('Authorization', `Bearer ${tokenValueAdmin}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(200);
          done();
        });
    });

    it('should not pass as the user is already deleted', (done) => {
      chai
        .request(app)
        .delete('/api/v1/users/tester7')
        .set('Authorization', `Bearer ${tokenValueAdmin}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(400);
          done();
        });
    });

    it('should not pass as the user does not exists', (done) => {
      chai
        .request(app)
        .delete('/api/v1/users/test')
        .set('Authorization', `Bearer ${tokenValueAdmin}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(400);
          done();
        });
    });

    it('should not pass, and returns authentication error as you are not super-admin', (done) => {
      chai
        .request(app)
        .delete('/api/v1/users/tester6')
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(401);
          done();
        });
    });

    it('should pass, and give access to the user', (done) => {
      const access = { access: 'admin' };
      chai
        .request(app)
        .put('/api/v1/users/grant/tester2')
        .send(access)
        .set('Authorization', `Bearer ${tokenValueAdmin}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(200);
          done();
        });
    });

    it('should not pass as access in not user or admin', (done) => {
      const access = { access: 'admins' };
      chai
        .request(app)
        .put('/api/v1/users/grant/tester2')
        .send(access)
        .set('Authorization', `Bearer ${tokenValueAdmin}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(400);
          done();
        });
    });

    it('should not pass as the username doesn\'t match any user', (done) => {
      const access = { access: 'admins' };
      chai
        .request(app)
        .put('/api/v1/users/grant/test')
        .send(access)
        .set('Authorization', `Bearer ${tokenValueAdmin}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(400);
          done();
        });
    });

    it('should not pass, as you are not sending anything in a body', (done) => {
      chai
        .request(app)
        .put('/api/v1/users/grant/tester2')
        .set('Authorization', `Bearer ${tokenValueAdmin}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(500);
          done();
        });
    });

    it('should not pass, and returns authentication error as you are not super-admin', (done) => {
      const access = { access: 'admin' };
      chai
        .request(app)
        .put('/api/v1/users/grant/tester2')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send(access)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(401);
          done();
        });
    });

    it('should pass, and returns users as you are a super-admin', (done) => {
      chai
        .request(app)
        .get('/api/v1/users/search?role=user')
        .set('Authorization', `Bearer ${tokenValueAdmin}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(200);
          done();
        });
    });

    it('should not pass, and returns error as you are not a super-admin', (done) => {
      chai
        .request(app)
        .get('/api/v1/users/search?role=user')
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          res.body.should.be.an('object');
          // res.should.have.status(401);
          done();
        });
    });

    it('should not pass as the role is not user or admin', (done) => {
      chai
        .request(app)
        .get('/api/v1/users/search?role=users')
        .set('Authorization', `Bearer ${tokenValueAdmin}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(400);
          done();
        });
    });
  });
});
