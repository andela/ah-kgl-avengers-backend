export default (sequelize, DataTypes) => {
  const tags = sequelize.define(
    'tags',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
    },
    {}
  );
  return tags;
};
