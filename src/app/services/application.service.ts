import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ApplicationQuestion {
  id: number;
  question: string;
  type: 'text' | 'textarea';
  required: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private questions: ApplicationQuestion[] = [
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

  private currentJobId: number | null = null;

  setCurrentJobId(jobId: number) {
    this.currentJobId = jobId;
  }

  getCurrentJobId(): number | null {
    return this.currentJobId;
  }

  getQuestions(): ApplicationQuestion[] {
    return this.questions;
  }

  submitApplication(answers: { [key: number]: string }): void {
    // Pour le moment, on affiche juste les réponses dans la console
    console.log('Candidature soumise:', {
      jobId: this.currentJobId,
      answers
    });
  }
} 