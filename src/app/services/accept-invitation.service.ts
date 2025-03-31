import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({   
  providedIn: 'root',   
})
export class AcceptInvitationService {
  private readonly apiUrl = environment.BASE_API_URL + '/api/invitations/accept';
  readonly http = inject(HttpClient);
  acceptInvitation(token: string): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl, { token });
  }
}