import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.should();
chai.use(chaiHttp);

describe('Author should handle article ', () => {
  it('Author should be able to create an article', (done) => {
    chai.request(app)
      .get('/api/v1/article/feeds')
      .end((err, res) => {
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
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.an('Object');
        res.body.should.have.property('articles');
        res.body.articles.should.be.an('Array');
        done();
      });
  });

  it('Author should be able get his/her drafted articles', (done) => {
    chai.request(app)
      .get('/api/v1/articles')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.an('Object');
        res.body.should.have.property('articles');
        res.body.articles.should.be.an('Array');
        done();
      });
  });

  it('Author should be able to delete an article', (done) => {
    const slug = 'this-is-my-first-try-of-article';

    chai.request(app)
      .put(`/api/v1/articles/${slug}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.an('Object');
        res.body.should.have.property('message');
        done();
      });
  });
});
