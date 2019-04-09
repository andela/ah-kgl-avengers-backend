const nodemailer = require('nodemailer');
const ENV = require('dotenv');

ENV.config();

async function sentActivationMail(userObject) {

  var client = nodemailer.createTransport({
    service: process.env.TRANSPORT_SERVICE,
    auth: {
      user: process.env.TRANSPORT_USER,
      pass: process.env.TRANSPORT_PASS,
    }
  });

  const { username, email } = userObject;

  const envelope = {
    from: '"Kigali Avengers" <info@kgl-avengers.com>',
    to: email,
    subject: 'This feature is dope',
    text: `${username} Let's try this and see what it can brings to this group`,
    html: `<strong> ${username} Let's try this and see what it can brings to this group</strong>`,
  };
  try {
    const info = await client.sendMail(envelope);
  } catch (error) {
    return error;
  }
}
