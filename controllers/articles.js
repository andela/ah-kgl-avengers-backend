import crypto from 'crypto';
import open from 'open';
import models from '../models/index';
import readTime from '../helpers/readingTime';
import mailer from '../config/verificationMail';

const {
  article, User, bookmark, likes, subscribers, ratings, tags, Report
} = models;
const { Op } = models.Sequelize;
const attributes = {
  exclude: ['id', 'deleted', 'status']
};

/**
 * This function handle the rating  array and return the average rating of
 * a certain rated article.
 *
 * @param {*} data The article that
 * @returns {*} Average rating value
 *
 */
const getAverageRating = (data) => {
  const average = data === null || data.length === 0
    ? 0
    : data.reduce((sum, rating) => sum + rating.rating, 0) / data.length;
  return Number(average.toFixed(2));
};

const generateDescription = (body) => {
  // adjust the text to only remain with complete words
  const reduceText = (text, length) => {
    if (text.charAt(length) === ' ') {
      return text.substring(0, length);
    }
    return reduceText(text, length + 1);
  };
  // remove the tags and all element attributes in the content to remain with only text
  const cleanText = body.replace(/<\/?[^>]+(>|$)/g, '');
  if (cleanText.length < 100) {
    return cleanText;
  }
  return reduceText(cleanText, 99);
};

const articles = {
  /*
   * Creating an article
   *
   * For directly publishing an article, status flag has to be passed
   * into the request body object otherwise the article will be in drafted
   */
  createArticle: async (req, res) => {
    try {
      const {
        title, body, status, featuredImage
      } = req.body;
      const { id: author } = req.user;
      const flag = status === undefined ? 'draft' : status.toLowerCase();
      const totalArticleReadTime = readTime.totalReadTime(body);
      let { tagList } = req.body;
      if (!req.is('application/json')) {
        tagList = !tagList ? '[]' : tagList;
        tagList = JSON.parse(tagList);
      } else {
        tagList = !tagList ? [] : tagList;
      }
      tagList = tagList.map(tag => tag.toLowerCase());

      const slug = `${title
        .toLowerCase()
        .split(' ')
        .join('-')
        .substring(0, 40)}${crypto.randomBytes(5).toString('hex')}`;
      const description = generateDescription(body);

      const createdArticle = await article.create({
        title,
        body,
        author,
        slug,
        description,
        status: flag,
        tagList,
        featuredImage,
        readTime: totalArticleReadTime
      });

      // tag registration
      tagList.forEach(async (tag) => {
        const findTag = await tags.findOne({ where: { tag } });
        if (!findTag) tags.create({ tag });
        if (findTag) tags.update({ count: findTag.count + 1 }, { where: { tag }, returning: true });
      });

      // send email notification
      await mailer.sentNotificationMail({
        username: req.user.username,
        subscribeTo: req.user.id,
        slug: createdArticle.slug,
        title: createdArticle.title,
        action: 'has posted an article'
      });

      // register author as a subscriber to his article
      await subscribers.create({
        articleId: createdArticle.id,
        subscribers: [author]
      });

      return res.status(201).send({
        status: res.statusCode,
        article: {
          title: createdArticle.title,
          description: createdArticle.description,
          body: createdArticle.body,
          slug: createdArticle.slug,
          tags: createdArticle.tagList,
          featuredImage: createdArticle.featuredImage,
          totalArticleReadTime
        }
      });
    } catch (err) {
      if (err.message) {
        res.status(500).send({
          error: 'Server failed to handle your request'
        });
      }
    }
  },

  /*
   * updating a post based on its slug.
   *
   * For updating an article, status flag has to be passed
   * into the request body object otherwise the article will be in drafted.
   */
  updateArticle: async (req, res) => {
    const { id } = req.user;
    const { slug: oldSlug } = req.params;
    const { title, body, featuredImage } = req.body;
    let { status = 'draft' } = req.body;
    status = status.toLowerCase();

    let { tagList: newTags } = req.body;

    if (!req.is('application/json')) {
      newTags = !newTags ? '[]' : newTags;
      newTags = JSON.parse(newTags);
    } else {
      newTags = !newTags ? [] : newTags;
    }
    newTags = newTags.map(tag => tag.toLowerCase());

    try {
      const slug = `${title
        .toLowerCase()
        .split(' ')
        .join('-')
        .substring(0, 20)}${crypto.randomBytes(5).toString('hex')}`;
      const description = generateDescription(body);
      const totalArticleReadTime = readTime.totalReadTime(body);
      const findArticle = await article.findOne({ where: { slug: oldSlug } });
      let updatedArticle = await article.update(
        {
          title,
          body,
          slug,
          status,
          description,
          tagList: newTags,
          featuredImage: featuredImage || findArticle.featuredImage,
          readTime: totalArticleReadTime
        },
        {
          where: { slug: oldSlug, author: id },
          returning: true
        }
      );

      // When no article to update found
      if (updatedArticle[0] === 0) {
        return res.status(404).send({
          status: res.statusCode,
          error: 'Article not found'
        });
      }

      // tag registration
      const oldTags = findArticle.tagList;

      if (newTags) {
        oldTags.forEach(async (tag) => {
          if (!newTags.includes(tag)) {
            const findTag = await tags.findOne({ where: { tag } });
            if (findTag.count === 1) await tags.destroy({ where: { tag } });
            if (findTag.count > 1) {
              await tags.update({ count: findTag.count - 1 }, { where: { tag }, returning: true });
            }
          }
        });

        newTags.forEach(async (tag) => {
          if (!oldTags.includes(tag)) {
            const findTag = await tags.findOne({ where: { tag } });
            if (!findTag) await tags.create({ tag });
            if (findTag) {
              await tags.update({ count: findTag.count + 1 }, { where: { tag }, returning: true });
            }
          }
        });
      }

      // destructuring the updated article to remain with an object only
      [updatedArticle] = [updatedArticle[1][0]];

      // Get updated article ratings
      const allRatings = await ratings.findAll({
        where: { post: updatedArticle.id },
        attributes: ['rating']
      });

      updatedArticle.ratings = getAverageRating(allRatings);
      return res.status(200).send({
        status: res.statusCode,
        article: {
          title: updatedArticle.title,
          body: updatedArticle.body,
          slug: updatedArticle.slug,
          ratings: updatedArticle.ratings,
          tagList: updatedArticle.tagList,
          featuredImage: updatedArticle.featuredImage,
          findArticle: updatedArticle.findArticle
        }
      });
    } catch (err) {
      res.status(500).send({
        status: res.statusCode,
        error: err.message
      });
    }
  },

  /*
   * Deleting a post based on its slug.
   *
   * For avoiding permanent deletion of the content from the database
   * we set the flag to the article that it is deleted.
   */
  deleteArticle: async (req, res) => {
    const { id, role } = req.user;
    const { slug } = req.params;
    try {
      // Check if article exists.
      const findArticle = await article.findOne({ where: { slug } });

      if (!findArticle) {
        return res.status(404).send({
          status: res.statusCode,
          error: 'The article is not found'
        });
      }
      // Check if article is reported
      const reported = await Report.findOne({ where: { articleId: findArticle.id } });
      // Check if someone deleting article is the owner or admin.
      if (findArticle.author !== id && (role !== 'admin' || !reported)) {
        return res.status(401).send({
          status: res.statusCode,
          error: 'Unauthorized to delete this article'
        });
      }
      await article.destroy({
        where: { slug },
        returning: true
      });

      findArticle.tagList.forEach(async (tag) => {
        const findTag = await tags.findOne({ where: { tag } });
        if (findTag.count === 1) await tags.destroy({ where: { tag } });
        if (findTag.count > 1) {
          await tags.update({ count: findTag.count - 1 }, { where: { tag }, returning: true });
        }
      });
      return res.status(200).send({
        status: res.statusCode,
        message: 'Article deleted successfully'
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Server failed to handle your request'
      });
    }
  },

  /*
   * Retrieving all the published articles based to the author
   * and the status of the article (Published).
   * The author here is the user logged in
   */
  getAllPublishedArticles: async (req, res) => {
    const { limit, offset } = req.query;
    try {
      const { id } = req.user;
      const authorInfo = await User.findOne({
        where: { id },
        attributes: ['username', 'bio', 'image', 'following']
      });
      attributes.exclude = attributes.exclude.filter(attribute => attribute !== 'id');
      const allPublishedArticles = await article.findAll({
        where: {
          author: id,
          status: 'published',
          deleted: 0
        },
        attributes,
        limit,
        offset
      });

      const formatedArticles = await Promise.all(
        allPublishedArticles.map(async (publishedArticle) => {
          // Get average ratings for each article
          const ArticleRatings = await ratings.findAll({
            where: { post: publishedArticle.id },
            attributes: ['rating']
          });

          const articleLikes = await likes.findAndCountAll({
            where: { articleId: publishedArticle.id, status: 'liked' }
          });
          const articleRatings = getAverageRating(ArticleRatings);
          publishedArticle.likes = articleLikes.count;
          publishedArticle.ratings = articleRatings;

          return {
            title: publishedArticle.title,
            body: publishedArticle.body,
            description: publishedArticle.description,
            slug: publishedArticle.slug,
            tagList: publishedArticle.tagList,
            updatedArticle: publishedArticle.updatedArticle,
            ratings: publishedArticle.ratings,
            readTime: publishedArticle.readTime,
            featuredImage: publishedArticle.featuredImage,
            likes: publishedArticle.likes
          };
        })
      );

      // return publishedArticle;
      return res.status(200).send({
        status: res.statusCode,
        author: authorInfo,
        articles: formatedArticles,
        articlesCount: formatedArticles.length
      });
    } catch (error) {
      throw error;
    }
  },

  /*
   * Retrieving all the drafted articles based to the author
   * and the status of the article=draft.
   */
  getAllDraftArticles: async (req, res) => {
    const { limit, offset } = req.query;
    try {
      const { id } = req.user;
      attributes.exclude.push('author');
      const response = await article.findAll({
        where: {
          author: id,
          status: 'draft',
          deleted: 0
        },
        attributes,
        limit,
        offset
      });

      return res.status(200).send({
        status: res.statusCode,
        articles: response,
        articlesCount: response.length
      });
    } catch (error) {
      throw error;
    }
  },
  /*
   * Retrieving one drafted article based to the author
   * and the status of the article=draft.
   */
  getSingleDraftArticle: async (req, res) => {
    const { slug } = req.params;
    const { id } = req.user;
    try {
      attributes.exclude.push('author');
      const response = await article.findOne({
        where: {
          author: id,
          slug,
          status: 'draft',
          deleted: 0
        },
        attributes
      });

      if (!response) {
        return res.status(404).json({
          status: res.statusCode,
          error: 'Article not found'
        });
      }

      return res.status(200).send({
        status: res.statusCode,
        article: response,
        articlesCount: response.length
      });
    } catch (error) {
      throw error;
    }
  },

  authorArticles: async (req, res) => {
    const { username } = req.params;
    const { limit, offset } = req.query;

    try {
      const findUser = await User.findOne({ where: { username } });
      if (!findUser) {
        return res.status(404).send({
          status: res.statusCode,
          message: 'No user found matches provided username'
        });
      }
      const findAll = await article.findAll({
        where: { status: 'published', deleted: 0, author: findUser.id },
        attributes,
        include: [
          {
            model: User,
            attributes: ['username', 'email', 'bio', 'image']
          }
        ],
        limit,
        offset
      });

      return res.status(200).send({
        status: res.statusCode,
        data: findAll
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Server failed to handle your request'
      });
    }
  },

  /*
   * Construct user's feed
   * and the status of the article (Published).
   */
  getFeeds: async (req, res) => {
    const { limit, offset } = req.query;
    try {
      let allArticles = await article.findAll({
        where: { status: 'published', deleted: 0 },
        include: [
          {
            model: User,
            attributes: ['username', 'email', 'bio', 'image']
          }
        ],
        order: [['updatedAt', 'DESC']],
        limit,
        offset
      });
      allArticles = await Promise.all(
        allArticles.map(async (feedArticle) => {
          const author = feedArticle.User;

          // Get the article ratings and generate average ratings
          const articleRatings = await ratings.findAll({
            where: { post: feedArticle.id },
            attributes: ['rating']
          });
          const averageRating = getAverageRating(articleRatings);

          return {
            title: feedArticle.title,
            body: feedArticle.body,
            description: feedArticle.description,
            slug: feedArticle.slug,
            tagList: feedArticle.tagList,
            readTime: feedArticle.readTime,
            averageRating,
            featuredImage: feedArticle.featuredImage,
            createdAt: feedArticle.createdAt,
            updatedAt: feedArticle.updatedAt,
            author
          };
        })
      );

      return res.status(200).send({
        status: res.statusCode,
        articles: allArticles,
        articlesCount: allArticles.length
      });
    } catch (error) {
      throw error;
    }
  },

  /*
   * Viewing an article based on its slug.
   *
   * To view an article, status flag has to be passed
   * into params otherwise the article will be in drafted.
   */
  viewArticle: async (req, res) => {
    const { slug } = req.params;
    try {
      // find the article, article's likes and ratings
      const articleToView = await article.findOne({
        where: { slug, deleted: 0, status: 'published' },
        include: [
          {
            model: likes,
            attributes: ['id', 'status'],
            where: { status: 'liked' },
            required: false
          },
          {
            model: User,
            attributes: ['username', 'image']
          },
          {
            model: ratings,
            attributes: ['rating'],
            required: false
          }
        ]
      });
      if (!articleToView) {
        return res.status(404).send({
          status: res.statusCode,
          error: 'Article not found'
        });
      }

      articleToView.ratings = getAverageRating(articleToView.ratings);
      const getArticleId = await article.findOne({ where: { slug } });
      articleToView.dislikes = await likes.findAndCountAll({ where: { articleId: getArticleId.id, status: 'disliked' } });
      return res.status(200).send({
        status: res.statusCode,
        article: {
          title: articleToView.title,
          body: articleToView.body,
          description: articleToView.description,
          slug: articleToView.slug,
          tagList: articleToView.tagList,
          featuredImage: articleToView.featuredImage,
          ratings: articleToView.ratings,
          readTime: articleToView.readTime,
          author: articleToView.User,
          likes: articleToView.likes.length,
          dislikes: articleToView.dislikes.count
        }
      });
    } catch (error) {
      if (error.message) {
        return res.status(500).send({
          status: res.statusCode,
          error: error.message
        });
      }
    }
  },

  /*
   * User should be able to rate an article.
   *
   * Only authenticated user will have access on this functionality
   * of rating an article.
   * A user can only submit one review per article
   * And the author of an article can not submit a rating for that same article
   */
  rateArticle: async (req, res) => {
    const { slug } = req.params;
    const { rating } = req.body;
    const { id: user } = req.user;

    try {
      // Check if the article exists
      const result = await article.findOne({ where: { slug } });
      if (!result) {
        return res.status(404).send({
          status: res.statusCode,
          error: 'Article not found'
        });
      }
      // Drafts are not rated
      if (result.status === 'draft') {
        return res
          .status(400)
          .json({ status: res.statusCode, message: 'draft articles are not rated' });
      }

      // check if the user submitting the rating is not the article's author
      if (user === result.author) {
        return res.status(400).json({
          status: res.statusCode,
          error: 'You are not allowed to submit a rating on your own article'
        });
      }

      // Check if the user has no review yet on that article
      // Add user rating
      // Add all ratings made on the article to get an average
      // Calculate the average rating
      const articleRatings = await ratings.findOne({ where: { post: result.id, user } });
      if (articleRatings == null) {
        const updated = await ratings.create({ user, post: result.id, rating });
        const allRatings = await ratings.findAll({
          where: { post: result.id },
          attributes: ['rating']
        });

        const averageRating = getAverageRating(allRatings);
        return res.status(201).json({
          status: res.statusCode,
          data: {
            user: updated.user,
            article: updated.user,
            rating: updated.rating
          },
          averageRating
        });
      }
      // The user is not allowed to review for the second time
      return res.status(400).json({
        status: res.statusCode,
        error: 'You are allowed to review an article only once'
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Server failed to handle your request'
      });
    }
  },

  /**
   * Get individual ratings made on an article
   * returns the user who rated the article, the rating given
   * The endpoint is not authenticated
   * @param {object} req the Express request object
   * @param {object} res the Express response object
   * @returns {object} res the Express response object
   */
  getArticleRatings: async (req, res) => {
    const { slug } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    try {
      const result = await article.findOne({
        where: { slug, status: 'published' },
        attributes: ['id']
      });
      if (!result) {
        return res.status(400).json({
          status: res.statusCode,
          error: 'Article not found'
        });
      }

      // The first query response is used to calculate th average rating
      // The second query is limited and accepts offset, to get ratings to return
      const allRatings = await ratings.findAll({
        where: { post: result.id },
        attributes: ['rating', 'user']
      });
      const limitedRatings = await ratings.findAll({
        where: { post: result.id },
        attributes: ['rating', 'user'],
        limit,
        offset
      });

      // If the article has no rating
      if (allRatings.length === 0) {
        return res.status(400).json({ status: res.statusCode, error: 'Article has no rating' });
      }

      // Format and return the article's rating
      const averageRating = getAverageRating(allRatings);
      const formatedRatings = await Promise.all(
        limitedRatings.map(async (rating) => {
          const ratingUser = await User.findOne({
            where: { id: rating.user },
            attributes: ['username', 'image']
          });
          return {
            rating: rating.rating,
            profile: { id: rating.user, username: ratingUser.username, image: ratingUser.image }
          };
        })
      );

      return res.status(200).json({
        status: res.statusCode,
        totalRatings: formatedRatings.length,
        averageRating,
        ratings: formatedRatings
      });
    } catch (error) {
      return res.status(500).json({
        status: res.statusCode,
        error: 'The server failed to handle your request'
      });
    }
  },

  /* Bookmarking and article so that one can come back
   * and read it later.
   */

  createBookmark: async (req, res) => {
    try {
      const { slug } = req.params;
      const { id: userId } = req.user;

      const findArticle = await article.findOne({ where: { slug } });
      if (!findArticle) {
        return res.status(404).send({
          status: res.statusCode,
          error: 'The article your trying to bookmark does not exit'
        });
      }

      const checkExist = await bookmark.findOne({ where: { articleId: findArticle.id, userId } });
      if (checkExist) {
        return res.status(400).send({
          status: res.statusCode,
          error: 'You have already bookmarked this article'
        });
      }

      const createBookmark = await bookmark.create({
        userId,
        articleId: findArticle.id
      });
      if (createBookmark.articleId) {
        return res.status(200).send({
          status: res.statusCode,
          message: 'Article has been bookmarked',
          data: {
            title: findArticle.title,
            body: findArticle.body,
            description: findArticle.description
          }
        });
      }
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'The server failed to handle your request'
      });
    }
  },

  /*
   * get all bookmarked articles return
   * them to the user.
   */

  getAllBookmarks: async (req, res) => {
    const { id: userId } = req.user;
    try {
      let bookmarkedArticles = [];
      const findBookmarks = await bookmark.findAll({ where: { userId } });

      // If the user have no bookmarked article
      if (findBookmarks.length === 0) {
        return res.status(400).send({
          status: res.statusCode,
          error: "You don't have any bookmarked article"
        });
      }

      // If the user has bookmarked articles, format them
      bookmarkedArticles = await Promise.all(
        findBookmarks.map(async (item) => {
          const findBookmarkedArticle = await article.findOne({
            where: { id: item.articleId },
            attributes,
          });
          const author = await User.findOne({
            where: { id: findBookmarkedArticle.author },
            attributes: ['username', 'image']
          });
          findBookmarkedArticle.author = author;
          return findBookmarkedArticle;
        })
      );

      // Return formated articles
      return res.status(200).send({
        status: res.statusCode,
        data: bookmarkedArticles
      });
    } catch (error) {
      // Return server side error
      return res.status(500).send({
        status: res.statusCode,
        error: 'Something went wrong'
      });
    }
  },

  /*
   * delete bookmark
   */
  deleteBookmark: async (req, res) => {
    const { slug } = req.params;
    const { id: userId } = req.user;
    try {
      const checkArticle = await article.findOne({ where: { slug } });
      const checkBookmark = await bookmark.destroy({
        where: { articleId: checkArticle.id, userId }
      });
      if (checkBookmark === 0) {
        return res.status(400).send({
          status: res.statusCode,
          message: 'Bookmark not found'
        });
      }

      return res.status(200).send({
        status: res.statusCode,
        message: 'Bookmark cleared successfully'
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        message: 'Server failed to handle the request'
      });
    }
  },

  fbShare: async (req, res) => {
    const { link } = req.article;
    res.status(200).send({
      status: res.statusCode,
      message: 'post shared',
      link
    });
    open(`https:www.facebook.com/sharer/sharer.php?u=${link}`);
  },

  twitterShare: async (req, res) => {
    const { link } = req.article;
    res.status(200).send({
      status: res.statusCode,
      message: 'tweet sent',
      link
    });
    open(`https://twitter.com/intent/tweet?url=${link}`);
  },

  emailShare: async (req, res) => {
    const { title, link } = req.article;
    res.status(200).send({
      status: res.statusCode,
      message: 'email sent',
      link
    });
    open(`mailto:?subject=${title}&body=${link}`);
  },

  getAllTags: async (req, res) => {
    const tagsList = await tags.findAll({ attributes: ['tag', 'count'] });
    return res.status(200).send({
      status: res.statusCode,
      data: tagsList
    });
  },

  getTags: async (req, res) => {
    const { tag } = req.params;
    const tagsList = await tags.findAll({
      attributes: ['tag', 'count'],
      where: { tag: { [Op.regexp]: `(${tag})` } }
    });
    return res.status(200).send({
      status: res.statusCode,
      data: tagsList
    });
  }
};

export default articles;
