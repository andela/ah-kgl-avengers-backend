import chai from 'chai';
import chaiHttp from 'chai-http';
import mailer from '../config/verificationMail';

chai.should();
chai.use(chaiHttp);

const sendemail = () => {
  const data = {
    name: 'Jean Bosco',
    body: `You’re almost ready to start enjoying Author’s Heaven. 
            Simply click the button below to verify your email address.`,
    email: 'bosco7209@gmail.com',
    subject: 'Account activation',
    url: 'http://localhost:3000/api/sendActivation'
  };
  return mailer.sentActivationMail(data);
};

describe('Should send email to the user', function () {
  this.timeout(10000);

  it('Send activation email', async () => {
    await sendemail()
      .then((res) => {
        res.should.be.an('object');
        res.should.have.property('messageId');
        res.should.have.property('response');
        res.should.have.property('envelope');
      })
      .catch((err) => {
        throw err;
      });
  });
});
