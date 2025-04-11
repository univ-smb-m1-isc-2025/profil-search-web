import { Component, inject, OnInit } from '@angular/core';
import { GoogleAuthService } from '../services/google-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
})
export class LoginComponent implements OnInit {
  readonly #authService = inject(GoogleAuthService);

  ngOnInit(): void {
    this.#authService.initGoogleAuth('YOUR_GOOGLE_CLIENT_ID');
  }

  renderGoogleButton(): void {
    this.#authService.renderButton('google-signin-button');
  }
}
