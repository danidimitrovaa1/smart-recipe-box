import { Injectable, signal, computed, effect } from '@angular/core';
import type { Recipe, FilterType, Difficulty } from '../models/recipe.model';

// Recipes List
const INITIAL_RECIPES: Recipe[] = [
  {
    id: 1,
    title: 'Mediterranean Avocado Salad',
    description:
      'Crisp cucumbers, creamy avocado, cherry tomatoes, and feta cheese tossed with olive oil and lemon.',
    prepTimeMinutes: 15,
    difficulty: 'Easy',
    isFavorite: true,
  },
  {
    id: 2,
    title: 'Creamy Garlic Butter Pasta',
    description:
      'Silky pasta tossed in a rich garlic, butter, and parmesan sauce with fresh parsley.',
    prepTimeMinutes: 20,
    difficulty: 'Medium',
    isFavorite: false,
  },
  {
    id: 3,
    title: 'Artisan Sourdough Pizza',
    description:
      'Slow-fermented crust topped with San Marzano tomatoes, fresh mozzarella, and basil.',
    prepTimeMinutes: 45,
    difficulty: 'Hard',
    isFavorite: true,
  },
  {
    id: 4,
    title: 'Erewhon Kale and White Bean Salad',
    description: 'A fresh and crunchy combination of kale, white beans, onions, and avocado.',
    prepTimeMinutes: 10,
    difficulty: 'Easy',
    isFavorite: false,
  },
];

// Check if recipes list is empty
function getSavedRecipes(): Recipe[] {
  // 1. Read from storage
  const savedData = localStorage.getItem('smart_recipes');

  if (savedData) return JSON.parse(savedData);

  return INITIAL_RECIPES;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  // List of recipes
  readonly recipes = signal<Recipe[]>(getSavedRecipes());

  // Signal to remember which filter is currently active
  readonly currentFilter = signal<FilterType>('all');

  // Filtering
  readonly searchQuery = signal('');

  // Returns the number of favorites
  readonly favoriteCount = computed(
    () => this.recipes().filter((recipe) => recipe.isFavorite).length,
  );

  // Renders the list of filtered recipes
  readonly filteredRecipes = computed(() => {
    // 1. Get the current values
    const filter = this.currentFilter();
    const query = this.searchQuery().toLowerCase().trim();
    let list = this.recipes();

    if (filter === 'favorites') list = list.filter((recipe) => recipe.isFavorite);

    if (filter === 'quick') list = list.filter((recipe) => recipe.prepTimeMinutes <= 20);

    if (query) {
      list = list.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query),
      );
    }

    return list;
  });

  // Toggles favorites
  toggleFavorite(recipeId: number): void {
    this.recipes.update((currentRecipes) => {
      return currentRecipes.map(
        (recipe) =>
          recipe.id === recipeId ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe, // inverts the isFavorite boolean
      );
    });
  }

  // Sets the filter
  setFilter(filter: FilterType): void {
    this.currentFilter.set(filter);
  }

  // Let the user add new recipes
  addRecipe(newRecipeData: Omit<Recipe, 'id' | 'isFavorite'>) {
    // Build the Recipe object again to add in the id and isFavorite
    const newRecipe: Recipe = {
      id: Date.now(),
      title: newRecipeData.title,
      description: newRecipeData.description,
      prepTimeMinutes: newRecipeData.prepTimeMinutes,
      difficulty: newRecipeData.difficulty,
      isFavorite: false, // starts out as false
    };

    // Insert it into recipes
    this.recipes.update((currentList) => [newRecipe, ...currentList]);
  }

  // Lets the user delete recipes
  deleteRecipe(recipeId: number): void {
    this.recipes.update((currentRecipes) => {
      return currentRecipes.filter((recipe) => recipe.id !== recipeId);
    });
  }

  // Saving to LocalStorage when refreshing
  constructor() {
    // Angular automatically tracks ANY signal you call inside here!
    effect(() => {
      // 1. Read the signal
      const currentList = this.recipes();

      // 2. Convert list to text
      const textData = JSON.stringify(currentList);

      // 3. Write to localStorage under the name 'smart_recipes'
      localStorage.setItem('smart_recipes', textData);
    });
  }
}
