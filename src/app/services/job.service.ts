import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/offres/all';
  private initialJobs: Job[] = [];
  
  jobs = signal<Job[]>([]);

  constructor() {
    this.fetchJobs();
  }

  fetchJobs(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        const transformedJobs = this.transformJobData(response);
        this.initialJobs = transformedJobs;
        this.jobs.set(transformedJobs);
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }

  private transformJobData(apiData: any): Job[] {
    if (!Array.isArray(apiData)) {
      apiData = [apiData];
    }
    
    return apiData.map((item: any) => {
      return {
        id: item.id,
        title: item.titre || '',
        company: item.user_source?.entreprise?.name || '',
        description: this.extractDescription(item.paragraphes),
        bulletPoints: this.extractBulletPoints(item.bulletPoints)
      };
    });
  }

  private extractDescription(paragraphes: any[]): string {
    if (!paragraphes || !Array.isArray(paragraphes)) return '';
    
    const firstValidParagraph = paragraphes.find(p => p.valid && p.contenu);
    return firstValidParagraph ? firstValidParagraph.contenu : '';
  }

  private extractBulletPoints(bulletPoints: any[]): string[] {
    if (!bulletPoints || !Array.isArray(bulletPoints)) return [];
    
    return bulletPoints
      .filter(bp => bp.valid)
      .map(bp => bp.bullet_point || '')
      .filter(text => text !== '');
  }

  getJobs(): Job[] {
    return this.jobs();
  }

  searchJobs(query: string): void {
    if (!query || query.trim() === '') {
      this.resetSearch();
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const filteredJobs = this.initialJobs.filter(job => {
      return (
        job.title.toLowerCase().includes(searchTerm) || 
        job.company.toLowerCase().includes(searchTerm) || 
        job.description.toLowerCase().includes(searchTerm) ||
        job.bulletPoints.some(point => point.toLowerCase().includes(searchTerm))
      );
    });
    
    this.jobs.set(filteredJobs);
  }
  
  resetSearch(): void {
    this.jobs.set(this.initialJobs);
  }
} 