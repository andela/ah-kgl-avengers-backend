import chai from 'chai';
import chaiHttp from 'chai-http';
import dataGenerator from './dataGenerator';
import app from '../index';
import utils from './utils';

chai.use(chaiHttp);
chai.should();

let token = '';

describe('Comments', () => {
  // get the token
  before((done) => {
    utils
      .getUserToken()
      .then((res) => {
        token = res.body.user.token;
        done();
      })
      .catch(() => {
        done();
      });
  });
  // create comment
  it('Should add a comment and return 201', (done) => {
    const comment = {
      body: 'This article is very educational, waiting for the next one.'
    };
    chai
      .request(app)
      .post(`/api/v1/articles/${dataGenerator.post1.slug}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send(comment)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.comment.body.should.be.a('string');
        res.body.comment.author.should.be.an('object');
        done();
      });
  });

  // Create a comment without logging in
  it('Should add a comment and return 201', (done) => {
    const comment = {
      body: 'This article is very educational, waiting for the next one.'
    };
    chai
      .request(app)
      .post(`/api/v1/articles/${dataGenerator.post1.slug}/comments`)
      .send(comment)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  // get all comments
  it('Get all comments added on the article', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${dataGenerator.post1.slug}/comments`)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.commentsCount.should.be.a('number');
        res.body.comments.should.be.an('array');
        done();
      });
  });

  // delete a comment
  it('deletes a comment', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${dataGenerator.post1.slug}/comments/${dataGenerator.comment1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.be.a('string');

        done();
      });
  });
});
