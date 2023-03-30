import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { CategoryClass, SubscriptionClass } from '../masterModel';
import { getAllBannerURL, getAllSubscriptionURL, getBannerByIdURL, getSubscriptionByIdURL, postSubscriptionURL, putSubscriptionURL } from '../mastersURL';

@Component({
  selector: 'app-subscription-master',
  templateUrl: './subscription-master.component.html',
  styleUrls: ['./subscription-master.component.css']
})
export class SubscriptionMasterComponent implements OnInit {

  subscriptionForm: FormGroup | any;
  subscriptionModel = new SubscriptionClass();

  errormsgDiv: boolean = false;
  submitted = false;
  isEdit: boolean = true;

  // ==== Table ====
  displayedColumns: string[] = ['Sr.No.', 'Plan', 'Validity', 'Amount', 'Status', 'Action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild('epltable', { static: false }) epltable: ElementRef | any;

  constructor(private formBuilder: FormBuilder, private httpService: HttpmethodsService, public toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.subscriptionForm = this.formBuilder.group({
      subscriptionName: new FormControl('', [Validators.required]),
      subscriptionDescription: new FormControl('', [Validators.required]),
      validityInYears: new FormControl('', [Validators.required]),
      validityInMonths: new FormControl('', [Validators.required]),
      subscriptionAmount: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
    });
    this.getAllSubscription();
  }

  get f() { return this.subscriptionForm.controls; }

  // == Insert ==
  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if (this.subscriptionForm.invalid) {
      this.spinner.hide();
      return;
    }
    if (this.isEdit) {
      this.httpService.postRequest(postSubscriptionURL, this.subscriptionModel).subscribe((data: any) => {
        this.toastr.success('Save Succesfully...', 'Success!');
        this.subscriptionForm.reset();
        this.getAllSubscription();
        this.submitted = false;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
    else {
      this.httpService.putRequest(putSubscriptionURL, this.subscriptionModel).subscribe((data: any) => {
        this.toastr.success('Update Succesfully...', 'Success!');
        this.subscriptionForm.reset();
        this.getAllSubscription();
        this.submitted = false;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
  }


  // == Get All Subscription List ==
  getAllSubscription() {
    this.spinner.show();
    this.httpService.getRequest(getAllSubscriptionURL).subscribe((data: any) => {
      if (data.length != 0) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        })
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
    });
  }

  // == Get Subscription By Id List ==
  getSubscriptionById(subscriptionId: number) {
    this.spinner.show();
    this.httpService.getRequest(getSubscriptionByIdURL + "/" + subscriptionId).subscribe((data: any) => {
      this.subscriptionModel = data;
      this.isEdit = false;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
    });
  }

  // ==== Search ====
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
