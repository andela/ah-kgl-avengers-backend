import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import ENV from 'dotenv';

import models from '../models';

const { subscribers, User } = models;
const { Op } = models.Sequelize;

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
        pass: process.env.TRANSPORT_PASS
      }
    });

    const source = fs.readFileSync(path.join(__dirname, '../template/activation.hjs'), 'utf8');
    const template = Handlebars.compile(source);
    const { id, name, email } = params;
    const tokenToSend = await jwt.sign({ id, email }, process.env.SECRET);
    const url = `${process.env.SERVER_ADDRESS}/api/v1/activation/${tokenToSend}`;
    const envelope = {
      from: process.env.SENDER,
      to: email,
      subject: 'Account activation',
      html: template({ name, url })
    };
    try {
      return await client.sendMail(envelope);
    } catch (error) {
      return {
        status: 500,
        message: 'Failed to send the email'
      };
    }
  },

  async sentResetMail(params) {
    const client = nodemailer.createTransport({
      service: process.env.TRANSPORT_SERVICE,
      auth: {
        user: process.env.TRANSPORT_USER,
        pass: process.env.TRANSPORT_PASS
      }
    });

    const source = fs.readFileSync(path.join(__dirname, '../template/reset.hjs'), 'utf8');
    const template = Handlebars.compile(source);
    const { username, email } = params;
    const tokenToSend = await jwt.sign({ email }, process.env.SECRET);
    const url = `${process.env.SERVER_ADDRESS}/api/v1/update_password/${tokenToSend}`;
    const envelope = {
      from: process.env.SENDER,
      to: email,
      subject: 'Reset password',
      html: template({ username, url })
    };
    try {
      return await client.sendMail(envelope);
    } catch (error) {
      return {
        status: 500,
        message: 'Failed to send the email'
      };
    }
  },

  async sentNotificationMail(params) {
    const client = nodemailer.createTransport({
      service: process.env.TRANSPORT_SERVICE,
      auth: {
        user: process.env.TRANSPORT_USER,
        pass: process.env.TRANSPORT_PASS
      }
    });

    const source = fs.readFileSync(path.join(__dirname, '../template/notification.hjs'), 'utf8');
    const template = Handlebars.compile(source);
    const {
      subscribeTo, username, slug, action
    } = params;
    const url = `${process.env.SERVER_ADDRESS}/api/v1/activation/${slug}`;

    const getSubscriber = await subscribers.findOne({
      where: {
        [Op.or]: [{ articleId: subscribeTo }, { authorId: subscribeTo }]
      },
      attributes: { subscribers }
    });

    try {
      getSubscriber.subscribers.forEach(async (subId) => {
        const subs = await User.findOne({
          where: { id: subId }
        });

        const receiver = subs.username;

        const envelope = {
          from: process.env.SENDER,
          to: subs.email,
          subject: 'new article',
          html: template({
            username, receiver, url, action
          })
        };
        client.sendMail(envelope);
      });
    } catch (error) {
      return {
        status: 500,
        message: 'Failed to send the email'
      };
    }
  }
};

export default config;
