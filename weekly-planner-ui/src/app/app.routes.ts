import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'lead-home',
    loadComponent: () =>
      import('./features/home/lead-home').then(m => m.LeadHome)
  },
  {
    path: 'member-home/:id',
    loadComponent: () =>
      import('./features/home/member-home').then(m => m.MemberHome)
  },
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
    path: '**',
    redirectTo: ''
  }
];