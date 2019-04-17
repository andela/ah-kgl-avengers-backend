import models from '../models/index';

const { article } = models;
const tempUser = '2dd9e22b-d19d-4501-a6b5-00bb4ebd9b3e'; // This line has to be deleted.
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

      const slug = title.toLowerCase().split(' ').join('-');
      const description = body.substring(0, 30);
      const flag = status === undefined ? 'Draft' : 'Published';
      const tags = req.is('application/json') ? tagList : JSON.parse(tagList);

      const queryArticle = await article.create({
        title, body, author, slug, description, status: flag, tagList: tags
      });
      return res.status(201).send({
        status: res.statusCode,
        data: queryArticle
      });
    } catch (err) {
      return res.send(err);
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
    // const { author } = req.user;
    const response = await article.findAll({ where: { author: tempUser, status: 'Published', deleted: 0 } });
    return res.status(200).send({
      status: res.statusCode,
      articles: response,
    });
  },

  /*
  * Retieving all the published articles based to the author
  * and the status of the article (Draft).
  */
  getAllDraft: async (req, res) => {
    // const { author } = req.user;
    const response = await article.findAll({ where: { author: tempUser, status: 'Draft', deleted: 0 } });
    return res.status(200).send({
      status: res.statusCode,
      articles: response,
    });
  },

  /*
   * Construct user's feed
   * and the status of the article (Published).
   */
  getFeeds: async (req, res) => {
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
  }
};

export default articles;
