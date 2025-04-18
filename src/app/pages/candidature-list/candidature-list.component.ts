import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Candidature, CandidatureService } from '../../services/candidature.service';
import { Subscription } from 'rxjs';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

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
  authError: string | null = null;
  private subscription: Subscription | undefined;
  private jobsMap: Map<number, string> = new Map();

  constructor(
    private candidatureService: CandidatureService,
    private jobService: JobService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier l'authentification avant de charger les données
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadJobs();
        this.loadCandidatures();
      } else {
        this.authError = "Vous devez être connecté pour voir les candidatures";
        this.isLoading = false;
        // Rediriger vers la page de connexion après un délai
        setTimeout(() => {
          this.router.navigate(['/connexion'], { 
            queryParams: { returnUrl: this.router.url } 
          });
        }, 2000);
      }
    });
  }

  private loadJobs(): void {
    this.jobService.jobs().forEach(job => {
      this.jobsMap.set(job.id, job.title);
    });
    
    if (this.jobsMap.size === 0) {
      this.jobService.fetchJobs();
    }
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

  // Méthodes pour obtenir les informations liées à l'offre
  getOffreTitle(candidature: Candidature): string {
    if (this.jobsMap.has(candidature.offreId)) {
      return this.jobsMap.get(candidature.offreId) || 'Offre d\'emploi';
    }
    return 'Offre d\'emploi #' + candidature.offreId;
  }

  getOffreEntreprise(candidature: Candidature): string {
    // Pour le moment, on n'a pas d'accès direct à l'entreprise dans la structure de candidature
    return 'Entreprise';
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
