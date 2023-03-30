import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionMasterComponent } from './subscription-master.component';

describe('SubscriptionMasterComponent', () => {
  let component: SubscriptionMasterComponent;
  let fixture: ComponentFixture<SubscriptionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
