import models from '../models';

const { User, Report, article } = models;

const Reports = {
  /**
   * Authenticated user should be able to report
   * an article that violate terms of argument.
   *
   * @param {*} req request object.
   * @param {*} res response object.
   * @returns {*}   response to be returned.
   */
  reportArticle: async (req, res) => {
    const { slug } = req.params;
    const { message } = req.body;
    const { id: reporter } = req.user;
    try {
      const findArticle = await article.findOne({
        where: { slug, status: 'published' },
        attributes: ['id', 'slug', 'title', 'body']
      });
      if (!findArticle) {
        return res.status(404).send({
          status: res.statusCode,
          error: 'The article you\'re trying to report is not found',
        });
      }

      const findReport = await Report.findOne({ where: { reporter, articleId: findArticle.id } });
      if (findReport) {
        return res.status(400).send({
          status: res.statusCode,
          error: 'You have already reported this article',
        });
      }
      const report = await Report.create({ reporter, message, articleId: findArticle.id });
      if (!report) {
        return res.status(500).send({
          status: res.statusCode,
          error: 'Failed to handle this request',
        });
      }
      delete findArticle.get().id;
      return res.status(200).send({
        status: res.statusCode,
        message,
        article: findArticle,
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Server failed to handle your request',
      });
    }
  },

  /**
   * Only Admin should be able to get all articles
   * that have been reported.
   *
   * @param {*} req request object.
   * @param {*} res response object.
   * @returns {*}   response to be returned.
   */
  getAllReportedArticle: async (req, res) => {
    const { role } = req.user;
    if (role < 0) {
      return res.status(401).send({
        status: res.statusCode,
        error: 'Unauthorized to make this request',
      });
    }
    try {
      const allReports = await Report.findAll({
        attributes: { exclude: ['id', 'articleId', 'reporter'], },
        include: [{
          model: User,
          attributes: ['username', 'email', 'bio']
        }, {
          model: article,
          attributes: ['title', 'slug', 'description']
        }]
      });
      return res.status(200).send({
        status: res.statusCode,
        data: allReports,
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Server failed to handle your request',
      });
    }
  },

  /**
   * Authenticated user should be able to report
   * an article that doesn't obey rules and regulations.
   *
   * @param {*} req request object.
   * @param {*} res response object.
   * @returns {*}   response to be returned.
   */
  deleteReportedArticle: async (req, res) => {
    const { slug } = req.params;
    const { role } = req.user;
    if (role < 0) {
      return res.status(401).send({
        status: res.statusCode,
        error: 'Unauthorized to make this request',
      });
    }
    try {
      const findArticle = await article.findOne({ where: { slug } });
      if (!findArticle) {
        return res.status(404).send({
          status: res.statusCode,
          error: 'The article was not found',
        });
      }
      const destroy = await article.destroy({ where: { slug } });
      if (!destroy) {
        return res.status(500).send({
          status: res.statusCode,
          error: 'Failed to delete the article'
        });
      }
      return res.status(200).send({
        status: res.statusCode,
        message: 'Article delete successfully'
      });
    } catch (error) {
      return res.status(500).send({
        status: res.statusCode,
        error: 'Server failed to handle your request',
      });
    }
  },
};

export default Reports;
