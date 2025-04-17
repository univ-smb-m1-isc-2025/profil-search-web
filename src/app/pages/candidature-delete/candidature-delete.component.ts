import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatureService } from '../../services/candidature.service';

@Component({
  selector: 'app-candidature-delete',
  standalone: true,
  template: '' // Pas besoin d'interface
})
export class CandidatureDeleteComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const candidatureId = parseInt(idParam, 10);
      this.candidatureService.deleteCandidature(candidatureId).subscribe({
        next: () => {
          // Redirection immédiate vers la page d'accueil
          this.router.navigate(['/']);
        },
        error: () => {
          // En cas d'erreur, on redirige aussi vers l'accueil
          this.router.navigate(['/']);
        }
      });
    } else {
      // Si pas d'ID, redirection vers l'accueil
      this.router.navigate(['/']);
    }
  }
} 