import express from 'express';
import tokenChecker from '../../middlewares/passportCustom';
import unsubscribe from '../../controllers/unsubscribe';

const router = express.Router();
const { checkToken } = tokenChecker;

router.get('/unsubscribe/:slugOrUsername', checkToken, unsubscribe.unsubscribe);

export default router;
