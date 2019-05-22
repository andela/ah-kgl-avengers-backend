import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import utils from './utils';
import data from './dataGenerator';

chai.should();
chai.use(chaiHttp);

let tokenValue;
let tokenWithNoFavorite;

describe('Like, Dislike and Favorite', () => {
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
      .getUser4Token()
      .then((res) => {
        tokenWithNoFavorite = res.body.user.token;
        done();
      })
      .catch(() => {
        done();
      });
  });

  it('Should remove your like on article you liked', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${data.post2.slug}/like`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.have.property('message').eql('You have successfully removed your like');
        done();
      });
  });

  it('Should return 200 when like article you liked before', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${data.post2.slug}/like`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.have.property('message').eql('You have liked this article');
        done();
      });
  });

  it('Should return 200 when like an article', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${data.post1.slug}/like`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.have.property('message').eql('You have successfully liked this article');
        done();
      });
  });

  it('Should return 404 when liking invalid article', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${data.invalidSlug.slug}/like`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should dislike the article you have liked and return 200', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${data.post6.slug}/dislike`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.have.property('message').eql(' You have disliked this article');
        done();
      });
  });

  it('Should remove dislike on article and return 200', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${data.post6.slug}/dislike`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.have.property('message').eql('You have successfully remove your dislike');
        done();
      });
  });

  it('Should dislike new article and return 200', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${data.postDislike.slug}/dislike`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.have.property('message').eql('You have successfully disliked this article');
        done();
      });
  });

  it('Should return 404 for liking invalid article', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${data.invalidSlug.slug}/dislike`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(404);
        res.body.should.have.property('error');
        done();
      });
  });

  describe('/FAVORITE', () => {
    it('should favorite the article and return 200', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/${data.post4.slug}/favorite`)
        .set('Authorization', `Bearer ${tokenValue}`)
        .send()
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.have.property('message').eql('You have favorited this article');
          done();
        });
    });
  });
  it('should remove the favorite on the article and return 200', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${data.post4.slug}/favorite`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.have.property('message').eql('You have successfully removed your favorite');
        done();
      });
  });

  it('Should return 404 when user favorite draft article', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${data.post3.slug}/favorite`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('should favorite new  article and return 200', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${data.newFavorite.slug}/favorite`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(201);
        res.body.should.have
          .property('message')
          .eql('You have successfully favorited this article');
        done();
      });
  });

  it('Should return 404 when user has no favorite', (done) => {
    chai
      .request(app)
      .get('/api/v1/users/favorite')
      .set('Authorization', `Bearer ${tokenWithNoFavorite}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('should get the articles you favorite and return 200', (done) => {
    chai
      .request(app)
      .get('/api/v1/users/favorite')
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        done();
      });
  });
});
