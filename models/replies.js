export default (sequelize, DataTypes) => {
  const replies = sequelize.define(
    'replies',
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
      reply: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'show',
        validate: {
          isIn: [['hide', 'show']]
        }
      },
    },
    {}
  );
  replies.associate = (models) => {
    replies.belongsTo(models.User, { foreignKey: 'userId' });
    replies.belongsTo(models.Comments, { foreignKey: 'commentId' });
  };
  return replies;
};
