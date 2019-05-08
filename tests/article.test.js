import chai from 'chai';
import dotenv from 'dotenv';
import chaiHttp from 'chai-http';
import app from '../index';
import utils from './utils';
import dataGenerator from './dataGenerator';

dotenv.config();
chai.should();
chai.use(chaiHttp);

let tokenValue;

describe('Article ', () => {
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

  it('should return an object with status 201 when a user creates an article', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .set('Authorization', `Bearer ${tokenValue}`)
      .send({
        title: 'One to Many and One to One',
        body:
          'One to Many and One to One relationships are pretty straightforward to create on Sequelize.'
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        if (err) done(err);
        res.should.have.status(201);
        res.body.article.should.be.an('object');
        done();
      });
  });

  it('Author should be able to update his/her article', (done) => {
    chai
      .request(app)
      .put(`/api/v1/article/${dataGenerator.post1.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send({
        title: 'I am being updated',
        body: 'See they have update me'
      })
      .end((err, res) => {
        if (err) done(err);
        res.should.be.an('Object');
        done();
      });
  });

  it('should return an article', (done) => {
    chai
      .request(app)
      .get(`/api/v1/article/${dataGenerator.post2.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.should.be.an('Object');
        done();
      });
  });

  it('Author should be able to view the feeds', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles/feeds')
      // .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(res);
        res.should.have.status(200);
        res.should.be.an('Object');
        res.body.should.have.property('articles');
        res.body.articles.should.be.an('Array');
        done();
      });
  });
  context('Rate article', () => {
    it('Authenticated user should be able to rate an article', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${dataGenerator.post4.slug}/ratings`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({ rating: 4 })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(201);
          res.should.be.an('Object');
          done();
        });
    });

    it('Should return the articles ratings', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${dataGenerator.post4.slug}/ratings?limit=5&offset=0`)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          res.should.have.status(200);
          res.body.ratings.should.be.an('array');
          done();
        });
    });
  });

  it('Author should be able get his/her published articles', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles')
      .set('Authorization', `Bearer ${tokenValue}`)
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
    chai
      .request(app)
      .get('/api/v1/articles')
      .set('Authorization', `Bearer ${tokenValue}`)
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
    chai
      .request(app)
      .get('/api/v1/articles/draft')
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.should.be.an('Object');
        res.body.should.have.property('articles');
        res.body.articles.should.be.an('Array');
        done();
      });
  });

  it('should return an object with status 404 when a user tries to update that does not exist', (done) => {
    chai
      .request(app)
      .put('/api/v1/articles/working-now-with-aaron-dbc007065')
      .set('Authorization', `Bearer ${tokenValue}`)
      .send({
        title: '5 Things About Sequelize',
        body:
          'One to Many and One to One relationships are pretty straightforward to create on Sequelize.'
      })
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(404);
        res.body.should.be.an('Object');
        res.body.errorMessage.should.eql('Article not found');
        done();
      });
  });

  context('Bookmark article', () => {
    it('Bookmark an article', (done) => {
      chai
        .request(app)
        .post(`/api/v1/bookmarks/${dataGenerator.post1.slug}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          if (err) done(err);
          res.body.status.should.eql(200);
          res.should.be.an('Object');
          done();
        });
    });

    it('User should be able to view bookmarked article', (done) => {
      chai
        .request(app)
        .get(`/api/v1/bookmarks/${dataGenerator.post1.slug}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          if (err) done(err);
          res.should.be.an('Object');
          done();
        });
    });

    it('User should be able to delete a bookmarked article', (done) => {
      chai
        .request(app)
        .get(`/api/v1/bookmarks/${dataGenerator.post1.slug}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          if (err) done(err);
          res.should.be.an('Object');
          done();
        });
    });
  });

  it('Author should be able to delete an article', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${dataGenerator.post1.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.should.be.an('Object');
        res.body.should.have.property('message');
        done();
      });
  });
  it('should return 3 published articles ', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles?limit=3')
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.status.should.eql(200);
        res.body.articlesCount.should.eql(3);
        res.body.should.be.an('Object');
        done();
      });
  });
  it('should return 2 published articles ', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles?limit=3&offset=1')
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.status.should.eql(200);
        res.body.articlesCount.should.eql(3);
        res.body.should.be.an('Object');
        done();
      });
  });

  it('should share articles ', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${dataGenerator.post1.slug}/facebook-share`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.status.should.eql(200);
        res.body.should.be.an('Object');
        done();
      });
  });

  it('should share articles ', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${dataGenerator.post1.slug}/twitter-share`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.status.should.eql(200);
        res.body.should.be.an('Object');
        done();
      });
  });

  it('should share articles ', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${dataGenerator.post1.slug}/email-share`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.status.should.eql(200);
        res.body.should.be.an('Object');
        done();
      });
  });
});
