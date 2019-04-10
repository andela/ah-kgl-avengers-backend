import express from 'express';
import userController from '../../controllers/user';
import userValidations from '../../middlewares/userValidation';

const router = express.Router();

router.post('/auth/signup', userValidations.signup, userController.create);

router.post('/auth/logout', userController.logout);

export default router;
