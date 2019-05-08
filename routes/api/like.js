import express from 'express';
import likesControllers from '../../controllers/likes';
import tokenChecker from '../../middlewares/passportCustom';
import likeComments from '../../controllers/likeComments';

const router = express.Router({});
const { checkToken } = tokenChecker;

// Routes about like and favorite the articles

router.post('/articles/:slug/like', checkToken, likesControllers.likeArticle);
router.delete('/articles/:slug/dislike', checkToken, likesControllers.dislikeArticle);
router.post('/articles/:slug/favorite', checkToken, likesControllers.addFavorite);
router.get('/users/favorite', checkToken, likesControllers.getFavorites);

// Route about like the comment

router.post('/articles/comments/:commentId/like', checkToken, likeComments.likeComment);
export default router;
