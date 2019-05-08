import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import utils from './utils';

chai.should();
chai.use(chaiHttp);

let tokenValue;

describe('Like, Dislike and Favorite', () => {
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

  describe('/LIke', () => {
    it('should like the article and return 200', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/this-is-my-first-try-of-article69f9fccd65/like')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('You have successfully liked this article');
          done();
        });
    });
  });
  it('should like the article and return 200', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles/this-is-my-second-try-of-article69f9fccd65/like')
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('You have successfully remove your like');
        done();
      });
  });

  describe('/DISLIKE', () => {
    it('should dislike the article and return 200', (done) => {
      chai
        .request(app)
        .delete('/api/v1/articles/this-is-my-first-disliked-article69f9fccd65/dislike')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('You have successfully disliked this article');
          done();
        });
    });
  });
  it('should like the article and return 200', (done) => {
    chai
      .request(app)
      .delete('/api/v1/articles/this-is-my-second-disliked-article69f9fccd65/dislike')
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('You have successfully remove your dislike');
        done();
      });
  });

  describe('/FAVORITE', () => {
    it('should favorite the article and return 200', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/this-is-my-first-favorite-article69f9fccd65/favorite')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('You have favorited this article');
          done();
        });
    });
  });
  it('should remove the favorite on the article and return 200', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles/this-is-my-second-favorite-article69f9fccd65/favorite')
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('You have successfully removed your favorite');
        done();
      });
  });
  it('should get the articles you favorited and return 200', (done) => {
    chai
      .request(app)
      .get('/api/v1/users/favorite')
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
