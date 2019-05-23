import express from 'express';
import articlesController from '../../controllers/articles';
import validation from '../../middlewares/articleValidation';
import tokenChecker from '../../middlewares/passportCustom';
import commentController from '../../controllers/comments';
import replComment from '../../controllers/reply';

const router = express.Router();
const { checkToken, verifyToken } = tokenChecker;

router.get('/articles/feeds', verifyToken, articlesController.getFeeds);

router.get('/user/:username/articles', verifyToken, articlesController.authorArticles);

router.get('/articles/tags', articlesController.getAllTags);

router.get('/articles/tags/:tag', articlesController.getTags);
// selects all articles
router.get('/articles', checkToken, articlesController.getAllPublishedArticles);

router.get('/articles/draft', checkToken, articlesController.getAllDraftArticles);

router.get('/articles/draft/:slug', checkToken, articlesController.getSingleDraftArticle);

// Create articles
router.post('/articles', checkToken, validation.article, articlesController.createArticle);

// Deletes a single article based on the slug
router.delete('/articles/:slug', checkToken, validation.slug, articlesController.deleteArticle);

// Edits an article based on a slug
router.put('/articles/:slug', checkToken, validation.article, articlesController.updateArticle);

// selects an article based on a slug
router.get('/articles/:slug', validation.slug, verifyToken, articlesController.viewArticle);

// add a comment on article
router.post('/articles/:slug/comments', checkToken, commentController.create);

// get all article's comments
router.get('/articles/:slug/comments', commentController.get);

// update a comment
router.put('/articles/:slug/comments/:commentId', checkToken, commentController.update);

// delete a comment
router.delete('/articles/:slug/comments/:id', checkToken, commentController.delete);

// get highlighted texts on the article
router.get('/articles/:slug/commented-text', checkToken, commentController.getHighlighted);

// reply to the comment
router.post('/comment/:commentId', checkToken, replComment.createReply);

// update the reply to the comment
router.put('/comment/:replyId/update', checkToken, replComment.editReply);

// delete the reply to the comment
router.delete('/comment/:replyId/delete', checkToken, replComment.deleteCommentReply);

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

router.delete('/bookmarks/:slug', checkToken, validation.slug, articlesController.deleteBookmark);

// Share an article
router.get(
  '/articles/:slug/facebook-share',
  checkToken,
  validation.validArticle,
  articlesController.fbShare
);

router.get(
  '/articles/:slug/twitter-share',
  checkToken,
  validation.validArticle,
  articlesController.twitterShare
);

router.get(
  '/articles/:slug/email-share',
  checkToken,
  validation.validArticle,
  articlesController.emailShare
);

export default router;
