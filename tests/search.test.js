import chai from 'chai';
import chaiHttp from 'chai-http';
import data from './dataGenerator';
import app from '../index';

chai.should();
chai.use(chaiHttp);

describe('Search for an article', () => {
  it('User should be able to search for an article using authors name', (done) => {
    chai.request(app)
      .get(`/api/v1/search/articles?username=${data.searchByAuthor.username}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(200);
        done();
      });
  });

  it('User should be able to search by tag', (done) => {
    chai.request(app)
      .get(`/api/v1/search/articles?tag=${data.post2.tagList[0]}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(200);
        res.body.should.have.property('articles');
        res.body.articles.should.be.an('Array');
        done();
      });
  });

  it('User should be able to search for an article using article title', (done) => {
    chai.request(app)
      .get(`/api/v1/search/articles?title=${data.searchByTitle.title}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(200);
        done();
      });
  });

  it('User should be able to search by article content', (done) => {
    chai.request(app)
      .get(`/api/v1/search/articles?body=${data.post2.body}`)
      .send({ body: data.post2.body })
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(200);
        res.body.should.have.property('articles');
        res.body.articles.should.be.an('Array');
        done();
      });
  });

  it('Should return status 400 when no data provided', (done) => {
    chai.request(app)
      .get('/api/v1/search/articles')
      .end((err, res) => {
        if (err) done(err);
        res.body.should.has.property('status').eql(400);
        done();
      });
  });

  it('Should return status 400 when provided wrong argument', (done) => {
    chai.request(app)
      .get('/api/v1/search/articles?anything=data')
      .end((err, res) => {
        if (err) done(err);
        res.body.should.has.property('status').eql(400);
        done();
      });
  });

  it('User should be able to search by article by any keyword', (done) => {
    chai.request(app)
      .get('/api/v1/search/articles?all=favorite')
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(200);
        res.body.should.have.property('articles');
        res.body.articles.should.be.an('Array');
        res.body.should.have.property('users');
        res.body.users.should.be.an('Array');
        done();
      });
  });
});
