import { Injectable, signal } from '@angular/core';

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
  private questionsData: ApplicationQuestion[] = [
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
  ];

  // Signaux pour l'état de l'application
  readonly questions = signal<ApplicationQuestion[]>(this.questionsData);
  readonly currentJobId = signal<number | null>(null);
  readonly submissions = signal<ApplicationSubmission[]>([]);

  setCurrentJobId(jobId: number) {
    this.currentJobId.set(jobId);
  }

  getCurrentJobId(): number | null {
    return this.currentJobId();
  }

  getQuestions(): ApplicationQuestion[] {
    return this.questions();
  }

  submitApplication(answers: { [key: number]: string }): void {
    const submission: ApplicationSubmission = {
      jobId: this.currentJobId(),
      answers
    };
    
    // Ajouter la nouvelle soumission à la liste des soumissions
    this.submissions.update(current => [...current, submission]);
    
    // Pour le moment, on affiche juste les réponses dans la console
    console.log('Candidature soumise:', submission);
  }
} 