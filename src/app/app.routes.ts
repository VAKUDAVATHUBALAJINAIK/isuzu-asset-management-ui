
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'asset/entry',
    loadComponent: () =>
      import('./asset-submenus/asset-entry/asset-entry')
        .then(m => m.AssetEntry)
  },

  {
    path: 'employee',
    loadComponent: () =>
      import('./employee/employee')
        .then(m => m.Employee)
  },

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
