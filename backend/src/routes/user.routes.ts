import { Router } from 'express';
import { authenticateToken, requireParent } from '../middleware/auth';
import {
  getProfile,
  getUsers,
  getUserById
} from '../controllers/user.controller';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/profile', getProfile);
router.get('/', requireParent, getUsers);
router.get('/:id', getUserById);

export default router;
