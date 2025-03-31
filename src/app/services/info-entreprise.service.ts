import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class InfoEntrepriseService {
  private readonly apiUrl = environment.BASE_API_URL + '/api/entreprises/all';
  readonly http = inject(HttpClient);
  getEntreprises(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}