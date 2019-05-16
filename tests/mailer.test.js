import sinon from 'sinon';
import nodeMailer from 'nodemailer';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mailer from '../config/verificationMail';

const sandBox = sinon.createSandbox();
chai.should();
chai.use(chaiHttp);

const data = {
  name: 'Jean Bosco',
  email: 'test@mail.com',
  subject: 'Account activation',
  url: `${process.env.SERVER_ADDRESS}/api/sendActivation`
};

describe('Should send email to the user', () => {
  it('Sending verification mail after user registered', async () => {
    const transport = {
      sendMail: params => params
    };
    sandBox.stub(nodeMailer, 'createTransport').returns(transport);
    const res = await mailer.sentActivationMail(data);
    res.should.be.an('Object');
    res.should.have.property('from', process.env.SENDER);
    res.should.have.property('to', data.email);
    res.should.have.property('subject', data.subject);
  });

  it('Sending reset mail after user', async () => {
    const user = { username: 'test', email: 'mock@mail.com' };
    const res = await mailer.sentResetMail(user);
    res.should.have.property('from', process.env.SENDER);
    res.should.have.property('to', user.email);
    res.should.have.property('subject', 'Reset password');
  });
});
