export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING
    },
    activated: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    following: {
      type: Sequelize.JSON
    },
    followers: {
      type: Sequelize.JSON
    },
    salt: {
      type: Sequelize.STRING(1024)
    },
    hash: {
      type: Sequelize.STRING(1024)
    },
    bio: {
      type: Sequelize.STRING
    },
    provider: {
      type: Sequelize.TEXT,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users')
};
