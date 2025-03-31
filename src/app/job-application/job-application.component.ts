import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html'
})
export class JobApplicationComponent implements OnInit {
  applicationForm: FormGroup;
  questions: any[] = [];
  jobId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.applicationForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id');
    this.http.get(`/api/jobs/${this.jobId}/questions`).subscribe((data: any) => {
      this.questions = data;
      this.questions.forEach(question => {
        this.applicationForm.addControl(
          question.id,
          this.fb.control('', Validators.required)
        );
      });
    });
  }

  submitApplication(): void {
    if (this.applicationForm.valid) {
      this.http.post(`/api/jobs/${this.jobId}/apply`, this.applicationForm.value).subscribe(() => {
        alert('Votre candidature a été soumise avec succès.');
      });
    }
  }
}
