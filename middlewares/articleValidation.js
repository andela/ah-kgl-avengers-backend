import Joi from 'joi';

const arcticleValidation = {

  createAnArticle: (params) => {
    const schema = {
      title: Joi.string().min(5).trim().required(),
      body: Joi.string().min(5).trim().required(),
      taglines: Joi.string().trim().min(2),
      categories: Joi.string().trim().min(5),
      author: Joi.string().uuid().min(5).required()
        .trim(),
    };
    return Joi.validate(params, schema, ({ abortEarly: false }));
  }
};

export default arcticleValidation;
