import chai from 'chai';
import chaiHttp from 'chai-http';
import dataGenerator from './dataGenerator';
import app from '../index';
import utils from './utils';

chai.use(chaiHttp);
chai.should();

let tokenValue = '';
const tokens = {};
const comment = {
  body: 'This article is very educational, waiting for the next one.'
};

describe('Comments', () => {
  // get the token
  before((done) => {
    utils
      .getUser1Token()
      .then((res) => {
        tokenValue = res.body.user.token;
      })
      .catch(() => {
        done();
      });
    utils
      .getUser2Token()
      .then((res) => {
        tokens.user2 = res.body.user.token;
        done();
      })
      .catch(() => {
        done();
      });
  });

  xit('Adds a comment to an article', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${dataGenerator.post1.slug}/comments`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send(comment)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.comment.body.should.be.a('string');
        res.body.comment.id.should.be.a('string');
        done();
      });
  });

  xit('Should fail to comment when article not found', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${dataGenerator.invalidSlug.slug}/comments`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send(comment)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(404);
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        done();
      });
  });

  // Create a comment without logging in
  it('Should fail to add a comment because there user is not authenticated', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${dataGenerator.post1.slug}/comments`)
      .send(comment)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  // update a comment
  it('Updates a comment(body) when the token sent is from the comment author', (done) => {
    // change the comment body
    comment.body = 'This is an updated comment body, and i am the author';
    chai
      .request(app)
      .put(`/api/v1/articles/${dataGenerator.post1.slug}/comments/${dataGenerator.comment1.id}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send(comment)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);
        res.body.editHistory.should.be.an('array');
        done();
      });
  });

  // update a comment
  it('Fails to update a comment(body) when the body is not sent or is null', (done) => {
    chai
      .request(app)
      .put(`/api/v1/articles/${dataGenerator.post1.slug}/comments/${dataGenerator.comment1.id}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(400);
        done();
      });
  });

  it('Fails to update the comment when the token sent is not from the comment author', (done) => {
    chai
      .request(app)
      .put(`/api/v1/articles/${dataGenerator.post1.slug}/comments/${dataGenerator.comment1.id}`)
      .set('Authorization', `Bearer ${tokens.user2}`)
      .send(comment)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(401);
        done();
      });
  });

  it("Fails to update the comment when the commentId sent doesn't exist", (done) => {
    chai
      .request(app)
      .put(
        `/api/v1/articles/${dataGenerator.post1.slug}/comments/ec95c249-e96e-4093-8972-8ba16fe45fa4`
      )
      .set('Authorization', `Bearer ${tokens.user2}`)
      .send(comment)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(404);

        done();
      });
  });

  it("Fails to update the comment when the article slug sent doesn't exist", (done) => {
    chai
      .request(app)
      .put(`/api/v1/articles/this-slug-does-not-exist/comments/${dataGenerator.comment1.id}`)
      .set('Authorization', `Bearer ${tokens.user2}`)
      .send(comment)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(404);
        res.body.should.have.property('error', 'Article not found');
        done();
      });
  });

  it('Gets all comments and their edit history', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${dataGenerator.post1.slug}/comments`)
      .send()
      .end((err, res) => {
        if (err) {
          done(err);
        }
        res.should.have.status(200);
        res.body.comments.should.be.an('array');
        done();
      });
  });

  it('Should return 404 when try to get comment of invalid article', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${dataGenerator.invalidSlug.slug}/comments`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(404);
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        done();
      });
  });

  // delete a comment
  it('deletes a comment when the user sending the request is the comment author', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${dataGenerator.post1.slug}/comments/${dataGenerator.comment1.id}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.be.a('string');
        done();
      });
  });

  it('Fail to delete a comment on invalid article', (done) => {
    chai
      .request(app)
      .delete(
        `/api/v1/articles/${dataGenerator.invalidSlug.slug}/comments/${dataGenerator.comment1.id}`
      )
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(404);
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        done();
      });
  });

  it('fails to delete the comment since he is not the author of the comment', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${dataGenerator.post1.slug}/comments/${dataGenerator.comment2.id}`)
      .set('Authorization', `Bearer ${tokens.user2}`)
      .send()
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });
});
