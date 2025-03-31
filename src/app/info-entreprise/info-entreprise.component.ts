import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-info-entreprise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-entreprise.component.html',
})
export class InfoEntrepriseComponent implements OnInit {
  entreprises: any[] = [];

  constructor(private http: HttpClient) {
    console.log('InfoEntrepriseComponent initialized');
    console.log('Environment:', environment);
  }

  ngOnInit(): void {
    // Create headers with CORS-related options
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Make the request with headers and withCredentials option
    this.http.get(environment.BASE_API_URL + '/api/entreprises/all', { 
      headers: headers,
      withCredentials: false // Set to true only if your API requires credentials
    }).subscribe({
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
