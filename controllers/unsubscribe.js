import models from '../models/index';
import subscribe from '../helpers/subscribe';

const { User, article, subscribers } = models;
const { Op } = models.Sequelize;

const unsubscribe = {
  unsubscribe: async (req, res) => {
    const { slugOrUsername } = req.params;
    const { id: userId } = req.user;
    const user = await User.findOne({
      where: { username: slugOrUsername }
    });
    const subscribedArticle = await article.findOne({
      where: { slug: slugOrUsername }
    });
    if (!user && !subscribedArticle) {
      return res.status(404).send({
        status: res.statusCode,
        message: 'Resource not found'
      });
    }
    try {
      const id = subscribedArticle ? subscribedArticle.id : user.id;

      const subscriber = await subscribers.findOne({
        where: {
          [Op.or]: [{ authorId: id }, { articleId: id }]
        },
        attribute: { subscribers }
      });

      if (!subscriber || !subscriber.subscribers.includes(userId)) {
        return res.status(400).send({
          status: res.statusCode,
          message: 'You are not a subscriber'
        });
      }
      subscribe(userId, id);
      return res.status(200).send({
        status: res.statusCode,
        message: 'Successfully unsubscribed'
      });
    } catch (er) {
      return res.status(500).send({
        status: res.statusCode,
        message: er.message
      });
    }
  }
};

export default unsubscribe;
