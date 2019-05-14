import express from 'express';
import statsController from '../../controllers/statistics';
import tokenChecker from '../../middlewares/passportCustom';

const router = express.Router();
const { checkToken } = tokenChecker;

router.post('/stats/articles', checkToken, statsController.createStats);
router.get('/stats/articles', checkToken, statsController.getAverageStats);
router.get('/stats/', checkToken, statsController.getSingleStats);

export default router;
