export default {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('Users', 'following', { type: Sequelize.JSONB }).then(() => queryInterface.changeColumn('Users', 'followers', { type: Sequelize.JSONB })),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn('Users', 'following', { type: Sequelize.JSON }).then(() => queryInterface.changeColumn('Users', 'followers', { type: Sequelize.JSON }))
};
