import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import ENV from 'dotenv';

ENV.config();

const config = {
  /**
   * Function to send the activation mail to the user.
   * below params are all required to successfully send the email
   *
   * @param { name, id, email } params
   */

  async sentActivationMail(params) {
    const client = nodemailer.createTransport({
      service: process.env.TRANSPORT_SERVICE,
      auth: {
        user: process.env.TRANSPORT_USER,
        pass: process.env.TRANSPORT_PASS,
      }
    });

    const source = fs.readFileSync(path.join(__dirname, '../template/activation.hjs'), 'utf8');
    const template = Handlebars.compile(source);

    const {
      name, id, email,
    } = params;

    const url = `http://localhost:3000/api/v1/activation/${id}`;
    const envelope = {
      from: process.env.SENDER,
      to: email,
      subject: 'Account activation',
      html: template({ name, url }),
    };
    try {
      return await client.sendMail(envelope);
    } catch (error) {
      return {
        status: 500,
        message: 'Failed to send the email',
      };
    }
  },
};

export default config;
