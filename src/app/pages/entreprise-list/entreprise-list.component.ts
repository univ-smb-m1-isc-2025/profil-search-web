import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InfoEntrepriseService } from '../../services/info-entreprise.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Subscription } from 'rxjs';

export interface Entreprise {
  id: number;
  name: string;
  logo?: string;
  industry?: string;
  description?: string;
  location?: string;
  jobCount?: number;
}

@Component({
  selector: 'app-entreprise-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './entreprise-list.component.html'
})
export class EntrepriseListComponent implements OnInit, OnDestroy {
  entreprises: Entreprise[] = [];
  
  readonly #service = inject(InfoEntrepriseService);
  private mySubscription: Subscription | undefined;

  ngOnInit(): void {
    this.getEntreprises();
  }

  getEntreprises(): void {
    this.mySubscription = this.#service.getEntreprises().subscribe((data: Entreprise[]) => {
      this.entreprises = data;
    });
  }

  ngOnDestroy(): void {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
} 