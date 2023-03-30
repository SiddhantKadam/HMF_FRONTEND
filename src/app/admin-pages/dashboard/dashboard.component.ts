import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { getActiveUserURL, getActiveVendorURL } from '../mainURL';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  getActiveVendorCount: number | any;
  getActiveUserCount: number | any;

  constructor(private formBuilder: FormBuilder, private httpService: HttpmethodsService, public toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getActiveVendor();
    this.getActiveUser();
  }

  // == Get Active Vendor List ==
  getActiveVendor() {
    this.spinner.show();
    this.httpService.getRequest(getActiveVendorURL).subscribe((data: any) => {
      if (data.length != 0) {
        this.getActiveVendorCount = data.length;
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
    });
  }

    // == Get Active Vendor List ==
    getActiveUser() {
      this.spinner.show();
      this.httpService.getRequest(getActiveUserURL).subscribe((data: any) => {
        if (data.length != 0) {
          this.getActiveUserCount = data.length;
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }

}
