export enum AppMode {
  GENERATE = 'GENERATE',
  EDIT = 'EDIT',
  ANALYZE = 'ANALYZE',
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
