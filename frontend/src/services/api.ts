import axios from 'axios';
import { User, Task, ShopItem, Pet, UserPet, Purchase, AuthResponse, UserRole, TaskFrequency } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = async (username: string, email: string, password: string, role: UserRole): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/register', { username, email, password, role });
  return data;
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/login', { username, password });
  return data;
};

// Users
export const getProfile = async (): Promise<{ user: User }> => {
  const { data } = await api.get('/users/profile');
  return data;
};

export const getUsers = async (): Promise<{ users: User[] }> => {
  const { data } = await api.get('/users');
  return data;
};

export const getUserById = async (id: string): Promise<{ user: User }> => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

// Tasks
export const getTasks = async (): Promise<{ tasks: Task[] }> => {
  const { data } = await api.get('/tasks');
  return data;
};

export const getTaskById = async (id: string): Promise<{ task: Task }> => {
  const { data } = await api.get(`/tasks/${id}`);
  return data;
};

export const createTask = async (taskData: {
  title: string;
  description: string;
  assignedTo: string;
  frequency: TaskFrequency;
  expReward: number;
  pointsReward: number;
  dueDate?: string;
  scheduledDays?: number[];
  scheduledDate?: number;
}): Promise<{ task: Task }> => {
  const { data } = await api.post('/tasks', taskData);
  return data;
};

export const completeTask = async (id: string): Promise<any> => {
  const { data } = await api.post(`/tasks/${id}/complete`);
  return data;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<{ task: Task }> => {
  const { data } = await api.put(`/tasks/${id}`, updates);
  return data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

// Shop
export const getShopItems = async (): Promise<{ items: ShopItem[] }> => {
  const { data } = await api.get('/shop/items');
  return data;
};

export const createShopItem = async (itemData: {
  name: string;
  description: string;
  cost: number;
  category: string;
  imageUrl?: string;
}): Promise<{ item: ShopItem }> => {
  const { data } = await api.post('/shop/items', itemData);
  return data;
};

export const purchaseItem = async (itemId: string): Promise<any> => {
  const { data } = await api.post('/shop/purchase', { itemId });
  return data;
};

export const getUserPurchases = async (): Promise<{ purchases: Purchase[] }> => {
  const { data } = await api.get('/shop/purchases');
  return data;
};

// Pets
export const getPets = async (): Promise<{ pets: Pet[] }> => {
  const { data } = await api.get('/pets');
  return data;
};

export const createPet = async (petData: {
  name: string;
  species: string;
  level?: number;
  exp?: number;
  description: string;
  unlockCost: number;
  imageUrl?: string;
}): Promise<{ pet: Pet }> => {
  const { data } = await api.post('/pets', petData);
  return data;
};

export const tamePet = async (petId: string, nickname?: string): Promise<any> => {
  const { data } = await api.post('/pets/tame', { petId, nickname });
  return data;
};

export const getUserPets = async (): Promise<{ userPets: UserPet[] }> => {
  const { data } = await api.get('/pets/my-pets');
  return data;
};

export default api;
