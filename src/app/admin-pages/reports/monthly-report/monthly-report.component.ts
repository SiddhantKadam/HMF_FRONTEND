import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.css']
})
export class MonthlyReportComponent implements OnInit {

  monthlyReportForm: FormGroup | any;

  errormsgDiv: boolean = false;
  submitted = false;
  isEdit: boolean = true;
  // selectedMonth: any;

  // ==== Table ====
  displayedColumns: string[] = ['Sr.No.', 'Image', 'Business Name', 'Vendor Name', 'Subscription Date', 'Status', 'Action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild('epltable', { static: false }) epltable: ElementRef | any;

  constructor(private formBuilder: FormBuilder, private httpService: HttpmethodsService, public toastr: ToastrService) { }

  ngOnInit(): void {
  }

  get f() { return this.monthlyReportForm.controls; }

  // == Insert ==
  onSubmit() {
    this.submitted = true;
    if (this.monthlyReportForm.invalid) {
      return;
    }
  }

  getReportById(vendorId: number) { }

  // ==== Search ====
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
