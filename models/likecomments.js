export default (sequelize, DataTypes) => {
  const likeComments = sequelize.define(
    'likeComments',
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
      commentId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {}
  );
  likeComments.associate = (models) => {
    likeComments.belongsTo(models.User, { foreignKey: 'userId' });
    likeComments.belongsTo(models.Comments, { foreignKey: 'commentId' });
  };
  return likeComments;
};
