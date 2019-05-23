import models from '../models/index';

const { Comments, replies, User } = models;

/**
 * @description Reply to the Comments
 */
class ReplyComments {
  /**
   * Reply to the existing comment
   *
   * @param {Object} req .
   * @param {Object} res The Comment Object.
   * @returns {Object}  Response object having data of reply comment.
   */
  static async createReply(req, res) {
    try {
      const { commentId } = req.params;
      const { reply } = req.body;
      const { user } = req;

      const findComment = await Comments.findOne({
        where: { id: commentId },
        attributes: ['id']
      });
      if (!findComment) {
        return res.status(404).send({
          status: res.statusCode,
          error: 'The Comment is not found'
        });
      }
      // get the username of comment author
      const author = await User.findOne({
        where: { id: user.id },
        attributes: ['username', 'image']
      });
      const replyComment = await replies.create({
        userId: user.id,
        commentId,
        reply
      });
      return res.status(200).send({
        status: res.statusCode,
        reply: {
          id: replyComment.id,
          commentId: replyComment.commentId,
          reply: replyComment.reply,
          updatedAt: replyComment.updatedAt
        },
        author
      });
    } catch (err) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Something went wrong'
      });
    }
  }

  /**
   * This method updates the comments on the article.
   * @param {Object} req .
   * @param {Object} res The comment Object.
   * @returns {Object} update comment data
   */
  static async editReply(req, res) {
    const { user } = req;
    const { reply } = req.body;
    const { replyId } = req.params;
    const isAdmin = !!(user && user.role === 'admin');

    try {
      // check if the comment to be updated is available
      const findReply = await replies.findOne({
        where: { id: replyId },
        attributes: ['id', 'reply', 'userId', 'commentId']
      });

      if (!findReply) {
        return res.status(404).send({
          status: res.statusCode,
          error: 'The Reply on comment is not found'
        });
      }

      if (req.user.id !== findReply.userId && req.user.role !== 'admin') {
        return res.status(401).send({
          status: res.statusCode,
          error: 'You are not authorized to update this reply comment'
        });
      }

      const isAuthor = user.id !== findReply.userId;

      // if everything is valid then update the reply comment
      const updatedReply = await replies.update(
        {
          reply: isAuthor ? findReply.reply : reply,
          status: isAdmin ? req.body.status : 'show'
        },
        {
          where: { id: replyId },
          returning: true
        }
      );

      const repUpdated = updatedReply[1][0].get();
      return res.status(200).send({
        status: res.statusCode,
        comment: {
          id: repUpdated.id,
          commentId: repUpdated.commentId,
          reply: repUpdated.reply,
          updatedAt: repUpdated.updatedAt
        }
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Something went wrong'
      });
    }
  }

  /**
   * This method updates the comments on the article.
   * @param {Object} req .
   * @param {Object} res The comment Object.
   * @returns {Object} update comment data
   */
  static async deleteCommentReply(req, res) {
    const { user } = req;
    const { replyId } = req.params;
    try {
      // check if comment reply is in db
      const findReply = await replies.findOne({
        where: { id: replyId },
        attributes: ['id', 'reply', 'userId', 'commentId']
      });
      if (!findReply) {
        return res.status(404).send({
          status: res.statusCode,
          error: 'The reply is not found'
        });
      }
      if (user.id !== findReply.userId && user.role !== 'admin') {
        return res.status(401).send({
          status: res.statusCode,
          error: 'You are not authorized to delete this reply comment'
        });
      }
      await replies.destroy({ where: { id: findReply.id } });
      return res.status(200).send({
        status: res.statusCode,
        message: 'Reply deleted successfully'
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Something went wrong'
      });
    }
  }
}

export default ReplyComments;
