import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { JobClass } from '../masterModel';
import { deleteJobByIdURL, getActiveJobURL, getActiveVendorURL, getAllJobURL, getJobByIdURL, postJobURL, putJobURL } from '../mastersURL';

@Component({
  selector: 'app-job-master',
  templateUrl: './job-master.component.html',
  styleUrls: ['./job-master.component.css']
})
export class JobMasterComponent implements OnInit {

  jobForm: FormGroup | any;
  jobModel = new JobClass();

  errormsgDiv: boolean = false;
  submitted = false;
  isEdit: boolean = true;

  activeVendorList: [] | any;

  // ==== Table ====
  displayedColumns: string[] = ['Sr.No.', 'vendor', 'jobName', 'noOfPositions', 'Status', 'Action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild('epltable', { static: false }) epltable: ElementRef | any;

  constructor(private formBuilder: FormBuilder, private httpService: HttpmethodsService, public toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.jobForm = this.formBuilder.group({
      jobName: new FormControl('', [Validators.required]),
      jobDescription: new FormControl('', [Validators.required]),
      noOfPositions: new FormControl('', [Validators.required]),
      jobStatus: new FormControl('', [Validators.required]),

      vendorId: new FormControl('', [Validators.required]),
    });
    this.getActiveJob();
    this.getActiveVendor();
  }

  get f() { return this.jobForm.controls; }

  // == Insert ==
  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if (this.jobForm.invalid) {
      this.spinner.hide();
      return;
    }
    if (this.isEdit) {
      this.httpService.postRequest(postJobURL, this.jobModel).subscribe((data: any) => {
        this.toastr.success('Save Succesfully...', 'Success!');
        this.jobForm.reset();
        this.getActiveJob();
        this.submitted = false;
        this.spinner.hide();
        this.jobModel = new JobClass();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
    else {
      this.httpService.putRequest(putJobURL, this.jobModel).subscribe((data: any) => {
        this.toastr.success('Update Succesfully...', 'Success!');
        this.jobForm.reset();
        this.getActiveJob();
        this.submitted = false;
        this.isEdit = true;
        this.spinner.hide();
        this.jobModel = new JobClass();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
  }

  // == Get All Job List ==
  getAllJob() {
    this.spinner.show();
    this.httpService.getRequest(getAllJobURL).subscribe((data: any) => {
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

  // == Get Active job ==
  getActiveJob() {
    this.spinner.show();
    this.httpService.getRequest(getActiveJobURL).subscribe((data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        })
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
    });
  }

  // == Get All Vendor List ==
  getActiveVendor() {
    this.spinner.show();
    this.httpService.getRequest(getActiveVendorURL).subscribe((data: any) => {
      if (data.length != 0) {
        this.activeVendorList = data;
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
    });
  }

  // == Get Job By Id==
  getJobById(jobId: number) {
    this.spinner.show();
    this.httpService.getRequest(getJobByIdURL + "/" + jobId).subscribe((data: any) => {
      this.jobModel = data;
      this.isEdit = false;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
    });
  }


  // == Delete Job by Id ==
  deleteJobById(jobId: number) {
    this.spinner.show();
    this.httpService.getRequest(deleteJobByIdURL + "/" + jobId).subscribe((data: any) => {
      this.toastr.success('Job deleted succesfully...', 'Success!');
      this.getActiveJob();
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
