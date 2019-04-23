import express from 'express';
import passport from 'passport';
import articlesController from '../../controllers/articles';
import validation from '../../middlewares/articleValidation';

const router = express.Router();


router.get(
  '/article/feeds',
  passport.authenticate('jwt', { session: false, }),
  articlesController.getFeeds
);

// selects all articles
router.get(
  '/articles',
  passport.authenticate('jwt', { session: false, }),
  articlesController.getAllPublishedArticles
);

router.get(
  '/articles/draft',
  passport.authenticate('jwt', { session: false, }),
  articlesController.getAllDraftArticles
);

// Create articles
router.post(
  '/articles',
  passport.authenticate('jwt', { session: false, }),
  validation.article,
  articlesController.createArticle
);

// Deletes a single article based on the slug
router.delete(
  '/articles/:slug',
  passport.authenticate('jwt', { session: false, }),
  validation.slug,
  articlesController.deleteArticle
);

// Edits an article based on a slug
router.put(
  '/articles/:slug',
  passport.authenticate('jwt', { session: false, }),
  validation.article,
  articlesController.updateArticle
);

// selects an article based on a slug
router.get(
  '/articles/:slug',
  passport.authenticate('jwt', { session: false, }),
  validation.slug,
  articlesController.viewArticle
);

export default router;
