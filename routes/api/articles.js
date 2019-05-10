import express from 'express';
import articlesController from '../../controllers/articles';
import validation from '../../middlewares/articleValidation';
import tokenChecker from '../../middlewares/passportCustom';
import commentController from '../../controllers/comments';
import commentText from '../../controllers/commentText';

const router = express.Router();
const { checkToken, verifyToken } = tokenChecker;

router.get('/articles/feeds', verifyToken, articlesController.getFeeds);

// selects all articles
// TODO: no authentication required
router.get('/articles/', checkToken, articlesController.getAllPublishedArticles);

router.get('/articles/draft', checkToken, articlesController.getAllDraftArticles);

// Create articles
router.post('/articles', checkToken, validation.article, articlesController.createArticle);

// Deletes a single article based on the slug
router.delete('/articles/:slug', checkToken, validation.slug, articlesController.deleteArticle);

// Edits an article based on a slug
router.put('/articles/:slug', checkToken, validation.article, articlesController.updateArticle);

// selects an article based on a slug
router.get('/articles/:slug', checkToken, validation.slug, articlesController.viewArticle);

// add a comment on article
router.post('/articles/:slug/comments', checkToken, commentController.create);

// get articles comments
router.get('/articles/:slug/comments', commentController.get);

// delete a comment
router.delete('/articles/:slug/comments/:id', checkToken, commentController.delete);

// comment on highlighted text
router.post('/articles/:slug/text-comment', checkToken, commentText.createTextComment);

// comment on highlighted text
router.put('/articles/text-comment/:commentId', checkToken, commentText.updateComment);

// get highlighted texts on the article
router.get('/articles/:slug/text-comment', checkToken, commentText.getHighlighted);

// Rate an  article
router.post(
  '/articles/:slug/ratings',
  checkToken,
  validation.rating,
  articlesController.rateArticle
);

// Get article ratings
router.get('/articles/:slug/ratings', articlesController.getArticleRatings);

// Create a bookmark based on the article id
router.post('/bookmarks/:slug', checkToken, validation.slug, articlesController.createBookmark);

router.get('/bookmarks', checkToken, articlesController.getAllBookmarks);

router.get(
  '/bookmarks/:slug',
  checkToken,
  validation.slug,
  articlesController.getBookmarkedArticle
);

router.delete('/bookmarks/:slug', checkToken, validation.slug, articlesController.deleteBookmark);

// Share an article
router.get('/articles/:slug/facebook-share', validation.validArticle, articlesController.fbShare);

router.get(
  '/articles/:slug/twitter-share',
  validation.validArticle,
  articlesController.twitterShare
);

router.get('/articles/:slug/email-share', validation.validArticle, articlesController.emailShare);
export default router;
