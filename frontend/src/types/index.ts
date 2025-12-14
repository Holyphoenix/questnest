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
  role: UserRole;
  level: number;
  exp: number;
  points: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  frequency: TaskFrequency;
  status: TaskStatus;
  expReward: number;
  pointsReward: number;
  dueDate?: string;
  scheduledDays?: number[];
  scheduledDate?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
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
  tamedAt: string;
  pet?: Pet;
}

export interface Purchase {
  id: string;
  userId: string;
  itemId: string;
  purchasedAt: string;
  item?: ShopItem;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}
