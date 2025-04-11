import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobManagementService {
  private readonly apiUrl = environment.BASE_API_URL + '/api/jobs';
  readonly http = inject(HttpClient);
  
  saveJob(jobData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, jobData);
  }
} 