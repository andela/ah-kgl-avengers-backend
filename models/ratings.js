module.exports = (sequelize, DataTypes) => {
  const Ratings = sequelize.define(
    'ratings',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true
      },
      user: {
        type: DataTypes.UUID,
        allowNull: false
      },
      post: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {}
  );
  Ratings.associate = (models) => {
    Ratings.belongsTo(models.User, {
      foreignKey: 'user',
      targetKey: 'id'
    });
    Ratings.belongsTo(models.article, {
      foreignKey: 'post',
      targetKey: 'id'
    });
  };
  return Ratings;
};
