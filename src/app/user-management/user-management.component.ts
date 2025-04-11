import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { UserManagementService } from '../services/user-management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  standalone: true,
  imports: [
    NgFor
  ],
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: any[] = [];
  
  readonly #service = inject(UserManagementService);
  private subscription: Subscription | undefined;

  ngOnInit(): void {
    this.getUsers();
  }
  
  getUsers(): void {
    this.subscription = this.#service.getUsers().subscribe((data: any) => {
      this.users = data;
    });
  }

  deactivateUser(userId: string): void {
    if (confirm('Voulez-vous vraiment désactiver cet utilisateur ?')) {
      this.#service.deactivateUser(userId).subscribe(() => {
        alert('Utilisateur désactivé.');
        this.users = this.users.filter(user => user.id !== userId);
      });
    }
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
