export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('articles', 'featuredImage', {
    type: Sequelize.STRING,
    allowNull: false
  }),

  down: queryInterface => queryInterface.removeColumn('articles', 'featuredImage')
};
