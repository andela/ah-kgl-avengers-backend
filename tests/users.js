import chai from 'chai';
import chaitHttp from 'chai-http';
import app from '../index';
import base from './base.test';

chai.should();

chai.use(chaitHttp);

const token = base.getToken();

describe('User tests', () => {
  context('User logout', () => {
    it('should work because no authorization is implemented on routes', (done) => {
      chai.request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', token)
        .send({ token })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });
});
