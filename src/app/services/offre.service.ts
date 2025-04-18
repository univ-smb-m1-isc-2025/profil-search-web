import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private apiUrl = environment.BASE_API_URL;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les offres
  getAllOffres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/offres/all`);
  }

  // Récupérer une offre par son ID
  getOffreById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/offres/${id}`);
  }

  // Créer une nouvelle offre
  createOffre(offreData: any): Observable<any> {
    // Récupérer l'ID du membre connecté (à partir du LocalStorage par exemple)
    const memberId = JSON.parse(localStorage.getItem('currentUser') || '{}')?.id;

    // Préparer les données pour l'API
    const offreDTO = {
      titre: offreData.titre,
      memberId: memberId,
      est_publiee: offreData.estPubliee
    };

    return this.http.post<any>(`${this.apiUrl}/api/offres/create`, offreDTO);
  }

  // Mettre à jour une offre existante
  updateOffre(id: number, offreData: any): Observable<any> {
    // Cette méthode n'existe peut-être pas encore dans l'API,
    // il faudrait potentiellement l'ajouter au backend
    return this.http.put<any>(`${this.apiUrl}/api/offres/update/${id}`, offreData);
  }

  // Créer un paragraphe pour une offre
  createParagraphe(contenu: string, offreId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/paragraphes/create`, {
      contenu,
      offreId
    });
  }

  // Créer un bullet point pour une offre
  createBulletPoint(content: string, offreId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/bullet-points/create`, {
      bullet_point: content,  // renommer "content" en "bullet_point"
      offre_id: offreId      // renommer "offreId" en "offre_id"
    });
  }

  // Associer une question existante à une offre
  associateQuestionToOffre(offreId: number, questionId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/offres-questions/create`, {
      offre_id: offreId,     // Renommer en snake_case si nécessaire
      question_id: questionId // Renommer en snake_case si nécessaire
    });
  }

  // Supprimer une offre
  deleteOffre(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/offres/delete/${id}`);
  }

  // Récupérer toutes les offres publiées (pour la partie publique du site)
  getPublishedOffres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/offres/published`);
  }
}
