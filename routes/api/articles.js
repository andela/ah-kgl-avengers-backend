import express from 'express';
import articlesController from '../../controllers/articles';
import validation from '../../middlewares/articleValidation';

const router = express.Router();

router.get('/article/feeds', articlesController.getFeeds);
router.get('/articles', articlesController.getAllPublished);
router.get('/articles/draft', articlesController.getAllDraft);
router.post('/articles', validation.article, articlesController.createAnArticle);
router.delete('/articles/:slug', validation.slug, articlesController.deleteArticle);
router.put('/articles/:slug', validation.article, articlesController.updateAnArticle);
router.get('/articles/:slug', validation.slug, articlesController.viewAnArticle);

export default router;
