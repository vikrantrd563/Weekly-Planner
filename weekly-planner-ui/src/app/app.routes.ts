import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'lead-home',
    loadComponent: () => import('./features/home/lead-home').then(m => m.LeadHome)
  },
  {
    path: 'member-home/:id',
    loadComponent: () => import('./features/home/member-home').then(m => m.MemberHome)
  },
  {
    path: 'team',
    loadComponent: () => import('./features/team/team').then(m => m.Team)
  },
  {
    path: 'backlog',
    loadComponent: () => import('./features/backlog/backlog').then(m => m.Backlog)
  },
  {
    path: 'week/setup',
    loadComponent: () => import('./features/planning/week-setup').then(m => m.WeekSetup)
  },
  {
    path: 'week/plan/:memberId',
    loadComponent: () => import('./features/planning/plan-my-work').then(m => m.PlanMyWork)
  },
  {
    path: 'week/review',
    loadComponent: () => import('./features/planning/review-freeze').then(m => m.ReviewFreeze)
  },
  {
    path: 'progress/:memberId',
    loadComponent: () => import('./features/progress/update-progress').then(m => m.UpdateProgress)
  },
  {
    path: 'dashboard/:weekId',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'dashboard/:weekId/category/:categoryId',
    loadComponent: () => import('./features/dashboard/category-detail').then(m => m.CategoryDetail)
  },
  {
    path: 'dashboard/:weekId/member/:memberId',
    loadComponent: () => import('./features/dashboard/member-detail').then(m => m.MemberDetail)
  },
  {
    path: 'past-weeks',
    loadComponent: () => import('./features/history/past-weeks').then(m => m.PastWeeks)
  },
  {
    path: '**',
    redirectTo: ''
  }
];