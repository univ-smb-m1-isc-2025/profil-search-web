import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';

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
export class JobDetailComponent implements OnInit {
  job: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    this.http.get(`/api/jobs/${jobId}`).subscribe((data: any) => {
      this.job = data;
    });
  }
}
