
export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('articles', 'readTime', Sequelize.STRING),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('articles', 'readTime')
};
