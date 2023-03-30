import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: 'layout', component: LayoutComponent,
    children:
      [
        {
          path: 'dashboard', component: DashboardComponent
        },
        { path: 'masters', loadChildren: () => import('./masters/masters.module').then(mod => mod.MastersModule) },
        { path: 'reports', loadChildren: () => import('./reports/reports.module').then(mod => mod.ReportsModule) }
      ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPagesRoutingModule { }
