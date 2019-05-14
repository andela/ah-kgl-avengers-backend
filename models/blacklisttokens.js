export default (sequelize, DataTypes) => {
  const BlacklistTokens = sequelize.define(
    'BlacklistTokens',
    {
      token: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.DATE
      }
    },
    {}
  );
  BlacklistTokens.associate = () => {};
  return BlacklistTokens;
};
