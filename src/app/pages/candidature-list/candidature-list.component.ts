import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Candidature, CandidatureService } from '../../services/candidature.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-candidature-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
  templateUrl: './candidature-list.component.html',
})
export class CandidatureListComponent implements OnInit, OnDestroy {
  candidatures: Candidature[] = [];
  filtreNonCloses: boolean = true;
  isLoading: boolean = true;
  error: string | null = null;
  private subscription: Subscription | undefined;

  constructor(private candidatureService: CandidatureService) {}

  ngOnInit(): void {
    this.loadCandidatures();
  }

  loadCandidatures(): void {
    this.isLoading = true;
    this.error = null;

    this.subscription = this.candidatureService.getCandidatures(this.filtreNonCloses).subscribe({
      next: (data) => {
        this.candidatures = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des candidatures', err);
        this.error = 'Impossible de charger la liste des candidatures. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  toggleFiltre(): void {
    this.filtreNonCloses = !this.filtreNonCloses;
    this.loadCandidatures();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
