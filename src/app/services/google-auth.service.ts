// filepath: src/app/services/google-auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  initGoogleAuth(clientId: string): void {
    (window as any).google.accounts.id.initialize({
      client_id: clientId,
      callback: this.handleCredentialResponse.bind(this),
    });
  }

  handleCredentialResponse(response: any): void {
    console.log('Google ID Token:', response.credential);
    // Envoyez le token au backend pour validation
  }

  renderButton(elementId: string): void {
    (window as any).google.accounts.id.renderButton(
      document.getElementById(elementId),
      { theme: 'outline', size: 'large' }
    );
  }
}
