import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate';
import { authenticateToken } from '../middleware/auth';
import {
  createCronJob,
  getCronJobs,
  getCronJob,
  updateCronJob,
  deleteCronJob,
  getCronJobHistory
} from '../controllers/cronJobs';

const router = Router();

router.use(authenticateToken);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('triggerUrl').isURL().withMessage('Valid trigger URL is required'),
    body('apiKey').notEmpty().withMessage('API key is required'),
    body('schedule').notEmpty().withMessage('Schedule is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required')
  ],
  validateRequest,
  createCronJob
);

router.get('/', getCronJobs);
router.get('/:id', getCronJob);
router.get('/:id/history', getCronJobHistory);

router.patch(
  '/:id',
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('triggerUrl').optional().isURL().withMessage('Valid trigger URL is required'),
    body('apiKey').optional().notEmpty().withMessage('API key cannot be empty'),
    body('schedule').optional().notEmpty().withMessage('Schedule cannot be empty'),
    body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
  ],
  validateRequest,
  updateCronJob
);

router.delete('/:id', deleteCronJob);

export { router as cronJobsRouter };