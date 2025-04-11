import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationService, ApplicationQuestion } from '../../services/application.service';
import { JobService, Job } from '../../services/job.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-job-application',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './job-application.component.html'
})
export class JobApplicationComponent implements OnInit {
  questions: ApplicationQuestion[] = [];
  answers: { [key: number]: string } = {};
  job: Job | null = null;

  constructor(
    private applicationService: ApplicationService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    if (!jobId) {
      this.router.navigate(['/']);
      return;
    }

    this.applicationService.setCurrentJobId(jobId);
    this.questions = this.applicationService.getQuestions();
    
    this.jobService.getJobs().subscribe(jobs => {
      this.job = jobs.find(j => j.id === jobId) || null;
      if (!this.job) {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit(): void {
    this.applicationService.submitApplication(this.answers);
    this.router.navigate(['/']);
  }
} 