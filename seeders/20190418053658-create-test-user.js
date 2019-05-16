import dataGenerator from '../tests/dataGenerator';

export default {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Users',
    [
      dataGenerator.user1,
      dataGenerator.user2,
      dataGenerator.user3,
      dataGenerator.user4,
      dataGenerator.user5,
      dataGenerator.user6,
      dataGenerator.user7
    ],
    {},
    {
      following: { type: new Sequelize.JSON() },
      followers: { type: new Sequelize.JSON() }
    }
  ),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
