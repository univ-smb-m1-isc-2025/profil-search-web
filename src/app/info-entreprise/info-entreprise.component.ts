import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-info-entreprise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-entreprise.component.html'
})
export class InfoEntrepriseComponent implements OnInit {
  entreprises: any[] = [];

  constructor(private http: HttpClient) {
    console.log('InfoEntrepriseComponent initialized');
    console.log('Environment:', environment);
  }

  ngOnInit(): void {
    this.http.get(environment.BASE_API_URL + '/api/entreprises/all').subscribe({
      next: (data: any) => {
        this.entreprises = data;
        console.log(this.entreprises);
      },
      error: (error) => {
        console.error('Error fetching entreprises:', error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }
}
