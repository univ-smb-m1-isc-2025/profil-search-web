import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member, MemberService, CreateMemberRequest } from '../../services/member.service';
import { Subscription } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterLink } from '@angular/router';
import { EmailService } from '../../services/email/email.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './member-list.component.html'
})
export class MemberListComponent implements OnInit, OnDestroy {
  members: Member[] = [];
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;
  invitationForm: FormGroup;
  isSubmitting = false;
  private subscription: Subscription | undefined;

  constructor(
    private memberService: MemberService,
    private emailService: EmailService,
    private fb: FormBuilder
  ) {
    this.invitationForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.isLoading = true;
    this.error = null;
    
    this.subscription = this.memberService.getMembers().subscribe({
      next: (data) => {
        this.members = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des membres', err);
        this.error = 'Impossible de charger la liste des membres. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  deactivateMember(member: Member): void {
    if (!member.actif) {
      // Le membre est déjà désactivé
      return;
    }

    this.memberService.deactivateMember(member.id).subscribe({
      next: (response) => {
        if (response.status === 200) {
          member.actif = false; // Mettre à jour le statut localement
        } else {
          this.error = 'Échec de la désactivation du membre.';
        }
      },
      error: (err) => {
        console.error('Erreur lors de la désactivation du membre', err);
        this.error = 'Impossible de désactiver ce membre. Veuillez réessayer plus tard.';
      }
    });
  }

  onSubmit(): void {
    if (this.invitationForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    this.successMessage = null;

    // Récupérer les données du formulaire
    const formData = this.invitationForm.value;

    // Générer d'abord le token d'invitation
    this.memberService.generateInvitationToken(1).subscribe({ // TODO: Remplacer 1 par l'ID de l'entreprise actuelle
      next: (token) => {
        console.log('Token généré:', token);
        // Créer le membre avec le token
        const memberData: CreateMemberRequest = {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          token: token
        };
        console.log('Données du membre à créer:', memberData);

        this.memberService.createMember(memberData).subscribe({
          next: (response) => {
            // Envoyer l'email d'invitation avec le token
            this.emailService.sendInvitationEmail(
              formData.email,
              `${formData.prenom} ${formData.nom}`,
              'ProfilSearch',
              token
            ).subscribe({
              next: () => {
                this.successMessage = response.message;
                this.invitationForm.reset();
                this.isSubmitting = false;
                this.loadMembers(); // Recharger la liste des membres
              },
              error: (err) => {
                console.error('Erreur lors de l\'envoi de l\'email', err);
                this.error = 'Le membre a été créé mais l\'email d\'invitation n\'a pas pu être envoyé';
                this.isSubmitting = false;
              }
            });
          },
          error: (err) => {
            console.error('Erreur lors de la création du membre', err);
            this.error = 'Impossible de créer le nouveau membre';
            this.isSubmitting = false;
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la génération du token', err);
        this.error = 'Impossible de générer un token d\'invitation';
        this.isSubmitting = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
} 