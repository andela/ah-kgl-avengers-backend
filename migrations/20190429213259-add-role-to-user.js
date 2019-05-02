export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'role', {
    type: Sequelize.INTEGER,
    allowNull: false,
  }),

  down: queryInterface => queryInterface.removeColumn('Users', 'role')
};
