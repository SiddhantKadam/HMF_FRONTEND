import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { UserReportClass } from '../reportModel';
import { postUserReportURL, postVendorReportURL } from '../reportsURL';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit {

  userReportForm: FormGroup | any;
  userReportModel = new UserReportClass();

  errormsgDiv: boolean = false;
  submitted = false;
  isEdit: boolean = true;
  sessionValue: string | any;

  // ==== Table ====
  displayedColumns: string[] = ['Sr.No.','Image', 'name', 'userMobileNo', 'registrationDate', 'Status'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild('epltable', { static: false }) epltable: ElementRef | any;

  constructor(private formBuilder: FormBuilder, private httpService: HttpmethodsService, public toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userReportForm = this.formBuilder.group({
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
    });
    this.sessionValue = sessionStorage.getItem('sessionReport');

    this.httpService.subsVar = this.httpService.    
      invokeFirstComponentFunction.subscribe((e) => {  
        this.sessionValue = sessionStorage.getItem('sessionReport');
        this.dataSource = new MatTableDataSource();
        this.userReportForm.reset();
        this.submitted = false;
      });
  }

  get f() { return this.userReportForm.controls; }

  // == Insert ==
  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if (this.userReportForm.invalid) {
      this.spinner.hide();
      return;
    }

    if (this.sessionValue == 'User') {
      this.httpService.postRequest(postUserReportURL, this.userReportModel).subscribe((data: any) => {
        if (data.length != 0) {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          setTimeout(() => {
            this.dataSource.sort = this.sort;
          })
        }
        else {
          this.toastr.error('No records found...', 'Empty!');
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
    else if (this.sessionValue == 'Vendor') {
      this.httpService.postRequest(postVendorReportURL, this.userReportModel).subscribe((data: any) => {
        if (data.length != 0) {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          setTimeout(() => {
            this.dataSource.sort = this.sort;
          })
        }
        else {
          this.toastr.error('No records found...', 'Empty!');
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
  }

  getReportById(userId: number) { }

  // ==== Search ====
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
