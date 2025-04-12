import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private userSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.ngZone.run(() => {
        this.currentUser = user;
        // Forcer la détection de changements après la mise à jour de l'utilisateur
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }
} 