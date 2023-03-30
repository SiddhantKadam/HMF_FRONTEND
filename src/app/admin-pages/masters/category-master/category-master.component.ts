import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { CategoryClass } from '../masterModel';
import { getActiveCategoryURL, getAllCategoryURL, getCategoryByIdURL, postCategoryURL, putCategoryURL } from '../mastersURL';

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.css']
})
export class CategoryMasterComponent implements OnInit {

  categoryForm: FormGroup | any;
  categoryModel = new CategoryClass();

  errormsgDiv: boolean = false;
  submitted = false;
  isEdit: boolean = true;

  activeCategoryList: any[] | any;

  // ==== Table ====
  displayedColumns: string[] = ['Sr.No.', 'Category Name', 'Category Description', 'Status', 'Action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild('epltable', { static: false }) epltable: ElementRef | any;

  constructor(private formBuilder: FormBuilder, private httpService: HttpmethodsService, public toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      categoryName: new FormControl('', [Validators.required]),
      categoryDescription: new FormControl(''),
      status: new FormControl('', [Validators.required]),
    });
    this.getAllCategory();
  }

  get f() { return this.categoryForm.controls; }

  // == Insert ==
  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if (this.categoryForm.invalid) {
      this.spinner.hide();
      return;
    }
    if (this.isEdit) {
      this.httpService.postRequest(postCategoryURL, this.categoryModel).subscribe((data: any) => {
        if (data.responseCode == 200) {
          this.toastr.success('Save Succesfully...', 'Success!');
          this.categoryForm.reset();
          this.getAllCategory();
          this.submitted = false;
          this.spinner.hide();
        } else if (data.responseCode == 400) {
          this.toastr.error('Category is already exists.', 'Error!');
          this.spinner.hide();
        } else {
          this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
        }
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
    else {
      this.httpService.putRequest(putCategoryURL, this.categoryModel).subscribe((data: any) => {
        this.toastr.success('Update Succesfully...', 'Success!');
        this.categoryForm.reset();
        this.getAllCategory();
        this.submitted = false;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }
  }


  // == Get All Category List ==
  getAllCategory() {
    this.spinner.show();
    this.httpService.getRequest(getAllCategoryURL).subscribe((data: any) => {
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


  // == Get Category By Id List ==
  getCategoryById(categoryId: number) {
    this.spinner.show();
    this.httpService.getRequest(getCategoryByIdURL + "/" + categoryId).subscribe((data: any) => {
      this.categoryModel = data;
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
