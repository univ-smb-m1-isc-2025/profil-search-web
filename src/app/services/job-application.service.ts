import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobApplicationService {
  private readonly apiUrl = environment.BASE_API_URL + '/api/jobs';
  readonly http = inject(HttpClient);
  
  getJobQuestions(jobId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${jobId}/questions`);
  }
  
  submitApplication(jobId: string, formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${jobId}/apply`, formData);
  }
} 