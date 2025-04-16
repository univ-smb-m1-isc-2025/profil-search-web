import { Injectable, signal } from '@angular/core';

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
  private initialJobs: Job[] = [
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

  jobs = signal<Job[]>(this.initialJobs);

  getJobs(): Job[] {
    return this.jobs();
  }

  searchJobs(query: string): void {
    if (!query || query.trim() === '') {
      this.resetSearch();
      return;
    }

    // Convertir la requête en minuscules pour une recherche insensible à la casse
    const searchTerm = query.toLowerCase().trim();
    
    // Filtrer les jobs qui correspondent à la requête
    const filteredJobs = this.initialJobs.filter(job => {
      return (
        job.title.toLowerCase().includes(searchTerm) || 
        job.company.toLowerCase().includes(searchTerm) || 
        job.description.toLowerCase().includes(searchTerm) ||
        job.bulletPoints.some(point => point.toLowerCase().includes(searchTerm))
      );
    });
    
    // Mettre à jour les résultats
    this.jobs.set(filteredJobs);
  }
  
  resetSearch(): void {
    // Réinitialiser la recherche en affichant tous les emplois
    this.jobs.set(this.initialJobs);
  }
} 