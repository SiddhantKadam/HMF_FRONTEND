import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { postBannerURL } from 'src/app/admin-pages/masters/mastersURL';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';
import { LoginClass } from '../authModel';
import { postAdminLoginURL } from '../AuthURL';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup | any;
  loginModel = new LoginClass();

  fieldTextType: boolean = false;
  submitted = false;
  showLoginForm: boolean = true;

  constructor(private formBuilder: FormBuilder, private router: Router, private httpService: HttpmethodsService, public toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      adminMobileNo: new FormControl('', [Validators.required, Validators.email]),
      adminPassword: new FormControl('', [Validators.required]),
    });
  }

  get f() { return this.loginForm.controls; }

  // == Save ==
  onSubmit() {
    this.spinner.show();
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.spinner.hide();
      return;
    }
    this.httpService.postRequest(postAdminLoginURL, this.loginModel).subscribe((data: any) => {

      if (data.responseCode == 200) {
        this.toastr.success(data.message, 'Success!');
        sessionStorage.setItem('adminId', data.adminId);
        this.router.navigateByUrl("/admin-pages/layout/dashboard")
        this.loginForm.reset();
        this.submitted = false;
        this.spinner.hide();
      }

      if (data.responseCode == 404) {
        this.toastr.error(data.message, 'Failed!');
        this.spinner.hide();
      }

      if (data.responseCode == 403) {
        this.toastr.error(data.message, 'Failed!');
        this.spinner.hide();
      }

      if (data.responseCode == 400) {
        this.toastr.error(data.message, 'Failed!');
        this.spinner.hide();
      }

    }, error => {
      this.spinner.hide();
      this.toastr.error('Something went wrong. Please contact your administrator.', 'Error!');
    });
  }

  // == Toggle Password ==
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
