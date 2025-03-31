
import { Routes } from '@angular/router';

import { JobListComponent } from './job-list/job-list.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { DeleteDataComponent } from './delete-data/delete-data.component';

// Définition des routes
export const routes: Routes = [
  { path: '', component: JobListComponent },
  { path: 'job/:id', component: JobDetailComponent },
  { path: 'apply/:id', component: JobApplicationComponent },
  { path: 'delete-data', component: DeleteDataComponent },
];
