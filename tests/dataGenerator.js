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
    id: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    username: 'tester1',
    salt,
    hash,
    email: 'tester1@test.com',
    role: 'user',
    activated: 1,
    following: JSON.stringify({
      ids: []
    }),
    followers: JSON.stringify({
      ids: []
    })
  },

  // user2
  user2: {
    id: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa74',
    username: 'tester2',
    salt,
    hash,
    email: 'tester2@test.com',
    role: 'user',
    activated: 1,
    following: JSON.stringify({
      ids: []
    }),
    followers: JSON.stringify({
      ids: []
    })
  },

  // user3
  user3: {
    id: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa75',
    username: 'tester3',
    salt,
    hash,
    email: 'tester3@test.com',
    role: 'super-admin',
    activated: 1,
    following: JSON.stringify({
      ids: []
    }),
    followers: JSON.stringify({
      ids: []
    })
  },

  // user4
  user4: {
    id: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa76',
    username: 'tester4',
    salt,
    hash,
    email: 'tester4@test.com',
    role: 'admin',
    activated: 1,
    following: JSON.stringify({
      ids: []
    }),
    followers: JSON.stringify({
      ids: []
    })
  },

  // user5
  user5: {
    id: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa77',
    username: 'tester5',
    salt,
    hash,
    email: 'tester5@test.com',
    activated: 1,
    role: 'admin',
    following: JSON.stringify({ ids: [] }),
    followers: JSON.stringify({ ids: [] })
  },

  // user6
  user6: {
    id: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa88',
    username: 'tester6',
    salt,
    hash,
    email: 'tester6@test.com',
    activated: 0,
    role: 'user',
    following: JSON.stringify({ ids: [] }),
    followers: JSON.stringify({ ids: [] })
  },
  user7: {
    id: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa89',
    username: 'tester7',
    salt,
    hash,
    email: 'tester6@test.com',
    activated: 1,
    role: 'user',
    following: JSON.stringify({ ids: [] }),
    followers: JSON.stringify({ ids: [] })
  },
  invalidUsername: {
    username: 'test'
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
    featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg)',
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
    featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg',
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
    status: 'draft',
    tagList: JSON.stringify(['lorem']),
    featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg',
    deleted: 0,
    createdAt,
    updatedAt
  },
  // post4 to rate
  post4: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd33',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa74',
    title: 'this is my second disliked article',
    slug: 'this-is-my-second-disliked-article69f9fccd65',
    description: 'second disliked article',
    body:
      'Lorem ipsum dolor sit amet,consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
    status: 'published',
    tagList: JSON.stringify(['lorem']),
    featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg',
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
    featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg',
    deleted: 0,
    createdAt,
    updatedAt
  },
  // Post Dislike
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
    featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg',
    deleted: 0,
    createdAt,
    updatedAt
  },
  // Post to update
  postUpdate: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd38',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    title: 'this is my second favorite article',
    slug: 'this-is-my-second-favorite-article69f9fccd66',
    description: 'second disliked article',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
    status: 'published',
    tagList: JSON.stringify(['lorem']),
    featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg',
    deleted: 0,
    createdAt,
    updatedAt
  },
  // Post to dislike
  postDislike: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd39',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    title: 'this is my second favorite article',
    slug: 'this-is-my-second-favorite-article69f9fccd67',
    description: 'second disliked article',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
    status: 'published',
    tagList: JSON.stringify(['lorem']),
    featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg',
    deleted: 0,
    createdAt,
    updatedAt
  },
  // Favorite new Article
  newFavorite: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd40',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    title: 'this is my second favorite article',
    slug: 'this-is-my-second-favorite-article69f9fccd68',
    description: 'second disliked article',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
    status: 'published',
    tagList: JSON.stringify(['lorem']),
    featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg',
    deleted: 0,
    createdAt,
    updatedAt
  },
  // Article to be deleted
  articleToBeDeleted: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd41',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    title: 'this is my second favorite article',
    slug: 'this-is-my-second-favorite-article69f9fccd69',
    description: 'second disliked article',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
    status: 'published',
    tagList: JSON.stringify(['lorem']),
    featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg',
    deleted: 0,
    createdAt,
    updatedAt
  },
  // 1 Min read article
  post7: {
    title: 'this is my second favorite article',
    body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'`,
    status: 'published',
    featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg'
  },
  // More than 1 Min read article
  post8: {
    title: 'this is my second favorite article',
    body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.'`,
    status: 'published',
    featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg'
  },
  testPostWithStatus: {
    title: 'Myfavorite article',
    body:
      'Lorem m ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus ipsum non metus finibus ultricies. Donec ac auctor dui, sed fringilla est. Duis et pellentesque nisl, a gravida felis. Ut tempor felis id dignissim congue. Nunc blandit nunc sit amet dui pharetra, quis porttitor sem ullamcorper. Suspendisse faucibus imperdiet lacinia.',
    status: 'draft',
    tagList: JSON.stringify(['lorem']),
    featuredImage: 'https://image.shutterstock.com/image-photo/group-people-260nw-602783837.jpg'
  },

  invalidSlug: {
    slug: 'this-is-my-second-favorite-article69f9fcxhdkd'
  },
  // comment1 to published story
  comment1: {
    id: '3797fca1-95fc-49fe-af38-787e880ca1d3',
    body: 'Thanks fo the article, its a great article',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    post: 'c90dee64-663d-4d8b-b34d-12acba22cd30',
    status: 'show',
    createdAt,
    updatedAt
  },
  // comment2 to published story
  comment2: {
    id: '18e1bbf9-e707-4925-a992-c59f1fc748aa',
    body: 'Hey tester, I want to know how you do tests?',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    post: 'c90dee64-663d-4d8b-b34d-12acba22cd30',
    status: 'show',
    createdAt,
    updatedAt
  },

  // comment3 to delete
  comment3: {
    id: '2f0bab3d-54f0-41bb-b20e-b3456b28342f',
    body: 'It can take another post, I will work on it',
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    post: 'c90dee64-663d-4d8b-b34d-12acba22cd30',
    status: 'show',
    createdAt,
    updatedAt
  },

  // comment4 with highlight text
  comment4: {
    id: '2f0bab3d-54f0-41bb-b20e-b3456b28343f',
    body: 'It can take another post, I will work on it',
    highlightedText: 'met, consectetur adipiscing elit. Nulla faucibus ipsum no',
    startIndex: 23,
    endIndex: 80,
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    post: 'c90dee64-663d-4d8b-b34d-12acba22cd30',
    status: 'show',
    createdAt,
    updatedAt
  },

  // comment5 with highlight text
  comment5: {
    id: '2f0bab3d-54f0-41bb-b20e-b3456b28345f',
    body: 'It can take another post, I will work on it',
    highlightedText: 'met, consectetur adipiscing elit. Nulla faucibus ipsum no',
    startIndex: 23,
    endIndex: 80,
    author: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa74',
    post: 'c90dee64-663d-4d8b-b34d-12acba22cd30',
    status: 'show',
    createdAt,
    updatedAt
  },

  // Search by author
  searchByAuthor: {
    username: 'tester1',
    createdAt,
    updatedAt
  },

  // Search by title
  searchByTitle: {
    title: 'this is my second favorite article',
    createdAt,
    updatedAt
  },

  // Search by title
  searchByAuthorAndTitle: {
    title: 'this is my second favorite article',
    username: 'tester1',
    createdAt,
    updatedAt
  },

  // Search by title
  searchByWrongAuthor: {
    username: 'aaron',
    createdAt,
    updatedAt
  },

  like1: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd33',
    userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd30',
    status: '',
    favorited: true,
    createdAt,
    updatedAt
  },
  like2: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd34',
    userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd31',
    status: 'liked',
    favorited: true,
    createdAt,
    updatedAt
  },
  like3: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd35',
    userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd32',
    status: '',
    favorited: true,
    createdAt,
    updatedAt
  },
  like4: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd36',
    userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd33',
    status: 'disliked',
    favorited: true,
    createdAt,
    updatedAt
  },
  like5: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd37',
    userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd34',
    status: '',
    favorited: null,
    createdAt,
    updatedAt
  },
  like6: {
    id: 'c90dee64-663d-4d8b-b34d-12acba22cd38',
    userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    articleId: 'c90dee64-663d-4d8b-b34d-12acba22cd35',
    status: '',
    favorited: true,
    createdAt,
    updatedAt
  },

  // comment4 with highlight text
  reply1: {
    id: '2f0bab3d-54f0-41bb-b20e-b3456b28346f',
    reply: 'It can take another post, I will work on it',
    userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    commentId: '18e1bbf9-e707-4925-a992-c59f1fc748aa',
    status: 'show',
    createdAt,
    updatedAt
  },

  reply2: {
    id: '2f0bab3d-54f0-41bb-b20e-b3456b28342f',
    reply: 'It can take another post',
    userId: 'dfef16f9-11a7-4eae-9ba0-7038c6ccaa73',
    commentId: '18e1bbf9-e707-4925-a992-c59f1fc748aa',
    status: 'show',
    createdAt,
    updatedAt
  }
};
