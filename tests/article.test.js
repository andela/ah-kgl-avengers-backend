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
const tokens = {
  user2: ''
};

describe('Article ', () => {
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

  it('should return an object with status 201 when a user creates an article', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .set('Authorization', `Bearer ${tokenValue}`)
      .set('content-type', 'application/json')
      .send({
        title: 'One to Many and One to One',
        body:
          'One to Many and One to One relationships are pretty straightforward to create on Sequelize.',
        status: 'published',
        tagList: ['Lorem'],
        featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg'
      })
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(201);
        res.body.article.should.be.an('object');
        done();
      });
  });

  it('Should create 1 min read article', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .set('Authorization', `Bearer ${tokenValue}`)
      .set('content-type', 'application/json')
      .send(dataGenerator.post7)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(201);
        res.body.article.should.be.an('object');
        done();
      });
  });

  it('Should create article of more than 2 min read', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .set('Authorization', `Bearer ${tokenValue}`)
      .set('content-type', 'application/json')
      .send(dataGenerator.post8)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(201);
        res.body.article.should.be.an('object');
        done();
      });
  });

  it('Should return 400 status when try to create article with no parameters', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .set('Authorization', `Bearer ${tokenValue}`)
      .set('content-type', 'application/json')
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('errors');
        done();
      });
  });

  it('Should send a request with status [draft|published] and x-www-form-urlencoded content-type ', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .set('Authorization', `Bearer ${tokenValue}`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(dataGenerator.testPostWithStatus)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(201);
        res.body.should.be.an('Object');
        res.body.should.have.property('article');
        done();
      });
  });

  it('Author should be able to update his/her article', (done) => {
    chai
      .request(app)
      .put(`/api/v1/articles/${dataGenerator.postUpdate.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send({
        title: 'I am being updated',
        body: 'See they have update me',
        featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg'
      })
      .end((err, res) => {
        if (err) done(err);
        res.should.be.an('Object');
        res.should.have.status(200);
        done();
      });
  });

  it('Should return 404 when article to be updated not found', (done) => {
    chai
      .request(app)
      .put(`/api/v1/articles/${dataGenerator.invalidSlug.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send({
        title: 'I am being updated',
        body: 'See they have update me',
        featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg'
      })
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(404);
        res.body.should.has.property('status').eql(404);
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

  it('User should be able to get authors all articles', (done) => {
    chai
      .request(app)
      .get(`/api/v1/user/${dataGenerator.user1.username}/articles`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        done();
      });
  });

  it('Should return a drafted article because the token is from the author', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/draft/${dataGenerator.post3.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('article');
        done();
      });
  });

  it('Should fail to get a drafted article because the token is not from the author', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/draft/${dataGenerator.post3.slug}`)
      .set('Authorization', `Bearer ${tokens.user2}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.have.property('status').eql(404);
        done();
      });
  });

  it('Should return 404 when articles author not found', (done) => {
    chai
      .request(app)
      .get(`/api/v1/user/${dataGenerator.invalidUsername.username}/articles`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('message');
        done();
      });
  });

  it('Author should be able to view the feeds', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles/feeds')
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
    it('Should get 404 for rating invalid article', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${dataGenerator.invalidSlug.slug}/ratings`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          rating: 4
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(404);
          res.body.should.be.an('Object');
          res.body.should.have.property('error');
          done();
        });
    });

    it('Should get 400 for rating drafted article', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${dataGenerator.post3.slug}/ratings`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          rating: 4
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.be.an('Object');
          res.body.should.have.property('message');
          done();
        });
    });

    it('Should get 400 for rate your article', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${dataGenerator.post2.slug}/ratings`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          rating: 4
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.be.an('Object');
          res.body.should.have.property('error');
          done();
        });
    });

    it('Authenticated user should be able to rate an article', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${dataGenerator.post4.slug}/ratings`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          rating: 4
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(201);
          res.should.be.an('Object');
          done();
        });
    });

    it('Should return 400 when rate article twice', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${dataGenerator.post4.slug}/ratings`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .send({
          rating: 4
        })
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.should.has.property('status').eql(400);
          res.should.has.property('error');
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

    it('Should return 400 when article to get its rating not found', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${dataGenerator.invalidSlug.slug}/ratings?limit=5&offset=0`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.be.an('Object');
          res.body.should.have.property('error');
          done();
        });
    });

    it('Should return 400 when article to get its rating is draft', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${dataGenerator.post3.slug}/ratings?limit=5&offset=0`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.be.an('Object');
          res.body.should.have.property('error');
          done();
        });
    });

    it('Should return 400 when article has no rating', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${dataGenerator.post2.slug}/ratings?limit=5&offset=0`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(400);
          res.body.should.be.an('Object');
          res.body.should.have.property('error');
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
          'One to Many and One to One relationships are pretty straightforward to create on Sequelize.',
        featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg'
      })
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(404);
        res.body.should.be.an('Object');
        res.body.error.should.eql('Article not found');
        done();
      });
  });

  context('Bookmark article', () => {
    it('Return 400 when user has no bookmarked articles', (done) => {
      chai
        .request(app)
        .get('/api/v1/bookmarks')
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          if (err) done(err);
          res.should.be.an('Object');
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('error');
          done();
        });
    });

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

    it('Should not bookmark article twice', (done) => {
      chai
        .request(app)
        .post(`/api/v1/bookmarks/${dataGenerator.post1.slug}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          if (err) done(err);
          res.body.status.should.eql(400);
          res.body.should.be.an('Object');
          res.body.should.have.property('error');
          done();
        });
    });

    it('Should return 404 when article to bookmark not found', (done) => {
      chai
        .request(app)
        .post(`/api/v1/bookmarks/${dataGenerator.invalidSlug.slug}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.an('Object');
          res.body.status.should.eql(404);
          res.body.should.have.property('error');
          done();
        });
    });

    it('User should be able to get all bookmarked article', (done) => {
      chai
        .request(app)
        .get('/api/v1/bookmarks')
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          if (err) done(err);
          res.should.be.an('Object');
          done();
        });
    });

    it('deletes a bookmark', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/bookmarks/${dataGenerator.post1.slug}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message');
          done();
        });
    });

    it("Fails since the bookmark doesn't exist", (done) => {
      chai
        .request(app)
        .delete(`/api/v1/bookmarks/${dataGenerator.post2.slug}`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          done();
        });
    });
  });

  it('Author should be able to delete an article', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${dataGenerator.articleToBeDeleted.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.should.be.an('Object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('Should get 404 for deleting invalid article', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${dataGenerator.invalidSlug.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(404);
        res.body.should.be.an('Object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('User should be able to view an article', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${dataGenerator.post4.slug}`)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.be.an('Object');
        res.body.should.have.property('article');
        done();
      });
  });

  it('Should get 404 when viewing invalid article', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${dataGenerator.invalidSlug.slug}`)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(404);
        res.body.should.be.an('Object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should return 3 published articles', (done) => {
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
  it('should return 2 published articles', (done) => {
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

  it('Should return 404 when sharing invalid article  ', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${dataGenerator.invalidSlug.slug}/facebook-share`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.status.should.eql(404);
        res.body.should.have.property('error');
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

  it('should share articles and return 200 status', (done) => {
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

  it('should share articles', (done) => {
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

  it('Should return 401 status when provide invalid token', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .set('Authorization', 'Bearer invalidToken')
      .set('content-type', 'application/json')
      .send({
        title: 'One to Many and One to One',
        body: 'One to Many and One to One '
      })
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(401);
        res.body.should.have.property('error');
        done();
      });
  });

  it('should get article tags', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles/tags')
      .end((err, res) => {
        if (err) done(err);
        res.body.status.should.eql(200);
        res.body.should.be.an('Object');
        done();
      });
  });

  it('should get article tags', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles/tags/test')
      .end((err, res) => {
        if (err) done(err);
        res.body.status.should.eql(200);
        res.body.should.be.an('Object');
        done();
      });
  });
});
