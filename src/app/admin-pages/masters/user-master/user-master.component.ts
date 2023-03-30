import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { UserClass } from '../masterModel';
import { getAllUserURL, getUserByIdURL, postUserURL, putUserURL } from '../mastersURL';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent implements OnInit {

  userForm: FormGroup | any;
  userModel = new UserClass();

  errormsgDiv: boolean = false;
  submitted = false;
  isEdit: boolean = true;

  // ==== Table ====
  displayedColumns: string[] = ['Sr.No.', 'FName', 'LName','Mobile', 'Status', 'Action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true })sort: MatSort | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild('epltable', { static: false }) epltable: ElementRef | any;

  constructor(private formBuilder: FormBuilder, private httpService: HttpmethodsService, public toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userFName: new FormControl('', [Validators.required]),
      userLName: new FormControl('', [Validators.required]),
      userMobileNo: new FormControl('', [Validators.required]),
      userReferenceMobileNo: new FormControl(''),
      userStatus: new FormControl('', [Validators.required]),
    });
    this.getAllUser();
  }

  get f() { return this.userForm.controls; }

  // == Insert ==
  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if (this.userForm.invalid) {
      this.spinner.hide();
      return;
    }
    if (this.isEdit) {
      this.httpService.postRequest(postUserURL, this.userModel).subscribe((data: any) => {
        this.toastr.success('Save Succesfully...', 'Success!');
        this.userForm.reset();
        this.getAllUser();
        this.submitted = false;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
    else {
      this.httpService.putRequest(putUserURL, this.userModel).subscribe((data: any) => {
        this.toastr.success('Update Succesfully...', 'Success!');
        this.userForm.reset();
        this.getAllUser();
        this.submitted = false;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
  }

  // == Get All User List ==
  getAllUser() {
    this.spinner.show();
    this.httpService.getRequest(getAllUserURL).subscribe((data: any) => {
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

  // == Get User By Id List ==
  getUserById(userId: number) {
    this.spinner.show();
    this.httpService.getRequest(getUserByIdURL + "/" + userId).subscribe((data: any) => {
      this.userModel = data;
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
