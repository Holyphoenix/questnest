import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const expProgress = (user.exp % 100) / 100 * 100;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {user.username}! 👋</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        {/* Level Card */}
        <div style={{
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>⭐ Level {user.level}</h3>
          <div style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#e0e0e0',
            borderRadius: '10px',
            overflow: 'hidden',
            marginTop: '10px'
          }}>
            <div style={{
              width: `${expProgress}%`,
              height: '100%',
              backgroundColor: '#4CAF50',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            {user.exp} / {user.level * 100} EXP
          </p>
        </div>

        {/* Points Card */}
        <div style={{
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>💰 Points</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: '#FF9800' }}>
            {user.points}
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Use in the shop!
          </p>
        </div>

        {/* Role Card */}
        <div style={{
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>
            {user.role === UserRole.PARENT ? '👑 Parent (Admin)' : '🧒 Child'}
          </h3>
          <p style={{ fontSize: '14px', color: '#666' }}>
            {user.role === UserRole.PARENT
              ? 'You can create and manage tasks'
              : 'Complete tasks to earn rewards!'}
          </p>
        </div>
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        borderLeft: '4px solid #2196F3'
      }}>
        <h3 style={{ marginTop: 0 }}>🎮 Quick Start Guide</h3>
        <ul style={{ lineHeight: '1.8' }}>
          {user.role === UserRole.PARENT ? (
            <>
              <li>Create tasks for your children in the <strong>Tasks</strong> page</li>
              <li>Set up shop items they can purchase with points</li>
              <li>Add pets they can tame as rewards</li>
              <li>Monitor everyone's progress and achievements</li>
            </>
          ) : (
            <>
              <li>Check your <strong>Tasks</strong> to see what needs to be done</li>
              <li>Complete tasks to earn EXP and level up!</li>
              <li>Collect points to buy items in the <strong>Shop</strong></li>
              <li>Tame pets to build your collection!</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
