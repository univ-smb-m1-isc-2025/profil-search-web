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

    // Charger les questions pour l'offre
    this.applicationService.setCurrentJobId(jobId);
    
    // Initialiser le formulaire après un court délai pour attendre les questions
    setTimeout(() => this.initForm(), 100);
    
    // Récupérer l'offre d'emploi
    this.loadJob(jobId);
  }

  private loadJob(jobId: number): void {
    const jobs = this.jobService.getJobs();
    
    if (jobs.length > 0) {
      this.job = jobs.find(j => j.id === jobId) || null;
    } else {
      this.jobService.fetchJobs();
      setTimeout(() => {
        const updatedJobs = this.jobService.getJobs();
        this.job = updatedJobs.find(j => j.id === jobId) || null;
      }, 300);
    }
  }

  private initForm(): void {
    const formConfig: Record<string, any> = {};
    
    for (const question of this.questions()) {
      formConfig[`question_${question.id}`] = ['', question.required ? Validators.required : []];
    }
    
    this.applicationForm = this.fb.group(formConfig);
  }

  onSubmit(): void {
    if (!this.applicationForm) return;
    
    
    this.router.navigate(['/']);
  }
} 