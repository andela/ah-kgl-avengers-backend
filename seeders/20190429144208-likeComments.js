import moment from 'moment';

const createdAt = moment('2018-01-07').format();
const updatedAt = createdAt;

export default {
  up: queryInterface => queryInterface.bulkInsert(
    'likeComments',
    [
      {
        id: 'c90dee64-663d-4d8b-b34d-12acba22cd40',
        userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
        commentId: '18e1bbf9-e707-4925-a992-c59f1fc748aa',
        status: '',
        createdAt,
        updatedAt
      },
      {
        id: 'c90dee64-663d-4d8b-b34d-12acba22cd41',
        userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
        commentId: '18e1bbf9-e707-4925-a992-c59f1fc748aa',
        status: 'liked',
        createdAt,
        updatedAt
      }
    ],
    {}
  ),

  down: queryInterface => queryInterface.bulkDelete('likeComments', null, {})
};
