import crypto from 'crypto';

const salt = crypto.randomBytes(16).toString('hex');
const password = 'testuser';
const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

export default {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [
    {
      username: 'tester1',
      salt,
      hash,
      email: 'tester1@test.com',
      activated: '1',
      following: JSON.stringify({ ids: [] }),
      followers: JSON.stringify({ ids: [] }),
    },
    {
      username: 'tester2',
      salt,
      hash,
      email: 'tester2@test.com',
      activated: '1',
      following: JSON.stringify({ ids: [] }),
      followers: JSON.stringify({ ids: [] }),
    },
    {
      username: 'tester3',
      salt,
      hash,
      email: 'tester3@test.com',
      activated: '1',
      following: JSON.stringify({ ids: [] }),
      followers: JSON.stringify({ ids: [] }),
    },
    {
      username: 'tester4',
      salt,
      hash,
      email: 'tester4@test.com',
      activated: '1',
      following: JSON.stringify({ ids: [] }),
      followers: JSON.stringify({ ids: [] }),
    },
    {
      username: 'tester5',
      salt,
      hash,
      email: 'tester5@test.com',
      activated: '1',
      following: JSON.stringify({ ids: [] }),
      followers: JSON.stringify({ ids: [] }),
    },
  ],
  {},
  {
    following: { type: new Sequelize.JSON() },
    followers: { type: new Sequelize.JSON() }
  }),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {}),
};
