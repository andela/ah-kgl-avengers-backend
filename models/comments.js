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
      }
    },
    {}
  );
  Comments.associate = (models) => {
    Comments.belongsTo(models.User, { foreignKey: 'author' });
    Comments.belongsTo(models.article, { foreignKey: 'post' });
  };
  return Comments;
};
