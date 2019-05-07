
export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('articles', 'readTime', Sequelize.STRING),

  down: queryInterface => queryInterface.removeColumn('articles', 'readTime')
};
