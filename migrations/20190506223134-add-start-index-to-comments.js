export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Comments', 'startIndex', Sequelize.INTEGER),

  down: queryInterface => queryInterface.removeColumn('Comments', 'startIndex')
};
