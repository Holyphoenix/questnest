import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Pet, UserPet, UserRole } from '../types';
import * as api from '../services/api';

const Pets: React.FC = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [userPets, setUserPets] = useState<UserPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [description, setDescription] = useState('');
  const [unlockCost, setUnlockCost] = useState(50);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [petsData, userPetsData] = await Promise.all([
        api.getPets(),
        api.getUserPets()
      ]);
      setPets(petsData.pets);
      setUserPets(userPetsData.userPets);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPet({ name, species, description, unlockCost });
      setName('');
      setSpecies('');
      setDescription('');
      setUnlockCost(50);
      setShowCreateForm(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create pet');
    }
  };

  const handleTamePet = async (petId: string, petCost: number) => {
    if (user && user.points < petCost) {
      setError('Not enough points to tame this pet!');
      return;
    }
    
    const nickname = window.prompt('Give your pet a nickname (optional):');
    
    try {
      await api.tamePet(petId, nickname || undefined);
      loadData();
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to tame pet');
    }
  };

  const isPetTamed = (petId: string) => {
    return userPets.some(up => up.petId === petId);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading pets...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🐾 Pets</h1>
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
            {showCreateForm ? 'Cancel' : '+ New Pet'}
          </button>
        )}
      </div>

      <div style={{ padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px', marginBottom: '20px' }}>
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
          <h3>Create New Pet</h3>
          <form onSubmit={handleCreatePet} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="Pet name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="text"
              placeholder="Species (e.g., Dragon, Cat, Phoenix)"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
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
              type="number"
              placeholder="Unlock cost (points)"
              value={unlockCost}
              onChange={(e) => setUnlockCost(parseInt(e.target.value))}
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
              Create Pet
            </button>
          </form>
        </div>
      )}

      <h2>Available Pets</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {pets.map(pet => (
          <div
            key={pet.id}
            style={{
              padding: '20px',
              backgroundColor: isPetTamed(pet.id) ? '#e8f5e9' : '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderLeft: isPetTamed(pet.id) ? '4px solid #4CAF50' : 'none'
            }}
          >
            <h3 style={{ marginTop: 0 }}>🐉 {pet.name}</h3>
            <p style={{ fontSize: '14px', color: '#666' }}><strong>Species:</strong> {pet.species}</p>
            <p style={{ fontSize: '14px', color: '#666' }}>{pet.description}</p>
            <p style={{ fontSize: '14px', color: '#666' }}>Level {pet.level}</p>
            
            {isPetTamed(pet.id) ? (
              <div style={{
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                borderRadius: '4px',
                textAlign: 'center',
                marginTop: '15px'
              }}>
                ✓ Tamed
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF9800' }}>
                  💰 {pet.unlockCost}
                </span>
                <button
                  onClick={() => handleTamePet(pet.id, pet.unlockCost)}
                  disabled={user ? user.points < pet.unlockCost : true}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: user && user.points >= pet.unlockCost ? '#4CAF50' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: user && user.points >= pet.unlockCost ? 'pointer' : 'not-allowed'
                  }}
                >
                  Tame
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {pets.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          No pets available yet. {user?.role === UserRole.PARENT && 'Create some pets!'}
        </div>
      )}

      {userPets.length > 0 && (
        <div>
          <h2>🏆 My Tamed Pets</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {userPets.map(userPet => (
              <div
                key={userPet.id}
                style={{
                  padding: '15px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '4px'
                }}
              >
                <strong>{userPet.nickname || userPet.pet?.name}</strong>
                <span style={{ marginLeft: '10px', color: '#666', fontSize: '14px' }}>
                  ({userPet.pet?.species}) - Tamed on {new Date(userPet.tamedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pets;
