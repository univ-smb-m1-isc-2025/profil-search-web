import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent, SearchBarComponent, JobCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  jobs = this.jobService.jobs;
  searchResults = false;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadAllJobs(): void {
    this.jobService.resetSearch();
    this.searchResults = false;
  }

  private loadJobs(): void {
    if (this.jobs().length === 0) {
      this.jobService.fetchJobs();
    }
  }

  onSearch(query: string): void {
    this.jobService.searchJobs(query);
    this.searchResults = true;
  }
} 