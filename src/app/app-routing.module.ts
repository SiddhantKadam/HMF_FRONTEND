import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'admin-pages', loadChildren: () => import('./admin-pages/admin-pages.module').then(mod => mod.AdminPagesModule) 
  },
  {
    path: '', loadChildren: () => import('./auth/auth.module').then(mod => mod.AuthModule) 
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
