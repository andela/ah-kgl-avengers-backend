import chai from 'chai';
import dotenv from 'dotenv';
import chaiHttp from 'chai-http';
import app from '../index';
import utils from './utils';

dotenv.config();
chai.should();
chai.use(chaiHttp);

let articleSlug;
let tokens;

describe('ARTICLE', () => {
  before((done) => {
    utils
      .getUserToken()
      .then((res) => {
        tokens = res.body.user.token;
        done();
      })
      .catch(() => {
        done();
      });
  });
  describe('Author should handle article ', () => {
    it('should return an object with status 201 when a user creates an article', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${tokens}`)
        .send({
          title: 'Testing Title',
          body: 'Booooooooooooo body',
        })
        .end((err, res) => {
          if (err) done(err);
          articleSlug = res.body.article.slug;
          res.body.status.should.eql(201);
          res.body.should.be.an('Object');
          done();
        });
    });

    it('Author should be able to update his/her article', (done) => {
      chai.request(app)
        .put(`/api/v1/article/${articleSlug}`)
        .set('Authorization', `Bearer ${tokens}`)
        .send({
          title: 'I am being updated',
          body: 'See they have update me',
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.be.an('Object');
          done();
        });
    });
    it('Author should be able to view an article', (done) => {
      chai.request(app)
        .get(`/api/v1/article/${articleSlug}`)
        .set('Authorization', `Bearer ${tokens}`)
        .end((err, res) => {
          if (err) done(err);
          res.should.be.an('Object');
          done();
        });
    });

    it('Author should be able to view the feeds', (done) => {
      chai.request(app)
        .get('/api/v1/article/feeds')
        .set('Authorization', `Bearer ${tokens}`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.an('Object');
          res.body.should.have.property('articles');
          res.body.articles.should.be.an('Array');
          done();
        });
    });
    it('Author should be able get his/her published articles', (done) => {
      chai.request(app)
        .get('/api/v1/articles')
        .set('Authorization', `Bearer ${tokens}`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.an('Object');
          res.body.should.have.property('articles');
          res.body.articles.should.be.an('Array');
          done();
        });
    });
    it('Author should be able get his/her drafted articles', (done) => {
      chai.request(app)
        .get('/api/v1/articles/draft')
        .set('Authorization', `Bearer ${tokens}`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.an('Object');
          res.body.should.have.property('articles');
          res.body.articles.should.be.an('Array');
          done();
        });
    });

    it('should return an object with status 404 when a user tries to update that doesnot exist', (done) => {
      chai
        .request(app)
        .put('/api/v1/articles/working-now-with-aaradbc007065')
        .set('Authorization', `Bearer ${tokens}`)
        .send({
          title: 'This is how we update this',
          body: 'I am being updated',
        })
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.an('Object');
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('errorMessage').eql('Article not found, please create a new article instead');
          done();
        });
    });

    it('Author should be able to delete an article', (done) => {
      chai.request(app)
        .delete(`/api/v1/articles/${articleSlug}`)
        .set('Authorization', `Bearer ${tokens}`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.an('Object');
          res.body.should.have.property('message');
          done();
        });
    });
  });
});
