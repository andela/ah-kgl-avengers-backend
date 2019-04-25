export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('articles', 'ratings', Sequelize.JSONB),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('articles', 'ratings')
};
