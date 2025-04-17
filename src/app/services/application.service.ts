import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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

} 