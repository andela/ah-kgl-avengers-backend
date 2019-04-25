import models from '../models/index';

const { article, likes } = models;


/**
 * @description Likes and Favorites Controller class
 */
class Likes {
  /**
   * Adds two numbers together.
   * @param {Object} req .
   * @param {Object} res The User Object.
   * @returns {Object}  Response object having message and status for liking artincle
   */
  static async likeArticle(req, res) {
    try {
      const { slug } = req.params;
      const { user } = req;

      const checkArticle = await article.findOne({ where: { slug, status: 'Published' } });
      if (!checkArticle) {
        res.status(404).send({
          status: 404,
          errorMessage: 'The Article you are trying to like is not found'
        });
      }

      const arleadyLiked = await likes.findOne({
        where: { userId: user.id, articleId: checkArticle.id }
      });
      if (arleadyLiked && (arleadyLiked.status === 'disliked' || arleadyLiked.status === null)) {
        await arleadyLiked.update({ status: 'liked' });
        return res.status(200).send({
          status: 200,
          message: ' You have liked this article'
        });
      }

      if (arleadyLiked && arleadyLiked.status === 'liked') {
        await arleadyLiked.update({ status: null });
        return res.status(200).send({
          status: 200,
          message: 'You have successfully remove your like',
        });
      }

      await likes.create({
        userId: user.id,
        articleId: checkArticle.id,
        status: 'liked'
      });
      return res.status(200).send({
        status: 200,
        message: 'You have successfully liked this article'
      });
    } catch (err) {
      return err;
    }
  }

  /**
   * Adds two numbers together.
   * @param {Object} req .
   * @param {Object} res .
   * @returns {Object} returns the response after disliking the article.
   */
  static async dislikeArticle(req, res) {
    const { slug } = req.params;
    const { user } = req;

    const checkArticle = await article.findOne({ where: { slug, status: 'Published' } });
    if (!checkArticle) {
      res.status(404).send({
        status: 404,
        errorMessage: 'The Article you are trying to like is not found'
      });
    }

    const arleadyLiked = await likes.findOne({
      where: { userId: user.id, articleId: checkArticle.id }
    });
    if (arleadyLiked && (arleadyLiked.status === 'liked' || arleadyLiked.status === null)) {
      await arleadyLiked.update({ status: 'disliked' });
      return res.status(200).send({
        status: 200,
        message: ' You have disliked this article'
      });
    }

    if (arleadyLiked && arleadyLiked.status === 'disliked') {
      await arleadyLiked.update({ status: null });
      return res.status(200).send({
        status: 200,
        message: 'You have successfully remove your dislike',
      });
    }

    await likes.create({
      userId: user.id,
      articleId: checkArticle.id,
      status: 'disliked'
    });
    return res.status(200).send({
      status: 200,
      message: 'You have successfully disliked this article'
    });
  }

  /**
   * Adds two numbers together.
   * @param {Object} req .
   * @param {Object} res .
   * @returns {Object} returns the response after favoriting the article.
   */
  static async addFavorite(req, res) {
    try {
      const { slug } = req.params;
      const { user } = req;

      const checkArticle = await article.findOne({ where: { slug, status: 'Published' } });
      if (!checkArticle) {
        res.status(404).send({
          status: 404,
          errorMessage: 'The Article can not be favorited'
        });
      }

      const arleadyFavorited = await likes.findOne({
        where: { userId: user.id, articleId: checkArticle.id }
      });
      if (arleadyFavorited
      && (arleadyFavorited.favorited === false || arleadyFavorited.favorited === null)) {
        await arleadyFavorited.update({ favorited: true });
        return res.status(200).send({
          status: 200,
          message: 'You have favorited this article'
        });
      }

      if (arleadyFavorited && arleadyFavorited.favorited === true) {
        await arleadyFavorited.update({ favorited: null });
        return res.status(200).send({
          status: 200,
          message: 'You have successfully removed your favorite',
        });
      }

      await likes.create({
        userId: user.id,
        articleId: checkArticle.id,
        favorited: true
      });
      return res.status(201).send({
        status: 200,
        message: 'You have successfully favorited this article'
      });
    } catch (err) {
      return err;
    }
  }

  /**
   * Adds two numbers together.
   * @param {Object} req .
   * @param {Object} res .
   * @returns {Object} returns the response after favoriting the article.
   */
  static async getFavorites(req, res) {
    try {
      const { user } = req;
      const findUser = await likes.findOne({ where: { userId: user.id, favorited: true } });
      if (!findUser) {
        return res.status(404).send({
          status: 404,
          errorMessage: 'You have not favorites articles'
        });
      }

      if (findUser) {
        const findArticles = await article.findOne({ where: { id: findUser.articleId } });
        return res.status(200).send({
          status: 200,
          favorites: {
            slug: findArticles.slug,
            title: findArticles.title,
            description: findArticles.description,
            body: findArticles.body
          }
        });
      }
    } catch (err) {
      return err;
    }
  }
}

export default Likes;
