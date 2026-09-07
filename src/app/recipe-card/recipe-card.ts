import { Component, input, output } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Component({
  imports: [],
  selector: 'app-recipe-card',
  styleUrl: './recipe-card.css',
  templateUrl: './recipe-card.html',
})
export class RecipeCard {
  // Will receive data from the parent with the recipe
  readonly recipe = input.required<Recipe>();

  // Will send data to the parent with the recipe id
  readonly toggleFavorite = output<number>();

  // Will send data to the parent with the recipe id
  readonly deleteRecipe = output<number>();

  protected onFavoriteClick(): void {
    this.toggleFavorite.emit(this.recipe().id);
  }

  protected onDeleteClick(): void {
    this.deleteRecipe.emit(this.recipe().id);
  }
}
