import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Candidature, CandidatureService, Member, Tag } from '../../services/candidature.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-candidature-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  templateUrl: './candidature-detail.component.html',
})
export class CandidatureDetailComponent implements OnInit, OnDestroy {
  candidatureId: number = 0;
  candidature: Candidature | undefined;
  isLoading: boolean = true;
  error: string | null = null;
  authError: string | null = null;
  successMessage: string | null = null;
  availableTags: Tag[] = [];
  newTagInput: string = '';
  selectedTags: Tag[] = [];
  members: Member[] = [];
  selectedMemberId: number | undefined = undefined;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidatureService: CandidatureService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Vérifier l'authentification avant de charger les données
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.authError = "Vous devez être connecté pour voir les détails d'une candidature";
        this.isLoading = false;
        // Rediriger vers la page de connexion après un délai
        setTimeout(() => {
          this.router.navigate(['/connexion'], { 
            queryParams: { returnUrl: this.router.url } 
          });
        }, 2000);
        return;
      }
      
      // Récupérer l'ID de la candidature et charger les données
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.candidatureId = parseInt(idParam, 10);
          this.loadInitialData();
        } else {
          this.error = 'ID de candidature non spécifié';
          this.isLoading = false;
        }
      });
    });
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.error = null;

    // Charger les données de base
    const candidatureSub = this.candidatureService.getCandidature(this.candidatureId).subscribe({
      next: (data) => {
        if (data) {
          this.candidature = data;
          this.selectedTags = data.tagList || [];
          this.selectedMemberId = data.assigneeId;
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

    this.subscriptions.push(candidatureSub);

    // Charger les tags et les membres
    const tagsSub = this.candidatureService.getTags().subscribe({
      next: (tags) => {
        this.availableTags = tags;
      }
    });

    const membersSub = this.candidatureService.getMembers().subscribe({
      next: (members) => {
        this.members = members;
      }
    });

    this.subscriptions.push(tagsSub, membersSub);
  }

  // Gestion des tags
  isTagSelected(tagId: number): boolean {
    return this.selectedTags.some(t => t.id === tagId);
  }

  toggleTag(tag: Tag): void {
    if (this.isLoading || this.isTagSelected(tag.id)) return;
    
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    
    this.candidatureService.addTagToCandidature(tag.id, this.candidatureId).subscribe({
      next: (response) => {
        this.selectedTags.push(tag);
        console.log('Tag ajouté avec succès:', response);
        this.successMessage = `Tag "${tag.tag}" ajouté avec succès`;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du tag:', err);
        this.error = `Impossible d'ajouter le tag "${tag.tag}"`;
        this.isLoading = false;
      }
    });
  }

  addNewTag(): void {
    if (this.isLoading || !this.newTagInput.trim()) return;
    
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    
    const newTagName = this.newTagInput.trim();
    
    this.candidatureService.createTag(newTagName).subscribe({
      next: (newTag) => {
        console.log('Nouveau tag créé:', newTag);
        this.availableTags.push(newTag);
        this.newTagInput = '';
        
        // Ajouter automatiquement le nouveau tag à la candidature
        this.candidatureService.addTagToCandidature(newTag.id, this.candidatureId).subscribe({
          next: (response) => {
            this.selectedTags.push(newTag);
            console.log('Nouveau tag ajouté à la candidature:', response);
            this.successMessage = `Tag "${newTag.tag}" créé et ajouté avec succès`;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Erreur lors de l\'ajout du nouveau tag:', err);
            this.error = `Tag créé mais impossible de l'ajouter à la candidature`;
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la création du tag:', err);
        this.error = `Impossible de créer le tag "${newTagName}"`;
        this.isLoading = false;
      }
    });
  }

  // Actions directes
  setPositif(positif: boolean): void {
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    
    this.candidatureService.updatePositif(this.candidatureId, positif).subscribe({
      next: () => {
        if (this.candidature) {
          this.candidature.positif = positif;
        }
        this.successMessage = 'Statut mis à jour avec succès';
        this.refreshCandidature();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut', err);
        this.error = 'Impossible de mettre à jour le statut';
        this.isLoading = false;
      }
    });
  }

  setClosed(closed: boolean): void {
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    
    this.candidatureService.updateClosed(this.candidatureId, closed).subscribe({
      next: () => {
        if (this.candidature) {
          this.candidature.closed = closed;
        }
        this.successMessage = closed ? 'Candidature fermée avec succès' : 'Candidature rouverte avec succès';
        
        // Si on ferme une candidature, rediriger vers la liste après un délai
        if (closed) {
          setTimeout(() => {
            this.router.navigate(['/liste-candidatures']);
          }, 1500);
        } else {
          this.refreshCandidature();
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut', err);
        this.error = 'Impossible de mettre à jour le statut';
        this.isLoading = false;
      }
    });
  }

  assignToMember(): void {
    if (this.selectedMemberId === undefined) return;
    
    this.isLoading = true;
    this.candidatureService.assignToCandidature(this.candidatureId, this.selectedMemberId).subscribe({
      next: () => {
        if (this.candidature) {
          this.candidature.assigneeId = this.selectedMemberId;
        }
        this.successMessage = 'Candidature assignée avec succès';
        this.isLoading = false;
        
        // Recharger la candidature pour mettre à jour les données
        this.refreshCandidature();
      },
      error: (err) => {
        console.error('Erreur lors de l\'assignation', err);
        this.error = 'Impossible d\'assigner la candidature';
        this.isLoading = false;
      }
    });
  }

  private refreshCandidature(): void {
    setTimeout(() => {
      this.candidatureService.getCandidature(this.candidatureId).subscribe({
        next: (data) => {
          if (data) {
            this.candidature = data;
            this.selectedTags = data.tagList || [];
            this.selectedMemberId = data.assigneeId;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors du rafraîchissement des données', err);
          this.error = 'Impossible de rafraîchir les données';
          this.isLoading = false;
        }
      });
    }, 500);
  }

  ngOnDestroy(): void {
    // Désabonnement de toutes les souscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
