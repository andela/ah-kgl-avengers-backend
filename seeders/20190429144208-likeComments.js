import moment from 'moment';

const createdAt = moment('2018-01-07').format();
const updatedAt = createdAt;

export default {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('likeComments', [
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd40',
      userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd30',
      commentId: '3797fca1-95fc-49fe-af38-787e880ca1d3',
      status: '',
      createdAt,
      updatedAt
    },
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd41',
      userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd31',
      commentId: '3797fca1-95fc-49fe-af38-787e880ca1d3',
      status: 'liked',
      createdAt,
      updatedAt
    }],
  {}),

  down: queryInterface => queryInterface.bulkDelete('likeComments', null, {}),
};
