export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Comments', 'highlightedText', Sequelize.STRING),

  down: queryInterface => queryInterface.removeColumn('Comments', 'highlightedText')
};
