import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { JobService, Job } from '../../services/job.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent, SearchBarComponent, JobCardComponent],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <app-sidebar />
      
      <div class="flex-1 ml-64">
        <main class="container mx-auto px-4 py-8">
          <app-search-bar />
          
          <div class="mt-8 grid gap-6 max-w-3xl mx-auto">
            <app-job-card
              *ngFor="let job of jobs"
              [job]="job"
            />
          </div>
        </main>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  jobs: Job[] = [];
  private subscription: Subscription | undefined;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.subscription = this.jobService.getJobs().subscribe(jobs => {
      this.jobs = jobs;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
} 