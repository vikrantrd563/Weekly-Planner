import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'team',
    loadComponent: () =>
      import('./features/team/team').then(m => m.Team)
  },
  {
    path: 'backlog',
    loadComponent: () =>
      import('./features/backlog/backlog').then(m => m.Backlog)
  },
  {
    path: '',
    redirectTo: 'team',
    pathMatch: 'full'
  }
];