import { Router } from 'express';
import { authenticateToken, requireParent } from '../middleware/auth';
import {
  getPets,
  createPet,
  tamePet,
  getUserPets
} from '../controllers/pet.controller';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getPets);
router.post('/', requireParent, createPet);
router.post('/tame', tamePet);
router.get('/my-pets', getUserPets);

export default router;
