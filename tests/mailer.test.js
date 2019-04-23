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
  email: 'bosco7209@gmail.com',
  subject: 'Account activation',
  url: 'http://localhost:3000/api/sendActivation'
};

describe('Should send email to the user', () => {
  it('Sending verification mail after user registred', async () => {
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
});
