export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Comments', 'endIndex', Sequelize.INTEGER),

  down: queryInterface => queryInterface.removeColumn('Comments', 'endIndex')
};
