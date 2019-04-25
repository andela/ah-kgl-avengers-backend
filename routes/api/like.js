import express from 'express';
import passport from 'passport';
import likesControllers from '../../controllers/likes';
import checkToken from '../../middlewares/passportCustom';

const router = express.Router({});

router.post('/articles/:slug/like', checkToken(), likesControllers.likeArticle);
router.delete('/articles/:slug/dislike', checkToken(), likesControllers.dislikeArticle);
router.post('/articles/:slug/favorite', checkToken(), likesControllers.addFavorite);
router.get('/users/favorite', checkToken(), likesControllers.getFavorites);

export default router;
