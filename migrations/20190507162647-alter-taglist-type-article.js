export default {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('articles', 'tagList', Sequelize.JSONB),

  down: queryInterface => queryInterface.removeColumn('articles', 'tagList')
};
