export enum AppMode {
  GENERATE = 'GENERATE',
  EDIT = 'EDIT',
  ANALYZE = 'ANALYZE',
}

export enum PageView {
  TOOLS = 'TOOLS',
  PROFILE = 'PROFILE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  ADMIN = 'ADMIN',
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE_4_3 = '4:3',
  MOBILE_PORTRAIT = '9:16',
  WIDESCREEN = '16:9',
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: AspectRatio;
  createdAt: number;
}

export interface AnalysisResult {
  text: string;
  timestamp: number;
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  coins: number;
  plan: string;
  lastDailyReward?: number; // Timestamp of last reward
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  coins: number;
  features: string[];
  recommended?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  planId: string;
  planName: string;
  amount: number;
  coins: number;
  utr: string; // UTR or Transaction Ref ID
  status: 'pending' | 'approved' | 'rejected';
  date: number;
}