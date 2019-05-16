import models from '../models';

const { Op } = models.Sequelize;
const { subscribers } = models;

const subscribe = async (userId, subscribeTo) => {
  const getSubscriber = await subscribers.findOne({
    where: {
      [Op.or]: [{ articleId: subscribeTo }, { authorId: subscribeTo }]
    },
    attributes: { subscribers }
  });

  if (!getSubscriber.subscribers.includes(userId)) {
    const newSubscribers = getSubscriber.subscribers.concat([userId]);
    await subscribers.update(
      {
        subscribers: newSubscribers
      },
      {
        where: {
          [Op.or]: [{ articleId: subscribeTo }, { authorId: subscribeTo }]
        }
      }
    );
  } else {
    const newSubscribers = getSubscriber.subscribers.filter(id => userId !== id);
    await subscribers.update(
      {
        subscribers: newSubscribers
      },
      {
        where: {
          [Op.or]: [{ articleId: subscribeTo }, { authorId: subscribeTo }]
        }
      }
    );
  }
};
export default subscribe;
