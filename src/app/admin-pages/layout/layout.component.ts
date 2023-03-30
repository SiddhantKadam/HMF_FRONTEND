import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpmethodsService } from 'src/app/services/httpmethods.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnDestroy {

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private httpService: HttpmethodsService, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 767px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  reportSession(e: any) {
    if (e == 'user') {
      sessionStorage.setItem("sessionReport", 'User');
    } else if (e == 'vendor') {
      sessionStorage.setItem("sessionReport", 'Vendor');
    }
    this.httpService.changeMessage(e);
  }

  ngOnInit(): void {
    if(!sessionStorage.getItem('adminId'))
    {
      this.router.navigateByUrl("/");
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout()
  {
    sessionStorage.removeItem('adminId');
    this.router.navigateByUrl("/");
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
}
