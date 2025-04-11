import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { JobDetailService } from '../services/job-detail.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgFor
  ],
})
export class JobDetailComponent implements OnInit, OnDestroy {
  job: any;
  
  readonly #service = inject(JobDetailService);
  readonly #route = inject(ActivatedRoute);
  private subscription: Subscription | undefined;

  ngOnInit(): void {
    const jobId = this.#route.snapshot.paramMap.get('id');
    if (jobId) {
      this.loadJobDetails(jobId);
    }
  }
  
  loadJobDetails(jobId: string): void {
    this.subscription = this.#service.getJobDetails(jobId).subscribe((data: any) => {
      this.job = data;
    });
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
