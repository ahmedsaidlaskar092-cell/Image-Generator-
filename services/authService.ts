import { User } from '../types';
import { storeService } from './storeService';

const STORAGE_KEY_SESSION = 'lumina_session';

// Mock delay to simulate network request
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(email: string, password: string): Promise<User> {
    await delay(1200); // Simulate network
    
    const users = storeService.getUsers();
    
    // Updated Hardcoded Admin Check
    // Credentials: mrattitude885@gmail.com / Ahmed@43211@
    if (email === 'mrattitude885@gmail.com' && password === 'Ahmed@43211@') {
      const admin = users.find(u => u.email === email);
      if (admin) {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(admin));
        return admin;
      }
    }

    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Remove password from session object
    const { password: _, ...userWithoutPassword } = user as any;
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  async signup(name: string, email: string, password: string): Promise<User> {
    await delay(1500); // Simulate network

    const users = storeService.getUsers();

    if (users.some((u: any) => u.email === email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: any = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // In a real app, never store plain text passwords!
      role: 'user',
      coins: 10, // Signup bonus (5 base + 5 daily instant)
      plan: 'free',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      lastDailyReward: Date.now() // Mark today as claimed for signup
    };

    users.push(newUser);
    localStorage.setItem('lumina_users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  async logout(): Promise<void> {
    await delay(500);
    localStorage.removeItem(STORAGE_KEY_SESSION);
  },

  getCurrentUser(): User | null {
    const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!sessionStr) return null;
    
    const sessionUser = JSON.parse(sessionStr);
    // Always fetch fresh data from store to get latest coins/plan
    const freshUser = storeService.getUserById(sessionUser.id);
    return freshUser || null;
  }
};