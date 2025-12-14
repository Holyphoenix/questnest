export enum UserRole {
  PARENT = 'parent',
  CHILD = 'child'
}

export enum TaskFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  EXPIRED = 'expired'
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // hashed
  role: UserRole;
  level: number;
  exp: number;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // user id
  createdBy: string; // user id (parent)
  frequency: TaskFrequency;
  status: TaskStatus;
  expReward: number;
  pointsReward: number;
  dueDate?: Date;
  scheduledDays?: number[]; // 0-6 for weekly tasks
  scheduledDate?: number; // 1-31 for monthly tasks
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  itemId: string;
  purchasedAt: Date;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  level: number;
  exp: number;
  imageUrl?: string;
  description: string;
  unlockCost: number;
}

export interface UserPet {
  id: string;
  userId: string;
  petId: string;
  nickname?: string;
  tamedAt: Date;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  email: string;
  role: UserRole;
}
