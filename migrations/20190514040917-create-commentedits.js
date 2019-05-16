import triggers from '../helpers/dbTriggers';

export default {
  up: (queryInterface, Sequelize) => queryInterface
    .createTable('CommentEdits', {
      commentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Comments',
          key: 'id'
        },
        primaryKey: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      highlightedText: {
        type: Sequelize.STRING
      },
      startIndex: {
        type: Sequelize.INTEGER
      },
      endIndex: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        primaryKey: true
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    })
    .then(() => queryInterface.sequelize.query(triggers.afterCommentUpdate)),
  down: queryInterface => queryInterface.dropTable('CommentEdits')
};
