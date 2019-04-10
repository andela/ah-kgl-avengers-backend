const nodemailer = require('nodemailer');
const ENV = require('dotenv');

ENV.config();

async function sentActivationMail(params) {

  var client = nodemailer.createTransport({
    service: process.env.TRANSPORT_SERVICE,
    auth: {
      user: process.env.TRANSPORT_USER,
      pass: process.env.TRANSPORT_PASS,
    }
  });

  const {
    username,
    email,
    file
  } = params;

  const envelope = {
    from: '"Kigali Avengers" <info@kgl-avengers.com>',
    to: email,
    subject: 'Account activation ',
    html: file,
  };
  try {
    const info = await client.sendMail(envelope);
    console.log(info);
  } catch (error) {
    return error;
  }
}
