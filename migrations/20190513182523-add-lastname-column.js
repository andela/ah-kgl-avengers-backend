export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'lastName', {
    type: Sequelize.STRING,
    allowNull: true
  }),

  down: queryInterface => queryInterface.removeColumn('Users', 'lastName')
};
