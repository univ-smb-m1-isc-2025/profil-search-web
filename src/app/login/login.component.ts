import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from '../services/google-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,

})
export class LoginComponent implements OnInit {
  constructor(private googleAuthService: GoogleAuthService) {}

  ngOnInit(): void {
    this.googleAuthService.initGoogleAuth('YOUR_GOOGLE_CLIENT_ID');
  }

  renderGoogleButton(): void {
    this.googleAuthService.renderButton('google-signin-button');
  }
}
