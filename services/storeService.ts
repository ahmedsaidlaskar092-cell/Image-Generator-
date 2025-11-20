import { User, Transaction, Plan } from '../types';

const STORAGE_KEY_USERS = 'lumina_users';
const STORAGE_KEY_TRANSACTIONS = 'lumina_transactions';

export const PLANS: Plan[] = [
  {
    id: 'plan_trial',
    name: 'Trial Pack',
    price: 49,
    coins: 20,
    features: ['20 Image Generations', 'Basic Support', 'Valid for 7 days'],
  },
  {
    id: 'plan_starter',
    name: 'Starter',
    price: 99,
    coins: 50,
    features: ['50 Image Generations', 'Standard Priority', 'Valid for 30 days'],
  },
  {
    id: 'plan_pro',
    name: 'Pro Value',
    price: 199,
    coins: 125,
    features: ['125 Image Generations', 'High Priority', 'Valid for 30 days'],
    recommended: true,
  },
  {
    id: 'plan_ultimate',
    name: 'Ultimate',
    price: 299,
    coins: 200,
    features: ['200 Image Generations', 'Top Priority', 'Access to Beta Features', 'Valid for 30 days'],
  },
];

// Safe JSON parse helper
const safeParse = <T>(key: string, fallback: T): T => {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    // If corrupted, clear it to prevent persistent crashes
    try {
      localStorage.removeItem(key);
    } catch (e) {}
    return fallback;
  }
};

// Initialize default admin if not exists
const initStore = () => {
  try {
    if (typeof localStorage === 'undefined') return;

    const users = safeParse<User[]>(STORAGE_KEY_USERS, []);
    
    const adminEmail = 'mrattitude885@gmail.com';
    const adminExists = users.some(u => u.email === adminEmail);

    if (!adminExists) {
      const adminUser: User = {
        id: 'admin_001',
        name: 'Super Admin',
        email: adminEmail,
        role: 'admin',
        coins: 99999,
        plan: 'infinite',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        lastDailyReward: Date.now(),
      };
      
      // Clean up any old test admins or duplicates if necessary
      const cleanedUsers = users.filter(u => u.role !== 'admin'); 
      cleanedUsers.push(adminUser);
      
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(cleanedUsers));
    }
  } catch (error) {
    console.error("Failed to initialize store:", error);
  }
};

// Run initialization safely
initStore();

export const storeService = {
  getUsers: (): User[] => {
    return safeParse<User[]>(STORAGE_KEY_USERS, []);
  },

  getUserById: (id: string): User | undefined => {
    const users = storeService.getUsers();
    return users.find(u => u.id === id);
  },

  updateUser: (updatedUser: User): void => {
    const users = storeService.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }
  },

  deductCoins: (userId: string, amount: number): boolean => {
    const user = storeService.getUserById(userId);
    if (!user) return false;
    if (user.coins < amount) return false;

    user.coins -= amount;
    storeService.updateUser(user);
    return true;
  },

  addCoins: (userId: string, amount: number): void => {
    const user = storeService.getUserById(userId);
    if (user) {
      user.coins += amount;
      storeService.updateUser(user);
    }
  },

  checkDailyReward: (userId: string): boolean => {
    const user = storeService.getUserById(userId);
    if (!user) return false;

    const now = new Date();
    const lastReward = user.lastDailyReward ? new Date(user.lastDailyReward) : null;

    let shouldReward = false;

    if (!lastReward) {
      shouldReward = true;
    } else {
      // Check if last reward was on a previous day (using local date)
      if (
        lastReward.getDate() !== now.getDate() ||
        lastReward.getMonth() !== now.getMonth() ||
        lastReward.getFullYear() !== now.getFullYear()
      ) {
        shouldReward = true;
      }
    }

    if (shouldReward) {
      user.coins += 5;
      user.lastDailyReward = now.getTime();
      storeService.updateUser(user);
      return true;
    }

    return false;
  },

  // Transactions
  getTransactions: (): Transaction[] => {
    return safeParse<Transaction[]>(STORAGE_KEY_TRANSACTIONS, []);
  },

  createTransaction: (userId: string, userName: string, plan: Plan, utr: string): Transaction => {
    const transactions = storeService.getTransactions();
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId,
      userName,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      coins: plan.coins,
      utr,
      status: 'pending',
      date: Date.now(),
    };
    transactions.push(newTx);
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    return newTx;
  },

  updateTransactionStatus: (txId: string, status: 'approved' | 'rejected'): void => {
    const transactions = storeService.getTransactions();
    const tx = transactions.find(t => t.id === txId);
    
    if (tx && tx.status === 'pending') {
      tx.status = status;
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));

      if (status === 'approved') {
        storeService.addCoins(tx.userId, tx.coins);
      }
    }
  },
};