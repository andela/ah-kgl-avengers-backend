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
      .getUser1Token()
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
        .post('/api/v1/articles/comments/18e1bbf9-e707-4925-a992-c59f1fc748aa/like')
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
        .post('/api/v1/articles/comments/c90dee64-663d-4d8b-b34d-12acba22cd40/like')
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not like the comment and return 404 as the comment is not found', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/comments/c90dee64-663d-4d8b-b34d-12acba22cd45/like')
        .send()
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it('Removes a like on the comment', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/comments/18e1bbf9-e707-4925-a992-c59f1fc748aa/like')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property('message')
            .eql('You have successfully removed your like on this comment');
          done();
        });
    });

    it('Fails to remove like on the comment as user is not authenticated', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/comments/c90dee64-663d-4d8b-b34d-12acba22cd41/like')
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
