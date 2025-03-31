import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  standalone: true,
  imports: [
        FormsModule,
        ReactiveFormsModule,
  ],

})
export class JobManagementComponent {
  jobForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      bulletPoints: [''],
      logo: [''],
      published: [false]
    });
  }

  saveJob(): void {
    if (this.jobForm.valid) {
      this.http.post('/api/jobs', this.jobForm.value).subscribe(() => {
        alert('Offre enregistrée avec succès.');
      });
    }
  }
}
