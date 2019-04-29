import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import utils from './utils';

chai.should();
chai.use(chaiHttp);

let tokenValue;

describe('Like Comments', () => {
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

  describe('/LIke Comments', () => {
    it('should like the comment and return 200', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/this-is-my-first-try-of-article69f9fccd65/c90dee64-663d-4d8b-b34d-12acba22cd40/like')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('You have successfully liked this comment');
          done();
        });
    });

    it('should not like the comment and return 401 as user is not authenticated', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/this-is-my-first-try-of-article69f9fccd65/c90dee64-663d-4d8b-b34d-12acba22cd40/like')
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql('You have to Login first in order to like a comment');
          done();
        });
    });

    it('should not like the comment and return 404 as the comment is not found', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/this-is-my-first-try-of-article69f9fccd65/c90dee64-663d-4d8b-b34d-12acba22cd45/like')
        .send()
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('The comment is not found');
          done();
        });
    });

    it('should remove like on the commnent and return 200', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/this-is-my-second-try-of-article69f9fccd65/c90dee64-663d-4d8b-b34d-12acba22cd41/like')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('You have successfully removed your like on this comment');
          done();
        });
    });

    it('should fail to remove like on the commnent and return 401 as user is not authenticated', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/this-is-my-second-try-of-article69f9fccd65/c90dee64-663d-4d8b-b34d-12acba22cd41/like')
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message').eql('You need to login before liking the comment');
          done();
        });
    });

    it('should fail to remove like on the commnent and return 404 as comment not found', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/this-is-my-second-try-of-article69f9fccd65/c90dee64-663d-4d8b-b34d-12acba22cd45/like')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eql('The comment is not found');
          done();
        });
    });
  });
});
