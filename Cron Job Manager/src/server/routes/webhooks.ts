import { Router } from 'express';
import { createWebhook, getWebhooks } from '../controllers/webhooks';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/:cronJobId', authenticateToken, createWebhook);
router.get('/', authenticateToken, getWebhooks);

export { router as webhooksRouter };