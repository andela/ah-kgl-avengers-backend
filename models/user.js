import crypto from 'crypto';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      firstName: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        required: true,
        validate: {
          isEmail: true
        }
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      activated: {
        type: DataTypes.INTEGER
      },
      following: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      followers: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      salt: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      hash: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true
      },
      provider: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
        validate: {
          isIn: [['user', 'admin']]
        }
      }
    },
    {
      hooks: {
        // hash the password before creating a user
        beforeCreate(user) {
          if (user.hash) {
            user.salt = crypto.randomBytes(16).toString('hex');
            user.hash = crypto
              .pbkdf2Sync(user.hash, user.salt, 1000, 64, 'sha512')
              .toString('hex');
          }
        }
      }
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Comments, {
      foreignKey: 'author'
    });
    User.hasMany(models.statistic, {
      foreignKey: 'userId'
    });
    User.hasMany(models.article, {
      foreignKey: 'author'
    });
    User.hasMany(models.likes, {
      foreignKey: 'userId'
    });
  };

  return User;
};
