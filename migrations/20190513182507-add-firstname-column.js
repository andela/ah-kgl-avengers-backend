export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'firstName', {
    type: Sequelize.STRING,
    allowNull: true,
  }),

  down: queryInterface => queryInterface.removeColumn('Users', 'firstName')
};
