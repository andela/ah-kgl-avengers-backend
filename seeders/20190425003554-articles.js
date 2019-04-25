import moment from 'moment';

const createdAt = moment('2018-01-07').format();
const updatedAt = createdAt;

const tagList = JSON.stringify(['dumy']);
export default {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('articles', [
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd30',
      author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      title: 'this is my first try of article',
      slug: 'this-is-my-first-try-of-article69f9fccd65',
      description: 'new article',
      body:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
      status: 'Published',
      tagList,
      deleted: 0,
      createdAt,
      updatedAt
    },
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd31',
      author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      title: 'this is my second try of article',
      slug: 'this-is-my-second-try-of-article69f9fccd65',
      description: 'second article',
      body:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
      status: 'Published',
      tagList,
      deleted: 0,
      createdAt,
      updatedAt
    },
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd32',
      author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      title: 'this is my first disliked article',
      slug: 'this-is-my-first-disliked-article69f9fccd65',
      description: 'first disliked article',
      body:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
      status: 'Published',
      tagList,
      deleted: 0,
      createdAt,
      updatedAt
    },
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd33',
      author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      title: 'this is my second disliked article',
      slug: 'this-is-my-second-disliked-article69f9fccd65',
      description: 'second disliked article',
      body:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
      status: 'Published',
      tagList,
      deleted: 0,
      createdAt,
      updatedAt
    },
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd34',
      author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      title: 'this is my first favorite article',
      slug: 'this-is-my-first-favorite-article69f9fccd65',
      description: 'second disliked article',
      body:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
      status: 'Published',
      tagList,
      deleted: 0,
      createdAt,
      updatedAt
    },
    {
      id: 'c90dee64-663d-4d8b-b34d-12acba22cd35',
      author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
      title: 'this is my second favorite article',
      slug: 'this-is-my-second-favorite-article69f9fccd65',
      description: 'second disliked article',
      body:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
      status: 'Published',
      tagList,
      deleted: 0,
      createdAt,
      updatedAt
    },
  ],
  {}),

  down: queryInterface => queryInterface.bulkDelete('articles', null, {}),
};
