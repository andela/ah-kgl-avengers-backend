import models from '../models/index';
import mailer from '../config/verificationMail';

const { article, likes } = models;

/**
 * @description Likes and Favorites Controller class
 */
class Likes {
  /**
   * @param {Object} req
   * @param {Object} res The User Object
   * @returns {Object}  Response object having message and status for liking article
   */
  static async likeArticle(req, res) {
    try {
      const { slug } = req.params;
      const { id, username } = req.user;

      const checkArticle = await article.findOne({ where: { slug, status: 'published' } });
      if (!checkArticle) {
        res.status(404).send({
          status: 404,
          error: 'The Article you are trying to like is not found'
        });
      }

      const alreadyLiked = await likes.findOne({
        where: { userId: id, articleId: checkArticle.id }
      });
      if (alreadyLiked && (alreadyLiked.status === 'disliked' || alreadyLiked.status === null)) {
        await alreadyLiked.update({ status: 'liked' });

        // send email notification
        await mailer.sentNotificationMail({
          username,
          subscribeTo: checkArticle.id,
          slug: checkArticle.slug,
          title: 'new like',
          action: 'has liked an article'
        });

        return res.status(200).send({
          status: 200,
          message: 'You have liked this article'
        });
      }

      if (alreadyLiked && alreadyLiked.status === 'liked') {
        await alreadyLiked.update({ status: null });
        return res.status(200).send({
          status: 200,
          message: 'You have successfully removed your like'
        });
      }

      await likes.create({
        userId: id,
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
   * @param {Object} req .
   * @param {Object} res .
   * @returns {Object} returns the response after disliking the article.
   */
  static async dislikeArticle(req, res) {
    const { slug } = req.params;
    const { user } = req;

    const checkArticle = await article.findOne({ where: { slug, status: 'published' } });
    if (!checkArticle) {
      res.status(404).send({
        status: 404,
        error: 'The Article you are trying to like is not found'
      });
    }

    const alreadyLiked = await likes.findOne({
      where: { userId: user.id, articleId: checkArticle.id }
    });
    if (alreadyLiked && (alreadyLiked.status === 'liked' || !alreadyLiked.status)) {
      await alreadyLiked.update({ status: 'disliked' });
      return res.status(200).send({
        status: 200,
        message: ' You have disliked this article'
      });
    }

    if (alreadyLiked && alreadyLiked.status === 'disliked') {
      await alreadyLiked.update({ status: null });
      return res.status(200).send({
        status: 200,
        message: 'You have successfully remove your dislike'
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
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns the response after adding the article  in user favorites
   */
  static async addFavorite(req, res) {
    try {
      const { slug } = req.params;
      const { id, username } = req.user;

      const checkArticle = await article.findOne({ where: { slug, status: 'published' } });
      if (!checkArticle) {
        res.status(404).send({
          status: 404,
          error: 'The Article can not be favorited'
        });
      }

      const alreadyLiked = await likes.findOne({
        where: { userId: id, articleId: checkArticle.id }
      });
      if (alreadyLiked && (alreadyLiked.favorited === false || !alreadyLiked.favorited)) {
        await alreadyLiked.update({ favorited: true });

        // send email notification
        await mailer.sentNotificationMail({
          username,
          subscribeTo: checkArticle.id,
          slug: checkArticle.slug,
          title: 'new favorite',
          action: 'has favorited an article'
        });

        return res.status(200).send({
          status: 200,
          message: 'You have favorited this article'
        });
      }

      if (alreadyLiked && alreadyLiked.favorited === true) {
        await alreadyLiked.update({ favorited: null });
        return res.status(200).send({
          status: 200,
          message: 'You have successfully removed your favorite'
        });
      }

      await likes.create({
        userId: id,
        articleId: checkArticle.id,
        favorited: true
      });

      // send email notification
      await mailer.sentNotificationMail({
        username: req.user.username,
        subscribeTo: checkArticle.id,
        slug: checkArticle.slug,
        title: 'new favorite',
        action: 'has favorited an article'
      });

      return res.status(201).send({
        status: res.statusCode,
        message: 'You have successfully favorited this article'
      });
    } catch (err) {
      return err;
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} res
   */
  static async getFavorites(req, res) {
    try {
      const { user } = req;
      const findUser = await likes.findOne({ where: { userId: user.id, favorited: true } });
      if (!findUser) {
        return res.status(404).send({
          status: 404,
          error: 'You have not favorites articles'
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
      return res.status(500).json({
        status: res.statusCode,
        error: err.message
      });
    }
  }
}

export default Likes;
