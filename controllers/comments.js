import models from '../models';
import subscribe from '../helpers/subscribe';
import mailer from '../config/verificationMail';

const {
  Comments, User, article, likeComments, CommentEdits
} = models;

export default {
  /**
   *  Only authenticated users can add comments on articles
   *  @param {object} req
   *  @param {object} res
   *  @return {object} res
   * */
  create: async (req, res) => {
    const { body } = req.body;
    const { slug } = req.params;
    const { id: authorID } = req.user;

    try {
      // check if the article exists
      const post = await article.findOne({
        where: { slug },
        attributes: ['id']
      });
      if (!post) {
        return res.status(404).json({
          status: res.statusCode,
          error: "The post doesn't exist"
        });
      }

      // get comment author username
      const author = await User.findOne({
        where: { id: authorID },
        attributes: ['username', 'image']
      });

      // save the comment
      const comment = await Comments.create({
        body,
        author: authorID,
        post: post.id
      });

      // send email notification
      await mailer.sentNotificationMail({
        username: req.user.username,
        subscribeTo: post.id,
        slug: post.slug,
        title: 'new comment',
        action: 'has left a comment on an article'
      });

      // register user as a subscriber to the commented article
      subscribe(req.user.id, post.id);

      return res.status(201).json({
        status: res.statusCode,
        comment: {
          id: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          body: comment.body,
          author
        }
      });
    } catch (e) {
      return res.status(500).json({
        status: res.statusCode,
        error: e.message || '',
        message: 'Something happened on the server'
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
          return {
            id: comment.id,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            body: comment.body,
            highlightedText: comment.hightedText,
            author: comment.User,
            likes: comment.likeComments.length,
            editHistory
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
        error: e.message || '',
        message: 'Something happened on the server'
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
    const { body } = req.body;
    const { slug, commentId } = req.params;
    const { id } = req.user;

    if (!body || body.trim() === '') {
      return res.status(400).json({
        status: res.statusCode,
        error: 'Comment body is required'
      });
    }

    try {
      const CommentedArticle = await article.findOne({
        where: { slug },
        attributes: ['id'],
        include: {
          model: User,
          attributes: ['username', 'id']
        }
      });

      if (!CommentedArticle) {
        return res.status(400).json({
          status: res.statusCode,
          error: 'Article not found'
        });
      }

      const updatedComment = await Comments.update(
        { body },
        {
          where: {
            id: commentId,
            post: CommentedArticle.id,
            author: id
          },
          returning: true
        }
      );

      if (updatedComment[0] === 0) {
        return res.status(400).json({
          status: res.statusCode,
          error: 'Comment to update not found'
        });
      }

      const editHistory = await CommentEdits.findAll({
        where: { commentId },
        attributes: ['body', 'createdAt']
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
  }
};
