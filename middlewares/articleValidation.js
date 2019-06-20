import Joi from 'joi';
import models from '../models';

const { article } = models;
/**
 *
 * @param {*} data request data object.
 * @param {*} res response object.
 * @param {*} schema  returns the User Object
 * @param {*} next callback function.
 * @returns {*} response.
 */
function validation(data, res, schema, next) {
  const { error } = Joi.validate(data, schema, {
    abortEarly: false
  });
  if (!error) return next(error);

  const errors = [];
  const { details } = error;
  details.forEach((element) => {
    errors.push(element.message.split('"').join(''));
  });
  return res.status(400).send({
    status: res.statusCode,
    errors
  });
}
const articleValidation = {
  article: (req, res, next) => {
    const schema = {
      title: Joi.string()
        .min(5)
        .trim()
        .required(),
      body: Joi.string()
        .min(5)
        .trim()
        .required(),
      featuredImage: Joi.string()
        .trim()
        .uri()
        .required(),
      tagList: Joi.array(),
      categories: Joi.array(),
      status: Joi.string()
        .trim()
        .min(5)
    };
    validation(req.body, res, schema, next);
  },

  slug: (req, res, next) => {
    const schema = {
      slug: Joi.string()
        .min(10)
        .trim()
        .required()
    };
    validation(req.params, res, schema, next);
  },

  rating: (req, res, next) => {
    const schema = {
      rating: Joi.number()
        .min(1)
        .max(5)
        .required()
    };
    validation(req.body, res, schema, next);
  },

  message: (req, res, next) => {
    const schema = {
      message: Joi.string()
        .max(512)
        .required()
    };
    validation(req.body, res, schema, next);
  },

  validArticle: async (req, res, next) => {
    const { slug } = req.params;
    const link = `${process.env.SERVER_ADDRESS}/articles/${slug}`;
    const oneArticle = await article.findOne({ where: { slug } });
    if (!oneArticle) {
      return res.status(404).send({
        status: res.statusCode,
        error: 'No article found, please create an article first'
      });
    }
    oneArticle.link = link;
    req.article = oneArticle;
    next();
  }
};

export default articleValidation;
