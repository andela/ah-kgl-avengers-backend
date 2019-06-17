import chai from 'chai';
import chaiHttp from 'chai-http';
import data from './dataGenerator';
import app from '../index';
import utils from './utils';

chai.should();
chai.use(chaiHttp);

let tokenValue = '';
let nonAdminToken = '';

describe('Reporting an article', () => {
  before((done) => {
    utils
      .getAdminToken()
      .then((res) => {
        tokenValue = res.body.user.token;
      })
      .catch(() => {
        done();
      });
    utils
      .getUser1Token()
      .then((res) => {
        nonAdminToken = res.body.user.token;
        done();
      })
      .catch(() => {
        done();
      });
  });

  it('User should be able to report article', (done) => {
    chai
      .request(app)
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

  it('Should return 404 when reporting unavailable article', (done) => {
    chai
      .request(app)
      .post(`/api/v1/report/articles/${data.invalidSlug.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .send({ message: 'Violating terms' })
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(404);
        res.body.should.has.property('error');
        done();
      });
  });

  it('Should fail to report article twice', (done) => {
    chai
      .request(app)
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
    chai
      .request(app)
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

  it('Should not get all reported when not admin', (done) => {
    chai
      .request(app)
      .get('/api/v1/report/articles')
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(401);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Admin should take decision (delete) reported article', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${data.post1.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(200);
        res.body.should.have.property('message');
        done();
      });
  });

  it('Should fail to delete article when not the author or article not reported', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${data.post4.slug}`)
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(401);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should fail to delete article when not exist', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${data.post1.slug}`)
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
