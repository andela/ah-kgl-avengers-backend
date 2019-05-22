export default (sequelize, DataTypes) => {
  const Comments = sequelize.define(
    'Comments',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      body: {
        type: DataTypes.TEXT,
        notNull: true
      },
      author: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      post: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'articles',
          key: 'id'
        }
      },
      highlightedText: {
        type: DataTypes.STRING
      },
      startIndex: {
        type: DataTypes.INTEGER
      },
      endIndex: {
        type: DataTypes.INTEGER
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'show',
        validate: {
          isIn: [['hide', 'show']]
        }
      }
    },
    {}
  );
  Comments.associate = (models) => {
    Comments.belongsTo(models.User, { foreignKey: 'author' });
    Comments.belongsTo(models.article, { foreignKey: 'post' });
    Comments.hasMany(models.CommentEdits, { foreignKey: 'commentId' });
    Comments.hasMany(models.likeComments, { foreignKey: 'commentId' });
  };
  return Comments;
};
