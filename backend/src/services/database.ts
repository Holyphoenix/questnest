import fs from 'fs';
import path from 'path';
import { User, Task, ShopItem, Purchase, Pet, UserPet } from '../types';

interface Database {
  users: User[];
  tasks: Task[];
  shopItems: ShopItem[];
  purchases: Purchase[];
  pets: Pet[];
  userPets: UserPet[];
}

class DatabaseService {
  private dbPath: string;
  private db: Database;

  constructor() {
    this.dbPath = path.join(__dirname, '../../data/db.json');
    this.initializeDatabase();
    this.db = this.loadDatabase();
  }

  private initializeDatabase(): void {
    const dataDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(this.dbPath)) {
      const initialDb: Database = {
        users: [],
        tasks: [],
        shopItems: [],
        purchases: [],
        pets: [],
        userPets: []
      };
      fs.writeFileSync(this.dbPath, JSON.stringify(initialDb, null, 2));
    }
  }

  private loadDatabase(): Database {
    const data = fs.readFileSync(this.dbPath, 'utf-8');
    return JSON.parse(data);
  }

  private saveDatabase(): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.db, null, 2));
  }

  // User operations
  getUsers(): User[] {
    return this.db.users;
  }

  getUserById(id: string): User | undefined {
    return this.db.users.find(u => u.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.db.users.find(u => u.username === username);
  }

  getUserByEmail(email: string): User | undefined {
    return this.db.users.find(u => u.email === email);
  }

  createUser(user: User): User {
    this.db.users.push(user);
    this.saveDatabase();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const index = this.db.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    
    this.db.users[index] = { ...this.db.users[index], ...updates, updatedAt: new Date() };
    this.saveDatabase();
    return this.db.users[index];
  }

  // Task operations
  getTasks(): Task[] {
    return this.db.tasks;
  }

  getTaskById(id: string): Task | undefined {
    return this.db.tasks.find(t => t.id === id);
  }

  getTasksByUserId(userId: string): Task[] {
    return this.db.tasks.filter(t => t.assignedTo === userId);
  }

  createTask(task: Task): Task {
    this.db.tasks.push(task);
    this.saveDatabase();
    return task;
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const index = this.db.tasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    
    this.db.tasks[index] = { ...this.db.tasks[index], ...updates, updatedAt: new Date() };
    this.saveDatabase();
    return this.db.tasks[index];
  }

  deleteTask(id: string): boolean {
    const initialLength = this.db.tasks.length;
    this.db.tasks = this.db.tasks.filter(t => t.id !== id);
    if (this.db.tasks.length < initialLength) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Shop operations
  getShopItems(): ShopItem[] {
    return this.db.shopItems;
  }

  getShopItemById(id: string): ShopItem | undefined {
    return this.db.shopItems.find(i => i.id === id);
  }

  createShopItem(item: ShopItem): ShopItem {
    this.db.shopItems.push(item);
    this.saveDatabase();
    return item;
  }

  // Purchase operations
  getPurchasesByUserId(userId: string): Purchase[] {
    return this.db.purchases.filter(p => p.userId === userId);
  }

  createPurchase(purchase: Purchase): Purchase {
    this.db.purchases.push(purchase);
    this.saveDatabase();
    return purchase;
  }

  // Pet operations
  getPets(): Pet[] {
    return this.db.pets;
  }

  getPetById(id: string): Pet | undefined {
    return this.db.pets.find(p => p.id === id);
  }

  createPet(pet: Pet): Pet {
    this.db.pets.push(pet);
    this.saveDatabase();
    return pet;
  }

  // User Pet operations
  getUserPetsByUserId(userId: string): UserPet[] {
    return this.db.userPets.filter(up => up.userId === userId);
  }

  createUserPet(userPet: UserPet): UserPet {
    this.db.userPets.push(userPet);
    this.saveDatabase();
    return userPet;
  }
}

export default new DatabaseService();
