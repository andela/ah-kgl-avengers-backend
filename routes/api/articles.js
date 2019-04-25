import express from 'express';
import articlesController from '../../controllers/articles';
import validation from '../../middlewares/articleValidation';
import checkToken from '../../middlewares/passportCustom';

const router = express.Router();


router.get(
  '/article/feeds',
  checkToken(),
  articlesController.getFeeds
);

// selects all articles
router.get(
  '/articles',
  checkToken(),
  articlesController.getAllPublishedArticles
);

router.get(
  '/articles/draft',
  checkToken(),
  articlesController.getAllDraftArticles
);

// Create articles
router.post(
  '/articles',
  checkToken(),
  validation.article,
  articlesController.createArticle
);

// Deletes a single article based on the slug
router.delete(
  '/articles/:slug',
  checkToken(),
  validation.slug,
  articlesController.deleteArticle
);

// Edits an article based on a slug
router.put(
  '/articles/:slug',
  checkToken(),
  validation.article,
  articlesController.updateArticle
);

// selects an article based on a slug
router.get(
  '/articles/:slug',
  checkToken(),
  validation.slug,
  articlesController.viewArticle
);

// Rate an  article
router.post(
  '/articles/:slug',
  checkToken(),
  validation.rating,
  articlesController.rateArticle
);

export default router;
