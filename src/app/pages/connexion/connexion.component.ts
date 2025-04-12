import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './connexion.component.html',
})
export class ConnexionComponent implements OnInit {
  invitationCode: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  private isBrowser: boolean;
  
  constructor(
    private router: Router, 
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Charger le script Google API seulement si on est dans un navigateur
    if (this.isBrowser) {
      this.loadGoogleApi();
    }
  }

  loadGoogleApi(): void {
    if (!this.isBrowser) return;
    
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      // Initialiser le bouton Google une fois que le script est chargé
      this.initGoogleButton();
    };
  }

  initGoogleButton(): void {
    if (!this.isBrowser) return;
    
    // @ts-ignore - la variable google est accessible via le script chargé
    window.google?.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT_ID,
      callback: this.handleGoogleLogin.bind(this)
    });
    
    // @ts-ignore
    window.google?.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large', width: 240 }
    );
  }

  handleGoogleLogin(response: any): void {
    // Utiliser NgZone pour s'assurer que Angular détecte les changements
    this.ngZone.run(() => {
      this.authService.loginWithGoogle(response);
      // Forcer la détection de changements
      this.cdr.detectChanges();
    });
  }

  verifyInvitationCode(): void {
    if (!this.invitationCode.trim()) {
      this.errorMessage = "Veuillez saisir un code d'invitation valide";
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.loginWithInvitationToken(this.invitationCode).subscribe({
      next: (isValid) => {
        this.isLoading = false;
        
        if (isValid) {
          this.ngZone.run(() => {
            this.router.navigate(['/']);
            this.cdr.detectChanges();
          });
        } else {
          this.errorMessage = "Code d'invitation invalide ou expiré";
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = "Erreur lors de la vérification du code d'invitation";
      }
    });
  }
}
