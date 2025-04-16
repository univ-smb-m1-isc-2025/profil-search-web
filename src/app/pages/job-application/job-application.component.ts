import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { JobService, Job } from '../../services/job.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-job-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './job-application.component.html'
})
export class JobApplicationComponent implements OnInit {
  questions = this.applicationService.questions;
  applicationForm!: FormGroup;
  job: Job | null = null;

  constructor(
    private applicationService: ApplicationService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    if (!jobId) {
      this.router.navigate(['/']);
      return;
    }

    this.applicationService.setCurrentJobId(jobId);
    this.initForm();
    
    const allJobs = this.jobService.getJobs();
    this.job = allJobs.find(j => j.id === jobId) || null;
    if (!this.job) {
      this.router.navigate(['/']);
    }
  }

  private initForm(): void {
    // Créer un groupe de formulaires dynamique basé sur les questions
    const formConfig: Record<string, any> = {};
    
    for (const question of this.questions()) {
      formConfig[`question_${question.id}`] = [
        '', // valeur par défaut
        question.required ? Validators.required : []
      ];
    }
    
    this.applicationForm = this.fb.group(formConfig);
  }

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.applicationForm.controls).forEach(key => {
        this.applicationForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    // Transformer les données du formulaire au format attendu par le service
    const formValues = this.applicationForm.value;
    const answers: { [key: number]: string } = {};
    
    for (const key in formValues) {
      if (key.startsWith('question_')) {
        const questionId = parseInt(key.replace('question_', ''));
        answers[questionId] = formValues[key];
      }
    }
    
    this.applicationService.submitApplication(answers);
    this.router.navigate(['/']);
  }
} 