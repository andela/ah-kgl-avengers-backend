import dataGenerator from '../tests/dataGenerator';

export default {
  up: (queryInterface, Sequelize) => queryInterface
    .bulkInsert(
      'articles',
      [
        dataGenerator.post1,
        dataGenerator.post2,
        dataGenerator.post3,
        dataGenerator.post4,
        dataGenerator.post5,
        dataGenerator.post6,
        dataGenerator.postUpdate,
        dataGenerator.postDislike,
        dataGenerator.newFavorite,
        dataGenerator.articleToBeDeleted,
      ],
      {},
      {}
    )
    .then(() => queryInterface.bulkInsert('Comments', [
      dataGenerator.comment1,
      dataGenerator.comment2,
      dataGenerator.comment3,
      dataGenerator.comment4,
      dataGenerator.comment5
    ]))
    .then(() => queryInterface.bulkInsert('replies', [
      dataGenerator.reply1,
      dataGenerator.reply2,
    ])),

  down: queryInterface => queryInterface
    .bulkDelete('articles', null, {})
    .then(() => queryInterface.bulkDelete('Comments', null, {}))
};
