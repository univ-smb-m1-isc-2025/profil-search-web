import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CandidatureDeleteComponent } from './pages/candidature-delete/candidature-delete.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'liste-entreprises',
    loadComponent: () => 
      import('./pages/entreprise-list/entreprise-list.component')
        .then(m => m.EntrepriseListComponent),
    data: { prefetchStrategy: 'viewport' }
  },
  {
    path: 'gestion-membres',
    loadComponent: () => 
      import('./pages/member-list/member-list.component')
        .then(m => m.MemberListComponent),
    data: { prefetchStrategy: 'viewport' }
  },
  {
    path: 'postuler/:id',
    loadComponent: () => 
      import('./pages/job-application/job-application.component')
        .then(m => m.JobApplicationComponent),
    data: { prefetchStrategy: 'viewport' }
  },
  {
    path: 'connexion',
    loadComponent: () => 
      import('./pages/connexion/connexion.component')
        .then(m => m.ConnexionComponent),
    data: { prefetchStrategy: 'viewport' }
  },
  {
    path: 'liste-candidatures',
    loadComponent: () => 
      import('./pages/candidature-list/candidature-list.component')
        .then(m => m.CandidatureListComponent),
    data: { prefetchStrategy: 'viewport' }
  },
  {
    path: 'candidature/:id',
    loadComponent: () => 
      import('./pages/candidature-detail/candidature-detail.component')
        .then(m => m.CandidatureDetailComponent),
    data: { prefetchStrategy: 'viewport' }
  },
  {
    path: 'candidature/delete/:id',
    component: CandidatureDeleteComponent
  }
];
