import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';
import { JobApplicationService } from '../services/job-application.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgFor
  ],
})
export class JobApplicationComponent implements OnInit, OnDestroy {
  applicationForm: FormGroup;
  questions: any[] = [];
  jobId: string | null = null;
  
  readonly #service = inject(JobApplicationService);
  readonly #route = inject(ActivatedRoute);
  readonly #fb = inject(FormBuilder);
  private subscription: Subscription | undefined;

  constructor() {
    this.applicationForm = this.#fb.group({});
  }

  ngOnInit(): void {
    this.jobId = this.#route.snapshot.paramMap.get('id');
    if (this.jobId) {
      this.loadQuestions(this.jobId);
    }
  }
  
  loadQuestions(jobId: string): void {
    this.subscription = this.#service.getJobQuestions(jobId).subscribe((data: any) => {
      this.questions = data;
      this.questions.forEach(question => {
        this.applicationForm.addControl(
          question.id,
          this.#fb.control('', Validators.required)
        );
      });
    });
  }

  submitApplication(): void {
    if (this.applicationForm.valid && this.jobId) {
      this.#service.submitApplication(this.jobId, this.applicationForm.value).subscribe(() => {
        alert('Votre candidature a été soumise avec succès.');
      });
    }
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
