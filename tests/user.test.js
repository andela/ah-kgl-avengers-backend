import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import models from '../models';

const { User } = models;

const { should } = chai;

chai.use(chaiHttp);

const googleToken = 'ya29.GlvoBssozS3e4mgyckGahaQKaUqdZ1UUKkfIdRfTc8Eoc9dZM8BX3b2NjPKht2ak8DPdiNBNGJ6tnXEykoqrVdXjYsdD24L8s2xfLfO0nqIs4VTKVSRYhf1viCJb';
const facebookToken = 'EAAEzaHJ8KTABAO406UiOaJUDIiTEynWbw1slue8tyxTEEqWnaY0U6HJVCKbKtvE5SX0DNFb2ZASUzbJR80wwdbYzeFlD9aKZBlwljykOtwtIepAp1ZBP7uGZByZBRo2XZBSCy20Yafj7AYTuaY3s3L1F3iR43hylZCuMZAZAq0HR4W9FaGWrT3eZCSclwm9uirMUVfqaVCc7jvmtFN0viMk9ZAiDUHSPbSDE82saloGv6c0OgZDZD';
// testing facebook strategy
describe('Social login routes', () => {
  before(() => {
    User.destroy({
      where: {},
      truncate: true
    });
  });

  it('should return an object with status 200', (done) => {
    chai.request(app)
      . post('/api/v1/oauth/google')
      .send({ access_token: googleToken })
      .end((err, res) => {
        res.body.should.be.a('object');
        done();
      });
  });

  it('should return an object with status 200', (done) => {
    chai.request(app)
      . post('/api/v1/oauth/facebook')
      .send({ access_token: facebookToken })
      .end((err, res) => {
        res.body.should.be.a('object');
        done();
      });
  });
});
