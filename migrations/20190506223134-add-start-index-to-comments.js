export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Comments', 'startIndex', Sequelize.INTEGER),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Comments', 'startIndex')
};