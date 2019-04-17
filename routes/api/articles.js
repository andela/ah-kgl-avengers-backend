import express from 'express';
import articlesController from '../../controllers/articles';
import validation from '../../middlewares/articleValidation';

const router = express.Router();

router.get('/article/feeds', articlesController.getFeeds);
router.get('/articles', articlesController.getAllPublished);
router.get('/articles/draft', articlesController.getAllDraft);
router.post('/articles', validation.article, articlesController.createAnArticle);
router.put('/articles/:slug', validation.slug, articlesController.deleteArticle);

export default router;
