import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member, MemberService } from '../../services/member.service';
import { Subscription } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterLink],
  templateUrl: './member-list.component.html'
})
export class MemberListComponent implements OnInit, OnDestroy {
  members: Member[] = [];
  isLoading = true;
  error: string | null = null;
  private subscription: Subscription | undefined;

  constructor(private memberService: MemberService) {}

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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
} 