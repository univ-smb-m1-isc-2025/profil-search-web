import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private readonly apiUrl = environment.BASE_API_URL + '/api/users';
  readonly http = inject(HttpClient);
  
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
  deactivateUser(userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userId}/deactivate`, {});
  }
} 