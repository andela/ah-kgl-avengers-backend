export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Comments', 'highlitedText', Sequelize.STRING),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Comments', 'highlitedText')
};
