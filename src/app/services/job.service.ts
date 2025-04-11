import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  bulletPoints: string[];
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobs: Job[] = [
    {
      id: 1,
      title: 'Développeur Frontend Angular',
      company: 'TechCorp',
      description: 'Nous recherchons un développeur Frontend expérimenté',
      bulletPoints: [
        'Expérience en Angular',
        'Connaissance de TypeScript',
        'Travail en équipe'
      ]
    },
    {
      id: 2,
      title: 'Développeur Backend Node.js',
      company: 'InnovTech',
      description: 'Poste de développeur Backend Node.js',
      bulletPoints: [
        'Maîtrise de Node.js',
        'Expérience en API REST',
        'Base de données NoSQL'
      ]
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      company: 'CloudSys',
      description: 'Recherche DevOps Engineer confirmé',
      bulletPoints: [
        'Expertise AWS/Azure',
        'CI/CD Pipeline',
        'Kubernetes'
      ]
    }
  ];

  private jobsSubject = new BehaviorSubject<Job[]>(this.jobs);

  getJobs(): Observable<Job[]> {
    return this.jobsSubject.asObservable();
  }
} 