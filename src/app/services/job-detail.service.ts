import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobDetailService {
  private readonly apiUrl = environment.BASE_API_URL + '/api/jobs';
  readonly http = inject(HttpClient);
  
  getJobDetails(jobId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${jobId}`);
  }
} 