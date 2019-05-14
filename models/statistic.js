
export default (sequelize, DataTypes) => {
  const statistic = sequelize.define('statistic', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    articleId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    totalTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {});
  statistic.associate = (models) => {
    // associations can be defined here
    statistic.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    statistic.belongsTo(models.article, {
      foreignKey: 'articleId'
    });
  };
  return statistic;
};
