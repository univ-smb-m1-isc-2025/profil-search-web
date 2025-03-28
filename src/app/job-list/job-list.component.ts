import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError, of } from 'rxjs';

interface Job {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  readonly #http = inject(HttpClient);

  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.#http.get<Job[]>('/api/jobs').pipe(
      switchMap((data: Job[]) => {
        this.jobs = data;
        this.filteredJobs = data;
        return this.#http.get('/api/entreprises/all');
      }),
      catchError((error: any) => {
        console.error('Error fetching jobs:', error);
        return of([]);
      })
    ).subscribe();
  }

  filterJobs(): void {
    this.filteredJobs = this.jobs.filter(job => job.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
}
