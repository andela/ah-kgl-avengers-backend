import express from 'express';
import userRouter from './users';
import articleRouter from './articles';
import likesRoutes from './like';
import reportRoutes from './reports';
import searchRoute from './search';
import unsubscribe from './unsubscribe';
import statsRoutes from './statistics';

const router = express.Router();

router.use('/', userRouter);
router.use('/', articleRouter);
router.use('/', likesRoutes);
router.use('/', reportRoutes);
router.use('/', searchRoute);
router.use('/', unsubscribe);
router.use('/', statsRoutes);

router.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }

  return next(err);
});

export default router;
