import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'team',
    loadComponent: () =>
      import('./features/team/team').then(m => m.Team)
  },
  {
    path: '',
    redirectTo: 'team',
    pathMatch: 'full'
  }
];