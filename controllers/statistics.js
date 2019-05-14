import models from '../models';
import timeWasted from '../helpers/readingTime';

const { User, article, statistic } = models;

const userAttributes = ['username', 'image', 'bio'];
const articleAttributes = ['title', 'description', 'slug', 'tagList'];

const statistics = {
  createStats: async (req, res) => {
    /**
     * Get the id of the current user that is logged in,
     * Get the time spent by that user while reading an article in seconds,
     * Convert the time received to minutes,
     * Call the nonReadTime function which simply calculates the time spend over time wasted.
     * If the user read time is below 20 seconds which is roughly 0.3333 minutes,
     * this is considered as wasted time.
     * So the system assumes that the user just scrolled through the article
     * But if the user read time is 20 second 0r 0.333 minutes and more,
     * the system will continue to execute the other codes.
     */
    const { id } = req.user;
    const { timeSpentReading } = req.query;
    const convertToMins = timeSpentReading / 60;
    const { slug } = req.query;
    const totalReadTime = timeWasted.nonReadTime(convertToMins);
    try {
      const articles = await article.findOne({
        where: { slug },
        attributes: ['id', 'title', 'body', 'slug'],
        include: {
          model: User,
          attributes: userAttributes
        }
      });
      if (totalReadTime <= 0.3333) {
        return res.status(400).send({
          status: res.statusCode,
          message: 'The read time captured is below the minimum value',
        });
      }

      const currentUser = await User.findOne({
        attributes: userAttributes,
        where: { id }
      });

      const findIfRead = await statistic.findOne({ where: { userId: id, articleId: articles.id } });
      if (!findIfRead) {
        const createStats = await statistic.create({
          userId: id,
          articleId: articles.id,
          totalTime: totalReadTime,
        });
        return res.status(201).send({
          status: res.statusCode,
          readTime: createStats.totalTime,
          articleRead: articles,
          currentUser,
        });
      }
      const updateCurrentTime = await statistic.update(
        {
          totalTime: totalReadTime,
        },
        {
          where: {
            userId: id,
            articleId: articles.id
          },
          returning: true,
        },
      );
      const time = updateCurrentTime[1][0].get();
      const neededTime = time.totalTime;
      return res.status(200).send({
        status: res.statusCode,
        newReadTime: neededTime,
        articleRead: articles,
        currentUser,
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Server failed to handle your request'
      });
    }
  },

  getAverageStats: async (req, res) => {
    const { id } = req.user;
    try {
      const currentUser = await User.findOne({
        where: { id },
        attributes: userAttributes
      });
      const userStats = await statistic.findAll({
        where: {
          userId: id,
        },
        attributes: ['totalTime'],
        include: [{
          model: article,
          attributes: articleAttributes,
          include: [{
            model: User,
            attributes: userAttributes
          }]
        }],
      });
      const totalArticleReadTime = userStats.reduce((total, data) => (data.totalTime + total), 0);
      const totalTime = totalArticleReadTime === 0 ? '0 mins' : totalArticleReadTime;
      return res.status(200).send({
        status: res.statusCode,
        totalTime,
        currentUser,
        articlesRead: userStats
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Server failed to handle your request'
      });
    }
  },

  getSingleStats: async (req, res) => {
    const { slug } = req.query;
    const { id } = req.user;
    try {
      const currentUser = await User.findOne({
        where: { id },
        attributes: userAttributes
      });
      const findArticle = await article.findOne({
        where: { slug }
      });
      const userStats = await statistic.findOne({
        where: {
          userId: id,
          articleId: findArticle.id
        },
        attributes: ['totalTime'],
        include: [{
          model: article,
          attributes: articleAttributes,
          include: [{
            model: User,
            attributes: userAttributes
          }]
        }],
      });
      return res.status(200).send({
        status: res.statusCode,
        currentUser,
        articleRead: userStats
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Server failed to handle your request'
      });
    }
  }
};

export default statistics;
