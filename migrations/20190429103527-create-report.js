export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Reports', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    reporter: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    articleId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'articles',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Reports')
};
