import express from 'express';
import validation from '../../middlewares/articleValidation';
import checkToken from '../../middlewares/passportCustom';
import reportController from '../../controllers/reports';

const router = express.Router();

/**
 * URL      : /api/v1/report/articles
 * Method   : GET.
 * Header   : Authorization Bearer <token>
 *
 * Only admin will be able to see reported article.
 */
router.get(
  '/report/articles',
  checkToken(),
  reportController.getAllReportedArticle
);

/**
 * URL      : /api/v1/report/article/:slug
 * Method   : POST.
 * Header   : Authorization Bearer <token>
 * Params   : Slug of an article to be reported
 * Body     : { message: <Reason to report an article> }
 *
 * Authenticated user can report an article.
 */
router.post(
  '/report/articles/:slug',
  checkToken(),
  validation.message,
  reportController.reportArticle
);

/**
 * URL      : /api/v1/report/article/:slug
 * Method   : DELETE.
 * Header   : Authorization Bearer <token>
 *
 * Only admin will be able to delete reported article.
 */
router.delete(
  '/report/articles/:slug',
  checkToken(),
  validation.slug,
  reportController.deleteReportedArticle
);

export default router;
