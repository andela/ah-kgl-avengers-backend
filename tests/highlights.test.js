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

  describe('/Create a comment on a highlighted text in article', () => {
    it('should comment on highlighted text and return 201', (done) => {
      chai
        .request(app)
        .post(
          '/api/v1/articles/this-is-my-first-try-of-article69f9fccd65/text-comment'
        )
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          text:
            'met, consectetur adipiscing elit. Nulla faucibus ipsum no',
          startIndex: 23,
          endIndex: 80,
          body: 'testing this'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.commentOnText.should.have.property('body');
          res.body.commentOnText.should.have.property('author');
          res.body.commentOnText.should.have.property('post');
          done();
        });
    });

    it('should not comment on highlighted inf article is not found', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/this-is-my-first-try-of-article69f9fccd66/text-comment')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('errorMessage').equal('The Article You are trying to find is not created');
          done();
        });
    });

    it('should not update the comment as you are not the author', (done) => {
      chai
        .request(app)
        .put('/api/v1/articles/text-comment/2f0bab3d-54f0-41bb-b20e-b3456b28343f')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          text: 'met, consectetur adipiscing elit. Nulla faucibus ipsum no',
          startIndex: 23,
          endIndex: 80,
          body: 'new updated comment'
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should get all the highlighted texts on the article', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles/this-is-my-first-try-of-article69f9fccd65/text-comment')
        .send()
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should not get the highlighted texts as the article is not found', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles/this-is-my-first-try-of-article69f9fccd88/text-comment')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('errorMessage').eql('The Article is not found');
          done();
        });
    });
  });
});
