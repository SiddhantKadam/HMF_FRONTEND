import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { BannerClass } from '../masterModel';
import { getAllBannerURL, getBannerByIdURL, postBannerURL, putBannerURL, uploadFile } from '../mastersURL';

@Component({
  selector: 'app-banner-master',
  templateUrl: './banner-master.component.html',
  styleUrls: ['./banner-master.component.css']
})
export class BannerMasterComponent implements OnInit {

  bannerForm: FormGroup | any;
  bannerModel = new BannerClass();

  errormsgDiv: boolean = false;
  submitted = false;
  isEdit: boolean = true;
  filetoUpload: File | any;

  // ==== Table ====
  displayedColumns: string[] = ['Sr.No.', 'Banner Image', 'Banner Description', 'Start Date', 'End Date', 'Status', 'Action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild('epltable', { static: false }) epltable: ElementRef | any;

  constructor(private formBuilder: FormBuilder, private httpService: HttpmethodsService, public toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.bannerForm = this.formBuilder.group({
      bannerImage: new FormControl(''),
      imageDescription: new FormControl(''),
      startdDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
    });
    this.getAllBanner();
  }

  get f() { return this.bannerForm.controls; }

  // == Insert ==
  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if (this.bannerForm.invalid) {
      this.spinner.hide();
      return;
    }
    if(!this.bannerModel.bannerImage) {
      this.spinner.hide();
      return;
    }
    if (this.isEdit) {
      this.httpService.postRequest(postBannerURL, this.bannerModel).subscribe((data: any) => {
        this.toastr.success('Save Succesfully...', 'Success!');
        this.bannerForm.reset();
        this.getAllBanner();
        this.submitted = false;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
    else {
      this.httpService.putRequest(putBannerURL, this.bannerModel).subscribe((data: any) => {
        this.toastr.success('Update Succesfully...', 'Success!');
        this.bannerForm.reset();
        this.getAllBanner();
        this.submitted = false;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
  }

  // == Get All Banner List ==
  getAllBanner() {
    this.httpService.getRequest(getAllBannerURL).subscribe((data: any) => {
      if (data.length != 0) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        })
      }
    });
  }

  // == File
  handleFileInput(File: any) {
    this.filetoUpload = File.files.item(0);
    this.httpService.uploadFile(uploadFile, this.filetoUpload).subscribe((
      data: any) => {
      if (data.status == true) {
        this.bannerModel.bannerImage = data.path;
      }
      else {
        this.toastr.error(data.path, 'error!');
      }
    })
  }

  // == Get Banner By Id List ==
  getBannerById(bannerId: number) {
    this.httpService.getRequest(getBannerByIdURL + "/" + bannerId).subscribe((data: any) => {
      this.bannerModel = data;
      this.bannerModel.startdDate = new Date(data.startdDate);
      this.bannerModel.endDate = new Date(data.endDate);
      this.bannerModel.bannerImage = data.bannerImage
      this.isEdit = false;
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
