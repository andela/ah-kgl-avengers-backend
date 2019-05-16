import chai from 'chai';
import chaiHttp from 'chai-http';
import data from './dataGenerator';
import app from '../index';
import utils from './utils';

chai.should();
chai.use(chaiHttp);

let tokenValue = '';

describe('unsubscribe to email notification', () => {
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

  it('User should not be able to unsubscribe as he is not subscribed', (done) => {
    chai
      .request(app)
      .get(`/api/v1/unsubscribe/${data.post3.slug}`)
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(400);
        done();
      });
  });

  it('Should not be able to unsubscribe to non existing article or author', (done) => {
    chai
      .request(app)
      .get('/api/v1/unsubscribe/fridolin')
      .set('Authorization', `Bearer ${tokenValue}`)
      .end((err, res) => {
        if (err) done(err);
        res.body.should.be.an('Object');
        res.body.should.has.property('status').eql(404);
        done();
      });
  });
});
