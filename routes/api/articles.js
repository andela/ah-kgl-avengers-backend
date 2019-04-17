import express from 'express';
import articlesController from '../../controllers/articles';

const router = express.Router();

router.post('/articles', articlesController.createAnArticle);

export default router;
