// import uuid from 'uuid';
import crypto from 'crypto';

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
    id: 'f36e2ee8-e206-4ccb-a6ec-dd752ea45ec3',
    title: 'the complete junior to senior web',
    body:
      'In order to keep up with the industry, your best bet is to be efficient and be wise about what you spend time on because it is impossible to learn and know everything.',
    author: 'acb2f760-aa40-4983-a664-31c520eb656f',
    slug: 'the-complete-junior-81234',
    description: 'In order to keep up with the industry, your best bet is to be efficient',
    status: 'published',
    deleted: 0,
    tagList: JSON.stringify(['developer'])
  },
  // post2 published
  post2: {
    id: '0bdbf765-3dcb-4d39-8fd6-f268d9fdebab',
    title: 'Lorem ipsum dolor sit',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    author: 'acb2f760-aa40-4983-a664-31c520eb656f',
    slug: 'lorem-ipsum-dolor-sit-45033',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
    status: 'published',
    deleted: 0,
    tagList: JSON.stringify(['lorem'])
  },
  // post3 drafted
  post3: {
    id: '6e7a2d6c-4118-4f17-868e-8669320466df',
    title: 'Duis aute irure dolor',
    body:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    author: 'acb2f760-aa40-4983-a664-31c520eb656f',
    slug: 'duis-aute-irure-dolor-fre453972',
    description: 'Duis aute irure dolor in reprehenderit',
    deleted: 0,
    status: 'published',
    tagList: JSON.stringify([])
  },
  // post4 to update
  post4: {
    id: 'fd3bc6a5-74d4-4121-92be-72f7829b62b3',
    title: 'the complete junior to senior web guide',
    body:
      'In order to keep up with the industry, your best bet is to be efficient and be wise about what you spend time on because it is impossible to learn and know everything.',
    author: 'acb2f760-aa40-4983-a664-31c520eb656f',
    slug: 'the-complete-junior-guide-81204',
    description: 'In order to keep up with the industry, your best bet is to be efficient',
    status: 'published',
    deleted: 0,
    tagList: JSON.stringify(['developer'])
  },
  // post5 to delete
  post5: {
    id: '622119ea-f74b-440c-b633-917ac5946dc9',
    title: 'Excepteur sint occaecat cupidatat',
    body:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    author: 'acb2f760-aa40-4983-a664-31c520eb656f',
    slug: 'excepteur-sint-occaecat-cupidat-356d344',
    description: 'Excepteur sint occaecat cupidatat non proident',
    deleted: 0,
    status: 'published',
    tagList: JSON.stringify(['uncommon'])
  },
  // comment1 to published story
  comment1: {
    id: '3797fca1-95fc-49fe-af38-787e880ca1d3',
    body: 'Thanks fo the article, its a great article',
    author: 'acb2f760-aa40-4983-a664-31c520eb656f',
    post: 'f36e2ee8-e206-4ccb-a6ec-dd752ea45ec3'
  },
  // comment2 to published story
  comment2: {
    id: '18e1bbf9-e707-4925-a992-c59f1fc748aa',
    body: 'Hey tester, I want to know how you do tests?',
    author: 'acb2f760-aa40-4983-a664-31c520eb656f',
    post: 'f36e2ee8-e206-4ccb-a6ec-dd752ea45ec3'
  },

  // comment3 to delete
  comment3: {
    id: '2f0bab3d-54f0-41bb-b20e-b3456b28342f',
    body: 'It can take another post, I will work on it',
    author: 'acb2f760-aa40-4983-a664-31c520eb656f',
    post: 'f36e2ee8-e206-4ccb-a6ec-dd752ea45ec3'
  }
};
