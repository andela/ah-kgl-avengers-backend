import express from 'express';
import controller from '../../controllers/search';

const router = express.Router();

/**
 * URL      : /api/v1/search/articles
 * Method   : POST.
 *          : No Authorization needed.
 *
 * This is a general search endpoint.
 * A user will provide a certain keyword and provide search criteria
 * like tag/author/body/filter
 *
 */
router.get('/search/articles', controller.search);

export default router;
