import models from '../models/index';
import validation from '../middlewares/articleValidation';

const { article } = models;

const articles = {

  // create an article for each user
  createAnArticle: async (req, res) => {
    const { error } = validation.createAnArticle(req.body);
    if (error) {
      const errorMessages = [];
      const { details } = error;
      details.forEach((element) => {
        errorMessages.push(element.message.split('"').join(''));
      });
      return res.status(400).send({
        status: res.statusCode,
        errorMessages
      });
    }
    try {
      const { title, body, author } = req.body;
      const slug = title.toLowerCase().split(' ').join('-');
      const description = body.substring(0, 30);

      const queryArticle = await article.create({
        title, body, author, slug, description,
      });
      return res.status(201).send({
        status: res.statusCode,
        data: queryArticle
      });
    } catch (err) {
      return res.send(err);
    }
  }
};

export default articles;
