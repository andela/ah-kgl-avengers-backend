import Joi from 'joi';
/**
 *
 * @param {*} data request data object.
 * @param {*} res response object.
 * @param {*} schema  returns the User Object
 * @param {*} next callback function.
 * @returns {*} response.
 */
function validation(data, res, schema, next) {
  const { error } = Joi.validate(data, schema, ({
    abortEarly: false
  }));
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
const arcticleValidation = {

  article: (req, res, next) => {
    const schema = {
      title: Joi.string().min(5).trim().required(),
      body: Joi.string().min(5).trim().required(),
      tagList: Joi.array(),
      categories: Joi.array(),
      status: Joi.string().trim().min(5),
    };
    validation(req.body, res, schema, next);
  },

  slug: (req, res, next) => {
    const schema = {
      slug: Joi.string().min(10).trim().required(),
    };
    validation(req.params, res, schema, next);
  },

};

export default arcticleValidation;
