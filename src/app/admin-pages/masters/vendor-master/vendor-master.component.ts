import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { VendorClass, VendorImgList } from '../masterModel';
import { deleteImageURL, getActiveCategoryURL, getAllVendorURL, getImageByVendorIdURL, getVendorByIdURL, postVendorURL, putVendorURL, uploadFile } from '../mastersURL';

@Component({
  selector: 'app-vendor-master',
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.css']
})
export class VendorMasterComponent implements OnInit {

  vendorForm: FormGroup | any;
  vendorModel = new VendorClass();

  errormsgDiv: boolean = false;
  submitted = false;
  isEdit: boolean = true;
  firstTimeImage: boolean = true;

  getActiveCategoryList: any[] | any;
  getVendorImagesList: Array<any> = [];
  // getVendorImagesList: Array<VendorImgList> = [];
  newList: any[] | any;
  filetoUpload: File | any;

  allImgList: Array<VendorImgList> = [];
  allImgModel = new VendorImgList();

  // ==== Table ====
  displayedColumns: string[] = ['Sr.No.', 'FName', 'Mobile', 'Category', 'Business Name', 'Status', 'Action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild('epltable', { static: false }) epltable: ElementRef | any;

  constructor(private formBuilder: FormBuilder, private httpService: HttpmethodsService, public toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.vendorForm = this.formBuilder.group({
      vendorFName: new FormControl('', [Validators.required]),
      vendorLName: new FormControl(''),
      vendorMobileNo: new FormControl('', [Validators.required]),
      vendorBusinessMobileNo: new FormControl('', [Validators.required]),
      vendorStatus: new FormControl('', [Validators.required]),

      categoryId: new FormControl(''),
      vendorBusinessName: new FormControl('', [Validators.required]),
      vendorBusinessAddress: new FormControl('', [Validators.required]),
      vendorBusinessProof: new FormControl(''),
      vendorBusinessImage: new FormControl(''),

      vendorReferenceMobileNo: new FormControl('', [Validators.required]),
      vendorHoliday: new FormControl('', [Validators.required]),
      vendorDescription: new FormControl('', [Validators.required]),

    });
    this.getAllVendor();
    this.getActiveCategory();
    this.allImgModel.vendorImagePath = "";
    this.getVendorImagesList.push({
      vendorImagePath: ""
    });
  }

  get f() { return this.vendorForm.controls; }

  // == Insert ==
  onSubmit() {
    console.log(JSON.stringify(this.vendorModel));
    this.spinner.show();
    this.submitted = true;
    if (this.vendorForm.invalid) {
      this.spinner.hide();
      return;
    }
    if (this.isEdit) {
      this.vendorModel.vendorImagesList = this.getVendorImagesList;
      this.httpService.postRequest(postVendorURL, this.vendorModel).subscribe((data: any) => {
        this.toastr.success('Save Succesfully...', 'Success!');
        this.vendorForm.reset();
        this.getAllVendor();
        this.submitted = false;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
    else {
      this.vendorModel.vendorImagesList = this.getVendorImagesList;
      this.httpService.putRequest(putVendorURL, this.vendorModel).subscribe((data: any) => {
        this.toastr.success('Update Succesfully...', 'Success!');
        this.vendorForm.reset();
        this.getAllVendor();
        this.submitted = false;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
  }

  deleteImageFromImageList(image: any) {
    const index = this.getVendorImagesList.indexOf(image);
    this.getVendorImagesList.splice(index, 1);
    if (this.getVendorImagesList.length == 0) {
      this.getVendorImagesList.push({
        vendorImagePath: ""
      });
    }
  }

  deleteBusinessProof() {
    this.vendorModel.vendorBusinessProof = null;
  }

  plusImage() {
    if (this.getVendorImagesList[this.getVendorImagesList.length - 1].vendorImagePath == "") {
      this.toastr.warning('Please upload the exisiting image', 'Warning!');
      return;
    }
    this.getVendorImagesList.push({
      vendorImagePath: ""
    });
  }

  // == File
  handleFileInputforImages(File: any, image: any) {
    this.filetoUpload = File.files.item(0);
    this.httpService.uploadFile(uploadFile, this.filetoUpload).subscribe((
      data: any) => {
      if (data.status == true) {
        image.vendorImagePath = data.path;
      }
      else {
        this.toastr.error(data.path, 'error!');
      }
    })
  }

  // == Get All Vendor List ==
  getAllVendor() {
    this.spinner.show();
    this.httpService.getRequest(getAllVendorURL).subscribe((data: any) => {
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

  // == Get Vendor By Id List ==
  getVendorById(vendorId: number) {
    this.spinner.show();
    this.httpService.getRequest(getVendorByIdURL + "/" + vendorId).subscribe((data: any) => {
      this.vendorModel = data;
      if (data.vendorImagesList.length > 0) {
        this.getVendorImagesList = data.vendorImagesList;
      }
      this.isEdit = false;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
    });
  }

  // == Get Active Category List ==
  getActiveCategory() {
    this.spinner.show();
    this.httpService.getRequest(getActiveCategoryURL).subscribe((data: any) => {
      if (data.length != 0) {
        this.getActiveCategoryList = data;
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
    });
  }

  // == Delete Images ==
  deleteImage(vendorImageId: any, vendorId: any) {
    this.spinner.show();
    this.httpService.getRequest(deleteImageURL + "/" + vendorImageId).subscribe((data: any) => {
      if (data == true) {
        this.toastr.success('Delete Succesfully...', 'Success!');
        this.deleteImageByVendorId(vendorId);
      }
      else {
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
    });
  }

  // == Get Images ==
  deleteImageByVendorId(vendorId: any) {
    this.spinner.show();
    this.httpService.getRequest(getImageByVendorIdURL + "/" + vendorId).subscribe((data: any) => {
      this.getVendorImagesList = data;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
    });
  }

  // == File
  handleFileInput(File: any) {
    this.filetoUpload = File.files.item(0);
    this.httpService.uploadFile(uploadFile, this.filetoUpload).subscribe((
      data: any) => {
      if (data.status == true) {
        this.vendorModel.vendorBusinessProof = data.path;
      }
      else {
        this.toastr.error(data.path, 'error!');
      }
    })
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
