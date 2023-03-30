import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
import { UserReportComponent } from './user-report/user-report.component';
import { VendorReportComponent } from './vendor-report/vendor-report.component';

const routes: Routes = [
  {
    path: 'user-report', component: UserReportComponent
  },
  {
    path: 'vendor-report', component: VendorReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
