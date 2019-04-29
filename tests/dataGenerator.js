// import uuid from 'uuid';
import crypto from 'crypto';
import moment from 'moment';

const createdAt = moment('2018-01-07').format();
const updatedAt = createdAt;

const salt = crypto.randomBytes(16).toString('hex');
const password = 'testuser';
const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

export default {
  // user1 author
  user1: {
    id: 'acb2f760-aa40-4983-a664-31c520eb656f',
    username: 'tester1',
    salt,
    hash,
    email: 'tester1@test.com',
    activated: 1,
    following: JSON.stringify({ ids: [] }),
    followers: JSON.stringify({ ids: [] })
  },
  // user2 to be followed
  user2: {
    id: '5a53493e-85b7-4957-9949-0703c1f096d5',
    username: 'tester2',
    salt,
    hash,
    email: 'tester2@test.com',
    activated: 1,
    following: JSON.stringify({ ids: [] }),
    followers: JSON.stringify({ ids: [] })
  },
  // user3 to be un-followed
  user3: {
    id: '7ab265ea-a6b1-49d7-91f1-69afe8ed049b',
    username: 'tester3',
    salt,
    hash,
    email: 'tester3@test.com',
    activated: 1,
    following: JSON.stringify({ ids: [] }),
    followers: JSON.stringify({ ids: [] })
  },
  // post1 published
  post1: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd30',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    title: 'this is my first try of article',
    slug: 'this-is-my-first-try-of-article69f9fccd65',
    description: 'new article',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
    status: 'published',
    tagList: JSON.stringify(['lorem']),
    deleted: 0,
    createdAt,
    updatedAt
  },
  // post2 published
  post2: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd31',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    title: 'this is my second try of article',
    slug: 'this-is-my-second-try-of-article69f9fccd65',
    description: 'second article',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
    status: 'published',
    tagList: JSON.stringify(['lorem']),
    deleted: 0,
    createdAt,
    updatedAt
  },
  // post3 drafted
  post3: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd32',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    title: 'this is my first disliked article',
    slug: 'this-is-my-first-disliked-article69f9fccd65',
    description: 'first disliked article',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
    status: 'published',
    tagList: JSON.stringify(['lorem']),
    deleted: 0,
    createdAt,
    updatedAt
  },
  // post4 to update
  post4: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd33',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    title: 'this is my second disliked article',
    slug: 'this-is-my-second-disliked-article69f9fccd65',
    description: 'second disliked article',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
    status: 'published',
    tagList: JSON.stringify(['lorem']),
    deleted: 0,
    createdAt,
    updatedAt
  },
  // post5 to delete
  post5: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd34',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    title: 'this is my first favorite article',
    slug: 'this-is-my-first-favorite-article69f9fccd65',
    description: 'second disliked article',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
    status: 'published',
    tagList: JSON.stringify(['lorem']),
    deleted: 0,
    createdAt,
    updatedAt
  },
  post6: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd35',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    title: 'this is my second favorite article',
    slug: 'this-is-my-second-favorite-article69f9fccd65',
    description: 'second disliked article',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
    status: 'published',
    tagList: JSON.stringify(['lorem']),
    deleted: 0,
    createdAt,
    updatedAt
  },
  // comment1 to published story
  comment1: {
    id: '3797fca1-95fc-49fe-af38-787e880ca1d3',
    body: 'Thanks fo the article, its a great article',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    post: 'c90dee64-663d-4d8b-b34d-12acba22cd30',
    createdAt,
    updatedAt
  },
  // comment2 to published story
  comment2: {
    id: '18e1bbf9-e707-4925-a992-c59f1fc748aa',
    body: 'Hey tester, I want to know how you do tests?',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    post: 'c90dee64-663d-4d8b-b34d-12acba22cd30',
    createdAt,
    updatedAt
  },

  // comment3 to delete
  comment3: {
    id: '2f0bab3d-54f0-41bb-b20e-b3456b28342f',
    body: 'It can take another post, I will work on it',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    post: 'c90dee64-663d-4d8b-b34d-12acba22cd30',
    createdAt,
    updatedAt
  }
};
