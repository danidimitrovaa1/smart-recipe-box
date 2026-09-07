import { Component, signal, inject, computed } from '@angular/core';
import { RecipeCard } from './recipe-card/recipe-card';
import { RecipeService } from './services/recipe';
import { FilterType, Recipe } from './models/recipe.model';

@Component({
  imports: [RecipeCard],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Smart Recipe Box 🥗');

  private readonly recipeService = inject(RecipeService);

  readonly allRecipes = computed<Recipe[]>(() => this.recipeService.recipes());

  readonly filteredRecipes = computed<Recipe[]>(() => this.recipeService.filteredRecipes());

  readonly favoriteRecipesCount = computed<number>(() => this.recipeService.favoriteCount());

  readonly currentFilter = computed<FilterType>(() => this.recipeService.currentFilter());

  protected onAddRecipe(
    event: SubmitEvent,
    recipeModal: HTMLDialogElement,
    titleInput: HTMLInputElement,
    descriptionInput: HTMLTextAreaElement,
    timeInput: HTMLInputElement,
    difficultySelect: HTMLSelectElement,
  ) {
    // 1. Prevent page reload
    event.preventDefault();

    // 2. Gather input values
    // 3. Call the addRecipe function from the service
    this.recipeService.addRecipe({
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      prepTimeMinutes: Number(timeInput.value) || 15,
      difficulty: difficultySelect.value as 'Easy' | 'Medium' | 'Hard',
    });

    // 4. Clear the boxes
    titleInput.value = '';
    descriptionInput.value = '';
    timeInput.value = '';

    // 5. Close the modal
    // 6. Call it in the HTML submit form tag
    recipeModal.close();
  }

  setSearchQuery(value: string) {
    this.recipeService.searchQuery.set(value);
  }

  setFilter(filter: FilterType) {
    this.recipeService.setFilter(filter);
  }

  onToggleFavorite(recipeId: number) {
    this.recipeService.toggleFavorite(recipeId);
  }

  onDeleteRecipe(recipeId: number) {
    this.recipeService.deleteRecipe(recipeId);
  }

  showRecipeModal(recipeModal: HTMLDialogElement) {
    recipeModal.showModal();
  }

  hideRecipeModal(recipeModal: HTMLDialogElement) {
    recipeModal.close();
  }
}
