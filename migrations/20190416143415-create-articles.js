export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('articles', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    author: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false
    },
    categories: {
      type: Sequelize.JSON,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    },
    deleted: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    tagList: {
      type: Sequelize.JSON,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now')
    }
  }),
  down: queryInterface => queryInterface.dropTable('articles')
};
