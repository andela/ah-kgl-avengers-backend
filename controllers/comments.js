import models from '../models';
import subscribe from '../helpers/subscribe';
import mailer from '../config/verificationMail';

const {
  Comments, User, article, likeComments, CommentEdits, replies
} = models;

const { Op } = models.Sequelize;
export default {
  /**
   *  Only authenticated users can add comments on articles
   *  @param {object} req
   *  @param {object} res
   *  @return {object} res
   * */
  create: async (req, res) => {
    const {
      text = null, startIndex = null, endIndex = null, body
    } = req.body;
    const { slug } = req.params;
    const { id: authorID } = req.user;

    try {
      // check if the article exists
      const post = await article.findOne({
        where: { slug },
        attributes: ['id', 'body'],
        include: [
          {
            model: User,
            attributes: ['username', 'image']
          }
        ]
      });

      if (!post) {
        return res.status(404).json({
          status: res.statusCode,
          error: "The post doesn't exist"
        });
      }

      let highlightedText = null;
      if (text !== null) {
        highlightedText = await post.body.slice(startIndex, endIndex);
      }
      if (highlightedText !== text) {
        return res.status(404).send({
          status: 404,
          error: 'Highlighted text not found'
        });
      }

      // save the comment
      let comment = await Comments.findOrCreate({
        where: {
          body,
          highlightedText: text,
          startIndex,
          endIndex,
          author: authorID,
          post: post.id
        },
        defaults: { body }
      });

      // send email notification
      await mailer.sentNotificationMail({
        username: req.user.username,
        subscribeTo: post.id,
        slug: post.slug,
        title: 'New comment',
        action: 'has left a comment on an article'
      });

      // register user as a subscriber to the commented article
      subscribe(req.user.id, post.id);

      comment = Object.assign(comment[0], {});
      return res.status(201).json({
        status: res.statusCode,
        comment: {
          id: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          body: comment.body,
          highlightedText: comment.highlightedText
        }
      });
    } catch (e) {
      return res.status(500).json({
        status: res.statusCode,
        error: 'Something happened on the server'
      });
    }
  },

  /**
   *  Get article comments, use pagination for performance  and order them from oldest to newest
   *  @param {object} req
   *  @param {object} res
   *  @return {object} res
   * */
  get: async (req, res) => {
    const { slug } = req.params;
    let formatedComments = [];

    try {
      // check if the article exists
      const post = await article.findOne({
        where: { slug },
        attributes: ['id']
      });
      if (!post) {
        return res.status(404).json({
          status: res.statusCode,
          error: 'The post does not exist'
        });
      }

      // if the post exists return all comments associated to it
      const comments = await Comments.findAll({
        where: { post: post.id },
        attributes: { exclude: ['post', 'UserId'] },
        limit: 15,
        order: [['createdAt', 'ASC']],
        include: [
          {
            model: User,
            attributes: ['username', 'image']
          },
          {
            model: likeComments,
            where: {
              status: 'liked'
            },
            attributes: ['id'],
            required: false
          }
        ]
      });
      // format the comments into the required format
      formatedComments = await Promise.all(
        comments.map(async (comment) => {
          const editHistory = await CommentEdits.findAll({
            where: { commentId: comment.id },
            attributes: ['body', 'createdAt'],
            order: [['createdAt', 'ASC']]
          });
          const commentReplies = await replies.findAll({
            where: { commentId: comment.id, status: 'show' },
            attributes: ['reply', 'createdAt'],
            order: [['createdAt', 'ASC']]
          });
          return {
            id: comment.id,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            body: comment.body,
            highlightedText: comment.hightedText,
            author: comment.User,
            likes: comment.likeComments.length,
            editHistory,
            commentReplies
          };
        })
      );

      return res.status(200).json({
        status: res.statusCode,
        comments: formatedComments,
        commentsCount: formatedComments.length
      });
    } catch (e) {
      return res.status(500).json({
        status: res.statusCode,
        error: 'Something happened on the server'
      });
    }
  },

  /**
   * An author of a comment is allowed to update a comment
   * When a comment is updated we keep the  old comment edits
   * so that a user can be able to see edit history
   * @param {object} req
   * @param {object} res
   * @return {object} res
   *
   */
  update: async (req, res) => {
    const {
      text = null, startIndex = null, endIndex = null, body, status
    } = req.body;
    const { slug, commentId } = req.params;
    const { id, role } = req.user;

    if (!body || body.trim() === '') {
      return res.status(400).json({
        status: res.statusCode,
        error: 'Comment body is required'
      });
    }

    try {
      const CommentedArticle = await article.findOne({
        where: { slug },
        attributes: ['id', 'body'],
        include: {
          model: User,
          attributes: ['username', 'id']
        }
      });

      if (!CommentedArticle) {
        return res.status(404).json({
          status: res.statusCode,
          error: 'Article not found'
        });
      }

      let highlightedText = null;

      if (text !== null && startIndex && endIndex) {
        // get the new text that is going to be commented on
        highlightedText = await CommentedArticle.body.slice(startIndex, endIndex);
      }
      // if text provided in body and one specified by indices are not matching
      if (highlightedText !== text) {
        return res.status(404).send({
          status: 404,
          error: 'Highlighted text is not found'
        });
      }

      const findComment = await Comments.findOne({ where: { id: commentId } });
      if (!findComment) {
        return res.status(404).send({
          status: res.statusCode,
          error: 'The comment is not found'
        });
      }
      if (role !== 'admin' && id !== findComment.author) {
        return res.status(401).send({
          status: res.statusCode,
          error: 'You are not authorized to update this comment'
        });
      }

      const updatedComment = await Comments.update(
        {
          highlightedText: text,
          startIndex,
          endIndex,
          body: role === 'admin' ? findComment.body : body,
          status: role === 'admin' ? status : 'show'
        },
        {
          where: {
            id: commentId,
            post: CommentedArticle.id,
          },
          returning: true
        }
      );

      const editHistory = await CommentEdits.findAll({
        where: { commentId },
        attributes: ['body', 'highlightedText', 'createdAt']
      });
      const comment = updatedComment[1][0];

      return res.status(200).json({
        status: res.statusCode,
        comment: {
          body: comment.body,
          updatedAt: comment.updatedAt,
          highlightedText: comment.highlightedText,
          startIndex: comment.startIndex,
          endIndex: comment.endIndex
        },
        editHistory
      });
    } catch (error) {
      return res.status(500).json({
        status: res.statusCode,
        error: error.message
      });
    }
  },

  /**
   *  An author of a comment is allowed to delete it
   *  @param {object} req
   *  @param {object} res
   *  @return {object} res
   * */
  delete: async (req, res) => {
    const { id, slug } = req.params;
    const { id: userID } = req.user;

    try {
      // check if the post exists
      // get the id and check if the comment belongs to this post
      const post = await article.findOne({
        where: { slug },
        attributes: ['id', 'author']
      });
      if (!post) {
        return res.status(404).json({
          status: res.statusCode,
          error: 'The article does not exist'
        });
      }

      const comment = await Comments.findOne({
        where: { id, post: post.id },
        attributes: ['id', 'author', 'post']
      });
      // the user deleting the comment should be the comment's author
      if (!(userID === comment.author)) {
        return res.status(403).json({
          status: res.statusCode,
          message: 'Not allowed to delete this comment'
        });
      }

      // delete the comment
      await Comments.destroy({ where: { id, post: post.id } });
      return res.status(200).json({
        status: res.statusCode,
        message: 'Comment deleted'
      });
    } catch (e) {
      return res.status(500).json({
        status: res.statusCode,
        message: 'Something happened on the server',
        error: e.message
      });
    }
  },

  /**
   * This method gets all the highlighted texts on the article
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Object of highlighted texts on the article
   */
  getHighlighted: async (req, res) => {
    const { slug } = req.params;

    // check if the article with slug provided is in db
    const findArticle = await article.findOne({
      where: { slug }
    });
    if (!findArticle) {
      return res.status(404).send({
        status: 404,
        error: 'Article not found'
      });
    }

    // now get all the highlighted texts associated to that article
    const highlighted = await Comments.findAll({
      where: { post: findArticle.id, highlightedText: { [Op.ne]: null } },
      attributes: ['highlightedText'],
      include: [{ model: User, attributes: ['username', 'image'] }]
    });

    return res.status(200).send({
      status: 200,
      highlighted
    });
  }
};
