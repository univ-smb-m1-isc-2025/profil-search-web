import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap, map } from 'rxjs/operators';

export interface Member {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  actif: boolean;
  entrepriseName: string;
  entrepriseId: number;
}

export interface CreateMemberRequest {
  nom: string;
  prenom: string;
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private readonly apiUrl = environment.BASE_API_URL;
  readonly http = inject(HttpClient);
  
  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/api/members/all`);
  }
  
  deactivateMember(memberId: number): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${this.apiUrl}/api/members/deactivate/${memberId}`,
      {},
      { observe: 'response', responseType: 'text' as 'json' }
    );
  }

  generateInvitationToken(entrepriseId: number): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}/api/invites/create/${entrepriseId}`,
      { responseType: 'text' as 'json' }
    );
  }

  createMember(member: CreateMemberRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/members/create`, member, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'text'
    }).pipe(
      tap(response => {
        console.log('Réponse du serveur:', response);
      }),
      map(response => {
        // Retourner un objet avec les informations du membre créé
        return {
          success: true,
          message: response,
          member: {
            nom: member.nom,
            prenom: member.prenom,
            email: member.email
          }
        };
      })
    );
  }
} 