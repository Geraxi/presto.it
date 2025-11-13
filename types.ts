

export type User = {
  id: number;
  name: string;
  email: string;
  isRevisor: boolean;
  password?: string;
  storeId?: number;
};

export type Store = {
  id: number;
  name: string;
  description: string;
  logo: string;
  ownerId: number;
};

export type AdStatus = 'pending' | 'approved' | 'rejected';

export type CategoryKey =
  | 'electronics'
  | 'furniture'
  | 'clothing'
  | 'motors'
  | 'books_magazines'
  | 'sports'
  | 'real_estate'
  | 'collectibles'
  | 'music_movies'
  | 'jobs';

export type Ad = {
  id: number;
  title: Record<Language['code'], string>;
  description: Record<Language['code'], string>;
  price: number;
  category: CategoryKey;
  userId: number;
  status: AdStatus;
  images: string[]; // file paths or base64 data URLs
  watermarkedImages?: string[];
};

export type Language = {
  code: 'it' | 'en' | 'es';
  name: string;
  flag: string;
  locale: string;
};

export type View =
  | { name: 'home' }
  | { name: 'ad_detail'; adId: number }
  | { name: 'create_ad' }
  | { name: 'revisor_dashboard' }
  | { name: 'work_with_us' }
  | { name: 'become_seller' }
  | { name: 'store_detail'; storeId: number };

export type ImageAnalysisResult = {
  safe: boolean;
  tags: string[];
  description: string;
};

export type TextAnalysisResult = {
  safe: boolean;
  tags: string[];
  reason: string;
};