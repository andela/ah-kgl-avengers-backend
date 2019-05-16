import Sequelize from 'sequelize';
import models from '../models';

const { User, article } = models;

const userAttrib = ['username', 'image', 'bio'];
const articleAttrib = ['title', 'description', 'slug', 'tagList'];

const handler = {
  searchByAuthor: async (req, res) => {
    const { title, username } = req.query;

    if (!title && !username) {
      return res.status(400).send({
        status: res.statusCode,
        error: "Please search using the article title or authors' username"
      });
    }

    try {
      /**
       * Any user is able to search for an article if
       * they know it's tittle
       */

      if (title) {
        const articles = await article.findAll({
          where: {
            title: {
              [Sequelize.Op.iLike]: `%${title.trim()}%`
            },
            status: 'published',
            deleted: 0
          },
          include: {
            model: User,
            attributes: userAttrib
          },
          limit: 10,
          attributes: articleAttrib
        });
        return res.status(200).send({
          status: res.statusCode,
          articles
        });
      }

      /**
       * Any user is able to search for an article if
       * they know the authors name
       */

      if (username) {
        const users = await User.findAll({
          where: {
            username: { [Sequelize.Op.iLike]: `%${username.trim()}%` }
          },
          attributes: userAttrib,
          include: [
            {
              model: article,
              attributes: articleAttrib,
              where: {
                status: 'published',
                deleted: 0
              }
            }
          ],
          limit: 10
        });
        return res.status(200).send({
          status: res.statusCode,
          users
        });
      }
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Server failed to handle your request'
      });
    }
  },

  searchByBody: async (req, res) => {
    const { body } = req.query;
    try {
      const articles = await article.findAll({
        where: {
          body: {
            [Sequelize.Op.iLike]: `%${body.trim()}%`
          },
          status: 'published',
          deleted: 0
        },
        attributes: articleAttrib
      });
      return res.status(200).send({
        status: res.statusCode,
        articles
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Failed to handle your request'
      });
    }
  },

  searchByTag: async (req, res) => {
    const { tag } = req.query;
    try {
      const articles = await article.findAll({
        where: {
          status: 'published',
          deleted: 0,
          tagList: {
            [Sequelize.Op.contains]: tag.trim().toLowerCase()
          }
        },
        attributes: articleAttrib
      });
      return res.status(200).send({
        status: res.statusCode,
        articles
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Failed to handle your request'
      });
    }
  },

  searchAll: async (req, res) => {
    const { all: query } = req.query;
    try {
      const users = await User.findAll({
        where: {
          username: {
            [Sequelize.Op.iLike]: `%${query.trim()}%`
          }
        },
        attributes: ['username', 'email', 'bio', 'image'],
        limit: 10
      });
      const articles = await article.findAll({
        where: {
          [Sequelize.Op.or]: [
            { title: { [Sequelize.Op.iLike]: `%${query.trim()}%` } },
            { tagList: { [Sequelize.Op.contains]: query.trim().toLowerCase() } }
          ],
          status: 'published',
          deleted: 0
        },
        attributes: articleAttrib,
        limit: 10
      });
      return res.status(200).send({
        status: res.statusCode,
        users,
        articles
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Failed to handle your request'
      });
    }
  }
};

export default {
  search: (req, res) => {
    if (!Object.keys(req.query).length) {
      return res.status(400).send({
        status: res.statusCode,
        error: 'Please provide your search query'
      });
    }

    const { body, tag, all } = req.query;
    if (body) handler.searchByBody(req, res);
    else if (tag) handler.searchByTag(req, res);
    else if (all) handler.searchAll(req, res);
    else handler.searchByAuthor(req, res);
  }
};
