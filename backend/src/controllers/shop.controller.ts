import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/database';
import { ShopItem, Purchase } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export const getShopItems = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const items = db.getShopItems();
    res.json({ items });
  } catch (error) {
    console.error('Get shop items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createShopItem = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description, cost, category, imageUrl } = req.body;

    if (!name || !cost || !category) {
      res.status(400).json({ error: 'Name, cost, and category are required' });
      return;
    }

    const item: ShopItem = {
      id: uuidv4(),
      name,
      description: description || '',
      cost,
      category,
      imageUrl,
      createdAt: new Date()
    };

    db.createShopItem(item);
    res.status(201).json({ message: 'Shop item created successfully', item });
  } catch (error) {
    console.error('Create shop item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const purchaseItem = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      res.status(400).json({ error: 'Item ID is required' });
      return;
    }

    const item = db.getShopItemById(itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    const user = db.getUserById(req.user!.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.points < item.cost) {
      res.status(400).json({ error: 'Insufficient points' });
      return;
    }

    // Deduct points
    const newPoints = user.points - item.cost;
    db.updateUser(user.id, { points: newPoints });

    // Create purchase record
    const purchase: Purchase = {
      id: uuidv4(),
      userId: user.id,
      itemId: item.id,
      purchasedAt: new Date()
    };
    db.createPurchase(purchase);

    res.json({
      message: 'Item purchased successfully',
      purchase,
      remainingPoints: newPoints
    });
  } catch (error) {
    console.error('Purchase item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserPurchases = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const purchases = db.getPurchasesByUserId(req.user!.id);
    
    // Enrich with item details
    const enrichedPurchases = purchases.map(purchase => {
      const item = db.getShopItemById(purchase.itemId);
      return {
        ...purchase,
        item
      };
    });

    res.json({ purchases: enrichedPurchases });
  } catch (error) {
    console.error('Get user purchases error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
