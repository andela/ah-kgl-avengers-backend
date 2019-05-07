import chai from 'chai';
import chaiHttp from 'chai-http';
import data from './dataGenerator';
import app from '../index';

chai.should();
chai.use(chaiHttp);


describe('Search for an article', () => {
  it('User should be able to search for an article using authors name', (done) => {
    chai.request(app)
      .get('/api/v1/search/articles')
      .send(data.searchByAuthor)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(201);
        done();
      });
  });

  it('User should be able to search for an article using article title', (done) => {
    chai.request(app)
      .get('/api/v1/search/articles')
      .send(data.searchByTitle)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(201);
        done();
      });
  });

  it('Should return status 400 when a user searches with both title and authors name', (done) => {
    chai.request(app)
      .get('/api/v1/search/articles')
      .send(data.searchByAuthorAndTitle)
      .end((err, res) => {
        if (err) done(err);
        console.log(err);
        res.body.should.has.property('status').eql(400);
        done();
      });
  });

  it('Should return status 500 when user searches unknown author', (done) => {
    chai.request(app)
      .get('/api/v1/search/articles')
      .send(data.searchByWrongAuthor)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.has.property('status').eql(500);
        done();
      });
  });
});
