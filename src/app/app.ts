import { Component, signal, inject } from '@angular/core';
import { RecipeCard } from './recipe-card/recipe-card';
import { RecipeService } from './services/recipe';

@Component({
  imports: [RecipeCard],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Smart Recipe Box 🥗');

  protected readonly recipeService = inject(RecipeService);

  protected onAddRecipe(
    recipeModal: HTMLDialogElement,
    titleInput: HTMLInputElement,
    descriptionInput: HTMLTextAreaElement,
    timeInput: HTMLInputElement,
    difficultySelect: HTMLSelectElement,
  ) {
    // 1. Prevent page reload - in the HTML form tag on submit

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
}
