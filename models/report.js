export default (sequelize, DataTypes) => {
  const report = sequelize.define(
    'Report',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      reporter: {
        type: DataTypes.UUID,
        allowNull: false
      },
      articleId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  report.associate = (models) => {
    report.belongsTo(models.User, {
      foreignKey: 'reporter',
      targetKey: 'id'
    });
    report.belongsTo(models.article, {
      foreignKey: 'articleId',
      targetKey: 'id'
    });
  };
  return report;
};
