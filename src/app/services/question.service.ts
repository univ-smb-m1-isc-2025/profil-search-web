import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = environment.BASE_API_URL;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les questions
  getAllQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/questions/all`);
  }

  // Créer une nouvelle question
  createQuestion(questionText: string): Observable<any> {
    // Utiliser un paramètre de requête au lieu d'un corps JSON
    return this.http.post<any>(
      `${this.apiUrl}/api/questions/create?question=${encodeURIComponent(questionText)}`,
      {}
    );
  }
}
