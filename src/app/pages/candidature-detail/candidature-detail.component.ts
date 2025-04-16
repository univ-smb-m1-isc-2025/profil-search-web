import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Candidature, CandidatureService, Tag } from '../../services/candidature.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-candidature-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  templateUrl: './candidature-detail.component.html',
})
export class CandidatureDetailComponent implements OnInit, OnDestroy {
  candidatureId: number = 0;
  candidature: Candidature | undefined;
  commentaire: string = '';
  prochaineAction: string = '';
  reponse: 'Positive' | 'Negative' | '' = '';
  isLoading: boolean = true;
  error: string | null = null;
  successMessage: string | null = null;
  availableTags: Tag[] = [];
  newTagInput: string = '';
  selectedTags: Tag[] = [];
  
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.candidatureId = parseInt(idParam, 10);
        this.loadCandidature();
        this.loadTags();
      } else {
        this.error = 'ID de candidature non spécifié';
        this.isLoading = false;
      }
    });
  }

  loadCandidature(): void {
    this.isLoading = true;
    this.error = null;

    const subscription = this.candidatureService.getCandidature(this.candidatureId).subscribe({
      next: (data) => {
        if (data) {
          this.candidature = data;
          this.commentaire = data.commentaire || '';
          this.prochaineAction = data.prochaineAction || '';
          this.selectedTags = data.tags || [];
          
          // Définir la réponse si la candidature est clôturée
          if (data.estClo) {
            this.reponse = data.positif ? 'Positive' : 'Negative';
          } else {
            this.reponse = '';
          }
        } else {
          this.error = 'Candidature non trouvée';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la candidature', err);
        this.error = 'Impossible de charger les détails de la candidature. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });

    this.subscriptions.push(subscription);
  }

  loadTags(): void {
    const subscription = this.candidatureService.getTags().subscribe({
      next: (tags) => {
        this.availableTags = tags;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tags', err);
      }
    });

    this.subscriptions.push(subscription);
  }

  isTagSelected(tagId: number): boolean {
    return this.selectedTags.some(t => t.id === tagId);
  }

  toggleTag(tag: Tag): void {
    if (this.isTagSelected(tag.id)) {
      this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id);
      this.candidatureService.removeTagFromCandidature(this.candidatureId, tag.id).subscribe();
    } else {
      this.selectedTags.push(tag);
      this.candidatureService.addTagToCandidature(this.candidatureId, tag.id).subscribe();
    }
  }

  addNewTag(): void {
    if (this.newTagInput.trim() === '') return;
    
    // Simuler l'ajout d'un nouveau tag (en production, cela ferait un appel API)
    const newTag: Tag = {
      id: this.availableTags.length + 1,
      tag: this.newTagInput.trim()
    };
    
    this.availableTags.push(newTag);
    this.selectedTags.push(newTag);
    this.newTagInput = '';
    
    // En production, on ajouterait également le tag à la candidature via l'API
  }

  terminerRevue(): void {
    if (!this.candidature) return;
    
    // Mise à jour de la candidature
    const updatedCandidature: Candidature = {
      ...this.candidature,
      commentaire: this.commentaire,
      prochaineAction: this.prochaineAction,
      tags: this.selectedTags,
      estClo: this.reponse !== '',
      positif: this.reponse === 'Positive'
    };
    
    this.isLoading = true;
    
    const subscription = this.candidatureService.updateCandidature(updatedCandidature).subscribe({
      next: () => {
        this.successMessage = 'Candidature mise à jour avec succès';
        this.isLoading = false;
        
        // Redirection vers la liste après un court délai
        setTimeout(() => {
          this.router.navigate(['/liste-candidatures']);
        }, 1500);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de la candidature', err);
        this.error = 'Impossible de mettre à jour la candidature. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    // Désabonnement de toutes les souscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
