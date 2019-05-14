import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import utils from './utils';

chai.should();
chai.use(chaiHttp);

let tokenValue = '';

describe('Create statistics', () => {
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

  it('System should be able to record the total time spent while reading an article', (done) => {
    chai.request(app)
      .post('/api/v1/stats/articles?timeSpentReading=360&slug=this-is-my-first-favorite-article69f9fccd65')
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(201);
        res.body.should.have.property('readTime');
        done();
      });
  });

  it('Should return 409 when time is below 20 seconds', (done) => {
    chai.request(app)
      .post('/api/v1/stats/articles?timeSpentReading=6&slug=this-is-my-first-favorite-article69f9fccd65')
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(400);
        res.body.should.have.property('message').eql('The read time captured is below the minimum value');
        done();
      });
  });

  it('System should be able update new read time of a user', (done) => {
    chai.request(app)
      .post('/api/v1/stats/articles?timeSpentReading=390&slug=this-is-my-first-favorite-article69f9fccd65')
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(200);
        res.body.should.have.property('newReadTime');
        done();
      });
  });

  it('System should return 500 when user selects wrong article', (done) => {
    chai.request(app)
      .post('/api/v1/stats/articles?timeSpentReading=360&slug=this-is-my-first-favorite-article69f9fccd75')
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(500);
        res.body.should.has.property('error').eql('Server failed to handle your request');
        done();
      });
  });

  it('User should be able to see time spend reading a single article', (done) => {
    chai.request(app)
      .get('/api/v1/stats?slug=this-is-my-first-favorite-article69f9fccd65')
      .set('Authorization', `Bearer ${tokenValue}`)
      .send()
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(200);
        res.body.articleRead.should.have.property('totalTime');
        done();
      });
  });

  it('user should be able see the average time spent while reading articles', (done) => {
    chai.request(app)
      .get('/api/v1/stats/articles')
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(200);
        res.body.should.have.property('totalTime');
        done();
      });
  });

  it('Should return 500 if it\'s server error', (done) => {
    chai.request(app)
      .get('/api/v1/stats?slug=this-is-my-first-favorite-article69f9f7cd66')
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(500);
        done();
      });
  });
});
