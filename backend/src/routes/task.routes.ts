import { Router } from 'express';
import { authenticateToken, requireParent } from '../middleware/auth';
import {
  createTask,
  getTasks,
  getTaskById,
  completeTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', requireParent, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/:id/complete', completeTask);
router.put('/:id', requireParent, updateTask);
router.delete('/:id', requireParent, deleteTask);

export default router;
