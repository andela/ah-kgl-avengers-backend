import dataGenerator from '../tests/dataGenerator';

export default {
  up: queryInterface => queryInterface.bulkInsert('likes', [
    dataGenerator.like1,
    dataGenerator.like2,
    dataGenerator.like3,
    dataGenerator.like4,
    dataGenerator.like5,
    dataGenerator.like6,
  ],
  {}),

  down: queryInterface => queryInterface.bulkDelete('likes', null, {}),
};
