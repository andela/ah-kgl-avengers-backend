import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import utils from './utils';
import dataGenerator from './dataGenerator';

chai.should();
chai.use(chaiHttp);

let tokenValue;

describe('Highlighted Comments', () => {
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

  describe('Should create a comment on a highlighted text in an article', () => {
    it('Adds a comment on highlighted text in an article', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${dataGenerator.post1.slug}/comments`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          text: 'met, consectetur adipiscing elit. Nulla faucibus ipsum no',
          startIndex: 23,
          endIndex: 80,
          body: 'testing this'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.comment.should.have.property('body');
          done();
        });
    });

    it('Should fail because highlighted text index is not correct', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${dataGenerator.post1.slug}/comments`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          text: 'met, consectetur adipiscing elit. Nulla faucibus ipsum no',
          startIndex: 23,
          endIndex: 83,
          body: 'testing this'
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error');
          done();
        });
    });

    it('should update the comment as you are the author', (done) => {
      chai
        .request(app)
        .put(
          `/api/v1/articles/${
            dataGenerator.post1.slug
          }/comments/2f0bab3d-54f0-41bb-b20e-b3456b28343f`
        )
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          text: 'met, consectetur adipiscing elit. Nulla faucibus ipsum no',
          startIndex: 23,
          endIndex: 80,
          body: 'new updated comment'
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('Should fail as the comment is not found', (done) => {
      chai
        .request(app)
        .put(
          `/api/v1/articles/${
            dataGenerator.post1.slug
          }/comments/2f0bab3d-54f0-41bb-b20e-b3456b28335f`
        )
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          text: 'met, consectetur adipiscing elit. Nulla faucibus ipsum no',
          startIndex: 23,
          endIndex: 80,
          body: 'new updated comment'
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error');
          done();
        });
    });

    it('Should return 404 when highlighted text index is invalid', (done) => {
      chai
        .request(app)
        .put(
          `/api/v1/articles/${
            dataGenerator.post1.slug
          }/comments/2f0bab3d-54f0-41bb-b20e-b3456b28345f`
        )
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          text: 'met, consectetur adipiscing elit. Nulla faucibus ipsum no',
          startIndex: 33,
          endIndex: 80,
          body: 'new updated comment'
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error');
          done();
        });
    });

    it('should get all the highlighted texts on the article', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${dataGenerator.post1.slug}/commented-text`)
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
        .get('/api/v1/articles/this-is-my-first-try-of-article69f9fccd88/commented-text')
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('Article not found');
          done();
        });
    });
  });
});
