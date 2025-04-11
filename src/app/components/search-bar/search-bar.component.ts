import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
  searchQuery: string = '';

  onSearch(): void {
    // À implémenter plus tard avec l'API
    console.log('Recherche:', this.searchQuery);
  }
} 