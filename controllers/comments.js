import models from '../models';

const { Comments, User, article } = models;

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
      const post = await article.findOne({ where: { slug }, attributes: ['id'] });
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
      const comment = await Comments.create({ body, author: authorID, post: post.id });

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
      if (e.message) {
        return res.status(500).json({
          status: res.statusCode,
          message: 'Something happened on the server',
          error: e.message
        });
      }
      return res.status(500).json({
        status: res.statusCode,
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
    let structuredComments = [];

    try {
      // check if the article exists
      const post = await article.findOne({ where: { slug }, attributes: ['id'] });
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
        order: [['createdAt', 'ASC']]
      });
      // format the comments into the required format
      structuredComments = await Promise.all(
        comments.map(async (comment) => {
          const author = await User.findOne({
            where: { id: comment.author },
            attributes: ['username', 'image']
          });
          return {
            id: comment.id,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            body: comment.body,
            author
          };
        })
      );
      return res.status(200).json({
        status: res.statusCode,
        comments: structuredComments,
        commentsCount: structuredComments.length
      });
    } catch (e) {
      if (e.message) {
        return res.status(500).json({
          status: res.statusCode,
          message: 'Something happened on the server',
          error: e.message
        });
      }
      return res.status(500).json({
        status: res.statusCode,
        message: 'Something happened on the server'
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
      const post = await article.findOne({ where: { slug }, attributes: ['id', 'author'] });
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
      if (e.message) {
        return res.status(500).json({
          status: res.statusCode,
          message: 'Something happened on the server',
          error: e.message
        });
      }
      return res.status(500).json({
        status: res.statusCode,
        message: 'Something happened on the server'
      });
    }
  }
};
