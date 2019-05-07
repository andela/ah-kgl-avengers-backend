import Sequelize from 'sequelize';
import models from '../models';

const { User, article } = models;

const searchFilters = {

  searchByAuthor: async (req, res) => {
    const { title, username } = req.body;
    try {
      if (title && username) {
        return res.status(400).send({
          status: res.statusCode,
          error: 'Please search using the article title or authors\' username but not both.'
        });
      }

      /**
      * Any user is able to search for an article if
      * they know it's tittle
      */

      if (title) {
        const searchByTitle = await article.findAll(
          {
            limit: 10,
            attributes: { exclude: ['id', 'author', 'createdAt', 'updatedAt', 'deleted', 'status'] },
            where: {
              title: { [Sequelize.Op.iLike]: `%${title}%` }
            },
            include: {
              model: User,
              attributes: ['username', 'email', 'bio']
            }
          }
        );
        return res.status(201).send({
          status: res.statusCode,
          searchByTitle
        });
      }

      /**
      * Any user is able to search for an article if
      * they know the authors name
      */

      if (username) {
        const findAuthor = await User.findAll(
          {
            attributes: ['username', 'email', 'image'],
            limit: 10,
            where: {
              username: { [Sequelize.Op.iLike]: `%${username}` }
            },
            include: [{
              model: article,
              attributes: ['title', 'description', 'slug'],
            }]
          }
        );
        return res.status(201).send({
          status: res.statusCode,
          findAuthor
        });
      }
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Server failed to handle your request'
      });
    }
  }
};

export default searchFilters;
