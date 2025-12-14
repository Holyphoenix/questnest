import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/database';
import { Pet, UserPet } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export const getPets = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const pets = db.getPets();
    res.json({ pets });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createPet = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, species, level, exp, description, unlockCost, imageUrl } = req.body;

    if (!name || !species || unlockCost === undefined) {
      res.status(400).json({ error: 'Name, species, and unlockCost are required' });
      return;
    }

    const pet: Pet = {
      id: uuidv4(),
      name,
      species,
      level: level || 1,
      exp: exp || 0,
      description: description || '',
      unlockCost,
      imageUrl
    };

    db.createPet(pet);
    res.status(201).json({ message: 'Pet created successfully', pet });
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const tamePet = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { petId, nickname } = req.body;

    if (!petId) {
      res.status(400).json({ error: 'Pet ID is required' });
      return;
    }

    const pet = db.getPetById(petId);
    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    const user = db.getUserById(req.user!.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if already tamed
    const existingUserPet = db.getUserPetsByUserId(user.id)
      .find(up => up.petId === petId);
    if (existingUserPet) {
      res.status(400).json({ error: 'Pet already tamed' });
      return;
    }

    // Check if user has enough points
    if (user.points < pet.unlockCost) {
      res.status(400).json({ error: 'Insufficient points to tame this pet' });
      return;
    }

    // Deduct points
    const newPoints = user.points - pet.unlockCost;
    db.updateUser(user.id, { points: newPoints });

    // Create user pet
    const userPet: UserPet = {
      id: uuidv4(),
      userId: user.id,
      petId: pet.id,
      nickname,
      tamedAt: new Date()
    };
    db.createUserPet(userPet);

    res.json({
      message: 'Pet tamed successfully',
      userPet,
      pet,
      remainingPoints: newPoints
    });
  } catch (error) {
    console.error('Tame pet error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserPets = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userPets = db.getUserPetsByUserId(req.user!.id);
    
    // Enrich with pet details
    const enrichedUserPets = userPets.map(userPet => {
      const pet = db.getPetById(userPet.petId);
      return {
        ...userPet,
        pet
      };
    });

    res.json({ userPets: enrichedUserPets });
  } catch (error) {
    console.error('Get user pets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
