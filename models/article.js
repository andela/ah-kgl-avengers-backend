export default (sequelize, DataTypes) => {
  const article = sequelize.define(
    'article',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      author: {
        type: DataTypes.UUID,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false
      },
      categories: {
        type: DataTypes.JSON,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'draft'
      },
      deleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      tagList: {
        type: DataTypes.JSON,
        allowNull: true
      },
      featuredImage: {
        type: DataTypes.STRING,
        allowNull: false
      },
      readTime: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {}
  );
  article.associate = (models) => {
    // define associations
    article.belongsTo(models.User, {
      foreignKey: 'author',
      targetKey: 'id'
    });
    article.hasMany(models.Comments, {
      foreignKey: 'post'
    });
    article.hasMany(models.statistic, {
      foreignKey: 'articleId'
    });
    article.hasMany(models.ratings, {
      foreignKey: 'post'
    });
    article.hasMany(models.likes, {
      foreignKey: 'articleId'
    });
  };
  return article;
};
