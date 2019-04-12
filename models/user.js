import crypto from 'crypto';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      required: true,
      validate: {
        isEmail: true,
      }
    },
    salt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hash: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    hooks: {
      // hash the password before creating a user
      beforeCreate(user) {
        if (user.hash) {
          user.salt = crypto.randomBytes(16).toString('hex');
          user.hash = crypto.pbkdf2Sync(user.hash, user.salt, 1000, 64, 'sha512').toString('hex'); 
        }
      }
    }
  });

  User.associate = function (models) {
    // associations can be defined here
  };

  return User;
};
