import dataGenerator from '../tests/dataGenerator';

export default {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Users',
    [dataGenerator.user1, dataGenerator.user2, dataGenerator.user3],
    {},
    {
      following: { type: new Sequelize.JSON() },
      followers: { type: new Sequelize.JSON() }
    }
  ),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
