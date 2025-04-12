import { Injectable, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  authProvider: 'google' | 'invitation';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Charger l'utilisateur depuis le localStorage s'il existe et si on est dans un navigateur
    if (this.isBrowser) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  loginWithGoogle(googleResponse: any): void {
    // Extraire les informations de l'utilisateur de la réponse Google
    // Dans un environnement réel, ceci serait validé côté serveur
    if (this.isBrowser) {
      const payload = this.decodeJwtResponse(googleResponse.credential);
      
      const user: User = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        authProvider: 'google'
      };

      this.setCurrentUser(user);
      
      // Utiliser NgZone pour s'assurer que la navigation se fait dans le contexte Angular
      this.ngZone.run(() => {
        this.router.navigate(['/']);
      });
    }
  }

  loginWithInvitation(invitationCode: string): boolean {
    // Simuler une vérification du code d'invitation
    // Dans un environnement réel, ceci serait validé côté serveur
    if (invitationCode.trim()) {
      const user: User = {
        id: 'inv_' + Math.random().toString(36).substr(2, 9),
        email: 'invite@example.com',
        name: 'Utilisateur Invité',
        authProvider: 'invitation'
      };

      this.setCurrentUser(user);
      return true;
    }
    return false;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/connexion']);
  }

  private setCurrentUser(user: User): void {
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private decodeJwtResponse(token: string): any {
    if (!this.isBrowser) {
      return {}; // Retourner un objet vide si pas dans le navigateur
    }
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
