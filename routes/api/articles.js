import express from 'express';
import articlesController from '../../controllers/articles';
import validation from '../../middlewares/articleValidation';
import checkToken from '../../middlewares/passportCustom';
import commentController from '../../controllers/comments';

const router = express.Router();

router.get('/articles/feeds', checkToken(), articlesController.getFeeds);

// selects all articles
router.get('/articles/', checkToken(), articlesController.getAllPublishedArticles);

router.get('/articles/draft', checkToken(), articlesController.getAllDraftArticles);

// Create articles
router.post('/articles', checkToken(), validation.article, articlesController.createArticle);

// Deletes a single article based on the slug
router.delete('/articles/:slug', checkToken(), validation.slug, articlesController.deleteArticle);

// Edits an article based on a slug
router.put('/articles/:slug', checkToken(), validation.article, articlesController.updateArticle);

// selects an article based on a slug
router.get('/articles/:slug', checkToken(), validation.slug, articlesController.viewArticle);

// add a comment on article
router.post('/articles/:slug/comments', checkToken(), commentController.create);

// get articles comments
router.get('/articles/:slug/comments', commentController.get);

// delete a comment
router.delete('/articles/:slug/comments/:id', checkToken(), commentController.delete);

// Rate an  article
router.post(
  '/articles/:slug',
  checkToken(),
  validation.rating,
  articlesController.rateArticle
);

// Rate an  article
router.post(
  '/articles/:slug',
  checkToken(),
  validation.rating,
  articlesController.rateArticle
);

// Create a bookmark based on the article id
router.post(
  '/bookmarks/:slug',
  checkToken(),
  validation.slug,
  articlesController.createBookmark
);

router.get(
  '/bookmarks',
  checkToken(),
  articlesController.getAllBookmarks
);

router.get(
  '/bookmarks/:slug',
  checkToken(),
  validation.slug,
  articlesController.getBookmarkedArticle
);

router.delete(
  '/bookmarks/:slug',
  checkToken(),
  validation.slug,
  articlesController.deleteBookmark
);
export default router;
