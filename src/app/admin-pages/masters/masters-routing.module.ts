import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { BannerMasterComponent } from './banner-master/banner-master.component';
import { CategoryMasterComponent } from './category-master/category-master.component';
import { JobMasterComponent } from './job-master/job-master.component';
import { SubscriptionMasterComponent } from './subscription-master/subscription-master.component';
import { UserMasterComponent } from './user-master/user-master.component';
import { VendorMasterComponent } from './vendor-master/vendor-master.component';

const routes: Routes = [
  {
    path: 'banner-master', component: BannerMasterComponent
  },
  {
    path: 'category-master', component: CategoryMasterComponent
  },
  {
    path: 'user-list', component: UserMasterComponent
  },
  {
    path: 'vendor-list', component: VendorMasterComponent
  },
  {
    path: 'subscription-plan-master', component: SubscriptionMasterComponent
  },
  {
    path: 'admin-settings', component: AdminSettingsComponent
  },
  {
    path: 'job-master', component: JobMasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
