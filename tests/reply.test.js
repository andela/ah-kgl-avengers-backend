import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import utils from './utils';

chai.should();
chai.use(chaiHttp);

let tokenValue = '';
let nonAdminToken = '';
let nonAuthor = '';

describe('Reply Comments', () => {
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

    utils
      .getUser7Token()
      .then((res) => {
        nonAuthor = res.body.user.token;
        done();
      })
      .catch(() => {
      });
  });

  describe('/Reply Comments', () => {
    const replyComment = {
      reply: 'test with aaron',
    };
    it('Should fail to reply as the comment is not in db', (done) => {
      chai
        .request(app)
        .post('/api/v1/comment/18e1bbf9-e707-4925-a992-c59f1fc748ac')
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send(replyComment)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.an('Object');
          res.should.have.status(404);
          done();
        });
    });

    it('Should pass and reply the comment', (done) => {
      chai
        .request(app)
        .post('/api/v1/comment/18e1bbf9-e707-4925-a992-c59f1fc748aa')
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .send(replyComment)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.an('Object');
          res.body.should.has.property('status').eql(200);
          res.body.reply.should.has.property('reply').eql('test with aaron');
          res.body.reply.should.has.property('commentId').eql('18e1bbf9-e707-4925-a992-c59f1fc748aa');
          done();
        });
    });

    it('Should fail to reply comment as you are not authenticated', (done) => {
      chai
        .request(app)
        .post('/api/v1/comment/18e1bbf9-e707-4925-a992-c59f1fc748aa')
        .send(replyComment)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.an('Object');
          res.should.have.status(401);
          done();
        });
    });

    it('Should pass and update the comment reply as you are an author', (done) => {
      chai
        .request(app)
        .put('/api/v1/comment/2f0bab3d-54f0-41bb-b20e-b3456b28346f/update')
        .send({ reply: 'test with aaron and hddhdss' })
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.an('Object');
          res.should.have.status(200);
          done();
        });
    });

    it('Should pass and update the reply as you are an author', (done) => {
      chai
        .request(app)
        .put('/api/v1/comment/2f0bab3d-54f0-41bb-b20e-b3456b28346f/update')
        .send({ reply: 'test with aaron and hddhdss', status: 'show' })
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.an('Object');
          res.should.have.status(200);
          done();
        });
    });

    it('Should fail to update as the comment reply is not found', (done) => {
      chai
        .request(app)
        .put('/api/v1/comment/2f0bab3d-54f0-41bb-b20e-b3456b28349f/update')
        .send({ reply: 'test with aaron and hddhdss' })
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.an('Object');
          res.should.have.status(404);
          done();
        });
    });

    it('Should fail to update as you are not author or admin', (done) => {
      chai
        .request(app)
        .put('/api/v1/comment/2f0bab3d-54f0-41bb-b20e-b3456b28346f/update')
        .send({ reply: 'test with aaron and hddhdss' })
        .set('Authorization', `Bearer ${nonAuthor}`)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.an('Object');
          res.should.have.status(401);
          done();
        });
    });

    it('Should fail to delete if you are not an author or an admin', (done) => {
      chai
        .request(app)
        .delete('/api/v1/comment/2f0bab3d-54f0-41bb-b20e-b3456b28346f/delete')
        .set('Authorization', `Bearer ${nonAuthor}`)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.an('Object');
          res.should.have.status(401);
          done();
        });
    });
    it('Should pass and delete the reply as you are an author', (done) => {
      chai
        .request(app)
        .delete('/api/v1/comment/2f0bab3d-54f0-41bb-b20e-b3456b28346f/delete')
        .set('Authorization', `Bearer ${nonAdminToken}`)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.an('Object');
          res.should.have.status(200);
          done();
        });
    });

    it('Should pass and delete the reply as you are an admin', (done) => {
      chai
        .request(app)
        .delete('/api/v1/comment/2f0bab3d-54f0-41bb-b20e-b3456b28342f/delete')
        .set('Authorization', `Bearer ${tokenValue}`)
        .end((err, res) => {
          if (err) done(err);
          res.body.should.be.an('Object');
          res.should.have.status(200);
          done();
        });
    });
  });
});
