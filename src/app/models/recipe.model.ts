export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  prepTimeMinutes: number;
  difficulty: Difficulty;
  isFavorite: boolean;
}

// Defining the possible filter options
export type FilterType = 'all' | 'favorites' | 'quick';
