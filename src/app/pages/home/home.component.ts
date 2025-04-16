import { Component, OnInit, effect } from '@angular/core';
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
  // On utilise directement le signal du service
  jobs = this.jobService.jobs;
  searchResults = false;

  constructor(private jobService: JobService) {
    // Utilisation d'un effect pour surveiller les changements dans les jobs
    effect(() => {
      // L'effect sera déclenché automatiquement quand les jobs changent
      console.log('Jobs mis à jour:', this.jobs());
    });
  }

  ngOnInit(): void {
    this.loadAllJobs();
  }

  loadAllJobs(): void {
    this.jobService.resetSearch();
    this.searchResults = false;
  }

  onSearch(query: string): void {
    this.jobService.searchJobs(query);
    this.searchResults = true;
  }
} 