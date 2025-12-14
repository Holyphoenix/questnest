import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/database';
import { config } from '../config';
import { User, UserRole, RegisterRequest, AuthRequest } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role }: RegisterRequest = req.body;

    // Validate input
    if (!username || !email || !password || !role) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    if (!Object.values(UserRole).includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    // Check if user exists
    if (db.getUserByUsername(username)) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    if (db.getUserByEmail(email)) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user: User = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role,
      level: 1,
      exp: 0,
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    db.createUser(user);

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration } as jwt.SignOptions
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        level: user.level,
        exp: user.exp,
        points: user.points
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: AuthRequest = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    // Find user
    const user = db.getUserByUsername(username);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration } as jwt.SignOptions
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        level: user.level,
        exp: user.exp,
        points: user.points
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
