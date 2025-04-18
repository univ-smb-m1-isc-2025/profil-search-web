import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Tag {
  id: number;
  tag: string;
}

export interface BulletPoint {
  id: number;
  bulletPoint: string;
  offreId: number;
}

export interface Offre {
  id: number;
  userSource: number;
  estPubliee: boolean;
  titre?: string;
  entreprise?: string;
  bulletPoints?: BulletPoint[];
}

export interface QuestionReponse {
  id: number;
  candidature_id: number;
  question_id: number;
  question_text: string;
  reponse: string;
}

export interface Candidature {
  id: number;
  emailCandidat: string;
  name?: string;
  offreId: number;
  assigneeId?: number;
  closed: boolean;
  positif?: boolean;
  tagList?: Tag[];
  questionReponses?: QuestionReponse[];
  commentaire?: string;
  prochaineAction?: string;
}

export interface Member {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private apiUrl = environment.BASE_API_URL;

  constructor(private http: HttpClient) { }

  // Créer une nouvelle candidature
  createCandidature(emailCandidat: string, name: string, offreId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/candidatures/create`, {
      emailCandidat,
      name,
      offreId
    });
  }

  // Ajouter une question-réponse à une candidature
  addQuestionReponse(candidatureId: number, questionId: number, reponse: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/question-reponses/create`, {
      candidature_id: candidatureId,
      question_id: questionId,
      reponse
    });
  }

  // Récupérer toutes les candidatures
  getCandidatures(filtreNonClo: boolean = false): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/api/candidatures/all`).pipe(
      map(candidatures => {
        if (filtreNonClo) {
          return candidatures.filter(c => !c.closed);
        }
        return candidatures;
      })
    );
  }

  // Récupérer une candidature par ID
  getCandidature(id: number): Observable<Candidature | undefined> {
    return this.http.get<Candidature>(`${this.apiUrl}/api/candidatures/${id}`);
  }

  // Récupérer les tags disponibles
  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/api/tags/all`);
  }

  // Créer un nouveau tag
  createTag(tagName: string): Observable<Tag> {
    return this.http.post<Tag>(`${this.apiUrl}/api/tags/create`, {
      name: tagName
    });
  }

  // Ajouter un tag à une candidature
  addTagToCandidature(tagId: number, candidatureId: number): Observable<string> {
    return this.http.get(
      `${this.apiUrl}/api/tag-candidatures/add/${tagId}/${candidatureId}`,
      { responseType: 'text' }
    );
  }

  // Marquer une candidature comme positive/négative
  updatePositif(candidatureId: number, positif: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/candidatures/updatePositif/${candidatureId}/${positif}`, {});
  }

  // Marquer une candidature comme fermée
  updateClosed(candidatureId: number, closed: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/candidatures/updateClosed/${candidatureId}/${closed}`, {});
  }

  // Supprimer une candidature
  deleteCandidature(candidatureId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/candidatures/delete/${candidatureId}`);
  }

  // Récupérer tous les membres
  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/api/members/all`);
  }

  // Assigner une candidature à un membre
  assignToCandidature(candidatureId: number, memberId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/candidatures/assign/${candidatureId}/${memberId}`, {});
  }

  // Mettre à jour une candidature (combinaison de plusieurs opérations)
  updateCandidature(candidature: Candidature): Observable<any> {
    // Pour simplifier, nous allons d'abord mettre à jour le statut
    return this.updatePositif(candidature.id, !!candidature.positif).pipe(
      tap(() => {
        if (candidature.closed !== undefined) {
          this.updateClosed(candidature.id, candidature.closed).subscribe();
        }
        
        // Si des tags sont fournis, on pourrait gérer l'ajout/suppression ici
        // Mais cela nécessiterait de connaître les tags actuels pour comparer
      })
    );
  }
}
