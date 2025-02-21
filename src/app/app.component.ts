import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InfoEntrepriseComponent } from './info-entreprise/info-entreprise.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InfoEntrepriseComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'profil-search';
  
}
