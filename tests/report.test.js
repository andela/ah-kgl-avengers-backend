import chai from 'chai';
import chaiHttp from 'chai-http';
import data from './dataGenerator';
import app from '../index';
import utils from './utils';

chai.should();
chai.use(chaiHttp);

let tokenValue = '';

describe('Reporting an article', () => {
  before((done) => {
    utils
      .getAdminToken()
      .then((res) => {
        tokenValue = res.body.user.token;
        done();
      })
      .catch(() => {
        done();
      });
  });

  it('User should be able to report article', (done) => {
    chai.request(app)
      .post(`/api/v1/report/articles/${data.post1.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send({ message: 'Violating terms' })
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(200);
        done();
      });
  });

  it('Should fail to report article twice', (done) => {
    chai.request(app)
      .post(`/api/v1/report/articles/${data.post1.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send({ message: 'Violating terms' })
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(400);
        res.body.should.has.property('error');
        done();
      });
  });

  it('Admin should be able to get all reported articles', (done) => {
    chai.request(app)
      .get('/api/v1/report/articles')
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('Array');
        done();
      });
  });

  it('Admin should take decision (delete) reported article', (done) => {
    chai.request(app)
      .delete(`/api/v1/report/articles/${data.post1.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(200);
        res.body.should.have.property('message');
        done();
      });
  });

  it('Should fail to delete article when not exist', (done) => {
    chai.request(app)
      .delete(`/api/v1/report/articles/${data.post1.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(404);
        res.body.should.have.property('error');
        done();
      });
  });
});
