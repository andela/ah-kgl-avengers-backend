import crypto from 'crypto';
import models from '../models/index';

const { article, User } = models;
const attributes = ['title', 'body', 'description', 'slug', 'createdAt', 'updatedAt', 'ratings', 'categories', 'tagList'];

/**
 * This function handle the rating  array and return the average rating of
 * a certain rated article.
 *
 * @param {*} data The article that.
 * @returns {*} Average rating value.
 *
 */
const getAverageRating = (data) => {
  const { ratings } = data;
  const average = ratings === null ? 0
    : ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return Number(average.toFixed(2));
};


const articles = {

  /*
   * Deleting a post based to its slug.
   *
   * For directly publishing an article, status flag has to be passed
   * into the request body object otherwise the article will be in drafted.
   */
  createArticle: async (req, res) => {
    try {
      const {
        title, body, status, tagList,
      } = req.body;
      const { id: author } = req.user;
      const flag = status === undefined ? 'Draft' : status;
      const tags = req.is('application/json') ? tagList : JSON.parse(tagList);

      const slug = `${title.toLowerCase().split(' ').join('-').substring(0, 40)}${crypto.randomBytes(5).toString('hex')}`;
      const description = body.substring(0, 100);

      const queryArticle = await article.create({
        title, body, author, slug, description, status: flag, tagList: tags,
      });
      return res.status(201).send({
        status: res.statusCode,
        article: {
          title: queryArticle.title,
          description: queryArticle.description,
          body: queryArticle.body,
          slug: queryArticle.slug,
          tags: [queryArticle.tagList]
        }
      });
    } catch (err) {
      if (err.message) {
        res.status(500).send({
          error: 'Your are not an author yet, please activate your account.',
        });
      }
    }
  },

  /*
   * updating a post based to its slug.
   *
   * For updating an article, status flag has to be passed
   * into the request body object otherwise the article will be in drafted.
   */
  updateArticle: async (req, res) => {
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
      updateThisArticle.ratings = getAverageRating(updateThisArticle);
      return res.status(200).send({
        status: res.statusCode,
        article: {
          title: updateThisArticle.title,
          body: updateThisArticle.body,
          slug: updateThisArticle.slug,
          ratings: updateThisArticle.ratings,
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
  getAllPublishedArticles: async (req, res) => {
    const { limit, offset } = req.query;
    try {
      const { id } = req.user;
      const authorInfo = await User.findOne({ where: { id }, attributes: ['username', 'bio', 'image', 'following'] });
      const response = await article.findAll({
        where: {
          author: id,
          status: 'Published',
          deleted: 0
        },
        attributes: ['title', 'body', 'description', 'slug', 'createdAt', 'updatedAt', 'categories', 'tagList'],
        limit,
        offset
      });

      response.forEach((element) => {
        element.ratings = getAverageRating(element);
        element.author = authorInfo;
      });
      return res.status(200).send({
        status: res.statusCode,
        articles: response,
        articlesCount: response.length,
      });
    } catch (error) {
      throw error;
    }
  },

  /*
   * Retieving all the published articles based to the author
   * and the status of the article (Draft).
   */
  getAllDraftArticles: async (req, res) => {
    const { limit, offset } = req.query;
    try {
      const { id } = req.user;
      const authorInfo = await User.findOne({ where: { id }, attributes: ['username', 'bio', 'image', 'following'] });
      const response = await article.findAll({
        where: {
          author: id,
          status: 'Draft',
          deleted: 0
        },
        attributes,
        limit,
        offset
      });

      response.forEach((element) => {
        element.ratings = getAverageRating(element);
        element.author = authorInfo;
      });
      return res.status(200).send({
        status: res.statusCode,
        articles: response,
        articlesCount: response.length,
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
    const { limit, offset } = req.query;
    try {
      const allArticles = await article.findAll({
        where: { status: 'Published', deleted: 0 },
        attributes,
        limit,
        offset
      });

      // eslint-disable-next-line no-restricted-syntax
      for (const iterator of allArticles) {
        const auth = User.findOne({
          where: { id: iterator.author },
          attributes: ['username', 'bio', 'image', 'following'],
        });
        iterator.author = auth;
        iterator.ratings = getAverageRating(iterator);
      }

      return res.status(200).send({
        status: res.statusCode,
        articles: allArticles,
        articlesCount: allArticles.length,
      });
    } catch (error) {
      throw error;
    }
  },

  /*
   * Viewing an article based to its slug.
   *
   * To view an article, status flag has to be passed
   * into params otherwise the article will be in drafted.
   */
  viewArticle: async (req, res) => {
    const { slug } = req.params;
    try {
      const oneArticle = await article.findOne({ where: { slug } });
      if (!oneArticle) {
        return res.status(404).send({
          status: res.statusCode,
          errorMessage: 'No article found, please create an article first'
        });
      }

      const articlesAuthor = await User.findOne({ where: { id: oneArticle.author }, attributes: ['username', 'image'] });
      oneArticle.author = articlesAuthor;
      oneArticle.ratings = getAverageRating(oneArticle);
      return res.status(200).send({
        status: res.statusCode,
        article: {
          title: oneArticle.title,
          body: oneArticle.body,
          description: oneArticle.description,
          slug: oneArticle.slug,
          tagList: oneArticle.tagList,
          ratings: oneArticle.ratings,
          author: articlesAuthor
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

  /*
   * User should be able to rate an article.
   *
   * Only authenticated user will have access on this functionality
   * of rating an article.
   */
  rateArticle: async (req, res) => {
    const { slug } = req.params;
    const { rating } = req.body;
    try {
      const result = await article.findOne({ where: { slug } });
      if (!result) {
        return res.status(404).send({
          status: res.statusCode,
          errorMessage: 'Article not found',
        });
      }
      const ratings = result.ratings == null ? [Number(rating)]
        : result.ratings.concat(Number(rating));

      const updated = await article.update({ ratings }, {
        where: { slug },
        returning: true,
      });

      const data = updated[1][0].get();
      data.ratings = getAverageRating(data);

      delete data.id;
      delete data.deleted;
      return res.status(200).send({
        status: res.statusCode,
        data,
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Server failed to handle your request',
      });
    }
  },
};

export default articles;
