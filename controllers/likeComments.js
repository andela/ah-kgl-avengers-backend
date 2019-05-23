import models from '../models/index';

const { Comments, likeComments } = models;

/**
 * @description Likes Comments
 */
class LikeComments {
  /**
   * Like the comment after it was created.
   *
   * @param {Object} req .
   * @param {Object} res The User Object.
   * @returns {Object}  Response object having message and status for liking the comment.
   */
  static async likeComment(req, res) {
    try {
      const { commentId } = req.params;
      const { user } = req;

      const findComment = await Comments.findOne({
        where: { id: commentId },
        attributes: ['id']
      });
      if (!findComment) {
        return res.status(404).send({
          status: 404,
          error: 'The Comment is not found'
        });
      }
      const isLiked = await likeComments.findOne({
        where: { userId: user.id, commentId }
      });
      if (isLiked && isLiked.status === 'liked') {
        await isLiked.update({ status: '' });
        return res.status(200).send({
          status: 200,
          message: 'You have successfully removed your like on this comment'
        });
      }

      if (isLiked && isLiked.status === '') {
        await isLiked.update({ status: 'liked' });
        return res.status(200).send({
          status: 200,
          message: 'You have successfully liked this comment'
        });
      }

      await likeComments.create({
        userId: user.id,
        commentId,
        status: 'liked'
      });
      return res.status(201).send({
        status: 201,
        message: 'You have successfully liked this comment'
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        error: 'Something went wrong'
      });
    }
  }
}

export default LikeComments;
