export type Category = 'breakfast' | 'lunch' | 'dinner' | 'library' | 'profile' | 'plans' | 'nutritionist' | 'menopause' | 'diabetes';

export type HealthTag = 'diabetes-friendly' | 'weight-loss' | 'hormonal-balance';

export type PlanType = 'free' | 'basic' | 'premium';

export interface Plan {
  id: PlanType;
  name: string;
  description?: string;
  price: number;
  features: string[];
  recipeLimit: number | 'unlimited';
}

export interface Recipe {
  id: string;
  number: number;
  title: string;
  category: 'breakfast' | 'lunch' | 'dinner';
  image: string;
  ingredients: string[];
  preparation: string[];
  nutritionalInfo: {
    calories: number;
    sugar: string;
    protein: string;
    carbs: string;
  };
  tags: HealthTag[];
  isPremium?: boolean;
  isVegetarian?: boolean;
  tips?: string;
  scientificExplanations?: Partial<Record<HealthTag, string>>;
  planId?: PlanType;
}

export interface BookChapter {
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  isPremium?: boolean;
  chapters?: BookChapter[];
  pdfUrl?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  goal: string;
  favorites: string[];
  purchasedBooks: string[];
  currentPlan: PlanType;
}
