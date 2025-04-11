import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobManagementService } from '../services/job-management.service';

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
  
  readonly #service = inject(JobManagementService);
  readonly #fb = inject(FormBuilder);

  constructor() {
    this.jobForm = this.#fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      bulletPoints: [''],
      logo: [''],
      published: [false]
    });
  }

  saveJob(): void {
    if (this.jobForm.valid) {
      this.#service.saveJob(this.jobForm.value).subscribe(() => {
        alert('Offre enregistrée avec succès.');
      });
    }
  }
}
