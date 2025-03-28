import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { DeleteDataComponent } from './delete-data/delete-data.component';
import { JobManagementComponent } from './job-management/job-management.component';

// Définition des routes
export const routes: Routes = [
  { path: '', component: JobListComponent },
  { path: 'job/:id', component: JobDetailComponent },
  { path: 'apply/:id', component: JobApplicationComponent },
  { path: 'delete-data', component: DeleteDataComponent },
];

@NgModule({
  declarations: [
    JobListComponent,
    JobDetailComponent,
    JobApplicationComponent,
    DeleteDataComponent,
    JobManagementComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
})
export class AppModule {}
