export default (sequelize, DataTypes) => {
  const CommentEdits = sequelize.define(
    'CommentEdits',
    {
      commentId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      highlightedText: {
        type: DataTypes.STRING
      },
      startIndex: {
        type: DataTypes.INTEGER
      },
      endIndex: {
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  CommentEdits.associate = (models) => {
    CommentEdits.belongsTo(models.Comments, {
      foreignKey: 'id'
    });
  };
  return CommentEdits;
};
