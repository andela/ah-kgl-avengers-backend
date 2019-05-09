import models from '../models';

const {
  Comments, User, article, Sequelize
} = models;

const { Op } = Sequelize;

/**
 * @description User Controller class
 */
class CommentOnText {
  /**
   * This method creates a comment on a text in an article
   * @param {Object} req .
   * @param {Object} res The comment Object.
   * @returns {Object} created comment data
   */
  static async createTextComment(req, res) {
    const { slug } = req.params;
    const { user } = req;
    const {
      text, startIndex, endIndex, body
    } = req.body;
    try {
      const findArticle = await article.findOne({
        where: { slug, status: 'published' }
      });
      if (!findArticle) {
        return res.status(404).send({
          status: 404,
          errorMessage: 'The Article You are trying to find is not created'
        });
      }
      const findHighlightedText = await findArticle.body.slice(
        startIndex,
        endIndex
      );
      if (findHighlightedText !== text) {
        res.status(404).send({
          status: 404,
          errorMessage: 'The text you highlighted is not found'
        });
      } else {
        const author = await User.findOne({
          where: { id: user.id },
          attributes: ['username', 'image']
        });
        const commentOnText = await Comments.findOrCreate({
          where: {
            body,
            author: user.id,
            post: findArticle.id,
            startIndex,
            endIndex,
            highlitedText: findHighlightedText
          },
          defaults: { body },
          attributes: [
            'id',
            'author',
            'highlitedText',
            'startIndex',
            'endIndex',
            'body',
            'createdAt',
            'updatedAt'
          ]
        });
        return res.status(200).send({
          status: 200,
          commentOnText: commentOnText[0],
          article: findArticle.slug,
          author
        });
      }
    } catch (error) {
      return res.status(500).send({
        status: 500,
        errorMessage: error.message
      });
    }
  }

  /**
   * This method updates the comments on the article.
   * @param {Object} req .
   * @param {Object} res The comment Object.
   * @returns {Object} update comment data
   */
  static async updateComment(req, res) {
    const { user } = req;
    const {
      text, startIndex, endIndex, body
    } = req.body;
    const { commentId } = req.params;

    try {
      // check if the comment to be updated is saved
      const findComment = await Comments.findOne({
        where: { id: commentId },
        attributes: ['id', 'post', 'author']
      });


      if (!findComment) {
        return res.status(404).send({
          status: 404,
          errorMessage: 'The Comment is not found'
        });
      }
      const findArticle = await article.findOne({
        where: { id: findComment.post }
      });
      if (!findArticle) {
        return res.status(404).send({
          status: 404,
          errorMessage: 'The Article is not found'
        });
      }

      // get the new text that is going to be commented on
      const findHighlightedText = await findArticle.body.slice(
        startIndex,
        endIndex
      );

      // if text proveded in body and one gotten using indexes are not matching
      if (findHighlightedText !== text) {
        return res.status(404).send({
          status: 404,
          errorMessage: 'The text you highlighted is not found'
        });
      }

      if (req.user.id !== findComment.author) {
        return res.status(401).send({
          status: 401,
          errorMessage: 'You are not authorized to update this comment'
        });
      }

      // if everything is valid then update the comment
      const updatedComment = await Comments.update(
        {
          highlitedText: text,
          startIndex,
          endIndex,
          body
        },
        {
          where: { id: commentId, author: user.id },
          returning: true
        }
      );
      const returned = updatedComment[1][0].get();
      return res.status(200).send({
        status: 200,
        comment: {
          body: returned.body,
          highlitedText: returned.highlitedText,
          post: findArticle.slug,
          startIndex: returned.startIndex,
          endIndex: returned.endIndex
        }
      });
    } catch (error) {
      return res.status(500).send({
        status: 500,
        errorMessage: error.message
      });
    }
  }

  /**
   * This method gets all the highlighted texts on the article.
   * @param {Object} req .
   * @param {Object} res Object.
   * @returns {Object} Object of highlighted texts on the article
   */
  static async getHighlighted(req, res) {
    const { slug } = req.params;

    // check if the article with slug provided is in db
    const findArticle = await article.findOne({
      where: { slug }
    });
    if (!findArticle) {
      return res.status(404).send({
        status: 404,
        errorMessage: 'The Article is not found'
      });
    }

    // now get all the highlighted texts associated to that article
    const highlighted = await Comments.findAll({
      where: { post: findArticle.id, highlitedText: { [Op.ne]: null } },
      attributes: ['highlitedText'],
      include: [{ model: User, attributes: ['username', 'image'] }]
    });
    if (!highlighted) {
      return res.status(404).send({
        status: 404,
        errorMessage: 'There are no comments for this article'
      });
    }
    return res.status(200).send({
      status: 200,
      highlighted
    });
  }
}

export default CommentOnText;
