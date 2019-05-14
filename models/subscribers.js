export default (sequelize, DataTypes) => {
  const subscribers = sequelize.define(
    'subscribers',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: true,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      articleId: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: true,
        references: {
          model: 'article',
          key: 'id'
        }
      },
      subscribers: {
        type: DataTypes.JSONB,
        allowNull: false
      }
    },
    {}
  );
  subscribers.associate = (models) => {
    subscribers.belongsTo(models.User, { foreignKey: 'authorId' });
    subscribers.belongsTo(models.article, { foreignKey: 'articleId' });
  };
  return subscribers;
};
