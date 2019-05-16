export default (sequelize, DataTypes) => {
  const likes = sequelize.define(
    'likes',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      articleId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      favorited: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {}
  );
  likes.associate = (models) => {
    likes.belongsTo(models.User, { foreignKey: 'userId' });
    likes.belongsTo(models.article, { foreignKey: 'articleId' });
  };
  return likes;
};
