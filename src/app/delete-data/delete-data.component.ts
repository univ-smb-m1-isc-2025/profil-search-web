import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-delete-data',
  templateUrl: './delete-data.component.html'
})
export class DeleteDataComponent {
  confirmation: boolean = false;

  constructor(private http: HttpClient) {}

  deleteData(): void {
    this.http.delete('/api/candidate/delete').subscribe(() => {
      alert('Vos données ont été supprimées.');
    });
  }
}
