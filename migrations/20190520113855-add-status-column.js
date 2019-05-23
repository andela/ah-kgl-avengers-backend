export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Comments', 'status', {
    type: Sequelize.STRING,
    allowNull: false,
  }),

  down: queryInterface => queryInterface.removeColumn('Comments', 'status')
};
