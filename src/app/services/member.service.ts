import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Member {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  actif: boolean;
  entrepriseName: string;
  entrepriseId: number;
}

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private readonly apiUrl = environment.BASE_API_URL + '/api/members/all';
  readonly http = inject(HttpClient);
  
  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }
  
  deactivateMember(memberId: number): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${environment.BASE_API_URL}/api/members/deactivate/${memberId}`,
      {},
      { observe: 'response', responseType: 'text' as 'json' }
    );
  }
} 