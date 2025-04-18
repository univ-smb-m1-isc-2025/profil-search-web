import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import { CandidatureService } from './candidature.service';

export interface ApplicationQuestion {
  id: number;
  question: string;
  type: 'text' | 'textarea';
  required: boolean;
}

export interface ApplicationSubmission {
  jobId: number | null;
  answers: { [key: number]: string };
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private http = inject(HttpClient);
  private apiUrl = environment.BASE_API_URL + '/api/offres';
  private candidatureService = inject(CandidatureService);
  
  // Signaux pour l'état de l'application
  readonly questions = signal<ApplicationQuestion[]>([]);
  readonly currentJobId = signal<number | null>(null);
  readonly submissions = signal<ApplicationSubmission[]>([]);

  constructor() {}

  setCurrentJobId(jobId: number) {
    this.currentJobId.set(jobId);
    this.loadQuestionsForJob(jobId);
  }

  private loadQuestionsForJob(jobId: number): void {
    const url = `${this.apiUrl}/${jobId}`;
    
    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response && response.questions) {
          const questionsFromApi = response.questions.map((q: any) => ({
            id: q.id || 0,
            question: q.question_text || '',
            type: q.question_text?.length > 50 ? 'textarea' : 'text',
            required: true
          }));
          this.questions.set(questionsFromApi);
        } else {
          this.setDefaultQuestions();
        }
      },
      error: () => {
        this.setDefaultQuestions();
      }
    });
  }

  private setDefaultQuestions(): void {
    const defaultQuestions = [
      {
        id: 1,
        question: "Combien d'année d'expérience disposez-vous ?",
        type: 'text',
        required: true
      },
      {
        id: 2,
        question: "Donnez 2-3 créneaux de disponibilité",
        type: 'textarea',
        required: true
      },
      {
        id: 3,
        question: "Comment avez-vous entendu parler de l'entreprise ?",
        type: 'textarea',
        required: true
      }
    ] as ApplicationQuestion[];
    
    this.questions.set(defaultQuestions);
  }

  submitApplication(answers: { [key: number]: string }, candidatName: string = 'Candidat', candidatEmail: string = 'candidat@exemple.com'): Observable<any> {
    const jobId = this.currentJobId();
    if (!jobId) return of({ success: false, error: 'Pas d\'offre sélectionnée' });

    console.log('Début de la soumission de candidature:', {
      jobId,
      candidatName,
      candidatEmail,
      answers
    });

    // 1. Créer la candidature
    return this.candidatureService.createCandidature(candidatEmail, candidatName, jobId).pipe(
      tap(candidatureResponse => {
        console.log('Candidature créée avec succès:', candidatureResponse);
      }),
      switchMap(candidatureResponse => {
        const candidatureId = candidatureResponse?.id;
        const deleteToken = candidatureResponse?.deleteToken;
        
        if (!candidatureId) {
          console.error('Erreur: Pas d\'ID de candidature reçu');
          return of({ success: false, error: 'Erreur lors de la création de la candidature' });
        }

        // 2. Ajouter les réponses aux questions
        const questionReponseRequests = Object.entries(answers).map(([questionId, reponse]) => {
          console.log(`Ajout de la réponse pour la question ${questionId}:`, reponse);
          return this.candidatureService.addQuestionReponse(
            candidatureId,
            parseInt(questionId),
            reponse
          );
        });

        // Exécuter toutes les requêtes pour ajouter les réponses
        return forkJoin(questionReponseRequests).pipe(
          tap(() => {
            console.log('Toutes les réponses ont été enregistrées avec succès');
            // Enregistrer la soumission localement
            this.submissions.update(current => [
              ...current,
              { jobId, answers }
            ]);
          }),
          map(() => ({ success: true, candidatureId, deleteToken }))
        );
      })
    );
  }
} 