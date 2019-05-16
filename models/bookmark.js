export default (sequelize, DataTypes) => {
  const bookmark = sequelize.define(
    'bookmark',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      articleId: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {}
  );
  bookmark.associate = (models) => {
    bookmark.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    bookmark.belongsTo(models.article, {
      foreignKey: 'articleId'
    });
  };
  return bookmark;
};
