import express from 'express';
import searchController from '../../controllers/search';

const router = express.Router();

/**
 * URL      : /api/v1/search/articles
 * Method   : GET.
 * Header   : Authorization Bearer <token>
 *
 * any user can search for an article.
 */
router.get(
  '/search/articles',
  searchController.searchByAuthor
);

export default router;
