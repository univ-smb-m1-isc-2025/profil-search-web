import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeleteDataService {
  private readonly apiUrl = '/api/candidate/delete';
  readonly http = inject(HttpClient);


  deleteData(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }
}
