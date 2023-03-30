import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { AdminClass } from '../masterModel';
import { getAdminByIdURL, putAdminURL } from '../mastersURL';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {

  adminForm: FormGroup | any;
  adminModel = new AdminClass();
  submitted = false;

  constructor(private formBuilder: FormBuilder, private httpService: HttpmethodsService, public toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.adminForm = this.formBuilder.group({
      adminMobileNo: new FormControl('', [Validators.required]),
      adminPassword: new FormControl('', [Validators.required]),
      adminStatus: new FormControl(''),
    });
    this.getAdminById();
  }

  get f() { return this.adminForm.controls; }

    // == Insert ==
    onSubmit() {
    this.spinner.show();
      this.submitted = true;
      if (this.adminForm.invalid) {
      this.spinner.hide();
        return;
      }
      this.httpService.putRequest(putAdminURL, this.adminModel).subscribe((data: any) => {
        this.toastr.success('Update Succesfully...', 'Success!');
        this.getAdminById();
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
      });
    }

      // == Get Admin By Id ==
  getAdminById() {
    this.spinner.show();
    this.httpService.getRequest(getAdminByIdURL + "/" + 1).subscribe((data: any) => {
      this.adminModel = data;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
    });
  }

}
