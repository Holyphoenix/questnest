import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShopItem, UserRole, Purchase } from '../types';
import * as api from '../services/api';

const Shop: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(10);
  const [category, setCategory] = useState('Reward');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsData, purchasesData] = await Promise.all([
        api.getShopItems(),
        api.getUserPurchases()
      ]);
      setItems(itemsData.items);
      setPurchases(purchasesData.purchases);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load shop data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createShopItem({ name, description, cost, category });
      setName('');
      setDescription('');
      setCost(10);
      setCategory('Reward');
      setShowCreateForm(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create item');
    }
  };

  const handlePurchase = async (itemId: string, itemCost: number) => {
    if (user && user.points < itemCost) {
      setError('Not enough points!');
      return;
    }
    
    if (!window.confirm('Purchase this item?')) return;
    
    try {
      await api.purchaseItem(itemId);
      loadData();
      window.location.reload(); // Refresh to update user points
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to purchase item');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading shop...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🛒 Shop</h1>
        {user?.role === UserRole.PARENT && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showCreateForm ? 'Cancel' : '+ New Item'}
          </button>
        )}
      </div>

      <div style={{
        padding: '15px',
        backgroundColor: '#fff3e0',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <strong>Your Points: </strong>
        <span style={{ fontSize: '20px', color: '#FF9800' }}>💰 {user?.points || 0}</span>
      </div>

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {showCreateForm && user?.role === UserRole.PARENT && (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Create New Item</h3>
          <form onSubmit={handleCreateItem} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="number"
              placeholder="Cost"
              value={cost}
              onChange={(e) => setCost(parseInt(e.target.value))}
              min="1"
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button
              type="submit"
              style={{
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Create Item
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ marginTop: 0 }}>{item.name}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>{item.description}</p>
            <p style={{ fontSize: '14px', color: '#999' }}>Category: {item.category}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF9800' }}>
                💰 {item.cost}
              </span>
              <button
                onClick={() => handlePurchase(item.id, item.cost)}
                disabled={user ? user.points < item.cost : true}
                style={{
                  padding: '8px 16px',
                  backgroundColor: user && user.points >= item.cost ? '#4CAF50' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: user && user.points >= item.cost ? 'pointer' : 'not-allowed'
                }}
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          No items in shop yet. {user?.role === UserRole.PARENT && 'Create some items!'}
        </div>
      )}

      {purchases.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2>📦 My Purchases</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {purchases.map(purchase => (
              <div
                key={purchase.id}
                style={{
                  padding: '15px',
                  backgroundColor: '#e8f5e9',
                  borderRadius: '4px'
                }}
              >
                <strong>{purchase.item?.name}</strong>
                <span style={{ marginLeft: '10px', color: '#666', fontSize: '14px' }}>
                  Purchased on {new Date(purchase.purchasedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
