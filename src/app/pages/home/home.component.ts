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
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  jobs: Job[] = [];
  private subscription: Subscription | undefined;
  searchResults: boolean = false;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadAllJobs();
  }

  loadAllJobs(): void {
    this.jobService.resetSearch();
    
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    this.subscription = this.jobService.getJobs().subscribe(jobs => {
      this.jobs = jobs;
      this.searchResults = false;
    });
  }

  onSearch(query: string): void {
    this.jobService.searchJobs(query);
    this.searchResults = true;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
} 