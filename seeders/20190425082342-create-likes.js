import moment from 'moment';

const createdAt = moment('2018-01-07').format();
const updatedAt = createdAt;

export default {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('likes', [
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd33',
      userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd30',
      status: '',
      favorited: true,
      createdAt,
      updatedAt
    },
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd34',
      userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd31',
      status: 'liked',
      favorited: true,
      createdAt,
      updatedAt
    },
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd35',
      userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd32',
      status: '',
      favorited: true,
      createdAt,
      updatedAt
    },
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd36',
      userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd33',
      status: 'disliked',
      favorited: true,
      createdAt,
      updatedAt
    },
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd37',
      userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd34',
      status: '',
      favorited: null,
      createdAt,
      updatedAt
    },
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd38',
      userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd35',
      status: '',
      favorited: true,
      createdAt,
      updatedAt
    }],
  {}),

  down: queryInterface => queryInterface.bulkDelete('likes', null, {}),
};
