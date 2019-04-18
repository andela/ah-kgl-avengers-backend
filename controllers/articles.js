import crypto from 'crypto';
import models from '../models/index';

const tempUser = '2dd9e22b-d19d-4501-a6b5-00bb4ebd9b3e'; // This line has to be deleted.
const { article, User } = models;

const articles = {

  /*
   * Deleting a post based to its slug.
   *
   * For directly publishing an article, status flag has to be passed
   * into the request body object otherwise the article will be in drafted.
   */
  createAnArticle: async (req, res) => {
    try {
      const {
        title, body, author, status, tagList,
      } = req.body;
      const flag = status === undefined ? 'Draft' : 'Published';
      const tags = req.is('application/json') ? tagList : JSON.parse(tagList);

      const slug = `${title.toLowerCase().split(' ').join('-').substring(0, 40)}${crypto.randomBytes(5).toString('hex')}`;
      const description = body.substring(0, 100);

      const queryArticle = await article.create({
        title, body, author, slug, description, status: flag, tagList: tags,
      });
      return res.status(201).send({
        status: res.statusCode,
        article: {
          id: queryArticle.id,
          title: queryArticle.title,
          description: queryArticle.description,
          body: queryArticle.body,
          slug: queryArticle.slug,
          tags: [queryArticle.taglines]
        }
      });
    } catch (err) {
      throw err;
    }
  },

  // update an Article
  updateAnArticle: async (req, res) => {
    try {
      const oldSlug = req.params.slug;
      const { title, body, tagList } = req.body;
      const slug = `${title.toLowerCase().split(' ').join('-').substring(0, 20)}${crypto.randomBytes(5).toString('hex')}`;
      const description = body.substring(0, 100);

      await article.update(
        {
          title, body, slug, description, tagList
        },
        {
          where: { slug: oldSlug }
        }
      );
      const updateThisArticle = await article.findOne({ where: { slug } });
      if (!updateThisArticle) {
        return res.status(404).send({
          status: res.statusCode,
          errorMessage: 'Article not found, please create a new article instead',
        });
      }
      return res.status(200).send({
        status: res.statusCode,
        article: {
          title: updateThisArticle.title,
          body: updateThisArticle.body,
          slug: updateThisArticle.slug,
          tagList: updateThisArticle.tagList,
        }
      });
    } catch (err) {
      if (err.message) {
        res.status(500).send({
          status: res.statusCode,
          errorMessage: 'No article to update, please create an article first',
        });
      }
    }
  },

  /*
   * Deleting a post based to its slug.
   *
   * For avoiding permanent deletion of the content from the database
   * we set the flag to the article that it is deletes.
   */
  deleteArticle: async (req, res) => {
    const { slug } = req.params;
    const row = await article.update({ deleted: 1 }, { where: { slug, deleted: 0 } });
    if (row[0] === 0) {
      return res.status(404).send({
        status: res.statusCode,
        message: 'No article found for this slug',
      });
    }
    return res.status(200).send({
      status: res.statusCode,
      message: 'Article deleted successfully',
    });
  },

  /*
  * Retieving all the published articles based to the author
  * and the status of the article (Published).
  */
  getAllPublished: async (req, res) => {
    try {
      // const { author } = req.user;
      const response = await article.findAll({ where: { author: tempUser, status: 'Published', deleted: 0 } });
      return res.status(200).send({
        status: res.statusCode,
        articles: response,
      });
    } catch (error) {
      throw error;
    }
  },

  /*
  * Retieving all the published articles based to the author
  * and the status of the article (Draft).
  */
  getAllDraft: async (req, res) => {
    // const { author } = req.user;
    try {
      const response = await article.findAll({ where: { author: tempUser, status: 'Draft', deleted: 0 } });
      return res.status(200).send({
        status: res.statusCode,
        articles: response,
      });
    } catch (error) {
      throw error;
    }
  },

  /*
   * Construct user's feed
   * and the status of the article (Published).
   */
  getFeeds: async (req, res) => {
    try {
      const response = await article.findAll({
        where: {
          status: 'Published',
          deleted: 0
        }
      });
      return res.status(200).send({
        status: res.statusCode,
        articles: response,
      });
    } catch (error) {
      throw error;
    }
  },

  viewAnArticle: async (req, res) => {
    const { slug } = req.params;
    try {
      const findAuthor = await User.findOne();
      const viewOneArticle = await article.findOne({ where: { slug } });
      if (!viewOneArticle && !findAuthor) {
        return res.status(404).send({
          status: res.statusCode,
          errorMessage: 'No article found, please create an article first'
        });
      }
      return res.status(200).send({
        status: res.statusCode,
        article: {
          title: viewOneArticle.title,
          body: viewOneArticle.body,
          description: viewOneArticle.description,
          slug: viewOneArticle.slug,
          tagList: viewOneArticle.tagList,
          author: {
            username: findAuthor.username,
            bio: findAuthor.bio,
            image: findAuthor.image,
            following: findAuthor.following
          }
        }
      });
    } catch (error) {
      if (error.message) {
        return res.status(500).send({
          status: res.statusCode,
          errorMessage: error.message,
        });
      }
    }
  },
};

export default articles;
