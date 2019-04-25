import dataGenerator from '../tests/dataGenerator';

const salt = crypto.randomBytes(16).toString('hex');
const password = 'testuser';
const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

export default {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [
    {
      id: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      username: 'tester1',
      salt,
      hash,
      email: 'tester1@test.com',
      activated: '1',
      following: JSON.stringify({ ids: [] }),
      followers: JSON.stringify({ ids: [] }),
    },
    {
      id: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa74',
      username: 'tester2',
      salt,
      hash,
      email: 'tester2@test.com',
      activated: '1',
      following: JSON.stringify({ ids: [] }),
      followers: JSON.stringify({ ids: [] }),
    },
    {
      id: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa75',
      username: 'tester3',
      salt,
      hash,
      email: 'tester3@test.com',
      activated: '1',
      following: JSON.stringify({ ids: [] }),
      followers: JSON.stringify({ ids: [] }),
    },
    {
      id: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa76',
      username: 'tester4',
      salt,
      hash,
      email: 'tester4@test.com',
      activated: '1',
      following: JSON.stringify({ ids: [] }),
      followers: JSON.stringify({ ids: [] }),
    },
    {
      id: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa77',
      username: 'tester5',
      salt,
      hash,
      email: 'tester5@test.com',
      activated: '1',
      following: JSON.stringify({ ids: [] }),
      followers: JSON.stringify({ ids: [] }),
    }, dataGenerator.user1, dataGenerator.user2, dataGenerator.user3
  ],
  {},
  {
    following: { type: new Sequelize.JSON() },
    followers: { type: new Sequelize.JSON() }
  }),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
