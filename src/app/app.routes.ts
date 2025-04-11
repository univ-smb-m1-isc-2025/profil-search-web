import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'liste-entreprises',
    loadComponent: () => import('./pages/entreprise-list/entreprise-list.component').then(m => m.EntrepriseListComponent)
  },
  {
    path: 'postuler/:id',
    loadComponent: () => import('./pages/job-application/job-application.component').then(m => m.JobApplicationComponent)
  }
];
