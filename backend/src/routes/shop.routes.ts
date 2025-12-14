import { Router } from 'express';
import { authenticateToken, requireParent } from '../middleware/auth';
import {
  getShopItems,
  createShopItem,
  purchaseItem,
  getUserPurchases
} from '../controllers/shop.controller';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/items', getShopItems);
router.post('/items', requireParent, createShopItem);
router.post('/purchase', purchaseItem);
router.get('/purchases', getUserPurchases);

export default router;
